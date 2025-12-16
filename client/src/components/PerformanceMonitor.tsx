import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  dcl: number; // DOMContentLoaded
  load: number; // Load Event
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

/**
 * Component that measures and displays Web Vitals performance metrics
 * Only active in development mode or when debug flag is set
 */
const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    dcl: 0,
    load: 0,
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  });
  
  const [isVisible, setIsVisible] = useState(false);
  
  // Only run in development or when debug flag is set
  const shouldShow = import.meta.env.DEV || import.meta.env.VITE_DEBUG_PERF === 'true';
  
  useEffect(() => {
    if (!shouldShow || !window.performance) return;
    
    // Function to collect performance metrics
    const collectMetrics = () => {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // Basic timing metrics
      const dcl = navEntry.domContentLoadedEventEnd - navEntry.fetchStart;
      const load = navEntry.loadEventEnd - navEntry.fetchStart;
      const ttfb = navEntry.responseStart - navEntry.requestStart;
      
      // Update metrics with basic timings
      setMetrics(prev => ({
        ...prev,
        dcl,
        load,
        ttfb
      }));
      
      // Get Paint Timing entries
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        setMetrics(prev => ({
          ...prev,
          fcp: fcpEntry.startTime
        }));
      }
    };
    
    // Collect LCP using the PerformanceObserver
    if ('PerformanceObserver' in window) {
      // Observe LCP
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          setMetrics(prev => ({
            ...prev,
            lcp: lastEntry.startTime
          }));
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Observe CLS
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          
          setMetrics(prev => ({
            ...prev,
            cls: clsValue
          }));
        });
        
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        
        // Observe FID
        const fidObserver = new PerformanceObserver((entryList) => {
          const firstEntry = entryList.getEntries()[0] as any;
          
          setMetrics(prev => ({
            ...prev,
            fid: firstEntry.processingStart - firstEntry.startTime
          }));
        });
        
        fidObserver.observe({ type: 'first-input', buffered: true });
        
        // Clean up
        return () => {
          lcpObserver.disconnect();
          clsObserver.disconnect();
          fidObserver.disconnect();
        };
      } catch (e) {
        console.error('Performance observer error:', e);
      }
    }
    
    // Collect basic metrics once the page has loaded
    window.addEventListener('load', collectMetrics);
    
    return () => {
      window.removeEventListener('load', collectMetrics);
    };
  }, [shouldShow]);
  
  // If we shouldn't show, return null
  if (!shouldShow) return null;
  
  const formatMs = (ms: number | null) => {
    if (ms === null) return '...';
    return `${Math.round(ms)}ms`;
  };
  
  const formatCls = (cls: number | null) => {
    if (cls === null) return '...';
    return cls.toFixed(3);
  };
  
  const getMetricColor = (name: string, value: number | null) => {
    if (value === null) return 'text-gray-500';
    
    // Thresholds based on Web Vitals recommendations
    const thresholds: Record<string, [number, number]> = {
      fcp: [1800, 3000], // Good < 1.8s, Poor > 3s
      lcp: [2500, 4000], // Good < 2.5s, Poor > 4s
      fid: [100, 300],   // Good < 100ms, Poor > 300ms
      cls: [0.1, 0.25],  // Good < 0.1, Poor > 0.25
      ttfb: [100, 600]   // Good < 100ms, Poor > 600ms
    };
    
    if (!thresholds[name]) return 'text-gray-500';
    
    const [good, poor] = thresholds[name];
    
    if (value <= good) return 'text-green-500';
    if (value > poor) return 'text-red-500';
    return 'text-yellow-500';
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 text-white px-3 py-1 rounded shadow text-xs"
      >
        {isVisible ? 'Hide Metrics' : 'Show Metrics'}
      </button>
      
      {isVisible && (
        <div className="bg-gray-800 text-white p-4 rounded mt-2 shadow-lg text-xs font-mono">
          <h3 className="font-bold mb-2 text-sm">Performance Metrics</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between">
              <span>DOM Content:</span>
              <span>{formatMs(metrics.dcl)}</span>
            </div>
            <div className="flex justify-between">
              <span>Page Load:</span>
              <span>{formatMs(metrics.load)}</span>
            </div>
            <div className="flex justify-between">
              <span>FCP:</span>
              <span className={getMetricColor('fcp', metrics.fcp)}>
                {formatMs(metrics.fcp)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>LCP:</span>
              <span className={getMetricColor('lcp', metrics.lcp)}>
                {formatMs(metrics.lcp)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>FID:</span>
              <span className={getMetricColor('fid', metrics.fid)}>
                {formatMs(metrics.fid)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>CLS:</span>
              <span className={getMetricColor('cls', metrics.cls)}>
                {formatCls(metrics.cls)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>TTFB:</span>
              <span className={getMetricColor('ttfb', metrics.ttfb)}>
                {formatMs(metrics.ttfb)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;