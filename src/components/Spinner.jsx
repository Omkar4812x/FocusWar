/**
 * Animated loading spinner component.
 * Props:
 *   - size: 'sm' | 'lg' (default: 'sm')
 *   - className: additional class names
 */
export default function Spinner({ size = 'sm', className = '' }) {
  return (
    <div
      className={`spinner ${size === 'lg' ? 'spinner-lg' : ''} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
