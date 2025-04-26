import React from "react";

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

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-3">
      {categories.map((category, index) => (
        <button
          key={`category-${category.id}-${index}`}
          onClick={() => onCategoryChange(category.id)}
          className={`py-1.5 px-4 rounded-full text-sm font-medium transition duration-150 ${
            (category.id === -1 && activeCategory === null) || category.id === activeCategory
              ? "filter-active bg-primary text-white"
              : "bg-neutral-100 hover:bg-neutral-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
