import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Creates a particle effect background animation
 * @param containerRef Reference to the container element
 * @param particleCount Number of particles to create
 * @param colors Array of particle colors
 */
export const createParticleBackground = (
  containerRef: React.RefObject<HTMLElement>,
  particleCount: number = 50,
  colors: string[] = ['#ffffff', '#f0f0f0', '#e0e0e0', '#d0d0d0']
) => {
  if (!containerRef.current) return;

  const container = containerRef.current;
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  // Clear existing particles
  const existingParticles = container.querySelectorAll('.particle');
  existingParticles.forEach(particle => particle.remove());

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.position = 'absolute';
    particle.style.borderRadius = '50%';
    particle.style.opacity = '0';
    particle.style.pointerEvents = 'none';
    
    // Randomize particle properties
    const size = Math.random() * 5 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    
    container.appendChild(particle);
    
    // Animate the particle
    gsap.to(particle, {
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 1 + 0.5,
      onComplete: () => {
        gsap.to(particle, {
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
          duration: Math.random() * 30 + 10,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });
      }
    });
  }
};

/**
 * Creates a text typing animation effect
 * @param textRef Reference to the text element
 * @param text The text to type
 * @param speed The typing speed in ms per character
 * @param startDelay Delay before typing starts
 * @param onComplete Callback to run when typing is complete
 */
export const typeText = (
  textRef: React.RefObject<HTMLElement>,
  text: string,
  speed: number = 50,
  startDelay: number = 0,
  onComplete?: () => void
) => {
  if (!textRef.current) return;
  
  const element = textRef.current;
  element.textContent = '';
  element.style.visibility = 'visible';
  
  let i = 0;
  
  // Start typing after delay
  setTimeout(() => {
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
        if (onComplete) onComplete();
      }
    }, speed);
  }, startDelay);
};

/**
 * Creates a scroll-triggered animation for a section
 * @param sectionRef Reference to the section element
 * @param animation The animation function to apply
 */
export const createScrollAnimation = (
  sectionRef: React.RefObject<HTMLElement>,
  animation: (element: HTMLElement) => gsap.core.Timeline
) => {
  if (!sectionRef.current) return;
  
  const section = sectionRef.current;
  const tl = animation(section);
  
  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom-=100',
    end: 'bottom top',
    toggleActions: 'play none none reverse',
    animation: tl
  });
};

/**
 * Creates a fade-in animation for an element
 * @param element The element to animate
 * @param delay Delay before animation starts (in seconds)
 * @param y Y offset to animate from
 */
export const fadeInAnimation = (
  element: HTMLElement,
  delay: number = 0,
  y: number = 50
): gsap.core.Timeline => {
  const tl = gsap.timeline();
  tl.from(element, {
    opacity: 0,
    y,
    duration: 0.8,
    delay,
    ease: 'power2.out'
  });
  return tl;
};

/**
 * Creates a staggered fade-in animation for multiple elements
 * @param parentRef Reference to the parent container
 * @param childrenSelector CSS selector for the children to animate
 * @param staggerDelay Delay between each child animation (in seconds)
 */
export const staggerFadeIn = (
  parentRef: React.RefObject<HTMLElement>,
  childrenSelector: string,
  staggerDelay: number = 0.1
) => {
  if (!parentRef.current) return;

  const parent = parentRef.current;
  const children = parent.querySelectorAll(childrenSelector);
  
  gsap.from(children, {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger: staggerDelay,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: parent,
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse'
    }
  });
};

/**
 * Creates a bouncing animation for a button or element
 * @param buttonRef Reference to the button element
 */
export const createButtonPulse = (buttonRef: React.RefObject<HTMLElement>) => {
  if (!buttonRef.current) return;
  
  const button = buttonRef.current;
  
  gsap.to(button, {
    scale: 1.05,
    duration: 0.8,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });
};