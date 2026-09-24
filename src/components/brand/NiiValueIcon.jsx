/**
 * Line icons for the three promises in the consumer hero: the one-page
 * summary, the ranked list of what to raise first, and the single next step.
 * Drawn in the brand teal, one stroke weight, so they read as a set.
 */
const PATHS = {
  // A single page with lines of text.
  summary: (
    <>
      <rect x="6.5" y="3.5" width="15" height="21" rx="2.5" />
      <path d="M10 9h8M10 13.5h8M10 18h5" strokeLinecap="round" />
    </>
  ),
  // A ranked list: three bars, the first one longest and marked.
  ranked: (
    <>
      <path d="M4 7h12M4 14h9M4 21h6" strokeLinecap="round" />
      <circle cx="21" cy="7" r="2.5" />
    </>
  ),
  // One clear next step: an arrow arriving at a point.
  nextStep: (
    <>
      <path d="M3 14h16" strokeLinecap="round" />
      <path d="M14 8.5 19.5 14 14 19.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="14" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
};

export default function NiiValueIcon({ name, size = 28, className }) {
  const paths = PATHS[name];
  if (!paths) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths}
    </svg>
  );
}
