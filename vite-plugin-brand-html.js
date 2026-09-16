/**
 * Swap index.html's head and static fallback content for the consumer brand.
 *
 * index.html is written for Nexus. Search engines and link previews (Facebook,
 * YouTube, iMessage) read that raw HTML without running the app, so setting
 * document.title in main.jsx is not enough: they would still see Nexus. This
 * runs at build time, so Nexus builds are untouched.
 */

const SITE = 'https://notimaginingit.com';
const TITLE = 'Not Imagining It — Systems, not symptoms.';
const DESCRIPTION =
  'Turn what you have been noticing into a clear one-page summary you can hand to your doctor.';

const CONSUMER_HEAD = `<title>${TITLE}</title>
    <meta name="description" content="${DESCRIPTION}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Not Imagining It" />
    <meta property="og:url" content="${SITE}/" />
    <meta property="og:title" content="${TITLE}" />
    <meta property="og:description" content="${DESCRIPTION}" />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${TITLE}" />
    <meta name="twitter:description" content="${DESCRIPTION}" />

    <meta name="author" content="Not Imagining It" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${SITE}/" />

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Not Imagining It",
      "url": "${SITE}",
      "description": "${DESCRIPTION}"
    }
    </script>
    `;

const CONSUMER_STATIC = `
      <div class="static-content">
        <header>
          <h1>Not Imagining It</h1>
          <p>Systems, not symptoms.</p>
        </header>
        <main>
          <p>${DESCRIPTION}</p>
          <p>Educational only. Not medical advice, and not a diagnosis.</p>
          <p>Contact: support@notimaginingit.com</p>
        </main>
      </div>
    `;

function between(html, start, end) {
  const from = html.indexOf(start);
  const to = html.indexOf(end, from + start.length);
  if (from === -1 || to === -1) {
    throw new Error(`brand-html: markers not found in index.html (${start} … ${end})`);
  }
  return [from, to];
}

export default function brandHtmlPlugin(brandId) {
  return {
    name: 'brand-html',
    // 'pre' so this sees index.html as written, before Vite moves the entry
    // script into <head> and rewrites asset tags.
    transformIndexHtml: { order: 'pre', handler: (html) => {
      if (brandId !== 'notimaginingit') return html;

      // Head: everything from <title> up to the resource hints.
      let [from, to] = between(html, '<title>', '<!-- Resource Hints for Performance -->');
      html = html.slice(0, from) + CONSUMER_HEAD + html.slice(to);

      // Body fallback: what shows before React mounts, and to non-JS readers.
      const rootOpen = '<div id="root">';
      [from, to] = between(html, rootOpen, '<script type="module"');
      html = html.slice(0, from + rootOpen.length) + CONSUMER_STATIC + '</div>\n    ' + html.slice(to);

      return html;
    } },
  };
}
