import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Plus, Trash2, Edit2, Check, X, Search, Sparkles, Filter, GripVertical, ArrowUp, ArrowDown, ArrowUpDown, AlertCircle } from 'lucide-react';
import { isSkillNameDuplicate } from '../utils/skillUtils';

export const AdminSkills = ({ triggerToast }) => {
  const { data, addSkill, updateSkill, deleteSkill, reorderSkills } = usePortfolio();

  // Add Form State
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Hard Skills',
    level: 'Intermediate',
  });
  const [addError, setAddError] = useState('');

  // Edit Modal State
  const [editingSkill, setEditingSkill] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: 'Hard Skills',
    level: 'Intermediate',
  });
  const [editError, setEditError] = useState('');

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Drag and Drop State
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const isAddDuplicate = isSkillNameDuplicate(data.skills, skillForm.name);
  const isEditDuplicate = editingSkill
    ? isSkillNameDuplicate(data.skills, editForm.name, editingSkill.id)
    : false;

  const handleAddSkill = (e) => {
    e.preventDefault();
    setAddError('');
    if (!skillForm.name.trim()) return;

    if (isAddDuplicate) {
      setAddError(`"${skillForm.name.trim()}" is already in your Skillset matrix. Duplicate skills are not allowed in the Skillset section.`);
      return;
    }

    const result = addSkill({
      name: skillForm.name.trim(),
      category: skillForm.category,
      level: skillForm.category === 'Soft Skills' ? '' : skillForm.level,
    });

    if (result && !result.success) {
      setAddError(result.error);
      return;
    }

    setSkillForm({
      name: '',
      category: 'Hard Skills',
      level: 'Intermediate',
    });
    setAddError('');
    triggerToast();
  };

  const startEditing = (skill) => {
    setEditingSkill(skill);
    setEditError('');
    const isSoft = skill.category?.toLowerCase().includes('soft');
    setEditForm({
      name: skill.name,
      category: isSoft ? 'Soft Skills' : 'Hard Skills',
      level: isSoft ? '' : (skill.level || 'Intermediate'),
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setEditError('');
    if (!editingSkill || !editForm.name.trim()) return;

    if (isEditDuplicate) {
      setEditError(`Another skill named "${editForm.name.trim()}" already exists. Skills in the Skillset section must be unique.`);
      return;
    }

    const result = updateSkill(editingSkill.id, {
      name: editForm.name.trim(),
      category: editForm.category,
      level: editForm.category === 'Soft Skills' ? '' : editForm.level,
    });

    if (result && !result.success) {
      setEditError(result.error);
      return;
    }

    setEditingSkill(null);
    setEditError('');
    triggerToast();
  };

  const filteredSkills = (data.skills || []).filter((s) => {
    const isSoft = s.category?.toLowerCase().includes('soft');
    const matchesCategory =
      activeFilter === 'All'
        ? true
        : activeFilter === 'Soft Skills'
        ? isSoft
        : !isSoft;

    const matchesSearch =
      !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const hardCount = (data.skills || []).filter((s) => !s.category?.toLowerCase().includes('soft')).length;
  const softCount = (data.skills || []).filter((s) => s.category?.toLowerCase().includes('soft')).length;

  const handleMoveSkill = (visibleIdx, direction) => {
    const targetVisibleIdx = visibleIdx + direction;
    if (targetVisibleIdx < 0 || targetVisibleIdx >= filteredSkills.length) return;

    const currentSkill = filteredSkills[visibleIdx];
    const targetSkill = filteredSkills[targetVisibleIdx];

    const allSkills = [...data.skills];
    const currentGlobalIdx = allSkills.findIndex((s) => s.id === currentSkill.id);
    const targetGlobalIdx = allSkills.findIndex((s) => s.id === targetSkill.id);

    if (currentGlobalIdx === -1 || targetGlobalIdx === -1) return;

    const temp = allSkills[currentGlobalIdx];
    allSkills[currentGlobalIdx] = allSkills[targetGlobalIdx];
    allSkills[targetGlobalIdx] = temp;

    reorderSkills(allSkills);
  };

  const handleDragStart = (e, idx) => {
    setDraggedIdx(idx);
    e.dataTransfer.setData('text/plain', String(idx));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (dragOverIdx !== idx) {
      setDragOverIdx(idx);
    }
  };

  const handleDragLeave = (e, idx) => {
    if (dragOverIdx === idx) {
      setDragOverIdx(null);
    }
  };

  const handleDrop = (e, dropIdx) => {
    e.preventDefault();
    setDragOverIdx(null);
    if (draggedIdx === null || draggedIdx === dropIdx) {
      setDraggedIdx(null);
      return;
    }

    const sourceSkill = filteredSkills[draggedIdx];
    const targetSkill = filteredSkills[dropIdx];

    const allSkills = [...data.skills];
    const sourceGlobalIdx = allSkills.findIndex((s) => s.id === sourceSkill.id);
    const targetGlobalIdx = allSkills.findIndex((s) => s.id === targetSkill.id);

    if (sourceGlobalIdx !== -1 && targetGlobalIdx !== -1) {
      const [movedItem] = allSkills.splice(sourceGlobalIdx, 1);
      allSkills.splice(targetGlobalIdx, 0, movedItem);
      reorderSkills(allSkills);
      triggerToast();
    }
    setDraggedIdx(null);
  };

  const handleSortAlphabetical = () => {
    const sorted = [...data.skills].sort((a, b) => a.name.localeCompare(b.name));
    reorderSkills(sorted);
    triggerToast();
  };

  const handleSortByLevel = () => {
    const levelOrder = { Proficient: 1, Intermediate: 2, Novice: 3, '': 4 };
    const sorted = [...data.skills].sort((a, b) => {
      const orderA = levelOrder[a.level || ''] || 5;
      const orderB = levelOrder[b.level || ''] || 5;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
    reorderSkills(sorted);
    triggerToast();
  };

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'Proficient':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Novice':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section: Add Skill Form & Auto-Sync Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Skill Form */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Plus size={16} className="text-zinc-400" />
              <span>Add New Skill</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Manual Entry
            </span>
          </div>

          <form onSubmit={handleAddSkill} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, Kubernetes..."
                  value={skillForm.name}
                  onChange={(e) => {
                    setSkillForm({ ...skillForm, name: e.target.value });
                    if (addError) setAddError('');
                  }}
                  className={`glass-input w-full px-3.5 py-2 text-sm transition-colors ${
                    isAddDuplicate || addError ? 'border-rose-500/70 focus:border-rose-400' : ''
                  }`}
                />
                {(isAddDuplicate || addError) && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-mono text-rose-400">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{addError || `"${skillForm.name.trim()}" already exists in Skillset. Duplicates not allowed.`}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Category
                </label>
                <select
                  value={skillForm.category}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setSkillForm({
                      ...skillForm,
                      category: newCat,
                      level: newCat === 'Soft Skills' ? '' : (skillForm.level || 'Intermediate'),
                    });
                  }}
                  className="glass-input w-full px-3.5 py-2 text-sm bg-zinc-900"
                >
                  <option value="Hard Skills">Hard Skills</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>
            </div>

            {skillForm.category === 'Hard Skills' ? (
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Proficiency Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Novice', 'Intermediate', 'Proficient'].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setSkillForm({ ...skillForm, level: lvl })}
                      className={`py-2 px-3 rounded-xl text-xs font-mono transition-all border ${
                        skillForm.level === lvl
                          ? `${getLevelBadgeClass(lvl)} font-bold shadow-sm`
                          : 'bg-zinc-900/60 text-zinc-400 border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-zinc-400">
                ✦ Soft skills do not have a proficiency level.
              </div>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} /> <span>Add Skill</span>
            </button>
          </form>
        </div>

        {/* Live Auto-Sync Info Card */}
        <div className="glass-card p-6 rounded-2xl border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-white font-mono font-bold text-sm">
              <Sparkles size={16} className="text-amber-400" />
              <span>Smart Sync & Ordering</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Any technologies added to <span className="text-zinc-200 font-medium">Projects</span> or <span className="text-zinc-200 font-medium">Certificates</span> are automatically synced here.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed mt-2.5">
              <span className="text-white font-semibold">Rearranging:</span> Drag cards using the handle <GripVertical size={11} className="inline mx-0.5 text-zinc-300" /> or click the <ArrowUp size={11} className="inline mx-0.5 text-zinc-300" /><ArrowDown size={11} className="inline mx-0.5 text-zinc-300" /> arrow buttons to customize display order.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.08] grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/[0.06]">
              <div className="text-base font-bold text-white font-mono">{hardCount}</div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Hard Skills</div>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/[0.06]">
              <div className="text-base font-bold text-white font-mono">{softCount}</div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Soft Skills</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Skills Matrix */}
      <div className="glass-card p-6 rounded-2xl border border-white/[0.08]">
        {/* Controls: Header, Filters, Rearrange Quick-actions & Search Bar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
          <div>
            <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <span>Skills Matrix & Rearrangement</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono">
                {filteredSkills.length} of {data.skills?.length || 0}
              </span>
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Drag cards or use arrow buttons to arrange order. Changes immediately reflect in the public portfolio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Sort Actions */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSortAlphabetical}
                title="Sort A to Z"
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-white/25 text-xs font-mono transition-all flex items-center gap-1"
              >
                <ArrowUpDown size={11} /> <span>A–Z</span>
              </button>
              <button
                type="button"
                onClick={handleSortByLevel}
                title="Sort by Proficiency Level"
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-white/25 text-xs font-mono transition-all flex items-center gap-1"
              >
                <Sparkles size={11} className="text-amber-400" /> <span>By Level</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input pl-8 pr-3 py-1.5 text-xs w-36 sm:w-48"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-white/[0.08]">
              {[
                { id: 'All', label: 'All' },
                { id: 'Hard Skills', label: 'Hard' },
                { id: 'Soft Skills', label: 'Soft' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                    activeFilter === f.id
                      ? 'bg-white text-black font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Grid with Drag & Drop and Arrows */}
        {filteredSkills.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-xs font-mono">
            No skills match your filter or search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5">
            {filteredSkills.map((s, idx) => {
              const isSoft = s.category?.toLowerCase().includes('soft');
              const isDragOver = dragOverIdx === idx;
              const isBeingDragged = draggedIdx === idx;

              return (
                <div
                  key={s.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragLeave={(e) => handleDragLeave(e, idx)}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`p-3.5 rounded-xl bg-zinc-900/70 border transition-all flex flex-col justify-between gap-3 group cursor-grab active:cursor-grabbing select-none hover:border-white/20 hover:bg-zinc-900/90 ${
                    isDragOver
                      ? 'border-white/60 bg-white/10 ring-2 ring-white/30 scale-102'
                      : isBeingDragged
                      ? 'opacity-40 border-dashed border-white/30'
                      : 'border-white/[0.07]'
                  }`}
                >
                  {/* Top Row: Drag Handle, Full Skill Name (never cut off), and Index Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <div
                        title="Drag to rearrange"
                        className="text-zinc-600 group-hover:text-zinc-400 cursor-grab active:cursor-grabbing shrink-0 mt-0.5"
                      >
                        <GripVertical size={14} />
                      </div>

                      <span className="text-sm font-bold text-white group-hover:text-zinc-100 leading-snug break-words">
                        {s.name}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-zinc-500 shrink-0 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Bottom Row: Category + Level Badge on left, Actions on right */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.04]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-zinc-400">
                        {isSoft ? 'Soft Skill' : 'Hard Skill'}
                      </span>
                      {!isSoft && s.level && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono border font-medium ${getLevelBadgeClass(
                            s.level
                          )}`}
                        >
                          {s.level}
                        </span>
                      )}
                    </div>

                    {/* Actions: Move Up, Move Down, Edit, Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Move Up */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSkill(idx, -1)}
                        title="Move Up"
                        className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-600 transition-colors"
                      >
                        <ArrowUp size={12} />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        disabled={idx === filteredSkills.length - 1}
                        onClick={() => handleMoveSkill(idx, 1)}
                        title="Move Down"
                        className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-600 transition-colors"
                      >
                        <ArrowDown size={12} />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => startEditing(s)}
                        title="Edit Skill"
                        className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Edit2 size={13} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => deleteSkill(s.id)}
                        title="Delete Skill"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-white/20 shadow-2xl relative bg-zinc-950">
            <button
              onClick={() => setEditingSkill(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-bold text-white font-mono mb-1 flex items-center gap-2">
              <Edit2 size={15} className="text-zinc-400" />
              <span>Edit Skill</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Modify the attributes of <span className="text-white font-semibold">{editingSkill.name}</span>.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => {
                    setEditForm({ ...editForm, name: e.target.value });
                    if (editError) setEditError('');
                  }}
                  className={`glass-input w-full px-3.5 py-2 text-sm transition-colors ${
                    isEditDuplicate || editError ? 'border-rose-500/70 focus:border-rose-400' : ''
                  }`}
                />
                {(isEditDuplicate || editError) && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-mono text-rose-400">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{editError || `Another skill named "${editForm.name.trim()}" already exists in Skillset.`}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setEditForm({
                      ...editForm,
                      category: newCat,
                      level: newCat === 'Soft Skills' ? '' : (editForm.level || 'Intermediate'),
                    });
                  }}
                  className="glass-input w-full px-3.5 py-2 text-sm bg-zinc-900"
                >
                  <option value="Hard Skills">Hard Skills</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>

              {editForm.category === 'Hard Skills' ? (
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Proficiency Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Novice', 'Intermediate', 'Proficient'].map((lvl) => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setEditForm({ ...editForm, level: lvl })}
                        className={`py-2 px-3 rounded-xl text-xs font-mono transition-all border ${
                          editForm.level === lvl
                            ? `${getLevelBadgeClass(lvl)} font-bold shadow-sm`
                            : 'bg-zinc-900/60 text-zinc-400 border-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-zinc-400">
                  ✦ Soft skills do not have a proficiency level.
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 font-medium text-xs hover:bg-zinc-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Check size={14} /> <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


