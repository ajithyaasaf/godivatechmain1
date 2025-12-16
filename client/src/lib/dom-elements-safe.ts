/**
 * COMPREHENSIVE React DOM Warnings Prevention System
 * 
 * This module provides bulletproof utilities for all HTML elements to ensure
 * ZERO React DOM warnings across the entire application.
 */

import React from 'react';

// ============================================================================
// SAFE IMAGE COMPONENT
// ============================================================================

export interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  width?: number | string;
  height?: number | string;
  fetchPriority?: 'high' | 'low' | 'auto';
  style?: React.CSSProperties;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  title?: string;
  sizes?: string;
  srcSet?: string;
}

export function safeImageProps(props: SafeImageProps): React.ImgHTMLAttributes<HTMLImageElement> {
  const {
    src,
    alt,
    className,
    loading = 'lazy',
    decoding = 'async',
    width,
    height,
    fetchPriority,
    style,
    onLoad,
    onError,
    title,
    sizes,
    srcSet
  } = props;

  // Create base props with proper types
  const imageProps: any = {
    src,
    alt,
    className,
    loading,
    decoding,
    style,
    onLoad,
    onError,
    title,
    sizes,
    srcSet,
    // Convert dimensions to numbers if needed
    width: typeof width === 'string' ? parseInt(width) || undefined : width,
    height: typeof height === 'string' ? parseInt(height) || undefined : height,
  };

  // Handle fetchPriority safely
  if (fetchPriority && fetchPriority !== 'auto') {
    // Use the DOM attribute name directly for compatibility
    imageProps.fetchpriority = fetchPriority;
  }

  // Remove undefined values to keep props clean
  Object.keys(imageProps).forEach(key => {
    if (imageProps[key] === undefined) {
      delete imageProps[key];
    }
  });

  return imageProps;
}

// ============================================================================
// SAFE VIDEO COMPONENT
// ============================================================================

export interface SafeVideoProps {
  src?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  onLoadedData?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  onCanPlay?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  children?: React.ReactNode;
}

export function safeVideoProps(props: SafeVideoProps): React.VideoHTMLAttributes<HTMLVideoElement> {
  const {
    src,
    poster,
    className,
    autoPlay = false,
    muted = false,
    loop = false,
    controls = true,
    playsInline = false,
    preload = 'metadata',
    width,
    height,
    style,
    onLoadedData,
    onCanPlay,
  } = props;

  return {
    src,
    poster,
    className,
    autoPlay: Boolean(autoPlay),
    muted: Boolean(muted),
    loop: Boolean(loop),
    controls: Boolean(controls),
    playsInline: Boolean(playsInline),
    preload,
    width: typeof width === 'string' ? parseInt(width) || undefined : width,
    height: typeof height === 'string' ? parseInt(height) || undefined : height,
    style,
    onLoadedData,
    onCanPlay,
  };
}

// ============================================================================
// SAFE IFRAME COMPONENT
// ============================================================================

export interface SafeIframeProps {
  src: string;
  title: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  sandbox?: string;
  allow?: string;
  allowFullScreen?: boolean;
  frameBorder?: number | string;
  style?: React.CSSProperties;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export function safeIframeProps(props: SafeIframeProps): React.IframeHTMLAttributes<HTMLIFrameElement> {
  const {
    src,
    title,
    className,
    width,
    height,
    loading = 'lazy',
    sandbox,
    allow,
    allowFullScreen = false,
    frameBorder = 0,
    style,
    referrerPolicy
  } = props;

  return {
    src,
    title,
    className,
    width: typeof width === 'string' ? parseInt(width) || undefined : width,
    height: typeof height === 'string' ? parseInt(height) || undefined : height,
    loading,
    sandbox,
    allow,
    allowFullScreen: Boolean(allowFullScreen),
    frameBorder: typeof frameBorder === 'string' ? parseInt(frameBorder) : frameBorder,
    style,
    referrerPolicy
  };
}

// ============================================================================
// SAFE LINK COMPONENT (for <link> elements in head)
// ============================================================================

export interface SafeLinkProps {
  rel: string;
  href: string;
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  integrity?: string;
  media?: string;
  sizes?: string;
  as?: string;
  hrefLang?: string;
}

export function safeLinkProps(props: SafeLinkProps): React.LinkHTMLAttributes<HTMLLinkElement> {
  return {
    rel: props.rel,
    href: props.href,
    type: props.type,
    crossOrigin: props.crossOrigin, // React handles the camelCase conversion
    integrity: props.integrity,
    media: props.media,
    sizes: props.sizes,
    as: props.as,
    hrefLang: props.hrefLang,
  };
}

// ============================================================================
// SAFE SCRIPT COMPONENT
// ============================================================================

export interface SafeScriptProps {
  src?: string;
  type?: string;
  async?: boolean;
  defer?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials';
  integrity?: string;
  nonce?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  children?: string;
}

export function safeScriptProps(props: SafeScriptProps): React.ScriptHTMLAttributes<HTMLScriptElement> {
  return {
    src: props.src,
    type: props.type || 'text/javascript',
    async: Boolean(props.async),
    defer: Boolean(props.defer),
    crossOrigin: props.crossOrigin,
    integrity: props.integrity,
    nonce: props.nonce,
    referrerPolicy: props.referrerPolicy,
  };
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates that a component is a valid React component and not a string
 */
export function validateReactComponent<T extends React.ComponentType<any>>(
  component: any,
  fallback: T,
  componentName: string = 'Component'
): T {
  if (typeof component === 'function') {
    return component as T;
  }
  
  if (typeof component === 'string') {
    console.error(`[React DOM Warning Prevention] ${componentName} received a string "${component}" instead of a React component. Using fallback.`);
    return fallback;
  }
  
  if (component === null || component === undefined) {
    return fallback;
  }
  
  console.error(`[React DOM Warning Prevention] ${componentName} received an invalid component type. Using fallback.`);
  return fallback;
}

/**
 * Cleans props object by removing undefined values and non-DOM attributes
 */
export function cleanDOMProps<T extends Record<string, any>>(
  props: T,
  validDOMAttributes: string[]
): Partial<T> {
  const cleaned: Partial<T> = {};
  
  validDOMAttributes.forEach(attr => {
    if (props[attr] !== undefined) {
      cleaned[attr as keyof T] = props[attr];
    }
  });
  
  return cleaned;
}

// ============================================================================
// RUNTIME VALIDATION
// ============================================================================

/**
 * Development-only function to detect potential React DOM warnings
 */
export function validateDOMElement(
  elementType: string,
  props: Record<string, any>,
  componentName: string
): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  const commonReactDOMWarnings = {
    img: ['fetchPriority', 'crossorigin'],
    video: ['autoplay', 'playsinline'],
    iframe: ['allowfullscreen', 'frameborder'],
    link: ['crossorigin'],
    script: ['crossorigin'],
  };
  
  const problematicProps = commonReactDOMWarnings[elementType as keyof typeof commonReactDOMWarnings] || [];
  
  problematicProps.forEach(prop => {
    if (props[prop] !== undefined) {
      console.warn(
        `[React DOM Warning Prevention] ${componentName} uses potentially problematic prop "${prop}". ` +
        `Consider using safe${elementType.charAt(0).toUpperCase() + elementType.slice(1)}Props() utility.`
      );
    }
  });
}

// ============================================================================
// STANDARD DOM ATTRIBUTES
// ============================================================================

export const STANDARD_DOM_ATTRIBUTES = {
  img: [
    'alt', 'src', 'srcSet', 'sizes', 'width', 'height', 'loading', 'decoding',
    'className', 'style', 'title', 'onLoad', 'onError', 'draggable', 'id'
  ],
  video: [
    'src', 'poster', 'autoPlay', 'muted', 'loop', 'controls', 'playsInline',
    'preload', 'width', 'height', 'className', 'style', 'onLoadedData', 'onCanPlay'
  ],
  iframe: [
    'src', 'title', 'width', 'height', 'loading', 'sandbox', 'allow',
    'allowFullScreen', 'frameBorder', 'className', 'style', 'referrerPolicy'
  ],
  link: [
    'rel', 'href', 'type', 'crossOrigin', 'integrity', 'media', 'sizes', 'as', 'hrefLang'
  ],
  script: [
    'src', 'type', 'async', 'defer', 'crossOrigin', 'integrity', 'nonce', 'referrerPolicy'
  ]
} as const;