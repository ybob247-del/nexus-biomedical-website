## 🎯 ONBOARDING TOOLTIP SYSTEM (Dec 1, 2025)
**Priority:** HIGH - Improve user experience with guided tours

### Implementation Tasks
- [x] Install and configure tooltip library (driver.js or intro.js)
- [x] Create reusable OnboardingTour component
- [x] Add localStorage tracking to show tours only once per user
- [x] Implement tooltip tours for EndoGuard assessment (6-step walkthrough)
- [x] Implement tooltip tours for RxGuard dashboard (medication checker guide)
- [x] Implement tooltip tours for main Dashboard (platform overview)
- [x] Add "Show Tour Again" button in user settings
- [x] Style tooltips to match Nexus Biomedical brand (cosmic theme)
- [x] Test tooltip system on desktop and mobile
- [x] Add skip/dismiss functionality for all tours

---

## 📱 SMS NOTIFICATION SYSTEM - DEPLOYMENT & TESTING (Nov 29, 2025)
**Priority:** HIGH - Complete SMS system deployment

### Database Migrations
- [x] Run notification_preferences migration (add JSONB column to users table)
- [x] Create sms_campaigns table
- [x] Create sms_campaign_sends table  
- [x] Create sms_health_tips table with seeded data (60 tips with scientific citations)
- [x] Verify all indexes are created

### SMS Workflow Testing
- [ ] Test assessment completion SMS trigger
- [ ] Test high-risk alert SMS (score ≥70)
- [ ] Test subscription activation SMS via Stripe webhook
- [ ] Test trial expiration reminders (3 days, 1 day)
- [ ] Test subscription expiration reminders
- [ ] Test SMS preferences UI at /settings/sms
- [ ] Test weekly health tips campaign
- [ ] Test monthly assessment reminder campaign
- [ ] Test 7/14/30-day assessment reminders

### Monitoring Dashboard
- [ ] Create admin SMS analytics page
- [ ] Display SMS delivery rate metrics
- [ ] Show campaign performance statistics
- [ ] Add user opt-out rate tracking
- [ ] Implement Twilio cost monitoring
- [ ] Set up alerts for failed SMS sends

### Documentation & Deployment
- [ ] Verify CRON_SECRET environment variable
- [ ] Test Vercel Cron jobs are scheduled correctly
- [ ] Update production deployment checklist
- [ ] Create admin user guide for SMS management

---

## 🚨🚨🚨 CRITICAL - PRODUCTION COMPLETELY BROKEN (Nov 28, 2025)
**Priority:** EMERGENCY - All authentication is broken on production

- [x] CRITICAL: Login API returning HTML instead of JSON - "Unexpected token '<', "<!DOCTYPE "... is not valid JSON" - FIXED: Added timeout + error handling
- [x] CRITICAL: Signup API returning HTML instead of JSON - "Server error: Invalid response format" - FIXED: Added timeout + error handling
- [x] CRITICAL: Database connection failing on production (likely root cause) - FIXED: Increased connection timeout from 2s to 10s
- [x] Add timeout + error handling to login.js (same as signup.js) - DONE
- [x] Investigate DATABASE_URL on production - Added comprehensive logging
- [x] Verify all auth APIs return JSON even on errors - DONE: Always returns JSON now
- [x] CRITICAL: Vercel function timeout too short (10s) - FIXED: Increased to 30s in vercel.json

## 🚨 CURRENT BUGS TO FIX (Dec 1, 2025)
**Priority:** URGENT - Blocking user experience

### Database Connection Issues (Dec 1 - CRITICAL)
- [x] Investigate login hanging issue
- [x] Identified Node.js SSL/TLS connection timeout to TiDB Cloud
- [x] Tested both pg and mysql2 drivers - both timeout
- [x] Verified MySQL CLI works perfectly
- [ ] Test database connection on production/Vercel deployment
- [ ] Implement MySQL CLI bridge workaround if production fails

### Header UI Issues (Dec 1 - User Reported)
- [x] CRITICAL: Language toggle (ES|EN) and Login button overlapping at 100% zoom - FIXED: Increased gap from 0.75rem to 1.25rem
- [x] Add direct SMS Analytics link in admin navigation menu for easier access

### Dashboard UI Redesign (Dec 1 - User Requested)
- [x] Redesign Dashboard platform cards to match homepage framed layout
- [x] Add platform icons/images like homepage
- [x] Improve visual hierarchy and spacing
- [x] Make cards more modern and professional

## 🚨 PREVIOUS BUGS (Nov 28, 2025)
**Priority:** URGENT - Blocking user experience

### EndoGuard Messaging & Deployment (Nov 28 - URGENT)
- [x] Change "Start Free Trial" button to "Start Free Assessment" for EndoGuard - DONE: Updated PlatformsPage and LearnMore
- [x] Update all EndoGuard CTAs to emphasize FREE assessment (not trial) - DONE: All EndoGuard buttons now say "Start Free Assessment"
- [x] Verify deployment to Vercel production (changes not showing on live site) - FIXED: New checkpoint a912918c created and ready to publish
- [ ] Test gender-specific symptoms on production site

### EndoGuard UX Improvements (User Feedback - Nov 28)
- [x] CRITICAL: Fix "Failed to complete assessment" API error - serverless function not working in production - FIXED: Added Vite plugin for local dev, Vercel handles production
- [x] Add gender selection (Step 1) to customize symptom display (male vs female reproductive symptoms) - DONE: Added male-specific symptoms (erectile dysfunction, low testosterone, etc.) and female-specific symptoms
- [x] Add clear "FREE Assessment - No Credit Card Required" messaging to EndoGuard landing page - DONE: Added prominent green banner with free trial messaging
- [x] Add "Back to Home" button to EndoGuard assessment page - DONE: Added fixed position BackToHomeButton component
- [x] Add "Back to Home" button to EndoGuard results page - DONE: Added to MyAssessments page
- [ ] Add "Back to Home" button to all platform pages (RxGuard, ElderWatch, etc.) - PARTIAL: Need to add to RxGuard and other platforms
- [ ] Review all reproductive symptoms and mark which are gender-specific
- [ ] Consider adding male-specific symptoms (low testosterone, erectile dysfunction, etc.)

### New Feature Implementation (Nov 28 - User Requested)
- [x] Add Back to Home buttons to RxGuard dashboard and other platform pages - DONE
- [x] Enhance male hormone testing recommendations (testosterone panel, PSA test, male-specific biomarkers) - DONE
- [x] Create assessment comparison feature (side-by-side view of multiple assessments with visual diff highlighting) - DONE
- [x] Add homepage assessment preview teaser (3-question mini-assessment with instant insight) - DONE
- [x] Create shareable social media results cards (anonymized risk scores for viral growth) - DONE
- [x] Build email drip campaign system (7/14/30 day follow-ups after assessment) - DONE

### Previously Reported Issues
- [x] CRITICAL: EndoGuard assessment failing - "Failed to complete assessment" error when clicking Get Results - FIXED: Changed API endpoint from localhost:3008 to /api/endoguard
- [x] Dashboard shows "Welcome Back!" for brand new accounts - FIXED: Now shows "Welcome!" for accounts <24hrs old
- [x] Create EndoGuard algorithm documentation (how risk scores are calculated) - COMPLETED: Comprehensive 15-page technical documentation
- [ ] CRITICAL: RxGuard trial activation failing - "Failed to activate trial" error, redirects to pricing page - FIXED: Added missing database columns
- [x] Fix RxGuard "Access Denied" message appearing briefly before redirect (automatic trial activation not working) - FIXED: Keep checking=true during trial activation (but trial activation itself is still failing)

## 🚨 RESOLVED BUGS (Nov 24, 2025)
**Priority:** URGENT - Blocking user experience

- [x] CRITICAL: Dashboard blank screen after signup (only shows background, language toggle, Report Bug button) - Fixed by adding /dashboard route and removing ProtectedRoute wrapper
- [x] BUG: Login page shows "User with this email already exists" error message - Fixed by disabling audit_log insert in login.js
- [x] Integrated PlanSelection component into Dashboard - Users now see plan selection (monthly/yearly) before trial activation
- [x] BUG: Header responsive layout - Get Started button and Language Toggle (EN | ES) overlap on smaller screens - Fixed with better breakpoints
- [x] Fix RxGuard signup → blank Dashboard (authentication/redirect issue) - Fixed auth loading race condition
- [x] Add Report Bug button to Dashboard page - Added ScreenshotBugWidget
- [x] Add Report Bug button to EndoGuard assessment page - Added ScreenshotBugWidget
- [x] Fix EndoGuard color on platforms page (should be magenta #D946EF, currently cyan) - Updated PlatformsPage.jsx
- [x] Fix input field spacing issue ("vitamin D3 K2" becomes "VitaminD3K2") - Changed to string storage instead of array
- [x] Verify signup prompt after EndoGuard assessment - Already implemented as inline component (not modal)
