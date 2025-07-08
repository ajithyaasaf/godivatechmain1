import React, { ReactNode, CSSProperties, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundSpeed?: number;
  contentSpeed?: number;
  className?: string;
  style?: CSSProperties;
  overlayColor?: string;
  overlayOpacity?: number;
  revealDirection?: 'up' | 'down' | 'left' | 'right';
  sectionHeight?: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  backgroundImage,
  backgroundColor = 'transparent',
  backgroundSpeed = 0.5,
  contentSpeed = -0.1,
  className = '',
  style = {},
  overlayColor = 'rgba(0, 0, 0, 0.4)',
  overlayOpacity = 0.2,
  revealDirection = 'up',
  sectionHeight = 'auto'
}) => {
  // Setup ref for the section
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Use framer-motion's useScroll and useTransform for parallax effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Transform values based on scroll position
  const backgroundY = useTransform(
    scrollYProgress, 
    [0, 1], 
    ['0%', `${backgroundSpeed * 100}%`]
  );
  
  const contentY = useTransform(
    scrollYProgress, 
    [0, 1], 
    ['0%', `${contentSpeed * 100}%`]
  );
  
  // Initial animation variants based on reveal direction
  const getVariants = () => {
    switch(revealDirection) {
      case 'up':
        return {
          hidden: { y: 50, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
      case 'down':
        return {
          hidden: { y: -50, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        };
      case 'left':
        return {
          hidden: { x: 50, opacity: 0 },
          visible: { x: 0, opacity: 1 }
        };
      case 'right':
        return {
          hidden: { x: -50, opacity: 0 },
          visible: { x: 0, opacity: 1 }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
    }
  };
  
  const variants = getVariants();
  
  // Combine background styles
  const backgroundStyles: CSSProperties = {
    backgroundColor,
    height: sectionHeight,
    ...style
  };
  
  return (
    <section 
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={backgroundStyles}
    >
      {/* Background image with parallax effect */}
      {backgroundImage && (
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            y: backgroundY
          }}
        />
      )}
      
      {/* Overlay for better text contrast */}
      {overlayOpacity > 0 && (
        <div 
          className="absolute inset-0" 
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}
      
      {/* Content with parallax effect */}
      <motion.div 
        className="relative z-10"
        style={{ y: contentY }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={variants}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default ParallaxSection;