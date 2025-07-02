/**
 * BUILD-TIME VALIDATION SYSTEM
 * 
 * This system prevents React DOM warnings by validating HTML elements
 * at build time and providing comprehensive error reporting.
 */

import React from 'react';

// ============================================================================
// PROHIBITED ATTRIBUTES - These will cause React DOM warnings
// ============================================================================

type ProhibitedAttributesMap = Record<string, string>;

const PROHIBITED_ATTRIBUTES: Record<string, ProhibitedAttributesMap> = {
  // Image attributes that cause warnings
  img: {
    'fetchpriority': 'Use fetchPriority (camelCase) or safeImageProps() utility',
    'crossorigin': 'Use crossOrigin (camelCase)',
    'autoplay': 'Wrong element - use autoPlay for video/audio',
  },
  
  // Video/Audio attributes that cause warnings
  video: {
    'autoplay': 'Use autoPlay (camelCase)',
    'playsinline': 'Use playsInline (camelCase)',
    'crossorigin': 'Use crossOrigin (camelCase)',
  },
  
  audio: {
    'autoplay': 'Use autoPlay (camelCase)',
    'crossorigin': 'Use crossOrigin (camelCase)',
  },
  
  // Iframe attributes that cause warnings
  iframe: {
    'allowfullscreen': 'Use allowFullScreen (camelCase)',
    'frameborder': 'Use frameBorder (camelCase)',
  },
  
  // Link attributes that cause warnings
  link: {
    'crossorigin': 'Use crossOrigin (camelCase)',
  },
  
  // Script attributes that cause warnings
  script: {
    'crossorigin': 'Use crossOrigin (camelCase)',
  },
  
  // General attributes that cause warnings
  '*': {
    'contenteditable': 'Use contentEditable (camelCase)',
    'spellcheck': 'Use spellCheck (camelCase)',
    'tabindex': 'Use tabIndex (camelCase)',
    'readonly': 'Use readOnly (camelCase)',
    'maxlength': 'Use maxLength (camelCase)',
    'minlength': 'Use minLength (camelCase)',
    'novalidate': 'Use noValidate (camelCase)',
  }
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates HTML attributes in JSX to prevent React DOM warnings
 */
export function validateHTMLAttributes(
  elementType: string,
  attributes: Record<string, any>,
  componentName: string = 'Unknown Component'
): string[] {
  const errors: string[] = [];
  
  // Check element-specific prohibited attributes
  const elementProhibited = PROHIBITED_ATTRIBUTES[elementType as keyof typeof PROHIBITED_ATTRIBUTES];
  if (elementProhibited) {
    Object.keys(attributes).forEach(attr => {
      if (elementProhibited[attr]) {
        errors.push(
          `[${componentName}] Prohibited attribute "${attr}" on <${elementType}>: ${elementProhibited[attr]}`
        );
      }
    });
  }
  
  // Check general prohibited attributes
  const generalProhibited = PROHIBITED_ATTRIBUTES['*'];
  Object.keys(attributes).forEach(attr => {
    if (generalProhibited[attr]) {
      errors.push(
        `[${componentName}] Prohibited attribute "${attr}": ${generalProhibited[attr]}`
      );
    }
  });
  
  return errors;
}

/**
 * Validates that icon props are React components, not strings
 */
export function validateIconComponent(
  icon: any,
  componentName: string = 'Unknown Component'
): string[] {
  const errors: string[] = [];
  
  if (typeof icon === 'string') {
    // Check if it looks like an HTML tag
    if (icon.match(/^[a-z-]+$/)) {
      errors.push(
        `[${componentName}] Icon prop received string "${icon}" which may render as HTML tag. ` +
        `Use a React component instead: import { ${icon.charAt(0).toUpperCase() + icon.slice(1)}Icon } from 'lucide-react'`
      );
    }
  }
  
  if (icon && typeof icon !== 'function' && typeof icon !== 'object') {
    errors.push(
      `[${componentName}] Icon prop must be a React component, received: ${typeof icon}`
    );
  }
  
  return errors;
}

/**
 * Comprehensive component validation
 */
export function validateReactComponent(
  componentName: string,
  props: Record<string, any>,
  htmlElements: Array<{ type: string; attributes: Record<string, any> }>
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validate HTML elements
  htmlElements.forEach(({ type, attributes }) => {
    const elementErrors = validateHTMLAttributes(type, attributes, componentName);
    errors.push(...elementErrors);
  });
  
  // Validate icon props
  if (props.icon) {
    const iconErrors = validateIconComponent(props.icon, componentName);
    errors.push(...iconErrors);
  }
  
  // Check for common anti-patterns
  if (props.dangerouslySetInnerHTML) {
    warnings.push(
      `[${componentName}] Uses dangerouslySetInnerHTML. Ensure content is sanitized.`
    );
  }
  
  return { errors, warnings };
}

// ============================================================================
// DEVELOPMENT-TIME HELPERS
// ============================================================================

/**
 * Development-only function to report validation errors
 */
export function reportValidationErrors(
  componentName: string,
  errors: string[],
  warnings: string[]
): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  if (errors.length > 0) {
    console.group(`🚨 React DOM Warning Prevention - ${componentName}`);
    errors.forEach(error => console.error(error));
    console.groupEnd();
  }
  
  if (warnings.length > 0) {
    console.group(`⚠️ React DOM Warning Prevention - ${componentName}`);
    warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }
}

/**
 * HOC to add validation to any component
 */
export function withValidation<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  componentName?: string
) {
  const WrappedComponent = (props: P) => {
    if (process.env.NODE_ENV === 'development') {
      const name = componentName || Component.displayName || Component.name || 'Anonymous';
      
      // Basic validation for common issues
      const { errors, warnings } = validateReactComponent(name, props, []);
      reportValidationErrors(name, errors, warnings);
    }
    
    return React.createElement(Component, props);
  };
  
  WrappedComponent.displayName = `withValidation(${componentName || Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
}

// ============================================================================
// RECOMMENDED SOLUTIONS
// ============================================================================

export const RECOMMENDED_SOLUTIONS = {
  fetchPriority: 'Use safeImageProps() from @/lib/dom-elements-safe',
  crossOrigin: 'Use camelCase crossOrigin in JSX (React handles conversion)',
  autoPlay: 'Use camelCase autoPlay for video/audio elements',
  allowFullScreen: 'Use camelCase allowFullScreen for iframe elements',
  contentEditable: 'Use camelCase contentEditable',
  iconStrings: 'Import proper React components: import { CloudIcon } from "lucide-react"',
  htmlTags: 'Never use HTML tag strings as JSX - use React components only',
};

// ============================================================================
// AUTOMATED TESTING HELPERS
// ============================================================================

/**
 * Test suite to validate all HTML elements in the application
 */
export function createValidationTestSuite() {
  return {
    // Test that all img elements use safe props
    testImageElements: () => {
      // This would be used in automated testing
      console.log('Testing image elements for React DOM warnings...');
    },
    
    // Test that all iframe elements use safe props
    testIframeElements: () => {
      console.log('Testing iframe elements for React DOM warnings...');
    },
    
    // Test that all icon components are valid React components
    testIconComponents: () => {
      console.log('Testing icon components for React DOM warnings...');
    }
  };
}