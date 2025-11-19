# Website Cleanup & Enhancement Tasks

## 🚨 CRITICAL: Compliance Fixes (DO FIRST)
- [ ] Change "HIPAA-compliant" to "HIPAA-ready" in FAQ.jsx line 22
- [ ] Review HIPAACompliance.jsx for false certification claims (SOC 2, HITRUST, ISO 27001)
- [ ] Change any "compliant" language to "ready" or "pursuing"

## 🎨 Logo Replacement
- [ ] Copy `/home/ubuntu/upload/Nexus_Logo_Static_Official.png` to project assets
- [ ] Copy `/home/ubuntu/upload/nexus-logo-ANIMATED.gif` to project assets
- [ ] Replace current Header logo with original animated GIF
- [ ] Add static logo as fallback
- [ ] Create downloadable logo files for user

## 📄 About Us Page
- [ ] Search for/recreate About Us content document
- [ ] Create src/pages/About.jsx component
- [ ] Add /about route to App.jsx
- [ ] Include: Mission, Vision, Team, Story
- [ ] Add starry background to About page

## 👥 "Who Benefits" Section
- [ ] Create new section component (WhoB enefits.jsx)
- [ ] Design 8 beneficiary cards:
  1. Small Clinics & Private Practices
  2. Large Hospital Systems
  3. Insurance Companies & Payers
  4. Pharmaceutical Companies
  5. Medical Device Manufacturers
  6. Clinical Research Organizations
  7. Nursing Homes & Senior Care Facilities
  8. Individual Healthcare Providers
- [ ] Add to Homepage after Platforms section
- [ ] Explain specific benefits for each stakeholder

## 🌟 Starry Background Fixes
- [ ] Ensure StarryBackground appears on ALL pages
- [ ] Exclude only header and footer areas
- [ ] Add to platform pages (RxGuard, ReguReady, etc.)
- [ ] Add to About page
- [ ] Add to compliance pages (Privacy, Terms, HIPAA)

## 🔗 Hyperlink Fixes
- [ ] Audit all navigation links
- [ ] Fix About link (currently goes nowhere)
- [ ] Verify all footer links work
- [ ] Test all platform Learn More links
- [ ] Test all CTA buttons

## ✅ Already Completed
- [x] Change "Schedule Demo" to "Request Beta Access" in Header.jsx
- [x] Link "Request Beta Access" button to BetaSignup component
- [x] Screenshot bug widget added
- [x] 4-column footer created
- [x] Framed FAQ section
- [x] Header with logo animation

## 📋 Testing Checklist
- [ ] Test all navigation links
- [ ] Test all platform demos
- [ ] Test beta signup form
- [ ] Test on mobile devices
- [ ] Verify starry background on all pages
- [ ] Check logo displays correctly
- [ ] Verify compliance language is accurate

## 🚀 Deployment
- [ ] Build locally and verify no errors
- [ ] Commit all changes to Git
- [ ] Push to GitHub
- [ ] Verify Vercel deployment succeeds
- [ ] Test live site
- [ ] Set up custom domain www.nexusbiomedical.ai
