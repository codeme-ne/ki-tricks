'use client'

import { List } from 'lucide-react';

interface TableOfContentsProps {
  items: { id: string; title: string }[];
}

export const TableOfContents = ({ items }: TableOfContentsProps) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
      <h3 className="flex items-center gap-2 font-semibold text-neutral-900 mb-4">
        <List className="w-5 h-5" />
        Inhaltsverzeichnis
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button 
              onClick={() => scrollTo(item.id)}
              className="text-neutral-300 hover:text-primary-400 transition-colors duration-200"
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};