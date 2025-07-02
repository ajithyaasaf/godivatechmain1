/**
 * DOM Props Utility
 * 
 * This utility ensures that React DOM attributes are properly handled
 * to prevent React warnings about unrecognized props.
 */

/**
 * Safely handles image props that might cause React warnings
 */
export function safeImageProps(props: {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  width?: number | string;
  height?: number | string;
  fetchPriority?: 'high' | 'low' | 'auto';
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}) {
  const { fetchPriority, ...restProps } = props;
  
  // Create the final props object
  const imageProps: any = {
    ...restProps,
    // Convert width/height to numbers if they're strings
    width: typeof props.width === 'string' ? parseInt(props.width) : props.width,
    height: typeof props.height === 'string' ? parseInt(props.height) : props.height,
  };
  
  // Only add fetchpriority if it's supported and needed
  if (fetchPriority && fetchPriority !== 'auto') {
    // Use the lowercase DOM attribute name
    imageProps.fetchpriority = fetchPriority;
  }
  
  return imageProps;
}

/**
 * Safely handles link props for preconnect/prefetch links
 */
export function safeLinkProps(props: {
  rel: string;
  href: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  as?: string;
  type?: string;
}) {
  return {
    ...props,
    // Ensure crossOrigin is properly handled
    crossOrigin: props.crossOrigin,
  };
}

/**
 * Cleans props to remove any that might cause React warnings
 */
export function cleanDOMProps<T extends Record<string, any>>(
  props: T,
  allowedProps: string[]
): Partial<T> {
  const cleaned: Partial<T> = {};
  
  allowedProps.forEach(prop => {
    if (props[prop] !== undefined) {
      cleaned[prop as keyof T] = props[prop];
    }
  });
  
  return cleaned;
}

/**
 * Standard HTML img element allowed props
 */
export const STANDARD_IMG_PROPS = [
  'src', 'alt', 'className', 'style', 'loading', 'decoding', 
  'width', 'height', 'onLoad', 'onError', 'title', 'id'
];

/**
 * Standard HTML link element allowed props  
 */
export const STANDARD_LINK_PROPS = [
  'rel', 'href', 'crossOrigin', 'as', 'type', 'media', 'sizes'
];

/**
 * ESLint rule configuration to prevent React DOM attribute warnings
 * Add this to your .eslintrc to catch issues at build time:
 * 
 * "rules": {
 *   "react/no-unknown-property": ["error", { "ignore": ["fetchpriority"] }]
 * }
 */

/**
 * Common HTML attributes that cause React warnings when used incorrectly:
 * 
 * ❌ WRONG (causes warnings):
 * - fetchPriority="low" (camelCase in DOM)
 * - crossorigin="anonymous" (lowercase in JSX)
 * - autoplay={true} (should be autoPlay)
 * - contenteditable="true" (should be contentEditable)
 * 
 * ✅ CORRECT:
 * - Use safeImageProps() for images with fetchPriority
 * - Use crossOrigin="anonymous" in JSX (React handles the conversion)
 * - Use autoPlay={true} for video/audio elements
 * - Use contentEditable="true" for editable elements
 */

/**
 * Type-safe wrapper for video/audio elements
 */
export function safeMediaProps(props: {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return {
    ...props,
    // Ensure proper boolean handling
    autoPlay: Boolean(props.autoPlay),
    muted: Boolean(props.muted),
    loop: Boolean(props.loop),
    controls: Boolean(props.controls),
    playsInline: Boolean(props.playsInline),
  };
}