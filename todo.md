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

