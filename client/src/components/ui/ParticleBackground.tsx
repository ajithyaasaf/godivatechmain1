import React, { useEffect, useRef, memo, useState } from 'react';
import { throttle } from '@/lib/jsOptimizer';

interface Particle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  opacity: number;
  color: string;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  minOpacity?: number;
  maxOpacity?: number;
  className?: string;
}

/**
 * A highly optimized particle background component
 * - Uses Canvas API instead of DOM elements for better performance
 * - Implements throttled animation frames
 * - Only runs when visible in viewport
 * - Handles resize events efficiently
 */
const ParticleBackground: React.FC<ParticleBackgroundProps> = memo(({
  particleCount = 30, // Reduced default count for better performance
  colors = ['#3b82f6', '#4f46e5', '#8b5cf6'], // Use the site's primary colors
  minSize = 2,
  maxSize = 6,
  minSpeed = 0.05, // Reduced speed for lower CPU usage
  maxSpeed = 0.2,
  minOpacity = 0.05,
  maxOpacity = 0.2,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const isInitialized = useRef(false);
  const isVisible = useRef(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Initialize particles in Canvas instead of DOM
  const initializeParticles = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear any existing particles
    particles.current = [];
    
    // Create new particles
    for (let i = 0; i < particleCount; i++) {
      // Randomize particle properties
      const size = Math.random() * (maxSize - minSize) + minSize;
      const opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Create particle object (no DOM elements)
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() > 0.5 ? 1 : -1),
        speedY: (Math.random() * (maxSpeed - minSpeed) + minSpeed) * (Math.random() > 0.5 ? 1 : -1),
        size,
        opacity,
        color
      });
    }
    
    // Draw initial state
    drawParticles();
    
    isInitialized.current = true;
  };
  
  // Draw particles to canvas
  const drawParticles = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each particle
    particles.current.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
    });
  };
  
  // Animate particles - optimized with performance considerations
  const animateParticles = () => {
    if (!canvasRef.current || !isVisible.current) {
      animationRef.current = requestAnimationFrame(animateParticles);
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Batch update and draw particles
    particles.current.forEach(particle => {
      // Update particle position - minimal calculations
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Efficient boundary checks
      if (particle.x <= 0 || particle.x >= canvas.width) {
        particle.speedX *= -1;
      }
      
      if (particle.y <= 0 || particle.y >= canvas.height) {
        particle.speedY *= -1;
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
    });
    
    // Continue animation
    animationRef.current = requestAnimationFrame(animateParticles);
  };
  
  // Setup visibility detection
  useEffect(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        isVisible.current = entries[0]?.isIntersecting ?? true;
      }, { threshold: 0.1 });
      
      if (canvasRef.current) {
        observer.observe(canvasRef.current);
      }
      
      return () => observer.disconnect();
    }
    
    return undefined;
  }, []);
  
  // Handle resizing
  useEffect(() => {
    // Throttled resize handler for performance
    const handleResize = throttle(() => {
      if (!canvasRef.current || !canvasRef.current.parentElement) return;
      
      const parent = canvasRef.current.parentElement;
      const { width, height } = parent.getBoundingClientRect();
      
      // Only update if dimensions actually changed
      if (width !== dimensions.width || height !== dimensions.height) {
        setDimensions({ width, height });
        
        // Update canvas size
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        
        // Reinitialize particles if already initialized
        if (isInitialized.current) {
          initializeParticles();
        }
      }
    }, 100);
    
    // Set initial dimensions
    if (canvasRef.current && canvasRef.current.parentElement) {
      const parent = canvasRef.current.parentElement;
      const { width, height } = parent.getBoundingClientRect();
      setDimensions({ width, height });
      canvasRef.current.width = width;
      canvasRef.current.height = height;
    }
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Initialize particles
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initializeParticles();
    }
  }, [dimensions, particleCount, minSize, maxSize, minOpacity, maxOpacity, colors]);
  
  // Start animation
  useEffect(() => {
    if (!isInitialized.current) return;
    
    // Start animation
    animationRef.current = requestAnimationFrame(animateParticles);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [dimensions]);
  
  return (
    <div className={`particle-container absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas 
        ref={canvasRef} 
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
      />
    </div>
  );
});

// Explicitly set display name for devtools
ParticleBackground.displayName = 'ParticleBackground';

export default ParticleBackground;