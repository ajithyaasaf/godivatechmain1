import React from 'react';
import { Link as WouterLink, useLocation } from 'wouter';

interface CustomLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any;
}

/**
 * Custom Link component that uses wouter's useLocation hook
 * to provide proper history-based navigation.
 */
const Link: React.FC<CustomLinkProps> = ({ 
  href, 
  children, 
  className = '',
  onClick,
  ...props 
}) => {
  const [, navigate] = useLocation();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If there's a custom onClick handler, call it
    if (onClick) {
      onClick(e);
    }
    
    // If the event wasn't prevented already and it's a left click without modifiers
    if (
      !e.defaultPrevented && 
      e.button === 0 && 
      !e.ctrlKey && 
      !e.metaKey && 
      !e.altKey && 
      !e.shiftKey
    ) {
      e.preventDefault();
      
      // Just use wouter's navigate - our enhanced hook will handle everything correctly
      navigate(href);
    }
  };
  
  return (
    <a 
      href={href} 
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;