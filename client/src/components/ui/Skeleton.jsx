import React from 'react';

/**
 * Skeleton component for creating sleek shimmer loading states.
 * 
 * @param {Object} props
 * @param {string} [props.className] - Tailwind classes to define width, height, border-radius, etc.
 */
export const Skeleton = ({ className = '' }) => {
  // Use the theme's border color to guarantee perfect contrast in both light and dark modes
  return (
    <div className={`bg-[var(--color-border)] animate-pulse rounded-md ${className}`} />
  );
};
export default Skeleton;
