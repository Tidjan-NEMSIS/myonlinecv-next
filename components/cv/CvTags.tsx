import React from 'react';

interface Props {
  tags: string[];
}

export default function CvTags({ tags }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span 
          key={index}
          className="px-3 py-1 bg-white border border-[var(--primary-color)] text-[var(--primary-color)] rounded-full text-xs font-semibold shadow-sm"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
