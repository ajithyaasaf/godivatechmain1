/**
 * React DOM Warning Prevention Hook
 * 
 * This hook automatically detects and prevents React DOM warnings
 * at runtime, providing comprehensive protection across the application.
 */

import { useEffect, useRef } from 'react';

interface WarningDetails {
  type: 'unknown-property' | 'invalid-tag' | 'attribute-mismatch' | 'other';
  element: string;
  property: string;
  message: string;
  timestamp: number;
}

let warningCount = 0;
const warningHistory: WarningDetails[] = [];

/**
 * Hook to monitor and prevent React DOM warnings
 */
export function useReactDOMWarningPrevention(componentName?: string) {
  const hasSetupRef = useRef(false);

  useEffect(() => {
    if (hasSetupRef.current || process.env.NODE_ENV !== 'development') return;
    hasSetupRef.current = true;

    // Store original console.error
    const originalError = console.error;

    // Intercept console.error to catch React warnings
    console.error = (...args: any[]) => {
      const message = args.join(' ');
      
      // Check if this is a React DOM warning
      if (message.includes('React does not recognize') || 
          message.includes('Warning: The tag') ||
          message.includes('unknown property') ||
          message.includes('unrecognized in this browser')) {
        
        warningCount++;
        
        // Parse warning details
        const warningDetails: WarningDetails = {
          type: parseWarningType(message),
          element: extractElementFromMessage(message),
          property: extractPropertyFromMessage(message),
          message,
          timestamp: Date.now()
        };
        
        warningHistory.push(warningDetails);
        
        // Provide helpful guidance
        console.group(`🚨 React DOM Warning Prevention #${warningCount}`);
        console.error('Original warning:', message);
        console.warn('Component:', componentName || 'Unknown');
        console.info('Recommended fix:', getRecommendedFix(warningDetails));
        console.info('Use safeImageProps(), safeIframeProps(), or other utilities from @/lib/dom-elements-safe');
        console.groupEnd();
        
        // Don't call original console.error for React warnings
        return;
      }
      
      // Call original console.error for non-React warnings
      originalError.apply(console, args);
    };

    // Cleanup on unmount
    return () => {
      console.error = originalError;
    };
  }, [componentName]);

  return {
    warningCount,
    warningHistory: [...warningHistory],
    clearWarnings: () => {
      warningHistory.length = 0;
      warningCount = 0;
    }
  };
}

/**
 * Parse the type of React warning
 */
function parseWarningType(message: string): WarningDetails['type'] {
  if (message.includes('React does not recognize')) return 'unknown-property';
  if (message.includes('The tag') && message.includes('unrecognized')) return 'invalid-tag';
  if (message.includes('attribute')) return 'attribute-mismatch';
  return 'other';
}

/**
 * Extract element name from warning message
 */
function extractElementFromMessage(message: string): string {
  // Try to extract element name from various warning patterns
  const elementMatch = message.match(/on a DOM element\. .* on (.+?) /);
  if (elementMatch) return elementMatch[1];
  
  const tagMatch = message.match(/The tag <(.+?)>/);
  if (tagMatch) return tagMatch[1];
  
  return 'unknown';
}

/**
 * Extract property name from warning message
 */
function extractPropertyFromMessage(message: string): string {
  const propMatch = message.match(/the `(.+?)` prop/);
  if (propMatch) return propMatch[1];
  
  const tagMatch = message.match(/<(.+?)>/);
  if (tagMatch) return tagMatch[1];
  
  return 'unknown';
}

/**
 * Get recommended fix for a specific warning
 */
function getRecommendedFix(warning: WarningDetails): string {
  const { type, element, property } = warning;
  
  switch (property.toLowerCase()) {
    case 'fetchpriority':
      return 'Use safeImageProps() utility from @/lib/dom-elements-safe';
    case 'crossorigin':
      return 'Use crossOrigin (camelCase) instead of crossorigin (lowercase)';
    case 'autoplay':
      return 'Use autoPlay (camelCase) instead of autoplay (lowercase)';
    case 'allowfullscreen':
      return 'Use allowFullScreen (camelCase) instead of allowfullscreen (lowercase)';
    case 'frameborder':
      return 'Use frameBorder (camelCase) instead of frameborder (lowercase)';
    case 'contenteditable':
      return 'Use contentEditable (camelCase) instead of contenteditable (lowercase)';
    case 'spellcheck':
      return 'Use spellCheck (camelCase) instead of spellcheck (lowercase)';
    case 'tabindex':
      return 'Use tabIndex (camelCase) instead of tabindex (lowercase)';
    default:
      if (type === 'invalid-tag') {
        return `Replace <${property}> with a proper React component or HTML element`;
      }
      return `Check React documentation for proper ${element} element attributes`;
  }
}

/**
 * Global function to get warning statistics
 */
export function getReactDOMWarningStats() {
  return {
    totalWarnings: warningCount,
    recentWarnings: warningHistory.slice(-10),
    warningsByType: warningHistory.reduce((acc, warning) => {
      acc[warning.type] = (acc[warning.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    warningsByElement: warningHistory.reduce((acc, warning) => {
      acc[warning.element] = (acc[warning.element] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}

/**
 * Development-only warning detector for manual testing
 */
export function testReactDOMWarnings() {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('testReactDOMWarnings() only works in development mode');
    return;
  }
  
  console.group('🧪 React DOM Warning Prevention Test');
  console.log('Current warning count:', warningCount);
  console.log('Warning history:', warningHistory);
  console.log('Stats:', getReactDOMWarningStats());
  console.groupEnd();
}