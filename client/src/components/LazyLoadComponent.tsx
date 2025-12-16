import React, { Suspense, lazy, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

// Loading fallback component with configurable height
const LoadingFallback = ({ height = "200px" }: { height?: string }) => (
  <div 
    className="w-full animate-pulse bg-gray-100 rounded-md transition-colors"
    style={{ height }}
    aria-hidden="true"
  />
);

interface LazyLoadComponentProps {
  /**
   * Function that returns a dynamic import 
   * For example: () => import('./HeavyComponent')
   */
  importComponent: () => Promise<any>;
  
  /** Height of the loading placeholder */
  height?: string;
  
  /** Props to pass to the loaded component */
  componentProps?: Record<string, any>;
  
  /** Whether to load immediately or wait for visibility */
  immediate?: boolean;
  
  /** Root margin for the intersection observer (for preloading) */
  rootMargin?: string;
}

/**
 * LazyLoadComponent - A component that lazy loads other components when they enter the viewport
 */
const LazyLoadComponent: React.FC<LazyLoadComponentProps> = ({
  importComponent,
  height = "200px",
  componentProps = {},
  immediate = false,
  rootMargin = "200px",
}) => {
  // Create a ref to track when the component is in view
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin,
  });
  
  // Only create the lazy component when it's needed
  const [LazyComponent, setLazyComponent] = useState<React.ComponentType<any> | null>(null);
  
  useEffect(() => {
    // Load immediately or wait until in view
    if (immediate || inView) {
      // Dynamically create the lazy component
      const Component = lazy(importComponent);
      setLazyComponent(() => Component);
    }
  }, [importComponent, inView, immediate]);
  
  return (
    <div ref={ref}>
      {LazyComponent ? (
        <Suspense fallback={<LoadingFallback height={height} />}>
          <LazyComponent {...componentProps} />
        </Suspense>
      ) : (
        <LoadingFallback height={height} />
      )}
    </div>
  );
};

export default LazyLoadComponent;