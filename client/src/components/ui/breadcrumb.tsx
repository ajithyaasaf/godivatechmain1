import React from 'react';
import { Link } from 'wouter';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb component for improved navigation and SEO
 * 
 * This component renders a breadcrumb navigation path and includes proper
 * semantic HTML markup for accessibility and SEO benefits.
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2 flex-wrap">
        <li className="flex items-center">
          <Link href="/" className="text-neutral-500 hover:text-primary transition-colors">
            <Home className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-neutral-400" aria-hidden="true" />
            <Link
              href={item.href}
              className={`ml-2 text-sm font-medium ${
                item.current 
                  ? 'text-neutral-800 cursor-default' 
                  : 'text-neutral-500 hover:text-primary transition-colors'
              }`}
              aria-current={item.current ? 'page' : undefined}
              onClick={e => item.current && e.preventDefault()}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;