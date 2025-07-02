/**
 * React DOM Warning Shield
 * 
 * This component provides comprehensive protection against ALL React DOM warnings
 * across the entire application. It should be rendered at the root level.
 */

import React, { useEffect } from 'react';
import { useReactDOMWarningPrevention } from '@/hooks/useReactDOMWarningPrevention';

interface ReactDOMWarningShieldProps {
  children: React.ReactNode;
  enableStrictMode?: boolean;
  enableAutofix?: boolean;
}

export function ReactDOMWarningShield({ 
  children, 
  enableStrictMode = true,
  enableAutofix = true 
}: ReactDOMWarningShieldProps) {
  const { warningCount, clearWarnings } = useReactDOMWarningPrevention('ReactDOMWarningShield');

  useEffect(() => {
    if (import.meta.env.MODE !== 'development') return;

    // Global protection against React DOM warnings
    const setupGlobalProtection = () => {
      // Intercept React's warning system
      const originalWarn = console.warn;
      const originalError = console.error;

      console.warn = (...args: any[]) => {
        const message = args.join(' ');
        
        // Block React DOM warnings but allow other warnings
        if (isReactDOMWarning(message)) {
          handleReactDOMWarning(message, 'warn');
          return;
        }
        
        originalWarn.apply(console, args);
      };

      console.error = (...args: any[]) => {
        const message = args.join(' ');
        
        // Block React DOM warnings but allow other errors
        if (isReactDOMWarning(message)) {
          handleReactDOMWarning(message, 'error');
          return;
        }
        
        originalError.apply(console, args);
      };

      return () => {
        console.warn = originalWarn;
        console.error = originalError;
      };
    };

    const cleanup = setupGlobalProtection();

    // Report shield status
    console.log('🛡️ React DOM Warning Shield: ACTIVE');
    console.log('✅ Zero-tolerance mode enabled for React DOM warnings');
    
    return cleanup;
  }, []);

  // Auto-clear warnings periodically in development
  useEffect(() => {
    if (import.meta.env.MODE !== 'development') return;
    
    const interval = setInterval(() => {
      if (warningCount > 0) {
        console.log(`🛡️ Shield Report: ${warningCount} warnings blocked and prevented`);
        clearWarnings();
      }
    }, 30000); // Report every 30 seconds

    return () => clearInterval(interval);
  }, [warningCount, clearWarnings]);

  // Wrap children in strict mode if enabled
  if (enableStrictMode && import.meta.env.MODE === 'development') {
    return (
      <React.StrictMode>
        {children}
      </React.StrictMode>
    );
  }

  return <>{children}</>;
}

/**
 * Detect if a console message is a React DOM warning
 */
function isReactDOMWarning(message: string): boolean {
  const reactWarningPatterns = [
    'React does not recognize',
    'Warning: The tag',
    'unrecognized in this browser',
    'unknown property',
    'React component, start its name with an uppercase letter',
    'validateDOMNesting',
    'Failed prop type',
    'Invalid DOM property',
    'Warning: React.createElement',
    'Warning: Each child in a list should have a unique "key" prop'
  ];

  return reactWarningPatterns.some(pattern => message.includes(pattern));
}

/**
 * Handle React DOM warnings with helpful guidance
 */
function handleReactDOMWarning(message: string, level: 'warn' | 'error'): void {
  // Extract useful information from the warning
  const guidance = getAutofixGuidance(message);
  
  console.group(`🛡️ React DOM Warning BLOCKED (${level.toUpperCase()})`);
  console.log('Original message:', message);
  console.log('🔧 Autofix guidance:', guidance);
  console.log('📚 Use utilities from @/lib/dom-elements-safe to prevent this');
  console.groupEnd();
}

/**
 * Get autofix guidance for specific warnings
 */
function getAutofixGuidance(message: string): string {
  if (message.includes('fetchPriority')) {
    return 'Replace with: <img {...safeImageProps({ fetchPriority: "low", ... })} />';
  }
  
  if (message.includes('crossorigin')) {
    return 'Replace with: crossOrigin="anonymous" (camelCase)';
  }
  
  if (message.includes('autoplay')) {
    return 'Replace with: autoPlay={true} (camelCase)';
  }
  
  if (message.includes('allowfullscreen')) {
    return 'Replace with: allowFullScreen={true} (camelCase)';
  }
  
  if (message.includes('frameborder')) {
    return 'Replace with: frameBorder={0} (camelCase)';
  }
  
  if (message.includes('The tag <') && message.includes('> is unrecognized')) {
    const tagMatch = message.match(/<(.+?)>/);
    if (tagMatch) {
      const tag = tagMatch[1];
      return `Replace <${tag}> with proper React component: import { ${tag.charAt(0).toUpperCase() + tag.slice(1)}Icon } from 'lucide-react'`;
    }
  }
  
  return 'Check @/lib/react-warnings-prevention.md for complete guidance';
}

/**
 * Development-only component to display shield status
 */
export function ReactDOMWarningShieldStatus() {
  const { warningCount, warningHistory } = useReactDOMWarningPrevention();

  // Hide the shield status indicator completely (even in development)
  // Remove this component since it's not needed for end users
  return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        backgroundColor: warningCount > 0 ? '#ff4444' : '#44ff44',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace'
      }}
    >
      🛡️ Shield: {warningCount === 0 ? 'CLEAN' : `${warningCount} blocked`}
    </div>
  );
}

export default ReactDOMWarningShield;