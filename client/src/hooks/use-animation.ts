import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAnimation, AnimationControls } from 'framer-motion';

/**
 * Hook to trigger animations when an element comes into view
 * @param threshold The percentage of the element that needs to be in view
 * @param triggerOnce Whether to trigger the animation only once 
 * @returns [ref, controls, inView] - Ref to attach to the element, animation controls, and whether the element is in view
 */
export function useAnimateOnScroll(
  threshold: number = 0.1,
  triggerOnce: boolean = true
): [any, AnimationControls, boolean] {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else if (!triggerOnce) {
      controls.start('hidden');
    }
  }, [controls, inView, triggerOnce]);

  return [ref, controls, inView];
}

/**
 * Hook to add staggered animation for child elements
 * @param childCount Number of children to animate
 * @param staggerDelay Delay between each child animation in seconds
 * @returns Animation variants object for parent and children
 */
export function useStaggerAnimation(childCount: number, staggerDelay: number = 0.1) {
  return {
    parent: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        },
      },
    },
    children: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          damping: 12,
          stiffness: 100,
        },
      },
    },
  };
}

/**
 * Animation variants for fading in elements
 */
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/**
 * Animation variants for sliding in elements from the left
 */
export const slideInLeftVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/**
 * Animation variants for sliding in elements from the right
 */
export const slideInRightVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/**
 * Animation variants for sliding in elements from the bottom
 */
export const slideInUpVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/**
 * Animation variants for scaling elements in
 */
export const scaleInVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

/**
 * Animation variants for rotating elements in
 */
export const rotateInVariants = {
  hidden: { rotate: -10, opacity: 0 },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};