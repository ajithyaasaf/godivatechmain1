import React, { memo, useCallback } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

// Memoize component to prevent unnecessary re-renders
const CategoryFilter = memo(({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  // Create a memoized click handler factory for each button
  const createClickHandler = useCallback((categoryId: number) => {
    return () => onCategoryChange(categoryId);
  }, [onCategoryChange]);
  
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-3">
      {categories.map((category, index) => {
        // Determine if this category is active
        const isActive = (category.id === -1 && activeCategory === null) || 
                         category.id === activeCategory;
        
        return (
          <button
            key={`category-${category.id}-${index}`}
            onClick={createClickHandler(category.id)}
            className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all duration-150 transform hover:scale-105 ${
              isActive
                ? "filter-active bg-primary text-white shadow-md"
                : "bg-neutral-100 hover:bg-neutral-200"
            }`}
            aria-pressed={isActive}
            role="tab"
            aria-controls="blog-posts"
            aria-selected={isActive}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
});

// Add displayName for React DevTools
CategoryFilter.displayName = "CategoryFilter";

export default CategoryFilter;
