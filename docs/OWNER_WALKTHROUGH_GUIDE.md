# Nexus Biomedical Intelligence - Owner Walkthrough Guide

**Version:** 1.0  
**Date:** December 8, 2025  
**Author:** Manus AI  
**Purpose:** Comprehensive testing and review guide for platform owner

---

## 🎯 Overview

This guide provides a systematic walkthrough for testing all features of the Nexus Biomedical Intelligence platform, with particular focus on **EndoGuard™** and **RxGuard™** platforms. The walkthrough ensures all functionality works as designed and prepares you for live demonstrations.

---

## 🔐 Admin Account Credentials

**Your Admin Account:**
- **Email:** support@nexusbiomedical.ai
- **Password:** Admin2025!Nexus
- **Admin Privileges:** GRANTED
- **Access Level:** Full platform access + admin analytics

⚠️ **IMPORTANT:** Change your password immediately after first login for security.

---

## 📋 Testing Checklist Overview

| Phase | Focus Area | Estimated Time | Priority |
|-------|-----------|----------------|----------|
| 1 | Authentication & Account Setup | 15 minutes | Critical |
| 2 | EndoGuard™ Complete Flow | 30 minutes | Critical |
| 3 | RxGuard™ Complete Flow | 25 minutes | Critical |
| 4 | Bilingual Features (Spanish) | 20 minutes | High |
| 5 | Admin Analytics Dashboard | 15 minutes | High |
| 6 | SMS Notifications | 10 minutes | Medium |
| 7 | Payment & Subscriptions | 15 minutes | High |
| 8 | Mobile Responsiveness | 15 minutes | High |

**Total Estimated Time:** 2.5 - 3 hours

---

## Phase 1: Authentication & Account Setup

### 1.1 Initial Login

**Steps:**
1. Navigate to https://www.nexusbiomedical.ai/login
2. Enter credentials:
   - Email: support@nexusbiomedical.ai
   - Password: Admin2025!Nexus
3. Click "Sign In"

**Expected Results:**
- ✅ Successful login without errors
- ✅ Redirect to Dashboard
- ✅ Welcome message displays: "Welcome, Nexus!"
- ✅ User email shows in header: "support@nexusbiomedical.ai"
- ✅ Language toggle (EN | ES) visible in header

**Troubleshooting:**
- If login fails: Check password was copied correctly (no extra spaces)
- If "Access Denied" appears: Database connection issue - contact support
- If page is blank: Clear browser cache and retry

### 1.2 Dashboard Overview

**What to Check:**
- ✅ Dashboard displays 7 platform cards
- ✅ EndoGuard™ and RxGuard™ show "Start Free Assessment" or "Start Free Trial" buttons
- ✅ 5 platforms show "Coming Soon" badges (ElderWatch, PediCalc Pro, ClinicalIQ, ReguReady, SkinScan Pro)
- ✅ Cosmic background animation is visible
- ✅ Platform cards have gradient borders and hover effects

**Navigation Test:**
- Click "My Subscriptions" in user dropdown → Should show subscription management page
- Click "Logout" → Should return to homepage
- Log back in to continue testing

---

## Phase 2: EndoGuard™ Complete Flow Testing

### 2.1 Starting the Assessment

**Steps:**
1. From Dashboard, click **"Start Free Assessment"** on EndoGuard™ card
2. Verify assessment page loads with cosmic background
3. Check that progress bar shows "Step 1 of 6"

**Expected Results:**
- ✅ Assessment page loads without errors
- ✅ Free assessment banner visible: "✨ FREE Assessment - No Credit Card Required"
- ✅ Back to Home button visible in top-left
- ✅ Language toggle (EN | ES) visible
- ✅ "My Assessments" button visible (for viewing history)

### 2.2 Completing Step 1: Demographics

**Test Data to Use:**
- **Biological Sex:** Female
- **Age:** 35
- **Height:** 5'6" (or 168 cm)
- **Weight:** 150 lbs (or 68 kg)

**What to Verify:**
- ✅ All fields accept input correctly
- ✅ Height/weight units toggle between imperial/metric
- ✅ "Next" button becomes enabled after all fields filled
- ✅ No console errors in browser developer tools

### 2.3 Completing Step 2: Symptoms

**Test Data:**
Select at least 5 symptoms to trigger moderate risk score:
- ☑️ Fatigue or low energy
- ☑️ Weight changes (gain or loss)
- ☑️ Mood swings or irritability
- ☑️ Sleep disturbances
- ☑️ Hair loss or thinning

**Gender-Specific Symptom Test:**
- ✅ Verify female-specific symptoms appear: "Irregular menstrual cycles", "Heavy or painful periods", "Vaginal dryness"
- ✅ Verify male-specific symptoms DO NOT appear for female selection

**What to Check:**
- ✅ Checkboxes toggle correctly
- ✅ Symptom count updates as you select
- ✅ Symptoms are organized by category (reproductive, metabolic, etc.)
- ✅ "Next" button works after selecting symptoms

### 2.4 Completing Step 3: Symptom Duration

**Test Data:**
- Select: **"3-6 months"** (moderate chronicity)

**Expected Results:**
- ✅ Radio buttons work correctly
- ✅ Selection is highlighted
- ✅ "Next" button advances to Step 4

### 2.5 Completing Step 4: Stress Level

**Test Data:**
- **Stress Level:** 7 (on slider from 1-10)
- **Guidance text visible:** "Rate your typical daily stress: 1 = Very relaxed, 5 = Moderate stress, 10 = Overwhelming/chronic stress"

**What to Verify:**
- ✅ Slider moves smoothly
- ✅ Selected value displays next to slider
- ✅ Guidance text helps with interpretation

### 2.6 Completing Step 5: Lifestyle Factors

**Test Data:**
- **Diet Quality:** Fair
- **Exercise Frequency:** 2-3 times per week
- **Sleep Quality:** Fair (5-6 hours)

**Expected Results:**
- ✅ All dropdowns work correctly
- ✅ Selections save properly
- ✅ "Next" button advances to Step 6

### 2.7 Completing Step 6: EDC Exposure

**Test Data:**
Select at least 3 exposure sources:
- ☑️ Plastic food containers or water bottles
- ☑️ Canned foods
- ☑️ Non-organic produce

**What to Check:**
- ✅ Checkboxes work correctly
- ✅ Multiple selections allowed
- ✅ "Submit Assessment" button appears (not "Next")

### 2.8 Reviewing Results

**Click "Submit Assessment"**

**Expected Results:**
- ✅ Results page loads with AI-generated analysis
- ✅ Risk score displays (should be 5-7 for test data entered)
- ✅ Risk level shows as "Moderate" with yellow/orange color
- ✅ Severity score is auto-calculated (NOT manually entered)
- ✅ GPT-4 AI analysis section displays with:
  - Pattern recognition insights
  - Hormone system analysis
  - Personalized recommendations
  - Clinical evidence citations

**AI Analysis Quality Check:**
- ✅ Analysis is personalized to your specific symptoms
- ✅ Recommendations are actionable and specific
- ✅ Language is professional and empathetic
- ✅ No generic or template-like responses

### 2.9 Test Recommendations Section

**What to Verify:**
- ✅ Recommended tests section displays
- ✅ Tests are categorized by priority (High, Medium, Low)
- ✅ Cost estimates shown for each test
- ✅ Scientific citations included (PMID/PMC references)
- ✅ Tests are relevant to selected symptoms

**For Female Test Data:**
- ✅ Should include: TSH, Free T4, Total Testosterone, Estradiol, Progesterone
- ✅ Should NOT include male-specific tests (PSA, Free PSA)

### 2.10 PDF Export Test

**Steps:**
1. Scroll to bottom of results page
2. Click **"Download PDF Report"** button

**Expected Results:**
- ✅ PDF downloads successfully
- ✅ PDF contains all assessment data
- ✅ PDF includes risk score and recommendations
- ✅ PDF is professionally formatted with Nexus branding

**If PDF Doesn't Download:**
- Check browser pop-up blocker settings
- Try different browser (Chrome, Firefox, Safari)
- Verify you're logged in

### 2.11 Subscription Modal Test

**Steps:**
1. On results page, click **"Upgrade to Premium"** button

**Expected Results:**
- ✅ Subscription modal opens
- ✅ Shows EndoGuard™ pricing: $49/month (Premium) or $97/month (Premium Plus)
- ✅ Lists 8 premium features
- ✅ "14-day money-back guarantee" displayed
- ✅ Close button (X) works to dismiss modal

**DO NOT complete payment** - this is just a UI test

---

## Phase 3: RxGuard™ Complete Flow Testing

### 3.1 Accessing RxGuard™ Dashboard

**Steps:**
1. Return to Dashboard (click "Dashboard" in header)
2. Click **"Start Free Trial"** on RxGuard™ card

**Expected Results:**
- ✅ Plan selection modal appears
- ✅ Shows monthly ($39/month) and yearly ($374/year) options
- ✅ "Save 20%" badge on yearly plan
- ✅ "Start 14-Day Free Trial" button visible

**Select Monthly Plan and Start Trial**

**Expected Results:**
- ✅ Modal closes
- ✅ RxGuard™ dashboard loads
- ✅ Trial banner appears: "14 days remaining in your free trial"
- ✅ Back to Home button visible
- ✅ Language toggle (EN | ES) visible

### 3.2 Drug Search Test

**Steps:**
1. In the "Search Medications" field, type: **"Lipitor"**
2. Wait for autocomplete suggestions

**Expected Results:**
- ✅ Autocomplete dropdown appears
- ✅ Shows 5+ medication options with dosages
- ✅ Each result shows drug name and strength
- ✅ Click on "Lipitor 10mg" to add it

**Add to Medication List:**
- ✅ Medication appears in "Your Medications" list
- ✅ Shows drug name, dosage, frequency fields
- ✅ "Remove" button visible for each medication

### 3.3 Multi-Drug Interaction Test

**Add Additional Medications:**
1. Search and add: **"Amlodipine"** (blood pressure medication)
2. Search and add: **"Bupropion"** (antidepressant)

**Expected Results:**
- ✅ All 3 medications appear in list
- ✅ Each has dosage and frequency fields
- ✅ No duplicate entries

### 3.4 Analyze Interactions

**Steps:**
1. Click **"Analyze Interactions"** button
2. Wait for analysis to complete (5-10 seconds)

**Expected Results:**
- ✅ Loading spinner appears during analysis
- ✅ Results section displays with:
  - Overall risk assessment (LOW/MODERATE/HIGH)
  - Specific interaction warnings
  - Clinical recommendations
  - Alternative medication suggestions

**Interaction Details to Verify:**
- ✅ Lipitor + Amlodipine interaction detected (moderate risk)
- ✅ Clinical guidance provided (monitor for muscle pain)
- ✅ Severity level clearly indicated
- ✅ Evidence-based recommendations included

### 3.5 AI Analysis Section

**What to Check:**
- ✅ GPT-4 AI analysis displays
- ✅ Confidence score shown (e.g., "88% confidence")
- ✅ Reasoning provided for interaction detection
- ✅ Pattern matching explained
- ✅ FDA FAERS data referenced

### 3.6 Alternative Recommendations

**Expected Results:**
- ✅ Alternative medications suggested
- ✅ Safer alternatives highlighted
- ✅ Rationale provided for each alternative
- ✅ Cost comparison included (if available)

### 3.7 Save Medication List

**Steps:**
1. Scroll to bottom
2. Click **"Save Medication List"** button

**Expected Results:**
- ✅ Success message appears: "Medication list saved"
- ✅ No errors in console
- ✅ List persists after page refresh

**Test Persistence:**
1. Refresh the page (F5)
2. Verify medications are still displayed
3. ✅ All 3 medications should reappear

### 3.8 PDF Export Test

**Steps:**
1. Click **"Download PDF Report"** button

**Expected Results:**
- ✅ PDF downloads successfully
- ✅ PDF contains all medications
- ✅ PDF includes interaction analysis
- ✅ PDF shows recommendations and alternatives

---

## Phase 4: Bilingual Features (Spanish Testing)

### 4.1 Language Toggle Test

**Steps:**
1. Navigate to homepage (https://www.nexusbiomedical.ai)
2. Click **"ES"** in language toggle (top-right header)

**Expected Results:**
- ✅ Page content switches to Spanish
- ✅ Hero section displays Spanish text
- ✅ Platform cards show Spanish descriptions
- ✅ Navigation menu items in Spanish
- ✅ Footer links in Spanish

### 4.2 EndoGuard™ Spanish Landing Page

**Steps:**
1. Click on **"EndoGuard™"** platform card (should redirect to /es/endoguard)

**Expected Results:**
- ✅ Spanish landing page loads
- ✅ All content in Spanish
- ✅ Features, pricing, FAQs in Spanish
- ✅ CTA buttons in Spanish: "Comenzar Evaluación Gratuita"

### 4.3 EndoGuard™ Spanish Assessment

**Steps:**
1. Click **"Comenzar Evaluación Gratuita"** button
2. Complete assessment in Spanish

**Expected Results:**
- ✅ All assessment questions in Spanish
- ✅ Symptom options in Spanish
- ✅ Progress indicators in Spanish
- ✅ Results page displays in Spanish
- ✅ AI analysis in Spanish

**Test Spanish AI Analysis:**
- ✅ GPT-4 responds in Spanish
- ✅ Recommendations are culturally appropriate
- ✅ Medical terminology correctly translated

### 4.4 RxGuard™ Spanish Landing Page

**Steps:**
1. Navigate to /es/rxguard

**Expected Results:**
- ✅ Spanish landing page loads
- ✅ All content in Spanish
- ✅ Statistics and benefits in Spanish
- ✅ Pricing in Spanish

### 4.5 AI Chatbot Spanish Test

**Steps:**
1. Click chatbot icon (bottom-right corner)
2. Type Spanish question: **"¿Qué es EndoGuard?"**

**Expected Results:**
- ✅ Chatbot detects Spanish language
- ✅ Responds in Spanish
- ✅ Answer is accurate and helpful
- ✅ Follow-up questions work in Spanish

---

## Phase 5: Admin Analytics Dashboard

### 5.1 Accessing Admin Analytics

**Steps:**
1. Navigate to https://www.nexusbiomedical.ai/admin/analytics
2. Verify admin access granted

**Expected Results:**
- ✅ Analytics dashboard loads
- ✅ Overview metrics display:
  - Total users
  - Active trials
  - Paid subscriptions
  - Conversion rate
- ✅ Revenue metrics show:
  - MRR (Monthly Recurring Revenue)
  - ARR (Annual Recurring Revenue)
  - ARPU (Average Revenue Per User)

### 5.2 Platform Statistics

**What to Check:**
- ✅ Platform breakdown table displays
- ✅ Shows trials and subscriptions by platform
- ✅ EndoGuard™ and RxGuard™ data visible
- ✅ Conversion rates calculated correctly

### 5.3 Engagement Distribution

**Expected Results:**
- ✅ Engagement score distribution chart displays
- ✅ Shows user distribution across 0-20, 20-40, 40-60, 60-80, 80-100 ranges
- ✅ Bar chart is visually clear

### 5.4 User Growth Chart

**What to Verify:**
- ✅ 30-day user growth chart displays
- ✅ Daily signup data visible
- ✅ Trend line shows growth pattern
- ✅ Chart is interactive (hover shows details)

### 5.5 SMS Analytics

**Steps:**
1. Click **"SMS Analytics"** link in navigation

**Expected Results:**
- ✅ SMS analytics dashboard loads
- ✅ Shows delivery rates
- ✅ Campaign statistics visible
- ✅ Cost monitoring data displays
- ✅ Opt-out tracking shown

### 5.6 Tour Analytics

**Steps:**
1. Navigate to /admin/tour-analytics

**Expected Results:**
- ✅ Tour analytics dashboard loads
- ✅ Shows tour completion rates
- ✅ Step-by-step drop-off analysis
- ✅ Daily trend charts visible
- ✅ Per-tour performance breakdown

### 5.7 Chatbot Analytics

**Steps:**
1. Navigate to /admin/chatbot-analytics

**Expected Results:**
- ✅ Chatbot analytics dashboard loads
- ✅ Shows popular questions
- ✅ User satisfaction metrics
- ✅ Response times tracked
- ✅ Language distribution chart (EN/ES)

---

## Phase 6: SMS Notifications Testing

### 6.1 SMS Settings Access

**Steps:**
1. Click user dropdown in header
2. Select **"SMS Settings"**

**Expected Results:**
- ✅ SMS settings page loads
- ✅ Phone number input field visible
- ✅ Master SMS toggle visible
- ✅ 11 individual notification preference toggles

### 6.2 Phone Number Configuration

**Steps:**
1. Enter phone number in E.164 format: **+1XXXXXXXXXX**
2. Toggle **"Enable SMS Notifications"** to ON
3. Click **"Save Settings"**

**Expected Results:**
- ✅ Success message appears
- ✅ Phone number saved to database
- ✅ SMS notifications enabled

### 6.3 Notification Preferences

**Test Each Toggle:**
- ☑️ Assessment completed
- ☑️ High risk alert
- ☑️ Trial expiring
- ☑️ Subscription expiring
- ☑️ Subscription activated
- ☑️ Assessment reminder
- ☑️ Lab reminder
- ☑️ Improvement celebration
- ☑️ Weekly tips
- ☑️ Monthly reminder

**Expected Results:**
- ✅ Each toggle works independently
- ✅ Settings save correctly
- ✅ Changes persist after page refresh

### 6.4 SMS History

**Steps:**
1. Click **"View SMS History"** button
2. Review sent messages

**Expected Results:**
- ✅ SMS history page loads
- ✅ Shows all sent messages
- ✅ Displays delivery status (sent, delivered, failed)
- ✅ Timestamp for each message
- ✅ Message content visible

---

## Phase 7: Payment & Subscriptions Testing

### 7.1 Subscription Management

**Steps:**
1. Navigate to /subscription-management
2. Review current subscriptions

**Expected Results:**
- ✅ Subscription management page loads
- ✅ Shows active trials (EndoGuard, RxGuard)
- ✅ Trial end dates displayed
- ✅ "Upgrade Now" buttons visible

### 7.2 Plan Selection Modal

**Steps:**
1. Click **"Upgrade Now"** on EndoGuard™ trial

**Expected Results:**
- ✅ Plan selection modal opens
- ✅ Shows Premium ($49/month) and Premium Plus ($97/month)
- ✅ Feature comparison visible
- ✅ "14-day money-back guarantee" displayed

**DO NOT complete payment** - this is just a UI test

### 7.3 Stripe Checkout Test (Optional)

**If you want to test Stripe integration:**
1. Click "Start 14-Day Free Trial" button
2. Use Stripe test card: **4242 4242 4242 4242**
3. Expiry: Any future date
4. CVC: Any 3 digits

**Expected Results:**
- ✅ Redirects to Stripe Checkout
- ✅ Shows correct pricing
- ✅ Trial period displayed (14 or 30 days)
- ✅ After payment, redirects back to platform
- ✅ Subscription activated successfully

---

## Phase 8: Mobile Responsiveness Testing

### 8.1 Mobile Device Testing

**Test on:**
- 📱 iPhone (Safari)
- 📱 Android (Chrome)
- 📱 Tablet (iPad or Android tablet)

**Pages to Test:**
1. Homepage
2. EndoGuard™ assessment
3. RxGuard™ dashboard
4. Dashboard
5. Login/Signup pages

### 8.2 Mobile UI Checks

**What to Verify:**
- ✅ Navigation menu collapses to hamburger icon
- ✅ Platform cards stack vertically
- ✅ Text is readable (no tiny fonts)
- ✅ Buttons are tap-friendly (minimum 44px height)
- ✅ Forms are easy to fill on mobile
- ✅ No horizontal scrolling required
- ✅ Images scale properly
- ✅ Cosmic background animations work smoothly

### 8.3 Touch Interactions

**Test:**
- ✅ Tap buttons work correctly
- ✅ Swipe gestures work (if applicable)
- ✅ Dropdown menus open properly
- ✅ Modal dialogs display correctly
- ✅ Keyboard appears for input fields

---

## 🐛 Common Issues & Troubleshooting

### Issue 1: "Access Denied" Error

**Symptoms:** User sees "Access Denied - No active subscription found"

**Solutions:**
1. Verify you're logged in (check header for email)
2. Clear browser cache and cookies
3. Try incognito/private browsing mode
4. Check that trial was activated successfully
5. Contact support if issue persists

### Issue 2: Assessment Results Not Loading

**Symptoms:** Blank page or loading spinner doesn't disappear

**Solutions:**
1. Check browser console for errors (F12 → Console tab)
2. Verify internet connection is stable
3. Refresh the page (F5)
4. Try different browser
5. Check that OpenAI API is responding (admin analytics)

### Issue 3: PDF Download Not Working

**Symptoms:** PDF doesn't download or is blank

**Solutions:**
1. Check browser pop-up blocker settings
2. Allow downloads from nexusbiomedical.ai
3. Try different browser
4. Verify you're logged in
5. Check that html2pdf library loaded correctly

### Issue 4: Spanish Translation Not Showing

**Symptoms:** Content still in English after clicking "ES"

**Solutions:**
1. Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check that i18n library loaded (console)
4. Verify translation files exist in /src/locales/
5. Check localStorage for language preference

### Issue 5: SMS Not Sending

**Symptoms:** SMS notifications not received

**Solutions:**
1. Verify phone number is in E.164 format (+1XXXXXXXXXX)
2. Check SMS preferences are enabled
3. Verify Twilio account is active (admin panel)
4. Check SMS history for delivery status
5. Ensure phone number is verified

---

## 📊 Success Metrics

After completing the walkthrough, verify these key metrics:

| Metric | Target | Status |
|--------|--------|--------|
| Login Success Rate | 100% | ⬜ |
| EndoGuard™ Assessment Completion | 100% | ⬜ |
| RxGuard™ Interaction Analysis | 100% | ⬜ |
| Spanish Translation Coverage | 100% | ⬜ |
| PDF Export Success | 100% | ⬜ |
| Mobile Responsiveness | 100% | ⬜ |
| Admin Analytics Access | 100% | ⬜ |
| SMS Delivery Rate | >95% | ⬜ |

---

## 📝 Notes Section

Use this section to document any issues, bugs, or improvements needed:

**Issues Found:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Improvements Needed:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Questions for Development Team:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## ✅ Final Checklist

Before concluding the walkthrough, ensure:

- [ ] Admin account is working correctly
- [ ] Password has been changed from temporary password
- [ ] EndoGuard™ complete flow tested successfully
- [ ] RxGuard™ complete flow tested successfully
- [ ] Spanish translations verified
- [ ] Admin analytics accessible
- [ ] SMS notifications configured
- [ ] Mobile responsiveness confirmed
- [ ] All critical issues documented
- [ ] Platform is ready for live demonstrations

---

## 📞 Support Contact

If you encounter any issues during testing:

**Technical Support:**
- Email: support@nexusbiomedical.ai
- GitHub: https://github.com/ybob247-del

**Emergency Contact:**
- For critical production issues, contact Manus support immediately

---

**Document Version:** 1.0  
**Last Updated:** December 8, 2025  
**Next Review:** After YC interview preparation
