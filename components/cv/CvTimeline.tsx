import React from 'react';
import { Experience } from '@/lib/types';

interface Props {
  experiences: Experience[];
}

export default function CvTimeline({ experiences }: Props) {
  return (
    <div className="relative border-l-2 border-[var(--accent-color)] ml-3 space-y-8 pb-4">
      {experiences.map((exp, index) => (
        <div key={exp.id || index} className="relative pl-6">
          {/* Dot */}
          <div className="absolute w-4 h-4 bg-white border-2 border-[var(--accent-color)] rounded-full -left-[9px] top-1"></div>
          
          <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-2">
            <h4 className="text-lg font-bold text-gray-800">{exp.role}</h4>
            {exp.date && (
              <span className="text-sm font-semibold text-[var(--accent-color)] bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap mt-1 md:mt-0">
                {exp.date}
              </span>
            )}
          </div>
          
          <h5 className="text-md font-medium text-gray-600 mb-1 flex items-center gap-2">
            <i className="fas fa-building text-gray-400"></i> {exp.org}
          </h5>

          {exp.location && (
            <p className="text-xs text-gray-500 mb-3">
              <i className="fas fa-map-marker-alt mr-1"></i>{exp.location}
            </p>
          )}
          
          {exp.tasks && exp.tasks.length > 0 && (
            <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed space-y-1">
              {exp.tasks.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
