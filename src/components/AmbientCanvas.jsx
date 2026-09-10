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

    // Subtle dark dust particles
    const particleCount = Math.min(width > 768 ? 50 : 25, 70);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        radius: Math.random() * 1.3 + 0.4,
        alpha: Math.random() * 0.35 + 0.1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial background halo follows mouse gently
      const gradX = mouse.active ? mouse.x : width / 2;
      const gradY = mouse.active ? mouse.y : height * 0.25;

      const gradient = ctx.createRadialGradient(
        gradX,
        gradY,
        0,
        gradX,
        gradY,
        Math.max(width, height) * 0.55
      );
      gradient.addColorStop(0, 'rgba(30, 30, 35, 0.35)');
      gradient.addColorStop(0.5, 'rgba(14, 14, 16, 0.18)');
      gradient.addColorStop(1, 'rgba(7, 7, 7, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw floating particles with gentle mouse repulsion/interaction
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Gentle interactive mouse influence
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