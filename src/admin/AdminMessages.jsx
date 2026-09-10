import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, Trash2 } from 'lucide-react';

export const AdminMessages = () => {
  const { data, deleteMessage, markMessageRead } = usePortfolio();

  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/[0.08]">
      <h3 className="text-lg font-bold text-white mb-1 font-mono">Visitor Inquiries Inbox</h3>
      <p className="text-xs text-zinc-400 mb-6">Messages transmitted through the Contact form.</p>

      {(!data.messages || data.messages.length === 0) ? (
        <div className="p-12 text-center text-zinc-500 text-xs font-mono">
          No visitor inquiries recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {data.messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-xl border transition-all ${
                msg.read ? 'bg-zinc-900/40 border-white/[0.05]' : 'bg-zinc-900/90 border-white/20 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{msg.name}</span>
                  <span className="text-xs font-mono text-zinc-400">&lt;{msg.email}&gt;</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{msg.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed my-3 bg-black/40 p-3 rounded-lg border border-white/[0.04]">
                {msg.message}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                <a
                  href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry`}
                  className="text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1"
                >
                  Reply via Email <ExternalLink size={11} />
                </a>
                <div className="flex items-center gap-2">
                  {!msg.read && (
                    <button
                      onClick={() => markMessageRead(msg.id)}
                      className="px-2.5 py-1 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300 hover:text-white"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="p-1 rounded text-zinc-500 hover:text-red-400"
                    title="Delete message"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
