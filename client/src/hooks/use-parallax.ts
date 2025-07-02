import { useRef, useEffect, useState, RefObject } from 'react';

/**
 * Hook to create parallax scrolling effects
 * @param speed Speed and direction of parallax effect (negative values move opposite to scroll)
 * @param threshold Minimum scroll position to start parallax effect (optional)
 * @returns React ref to attach to the element that should have parallax effect
 */
export function useParallax<T extends HTMLElement>(
  speed: number = 0.2,
  threshold: number = 0
): [RefObject<T>, { y: number }] {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState({ y: 0 });
  const [windowHeight, setWindowHeight] = useState(0);
  const [elementVisible, setElementVisible] = useState(false);
  
  // Get window height on mount
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Apply parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrollTop = window.scrollY;
      
      // Check if element is in viewport
      if (rect.bottom >= 0 && rect.top <= windowHeight) {
        setElementVisible(true);
        
        // Calculate parallax offset based on element position
        const elementTop = rect.top + scrollTop;
        const elementCenter = elementTop + (rect.height / 2);
        const distanceFromCenter = scrollTop + (windowHeight / 2) - elementCenter;
        
        // Only apply parallax if we've scrolled past threshold
        if (Math.abs(distanceFromCenter) > threshold) {
          setOffset({ y: distanceFromCenter * speed });
        } else {
          setOffset({ y: 0 });
        }
      } else {
        setElementVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, threshold, windowHeight]);
  
  return [ref, offset];
}

/**
 * Hook to apply parallax effect to background images
 * @param speed Speed of parallax effect (positive values move slower than scroll)
 * @returns [ref, backgroundPositionY]
 */
export function useBackgroundParallax<T extends HTMLElement>(
  speed: number = 0.5
): [RefObject<T>, string] {
  const ref = useRef<T>(null);
  const [backgroundPosition, setBackgroundPosition] = useState('50% 0px');
  
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrollPosition = window.scrollY;
      
      // Only apply effect when element is in viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Calculate how far the element is from the top of the viewport
        const elementTop = rect.top + scrollPosition;
        const viewportOffset = scrollPosition - elementTop;
        const parallax = viewportOffset * speed;
        
        setBackgroundPosition(`50% ${parallax}px`);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  
  return [ref, backgroundPosition];
}

/**
 * Hook to create a reveal on scroll effect with optional parallax
 * @param direction Direction to reveal from ('up', 'down', 'left', 'right')
 * @param distance Distance to travel in pixels
 * @param delay Delay before animation starts (in seconds)
 * @returns React ref to attach to the element
 */
export function useRevealParallax<T extends HTMLElement>(
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance: number = 50,
  delay: number = 0
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // If element has data attributes for transform, apply them
          if (ref.current) {
            const directionMap = {
              up: `translateY(${distance}px)`,
              down: `translateY(-${distance}px)`,
              left: `translateX(${distance}px)`,
              right: `translateX(-${distance}px)`,
            };
            
            ref.current.style.transform = directionMap[direction];
            ref.current.style.opacity = '0';
            ref.current.style.transition = `transform 0.6s ease-out ${delay}s, opacity 0.6s ease-out ${delay}s`;
            
            // Force reflow
            ref.current.offsetHeight;
            
            // Apply final state
            ref.current.style.transform = 'translate(0)';
            ref.current.style.opacity = '1';
          }
          
          // Once revealed, stop observing
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [direction, distance, delay]);
  
  return [ref, isVisible];
}