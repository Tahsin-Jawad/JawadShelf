import React from 'react';

interface MaterialBadgeProps {
  type: string;
}

export const MaterialBadge: React.FC<MaterialBadgeProps> = ({ type = 'OTHER' }) => {
  const getStyle = (t: string) => {
    switch (t.toUpperCase()) {
      case 'HTML':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'PDF':
        return 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'DOCX':
      case 'DOC':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'PPTX':
      case 'PPT':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'IMAGE':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStyle(
        type
      )}`}
    >
      {type}
    </span>
  );
};

export default MaterialBadge;