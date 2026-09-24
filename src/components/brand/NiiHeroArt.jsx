/**
 * Decorative artwork behind the consumer hero: soft leaf sprigs in the brand
 * greens, echoing the leaves inside the logo mark. Purely decorative, so it is
 * hidden from screen readers, and it sits behind the text at low opacity so
 * contrast is unaffected.
 */
export default function NiiHeroArt({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Long sweeping stem, lower left to upper right. */}
      <path d="M40 392C120 330 208 258 268 176 316 110 352 54 372 18" stroke="#5c9b8f" strokeWidth="3" strokeLinecap="round" opacity=".55" />
      {/* Leaves along the stem, alternating sides. */}
      <path d="M262 182c-26 10-52 6-70-8 14-20 44-28 70-18 2 9 2 18 0 26Z" fill="#5c9b8f" opacity=".32" />
      <path d="M286 140c26 8 52 2 68-14-16-18-46-24-72-12-1 9 1 18 4 26Z" fill="#c9dcd5" opacity=".75" />
      <path d="M314 96c-26 8-52 2-68-14 16-18 46-24 72-12 1 9-1 18-4 26Z" fill="#5c9b8f" opacity=".26" />
      <path d="M338 54c24 10 50 6 66-8-14-20-44-28-70-18-1 9 1 18 4 26Z" fill="#e7cfc6" opacity=".75" />
      {/* Second, shorter sprig for depth. */}
      <path d="M118 400c30-44 66-84 106-118" stroke="#5c9b8f" strokeWidth="2.4" strokeLinecap="round" opacity=".38" />
      <path d="M188 318c-20 4-40-2-52-16 14-12 38-14 56-4-1 7-2 14-4 20Z" fill="#c9dcd5" opacity=".6" />
    </svg>
  );
}
