import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  isLast: boolean;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  className?: string;
  location?: {
    city?: string;
    neighborhood?: string;
  };
}

/**
 * Enhanced breadcrumb navigation component with location information
 * Supports automatic breadcrumb generation and custom breadcrumbs
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  customItems, 
  className = '',
  location
}) => {
  const [location1] = useLocation();
  const [items, setItems] = useState<BreadcrumbItem[]>([]);
  
  useEffect(() => {
    if (customItems) {
      setItems(customItems);
      return;
    }
    
    // Automatic breadcrumb generation from current path
    const paths = location1.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Add Home as first breadcrumb
    breadcrumbs.push({
      label: 'Home',
      path: '/',
      isLast: paths.length === 0
    });
    
    // Generate breadcrumbs for each path segment
    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const isLast = index === paths.length - 1;
      
      // Format the label (capitalize, replace dashes with spaces)
      let label = path
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
      
      // Special case for URLs like /services/web-development/madurai/anna-nagar
      if (path === 'madurai' && paths[index + 1]) {
        // This is the city path segment, the next will be the neighborhood
        breadcrumbs.push({
          label: 'Madurai',
          path: currentPath,
          isLast: false
        });
        return;
      }
      
      // Handle last path segment with neighborhood specific labels
      if (isLast && paths[index - 1] === 'madurai') {
        // This is a neighborhood path segment
        const area = formatAreaName(path);
        label = `${area}, Madurai`;
      }
      
      // Special case for category pages
      if (paths[index - 1] === 'category') {
        label = `${label} Articles`;
      }
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isLast
      });
    });
    
    // Add location information if provided
    if (location && !paths.includes('madurai') && !paths.includes('tamil-nadu')) {
      if (location.city && location.neighborhood) {
        breadcrumbs.push({
          label: `${location.city} - ${formatAreaName(location.neighborhood)}`,
          path: `${currentPath}/${location.city.toLowerCase()}/${location.neighborhood}`,
          isLast: true
        });
        // Mark previous as not last
        if (breadcrumbs.length > 0) {
          breadcrumbs[breadcrumbs.length - 1].isLast = false;
        }
      } else if (location.city) {
        breadcrumbs.push({
          label: location.city,
          path: `${currentPath}/${location.city.toLowerCase()}`,
          isLast: true
        });
        // Mark previous as not last
        if (breadcrumbs.length > 0) {
          breadcrumbs[breadcrumbs.length - 1].isLast = false;
        }
      }
    }
    
    setItems(breadcrumbs);
  }, [location1, customItems, location]);
  
  // Helper to format area names
  const formatAreaName = (name: string): string => {
    const specialCases: Record<string, string> = {
      'anna-nagar': 'Anna Nagar',
      'iyer-bungalow': 'Iyer Bungalow',
      'kk-nagar': 'KK Nagar',
      'ss-colony': 'SS Colony',
      'tirunagar': 'Tirunagar',
    };
    
    return specialCases[name] || name
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };
  
  if (items.length <= 1) {
    return null; // Don't show breadcrumbs on homepage or with only one item
  }
  
  // Generate structured data for breadcrumbs
  const generateStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": `https://godivatech.com${item.path === '/' ? '' : item.path}`
      }))
    };
  };
  
  return (
    <nav aria-label="Breadcrumb" className={`text-sm mb-4 ${className}`}>
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
      <ol className="inline-flex flex-wrap items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={item.path} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight size={14} className="mx-1 text-neutral-400" />
            )}
            
            {item.isLast ? (
              <span className="text-neutral-500 truncate max-w-[150px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.path}
                className="text-primary hover:text-primary/80 truncate max-w-[120px] sm:max-w-none"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;