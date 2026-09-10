import React, { useEffect, useRef } from 'react';

export const AmbientCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, active: false };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Dynamic organic wandering grid state
    const gridSize = 52;
    let gridOffset = { x: 0, y: 0 };
    let currentAngle = Math.random() * Math.PI * 2;
    let targetAngle = Math.random() * Math.PI * 2;
    let angleChangeTimer = 0;
    const gridSpeed = 0.42; // Slow, smooth speed

    // Subtle dark dust particles
    const particleCount = Math.min(width > 768 ? 40 : 20, 60);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.35 + 0.1,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Update Grid Organic Direction & Offset
      angleChangeTimer++;
      if (angleChangeTimer > 240) {
        targetAngle = Math.random() * Math.PI * 2;
        angleChangeTimer = 0;
      }
      // Smoothly interpolate angle
      const diff = Math.atan2(Math.sin(targetAngle - currentAngle), Math.cos(targetAngle - currentAngle));
      currentAngle += diff * 0.008;

      gridOffset.x = (gridOffset.x + Math.cos(currentAngle) * gridSpeed) % gridSize;
      gridOffset.y = (gridOffset.y + Math.sin(currentAngle) * gridSpeed) % gridSize;

      const startX = ((gridOffset.x % gridSize) - gridSize);
      const startY = ((gridOffset.y % gridSize) - gridSize);

      // 2. Render Moving Grid Lines
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
      ctx.lineWidth = 1;

      // Vertical grid lines
      for (let x = startX; x < width + gridSize; x += gridSize) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, height);
      }

      // Horizontal grid lines
      for (let y = startY; y < height + gridSize; y += gridSize) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(width, Math.round(y) + 0.5);
      }
      ctx.stroke();

      // 3. Render Subtle Grid Intersection Nodes (with mouse reactivity)
      for (let x = startX; x < width + gridSize; x += gridSize) {
        for (let y = startY; y < height + gridSize; y += gridSize) {
          let nodeAlpha = 0.065;
          if (mouse.active) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 160) {
              nodeAlpha = 0.065 + (1 - dist / 160) * 0.18;
            }
          }
          ctx.fillStyle = `rgba(255, 255, 255, ${nodeAlpha})`;
          ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
        }
      }

      // 4. Radial mouse halo for depth
      const gradX = mouse.active ? mouse.x : width / 2;
      const gradY = mouse.active ? mouse.y : height * 0.25;

      const gradient = ctx.createRadialGradient(
        gradX,
        gradY,
        0,
        gradX,
        gradY,
        Math.max(width, height) * 0.6
      );
      gradient.addColorStop(0, 'rgba(45, 45, 55, 0.25)');
      gradient.addColorStop(0.5, 'rgba(18, 18, 22, 0.12)');
      gradient.addColorStop(1, 'rgba(7, 7, 7, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 5. Floating ambient dust particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.x -= (dx / dist) * force * 1.2;
            p.y -= (dy / dist) * force * 1.2;
          }
        }

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} id="ambient-canvas" className="pointer-events-none fixed inset-0 z-0 w-full h-full" />;
};