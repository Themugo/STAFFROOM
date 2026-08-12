import React from 'react';

/**
 * Avatar component displaying user profile picture or initials.
 */
export default function UserAvatar({ src, name = '', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-14 h-14 text-base',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size] || sizeClasses.md} rounded-full bg-[#EAF3FF] text-[#2563EB] font-bold flex items-center justify-center shrink-0 border border-[#2563EB]/20 ${className}`}
    >
      {initials || 'U'}
    </div>
  );
}
