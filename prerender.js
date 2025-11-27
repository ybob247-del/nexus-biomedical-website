/**
 * Pre-render Script
 * Generates static HTML for key pages to make content visible to AI assistants
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the base HTML template
const template = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

// Define key pages and their content
const pages = {
  '/': {
    title: 'Nexus Biomedical Intelligence | Revolutionary AI Healthcare Platforms',
    description: 'Six revolutionary AI healthcare platforms transforming patient safety, clinical decisions, and medical innovation',
    content: `
      <div class="home-page">
        <header class="header">
          <nav class="navigation">
            <div class="logo">Nexus Biomedical Intelligence</div>
            <div class="nav-links">
              <a href="/about">About</a>
              <a href="/platforms">Platforms</a>
              <a href="/faq">FAQ</a>
              <a href="/login">Login</a>
            </div>
          </nav>
        </header>
        
        <main class="hero-section">
          <h1>Nexus Biomedical Intelligence</h1>
          <p class="tagline">Revolutionizing Healthcare Through AI-Powered Patient Intelligence</p>
          
          <p class="description">
            Advanced clinical decision support platforms combining cutting-edge artificial intelligence 
            with evidence-based medicine to transform patient care and clinical outcomes.
          </p>
          
          <div class="cta-buttons">
            <a href="/platforms" class="btn-primary">Explore Our Platforms</a>
            <a href="/contact" class="btn-secondary">Contact Sales</a>
            <a href="/faq" class="btn-secondary">Hard Questions Answered</a>
          </div>
        </main>
        
        <section class="platforms-overview">
          <h2>Our AI Healthcare Platforms</h2>
          
          <div class="platform-grid">
            <div class="platform-card">
              <h3>RxGuard</h3>
              <p>AI-driven drug compliance and prescription safety analytics platform for healthcare providers and pharmacies.</p>
              <p class="price">$39/month</p>
              <a href="/rxguard">Learn More</a>
            </div>
            
            <div class="platform-card">
              <h3>EndoGuard</h3>
              <p>Endoscopy quality assurance and adverse event prediction platform using AI-powered analytics.</p>
              <p class="price">$97/month</p>
              <a href="/endoguard">Learn More</a>
            </div>
            
            <div class="platform-card">
              <h3>ReguReady</h3>
              <p>AI-powered regulatory compliance and documentation platform for medical device manufacturers.</p>
              <p class="price">$199-$399/month</p>
              <a href="/reguready">Learn More</a>
            </div>
            
            <div class="platform-card">
              <h3>ClinicalIQ</h3>
              <p>Predictive analytics and patient recruitment optimization platform for biotech and pharmaceutical research.</p>
              <p class="price">$299-$699/month</p>
              <a href="/clinicaliq">Learn More</a>
            </div>
            
            <div class="platform-card">
              <h3>ElderWatch</h3>
              <p>AI-driven platform for senior health monitoring, fall-risk prediction, and proactive elderly care management.</p>
              <p class="price">$49-$199/month</p>
              <a href="/elderwatch">Learn More</a>
            </div>
            
            <div class="platform-card">
              <h3>PediCalc Pro</h3>
              <p>AI-based pediatric dosing calculator for accurate, weight-based medication safety compliant with AAP standards.</p>
              <p class="price">$14.99-$19.99/month</p>
              <a href="/pedicalc">Learn More</a>
            </div>
            
            <div class="platform-card">
              <h3>SkinScan Pro</h3>
              <p>AI-based skin cancer detection and lesion analysis platform for dermatologists and teledermatology providers.</p>
              <p class="price">$49-$59/month</p>
              <a href="/skinscan">Learn More</a>
            </div>
          </div>
        </section>
        
        <section class="features">
          <h2>Why Choose Nexus Biomedical Intelligence?</h2>
          <ul>
            <li>AI-powered clinical decision support</li>
            <li>Evidence-based medicine integration</li>
            <li>Regulatory compliance automation</li>
            <li>Predictive analytics for patient safety</li>
            <li>Real-time risk assessment</li>
            <li>HIPAA-compliant and secure</li>
          </ul>
        </section>
        
        <footer class="footer">
          <p>&copy; 2024 Nexus Biomedical Intelligence. All rights reserved.</p>
          <p>Contact: support@nexusbiomedical.ai</p>
        </footer>
      </div>
    `
  }
};

// Generate pre-rendered HTML for each page
function generatePrerenderedHTML(route, pageData) {
  // Replace the SSR outlet with actual content
  let html = template.replace('<!--ssr-outlet-->', pageData.content);
  
  // Update title and description
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${pageData.title}</title>`
  );
  html = html.replace(
    /<meta name="description" content=".*?"\/>/,
    `<meta name="description" content="${pageData.description}"/>`
  );
  
  return html;
}

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist-prerendered');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Generate HTML for each page
for (const [route, pageData] of Object.entries(pages)) {
  const html = generatePrerenderedHTML(route, pageData);
  const filename = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  const filepath = path.join(distDir, filename);
  
  fs.writeFileSync(filepath, html, 'utf-8');
  console.log(`✅ Generated: ${filepath}`);
}

console.log('\n🎉 Pre-rendering complete!');
console.log(`📁 Files saved to: ${distDir}`);
