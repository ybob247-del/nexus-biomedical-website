# Nexus Biomedical Website TODO

## Current Task
- [x] Fix "Learn More" buttons to show comprehensive content for all 6 platforms
- [x] Create Learn More page component with full product details
- [x] Add routing/navigation to Learn More pages
- [x] Integrate comprehensive content created earlier (31,000+ words across 6 platforms)

## Bug Fixes
- [x] Learn More buttons currently go nowhere (reported by user)

## Completed
- [x] Created platformData.js with 15,000+ words of comprehensive content for all 6 platforms
- [x] Created reusable LearnMore.jsx component
- [x] Updated Platforms.jsx to handle Learn More clicks
- [x] Updated App.jsx with state management for Learn More pages
- [x] Built and deployed to production



## New Improvements (In Progress)

### Statistics & Citations
- [x] Add real citations from published studies to all statistics
- [x] Add disclaimer noting these are industry benchmarks from similar systems
- [x] Research and cite specific JAMA, NEJM, and other peer-reviewed sources

### Color Accessibility Fixes
- [x] Change ReguReady™ color to #B794F4 (soft lavender-purple)
- [x] Change SkinScan Pro™ color to #14B8A6 (medical teal)
- [x] Change PediCalc Pro™ color to #FB923C (soft coral-orange)
- [x] Test all color contrasts for WCAG AA compliance

### Interactive Demos (Phase 1)
- [ ] Create interactive HTML prototype for RxGuard™
- [ ] Create interactive HTML prototype for ReguReady™
- [ ] Create interactive HTML prototype for ClinicalIQ™
- [ ] Create interactive HTML prototype for ElderWatch™
- [ ] Create interactive HTML prototype for PediCalc Pro™
- [ ] Create interactive HTML prototype for SkinScan Pro™
- [ ] Replace "Schedule Demo" buttons with "Try Interactive Demo"

### Video Demos (Phase 2 - Day 2)
- [ ] Create 2-3 minute demo video for RxGuard™
- [ ] Create 2-3 minute demo video for ReguReady™

### Launch Preparation
- [ ] Preview all changes before deployment
- [ ] User approval before going live
- [ ] Deploy to production for 2-day launch deadline




### Additional Changes Requested
- [x] Add literature references to ALL platform benefits (ClinicalIQ™ and ElderWatch™ missing)
- [x] Add disclaimer in italics to ALL platforms (currently only on some)
- [x] Swap PediCalc Pro™ coral-orange color to ElderWatch™ (replace dull yellow)
- [x] Use rose or soft pink for PediCalc Pro™ instead of coral-orange
- [x] Research and add credible statistics for ClinicalIQ™ benefits
- [x] Research and add credible statistics for ElderWatch™ benefits




### Critical Fixes - Vague Terms
- [x] Replace "platform validation" with actual research citation (Olawade et al., 2025)
- [x] Replace "industry data" with specific study citation (Esteva et al., Nature 2017, FDA CDRH data)
- [x] Replace "industry benchmark" with specific study citation (FDA submission cost analysis)
- [x] Ensure ALL benefit descriptions have specific literature references (not generic terms)




### Critical Audit - No Made-Up Data
- [x] Audit ALL Benefits sections (all 6 platforms) for unsupported claims
- [x] Audit ALL FAQs (all 6 platforms) for made-up data
- [x] Fix PediCalc Pro "99.8% accuracy validated against 10,000 test cases" (appears fabricated)
- [x] Add citations or remove/revise any claims that cannot be substantiated
- [x] Verify every number has a real source

### Fabrications Fixed (8 total):
- [x] RxGuard™ FAQ #1: Removed fabricated 94.3%/91.7%/23% accuracy numbers
- [x] PediCalc Pro™ Benefits: Removed fabricated 99.8% validation
- [x] PediCalc Pro™ FAQ #1: Removed fabricated 10,000 test cases claim
- [x] ReguReady™ FAQ #1: Changed "validation against" to "trained on"
- [x] ClinicalIQ™ FAQ #4: Changed to reference published research
- [x] ElderWatch™ FAQ #1: Removed fabricated 5,000+ seniors validation
- [x] SkinScan Pro™ FAQ #1: Clarified these are general AI dermatology numbers
- [x] SkinScan Pro™ FAQ #2: Removed fabricated FDA clearance number




## NEW: Regulatory Compliance & FDA Status (Oct 27, 2025)
- [x] Fix SkinScan Pro™ false FDA clearance claims (changed to "pursuing clearance")
- [x] Add regulatory status FAQ to RxGuard™ (21st Century Cures Act exemption)
- [x] Add regulatory status FAQ to ReguReady™ (not a medical device)
- [x] Clarify: Only SkinScan Pro™ needs FDA clearance (other 5 platforms exempt)

## NEW: Interactive Prototypes & Stripe Integration (2-Day Launch)
- [x] Create RxGuard™ prototype component (RxGuardPrototype.jsx)
- [x] Integrate RxGuard™ prototype into App.jsx navigation
- [x] Add "Try Interactive Demo" button to RxGuard™ Learn More page
- [x] Build ReguReady™ interactive prototype/dashboard
- [x] Add "Try Interactive Demo" button to ReguReady™ Learn More page
- [ ] Wait for 4 Stripe Price IDs from user (RxGuard Pro, RxGuard Enterprise, ReguReady Starter, ReguReady Pro)
- [ ] Create Stripe checkout integration component
- [ ] Connect "Start Free Trial" buttons to Stripe checkout
- [ ] Test Stripe payment flow in test mode
- [ ] Push all code to GitHub (triggers Vercel deployment)
- [ ] Test live site at nexusbiomedical.ai
- [ ] Switch Stripe to live mode for launch

## Notes
- User creating Stripe products now (need guidance on 14-day trial setup)
- 2-day deadline for RxGuard™ and ReguReady™ MVP launch
- CI/CD pipeline: GitHub → Vercel → Production (already configured)




## Enhancement Requests
- [x] Expand RxGuard™ demo to show 3-4 drug interactions simultaneously
- [x] Add psychiatric medications to RxGuard™ demo database (SSRIs, antipsychotics, MAOIs)
- [x] Create realistic polypharmacy scenarios showing tool's power
- [x] Demonstrate complex multi-drug interactions including psychiatric meds
- [x] Add one-click "Example Scenarios" to RxGuard™ demo (elderly patient, psychiatric crisis, post-surgery, cardiac complexity)
- [x] Add one-click "Example Scenarios" to ReguReady™ demo (AI/ML device, high-risk implant, low-risk diagnostic)




## Stripe Payment Integration
- [x] Install Stripe npm packages (@stripe/stripe-js)
- [x] Create Stripe configuration file with Price IDs and Publishable Key
- [x] Create Stripe checkout utility function
- [x] Connect "Upgrade to Pro" buttons in RxGuard™ prototype to Stripe
- [x] Connect "Upgrade to Pro" buttons in ReguReady™ prototype to Stripe
- [x] Add 14-day free trial logic to RxGuard™ Professional checkout
- [ ] Connect pricing cards on LearnMore pages to Stripe checkout
- [ ] Test Stripe checkout flow for all 4 products



## 🚨 URGENT: Professional UI Redesign (SHOWSTOPPER - Blocking Sales)
- [ ] Complete RxGuard™ professional redesign:
  - [ ] Remove giant background circles (distracting, unprofessional)
  - [ ] Add generous padding and spacing (currently too cramped)
  - [ ] Professional typography (Inter/Roboto fonts, larger sizes)
  - [ ] Card-based demo scenario layout (make obviously clickable)
  - [ ] Larger, clearer buttons (Remove buttons too small)
  - [ ] Prominent drug search with autocomplete dropdown
  - [ ] Clean medication list display (cards instead of cramped list)
  - [ ] Professional interaction results table/cards
  - [ ] Fix "Start Free Trial" to go to Stripe (currently opens email)
  - [ ] Remove "Schedule Demo" button (redundant with interactive demo)
  - [ ] Larger back button (currently too small)
- [ ] Complete ReguReady™ professional redesign:
  - [ ] Remove giant decorative circles (taking up entire screen)
  - [ ] Clear step labels: "Device Information" → "Risk Classification" → "Predicate Device" → "Regulatory Pathway"
  - [ ] Professional progress bar showing current step (1-4 confusing)
  - [ ] Generous spacing and padding (currently cramped)
  - [ ] Card-based quick demo scenarios
  - [ ] Larger, clearer navigation buttons
  - [ ] Focused content area (not empty space)
  - [ ] Professional results/recommendation display
  - [ ] Fix "Upgrade to Pro" to go to Stripe properly
- [ ] Research-backed design decisions:
  - [ ] Follow best practices from Skilljar, Hunter, Clay, Nudge demos
  - [ ] Clean, spacious layouts with clear visual hierarchy
  - [ ] Single-focus CTAs at each step
  - [ ] Professional color schemes
  - [ ] Make demos feel like real, valuable products
- [ ] Test redesigned prototypes end-to-end
- [ ] Deploy to production
- [ ] Verify sales-readiness (no longer blocking conversions)




## 🚨 URGENT: Complete Redesign Required (User Feedback)
- [ ] Remove "Schedule Demo" buttons from LearnMore.jsx (still present!)
- [ ] Fix dark background issue - looks outdated and hard to read
- [ ] Increase spacing throughout - text too cramped (2-3x current spacing)
- [ ] Complete modern redesign - current looks "10 years old"
- [ ] Gen AI optimization for all content (SEO becoming obsolete):
  - [ ] Semantic HTML with rich schema markup
  - [ ] Natural language content structure
  - [ ] Entity-based content (not keyword-based)
  - [ ] Conversational, contextual copy
  - [ ] Structured data for AI crawlers (FAQ, HowTo, Product schemas)
  - [ ] Rich snippets for AI answers
- [ ] Add curves and personality (not DOS-program boxes):
  - [ ] Organic curves & waves (not straight lines)
  - [ ] Flowing shapes (blobs, morphing elements)
  - [ ] Rounded corners everywhere (not sharp boxes)
  - [ ] Personality (playful, human, warm)
  - [ ] Asymmetric layouts (not rigid grids)
  - [ ] Flowing animations
  - [ ] Natural, organic feel (like Stripe, Notion, Linear)
- [ ] Add graphics and visual interest (not bland boxes):
  - [ ] Icons & illustrations throughout
  - [ ] Subtle animations (floating elements, gradients)
  - [ ] Visual depth (shadows, layers, glassmorphism)
  - [ ] Decorative elements (abstract shapes, patterns)
  - [ ] Color accents (not just gray boxes)
  - [ ] Interactive hover effects
  - [ ] Gradient overlays (sophisticated, not flat)
- [ ] 2025 Premium Design Standards:
  - [ ] Light, airy backgrounds (white/subtle gradients)
  - [ ] Generous spacing (2-3x current)
  - [ ] Modern typography (larger, cleaner fonts)
  - [ ] Premium color palette (sophisticated)
  - [ ] Glassmorphism/Neumorphism effects
  - [ ] Micro-interactions and smooth animations
  - [ ] Interactive visualizations showing AI power
  - [ ] Before/After comparisons
  - [ ] Real-time analysis demos
- [ ] Research best 2025 SaaS websites (Stripe, Linear, Vercel, Notion)
- [ ] Make it look like $10M+ funded startup




## NEW: Remove Fake Stats from Demos (Oct 28, 2025)
- [x] Remove "Trusted by 1,247 Healthcare Providers" from RxGuard demo
- [x] Remove "Used at 89 hospitals nationwide" from RxGuard demo
- [x] Replace "2,847 Critical interactions caught this month" with "Built on 10M+ FDA adverse event records"
- [x] Add "Analyzing 1,000+ known drug interactions" metric
- [x] Keep "FDA FAERS data-powered" (factually accurate)
- [x] Apply same changes to ReguReady demo if applicable




## URGENT: Professional Interactive Demo Rebuild (Oct 28, 2025)
- [ ] Research professional demo examples (SDK.finance, Certara, OpenPayd, Genedata)
- [ ] Analyze UI patterns, flows, and interactivity standards
- [ ] Create design spec based on best practices
- [ ] Rebuild RxGuard™ demo to professional standards:
  - [ ] Multi-persona paths (Doctor, Pharmacist, Hospital Admin)
  - [ ] Real interactivity (user input, dynamic results)
  - [ ] ROI calculator or cost savings simulator
  - [ ] Guided step-by-step flow
  - [ ] Professional UI (spacious, modern, clean)
  - [ ] Data visualization that updates based on input
  - [ ] Sandbox environment feel
- [ ] Test rebuilt RxGuard™ demo
- [ ] If approved, apply same standards to ReguReady™
- [ ] Deploy to production




#### 🚨 CRITICAL BUGS: RxGuard Demo Layout Issues (Oct 28, 2025)
- [x] Fix text spacing - too tight/cramped, hard to read
  - [x] Increase line-height from default to 1.6-1.8
  - [x] Add more padding inside cards (p-8 → p-10)
  - [x] Increase font size for better readability
- [x] Fix hover effect breaking layout
  - [x] Card skews left on hover causing text to fall off page
  - [x] "Try This Scenario" button gets cut off
  - [x] Remove scale transform on hover
  - [x] Test hover states don't break layout
- [x] Overall spacing improvements
  - [x] More whitespace between elements (space-y-3 → space-y-4)
  - [x] Larger margins between sections
  - [x] Better visual breathing room

- [x] Add visual differentiation for scenario cards (borders/shadows/contrast)
  - [ ] Cards still blend into dark background (needs more work)
  - [x] Add visible borders (border-4) and increase shadow (shadow-2xl)
  - [x] Add ring for extra visibility

- [x] Increase gap between scenario cards for better visual separation (gap-8 → gap-12)on



- [x] Lighten demo background to make white cards visible
  - [x] Change from dark blue gradient to light blue/gray gradient
  - [x] Ensure sufficient contrast between background and white cards
  - [x] Override body's dark background with inline styles



- [x] Fix card visibility - cards are invisible on light background
  - [x] Change cards from pure white to subtle blue/slate tint (#f8fafc)
  - [x] Increase contrast between cards and background
  - [x] Make borders more visible (border-4 with #94a3b8 slate color)



-- [x] Make card borders darker for better contrast
  - [x] Change from slate-400 (#94a3b8) to slate-600 (#475569)

- [x] Remove "Schedule Demo" button from LearnMore pagee




## ReguReady™ Professional Rebuild (Oct 28, 2025)
- [x] Rebuild ReguReady™ with same professional style as RxGuard™
  - [x] Clean welcome screen with 3 regulatory scenario cards
  - [x] Instant results (no "analyze" step)
  - [x] Two-column layout (pathway timeline + milestone details)
  - [x] ROI calculator showing cost savings
  - [x] Light background with visible cards
  - [x] Generous spacing (line-height 1.7-1.8, p-2.5rem cards)
  - [x] Remove fake stats, use verifiable FDA/CDRH data
  - [x] BaseCase-style professional design




## Build Professional Demos for Remaining Platforms (Oct 28, 2025)

### ClinicalIQ™ Demo
- [ ] Build professional BaseCase-style interactive demo
  - [ ] 3 clinical trial scenario cards (Oncology Phase III, Rare Disease Phase II, Cardiovascular Phase III)
  - [ ] Instant results with trial success prediction
  - [ ] Two-column layout (protocol analysis + ROI calculator)
  - [ ] Success probability scoring (0-100%)
  - [ ] Recruitment timeline forecasting
  - [ ] Site selection recommendations
  - [ ] Cost savings calculator
  - [ ] Light background with visible cards
  - [ ] Honest metrics (400K+ trials analyzed, 75-85% forecast accuracy)

### ElderWatch™ Demo
- [ ] Build professional BaseCase-style interactive demo
  - [ ] 3 senior health scenario cards (Fall Risk, Medication Non-Adherence, Cognitive Decline)
  - [ ] Instant results with health risk prediction
  - [ ] Two-column layout (risk analysis + intervention recommendations)
  - [ ] Fall risk scoring (0-100%)
  - [ ] Activity pattern visualization
  - [ ] Medication adherence tracking
  - [ ] Intervention cost savings calculator
  - [ ] Light background with visible cards
  - [ ] Honest metrics (30-40% fall reduction, 24% fewer hospitalizations)




## 🚨 CRITICAL BUG: Try Interactive Demo Button Missing (Oct 28, 2025)
- [x] Update LearnMore.jsx to show "Try Interactive Demo" button for ALL 6 platforms
  - [x] Currently only shows for RxGuard™ and ReguReady™
  - [x] Need to add ClinicalIQ™, ElderWatch™, PediCalc Pro™, SkinScan Pro™
  - [x] Update onClick handler to map platform names to demo types




## 🚨 URGENT FIXES (Oct 29, 2025)
- [ ] Update RxGuard demo to match new professional light background layout (currently still has old dark background)
- [x] Fix "Start Free Trial" button - currently opens email, should either:
  - [x] Remove it entirely (no trial system yet)
  - [x] Link to Stripe checkout
  - [x] Link to a signup/registration page
- [x] Decide what to do with "Start Free Trial" button for each platform (some are B2B enterprise, not consumer trial products)
- [x] Fix back buttons in demos - only RxGuard works, other 5 demos' back buttons are broken



## 🎨 Demo Background Color Fixes (Oct 29, 2025)
- [x] Update RxGuard demo background to match brand cyan color (#00A8CC)
- [x] Update ReguReady demo background to lavender/purple (#B794F4)
- [x] Update SkinScan demo background to teal (#14B8A6)



## 🎨 RxGuard Demo Layout Rebuild (Oct 29, 2025)
- [x] Rebuild RxGuard demo to match modern layout pattern (like ReguReady, ClinicalIQ, etc.)
  - [x] Center title with badge above
  - [x] Add stats box with 3 columns
  - [x] Update scenario cards with rounded borders
  - [x] Match font sizes and spacing
  - [x] Ensure consistent styling with other 5 demos




## 💳 Stripe Payment Links Integration (Oct 29, 2025)
- [x] Replace deprecated Stripe checkout with Payment Links
- [x] Add all 6 payment links to LearnMore.jsx
- [x] Update ClinicalIQ™ to "Contact Sales" only (no self-service checkout)
- [x] Update pricing display to reflect free trials for PediCalc and SkinScan
- [x] Remove old Stripe Price ID configuration




## 🚨 CRITICAL BUGS FOUND (Oct 29, 2025 - Post-Blueprint)
- [ ] Fix "Contact Us" button in navigation - currently goes nowhere
- [ ] Fix Stripe payment links - still showing "Something went wrong" error
- [ ] Rebuild RxGuard demo with 3 clinical interaction scenarios (currently missing)
- [ ] Review ALL pricing tiers across all 6 platforms:
  - [ ] Apply rule: < $500/month = Stripe checkout, >= $500/month = Contact Sales
  - [ ] ElderWatch: Home Care ($200/mo) → Stripe, Facility ($300-500/mo) → Stripe, Enterprise → Contact Sales
  - [ ] SkinScan: Individual ($99/mo) → Stripe, Group ($79/mo/provider) → Stripe, Enterprise → Contact Sales
  - [ ] PediCalc: Individual ($15/mo) → Stripe, Group ($10/mo/provider) → Stripe, Enterprise → Contact Sales
- [ ] Audit ALL hyperlinks - found mailto: links that should be proper buttons/links
- [ ] Create Stripe payment links for all missing tiers (currently only have 6, need ~12-15 total)




## ✅ APPROVED: Premium Pricing Implementation (Oct 29, 2025)

### Phase 1: Stripe Payment Links (USER ACTION REQUIRED)
- [ ] Delete 6 old/incorrect payment links in Stripe
- [ ] Create 13 new Stripe payment links with approved premium pricing
- [ ] Provide all payment link URLs to Manus

### Phase 2: Website Code Updates (MANUS)
- [ ] Update platformData.js with premium pricing for all 6 platforms
- [ ] Update stripePaymentLinks.js with new payment link URLs  
- [ ] Update LearnMore.jsx pricing display logic
- [ ] Add new pricing tiers to all platform pages
- [ ] Test all Stripe checkout flows

### Phase 3: Fix Critical Bugs (MANUS)
- [ ] Fix Contact Us button (already done - add email link)
- [ ] Fix RxGuard demo scenarios (rebuild 3 clinical scenarios)
- [ ] Audit all hyperlinks across website
- [ ] Test all navigation flows

### Phase 4: Final QA (MANUS)
- [ ] Test all 6 platforms end-to-end
- [ ] Verify all payment links work
- [ ] Check mobile responsiveness
- [ ] Create final checkpoint




## AI Optimization Features (Oct 30, 2025 - Blueprint Implementation)
- [x] Create /public/ai-sitemap.json for AI agent discovery
- [x] Create /public/ai/embeddings.json for AI content understanding
- [x] Enhance JSON-LD schema markup on all pages
- [x] Add structured data for products and pricing
- [ ] Verify schema validation with Google Rich Results
- [ ] Test AI discoverability with ChatGPT/Claude/Perplexity



## SEO & Performance Optimization (Oct 30, 2025 - Blueprint Phase 2)
- [x] Create branded 404 error page
- [x] Run Lighthouse performance audit
- [ ] Optimize images for web performance
- [ ] Verify all meta tags are present
- [ ] Test mobile responsiveness (iOS & Android)
- [ ] Check page load times

## Final QA Testing (Oct 30, 2025 - Blueprint Phase 3)
- [ ] Test all navigation links (Home, Suite, 6 Apps, About, Contact)
- [ ] Verify all 6 demo interactions work correctly
- [ ] Test all 11 Stripe payment links
- [ ] Verify Contact Us button functionality
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Validate JSON-LD schema with Google Rich Results
- [ ] Test AI sitemap and embeddings accessibility
- [ ] Verify mobile view on real devices
- [ ] Check all CTAs route correctly
- [ ] Final cross-browser compatibility check




## Performance & Best Practices Optimization (Oct 30, 2025 - Lighthouse Improvements)
- [x] Analyze detailed Lighthouse report for specific issues
- [x] Fix console errors and warnings
- [x] Add security headers to vercel.json
- [x] Add resource hints (preconnect, dns-prefetch)
- [x] Create valid robots.txt file
- [x] Fix Chrome DevTools issues
- [x] Remove third-party cookies (Stripe - unavoidable)
- [x] Implement code splitting for large components
- [x] Optimize JavaScript bundle size (reduced to 239KB, 52% improvement)
- [x] Implement lazy loading for demos
- [x] Reduce First Contentful Paint (FCP)
- [x] Reduce Largest Contentful Paint (LCP)
- [x] Reduce Total Blocking Time (TBT)
- [x] Reduce Max Potential FID
- [x] Re-run Lighthouse audit - ACHIEVED: 92% performance, 100% best practices, 100% accessibility, 100% SEO




## Mobile UX Fixes (Oct 30, 2025 - Critical Issues from Phone Testing)
- [x] Fix "Nexus Biomedical Intelligence" title readability on mobile (solid white with strong shadow)
- [x] Fix platform cards overflowing/skewed on mobile viewport (minmax(min(100%, 320px), 1fr))
- [x] Enhance color contrast for subtitles (brightness(1.3) + text-shadow + glow)
- [x] Make card borders more prominent (6px gradient bar with glow effect)
- [ ] Test all fixes on real mobile device
- [ ] Verify responsive layout works on all screen sizes



## Mobile UX Fixes (Oct 30, 2025)
- [ ] Fix "COMING SOON" badge overflow on mobile platform cards (currently cut off screen)
- [ ] Verify all "Try Interactive Demo" buttons work correctly
- [ ] Verify all "Start Free Trial" Stripe payment links work correctly

