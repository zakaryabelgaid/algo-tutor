'use client';

import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export function ParticlesBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    const numberOfParticles = 100;

    const mouse = {
        x: -1000,
        y: -1000,
        radius: 150
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    };
    
    window.addEventListener('mousemove', handleMouseMove);


    const setCanvasSize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    setCanvasSize();
    
    const isDarkMode = () => document.documentElement.classList.contains('dark');


    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      baseX: number;
      baseY: number;
      density: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }

      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        
        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
          this.speedX *= -1;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY *= -1;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = isDarkMode() ? `rgba(255, 255, 255, 0.4)` : `hsla(180, 50%, 45%, 0.4)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    const init = () => {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };
    init();

    const connect = () => {
        if (!ctx) return;
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) { 
                    opacityValue = 1 - (distance/120);
                    ctx.strokeStyle = isDarkMode() ? `rgba(255, 255, 255, ${opacityValue * 0.4})` : `hsla(180, 50%, 45%, ${opacityValue * 0.4})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    };


    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      connect();
      requestAnimationFrame(animate);
    };
    
    let animationFrameId = requestAnimationFrame(animate);
    
    const handleResize = () => {
      setCanvasSize();
      init();
    };

    window.addEventListener('resize', handleResize);
    const parent = canvas.parentElement;
    const handleMouseOut = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    }
    if (parent) {
      parent.addEventListener('mouseleave', handleMouseOut);
    }
    
    // Observer for theme changes
    const observer = new MutationObserver((mutationsList) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                // This will trigger on theme change, the drawing functions will pick up the new theme
            }
        }
    });

    observer.observe(document.documentElement, { attributes: true });


    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (parent) {
        parent.removeEventListener('mouseleave', handleMouseOut);
      }
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={cn(className)} />;
}
