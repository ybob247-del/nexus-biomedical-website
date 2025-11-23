# Owner Quick Testing Guide
**Date:** November 23, 2025  
**Purpose:** Step-by-step testing checklist for Dr. Pamela to verify RxGuard and EndoGuard are ready for beta launch

---

## 🎯 Testing Goals

1. Verify both platforms work end-to-end
2. Test as a provider/user to understand the experience
3. Check different access tiers (free trial, paid, expired)
4. Confirm data persistence and database storage
5. Validate payment flows work correctly

**Estimated Time:** 2-3 hours

---

## 📋 Pre-Testing Setup

### What You'll Need

1. **Two email addresses** for testing:
   - Primary: Your real email (for main test account)
   - Secondary: Use Gmail alias like `youremail+test@gmail.com` (for additional testing)

2. **Stripe Test Card:**
   - Card Number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)

3. **Browser Setup:**
   - Use incognito/private window for testing (avoids cookie conflicts)
   - Test on desktop first, then mobile if time permits

4. **Database Access:**
   - Open Management Dashboard → Database panel
   - You'll use this to verify data is being saved correctly

---

## ✅ TEST 1: EndoGuard Assessment (Hybrid Freemium Model)

### Step 1: Test Anonymous Access
1. Open incognito window
2. Go to: `www.nexusbiomedical.ai/endoguard/assessment`
3. **✓ VERIFY:** Page loads WITHOUT asking you to log in
4. **✓ VERIFY:** You see "Step 1 of 6" and the assessment form

### Step 2: Complete Assessment
1. Fill out all 6 steps with realistic data:
   - **Step 1:** Age (e.g., 35), Biological Sex (Female)
   - **Step 2:** Menstrual status, symptoms with severity ratings
   - **Step 3:** Lifestyle (diet, exercise, sleep, stress levels)
   - **Step 4:** Exposure assessment (plastics, processed foods, personal care products)
   - **Step 5:** Health history
   - **Step 6:** Review and submit

2. Click "Next" after each step
3. **✓ VERIFY:** Progress bar updates (Step 1 of 6 → Step 2 of 6, etc.)
4. On final step, click "Analyze My Risk"

### Step 3: Review Results
1. **✓ VERIFY:** Risk score displays (0-100 scale)
2. **✓ VERIFY:** Risk level shows (High/Moderate/Low) with color coding
3. **✓ VERIFY:** Personalized recommendations appear
4. **✓ VERIFY:** FDA disclaimer is visible at bottom
5. **✓ VERIFY:** Signup prompt appears (e.g., "Create account to save results")

### Step 4: Create Account & Save Results
1. Click signup button from results page
2. Create account with your primary email
3. **✓ VERIFY:** You're redirected back to results OR dashboard
4. **✓ VERIFY:** You're now logged in (see user name/icon in header)

### Step 5: Check Saved Assessments
1. Navigate to `/my-assessments` (or click "My Assessments" button)
2. **✓ VERIFY:** Your completed assessment appears in the list
3. **✓ VERIFY:** Shows date, risk score, and risk level
4. Complete a SECOND assessment with different data
5. Return to `/my-assessments`
6. **✓ VERIFY:** Both assessments appear
7. **✓ VERIFY:** Risk trend chart shows two data points

### Step 6: Test PDF Export
1. On My Assessments page, click "Export PDF" button
2. **✓ VERIFY:** PDF downloads to your computer
3. Open the PDF
4. **✓ VERIFY:** Contains Nexus Biomedical branding
5. **✓ VERIFY:** Shows your risk score, date, and disclaimers
6. **✓ VERIFY:** PDF is professionally formatted

### Step 7: Verify Database Storage
1. Open Management Dashboard → Database panel
2. Query `assessment_history` table (or search for your user)
3. **✓ VERIFY:** Your two assessments are saved
4. **✓ VERIFY:** Timestamps are correct

---

## ✅ TEST 2: RxGuard Dashboard (Paid Platform)

### Step 1: Access Dashboard
1. While logged in, go to: `www.nexusbiomedical.ai/rxguard/dashboard`
2. **✓ VERIFY:** TrialGate allows access (you have 14-day free trial)
3. **✓ VERIFY:** Trial countdown banner shows "X days remaining"
4. **✓ VERIFY:** Dashboard loads with medication interface

### Step 2: Add Medications
1. Use the search box to add these medications:
   - Aspirin
   - Metformin
   - Lisinopril
   - Atorvastatin
   - Warfarin

2. For each medication:
   - **✓ VERIFY:** Search autocomplete works
   - **✓ VERIFY:** Medication appears in your list after adding

3. **✓ VERIFY:** Total medication count updates (should show 5)

### Step 3: Check Interactions
1. After adding 5+ medications, view interaction analysis
2. **✓ VERIFY:** Interactions display with severity levels:
   - High risk (red)
   - Moderate risk (orange)
   - Low risk (green)

3. Click on an interaction
4. **✓ VERIFY:** Detailed information appears (drug pair, recommendations)

### Step 4: Test Data Persistence
1. Log out (use logout button in header)
2. Log back in with same account
3. Navigate to `/rxguard/dashboard`
4. **✓ VERIFY:** Your medication list is still there (all 5 medications)

### Step 5: Verify Database Storage
1. Open Management Dashboard → Database panel
2. Query `user_medication_lists` table
3. **✓ VERIFY:** Your medications are saved
4. **✓ VERIFY:** User ID matches your account

### Step 6: Check Trial Record
1. In Database panel, query `platform_trials` table
2. Filter by your user ID or email
3. **✓ VERIFY:** Two trial records exist:
   - RxGuard: 14-day trial, status = 'active'
   - EndoGuard: 30-day trial, status = 'active'
4. **✓ VERIFY:** Trial end dates are in the future

---

## ✅ TEST 3: Provider/Tier Access Testing

### Test Different User States

#### State 1: Active Free Trial (Already Tested Above)
- ✓ Can access RxGuard dashboard
- ✓ Trial banner shows days remaining

#### State 2: Expired Trial (Simulate)
1. In Database panel, edit your RxGuard trial record
2. Change `trial_end_date` to yesterday's date
3. Change `trial_status` to 'expired'
4. Refresh `/rxguard/dashboard`
5. **✓ VERIFY:** Payment gate appears
6. **✓ VERIFY:** Message says "Your trial has expired" or similar
7. **✓ VERIFY:** "Subscribe Now" or "Upgrade" button appears

#### State 3: Paid Subscription (Test Stripe)
1. Click "Subscribe Now" button
2. **✓ VERIFY:** Stripe checkout page loads
3. Enter test card details:
   - Card: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVC: 123
   - ZIP: 12345
4. Complete payment
5. **✓ VERIFY:** Redirected back to dashboard
6. **✓ VERIFY:** Can now access RxGuard (no payment gate)
7. **✓ VERIFY:** Trial banner is gone or shows "Active Subscription"

#### State 4: Subscription Management
1. Navigate to Stripe Customer Portal (link should be in account settings or dashboard)
2. **✓ VERIFY:** Can view subscription details
3. **✓ VERIFY:** Can update payment method
4. **✓ VERIFY:** Can cancel subscription (DON'T actually cancel unless testing)

---

## ✅ TEST 4: Cross-Platform & Navigation

### Desktop Testing
1. Test on Chrome, Firefox, and Safari (if available)
2. **✓ VERIFY:** All features work on each browser
3. **✓ VERIFY:** No console errors (open Developer Tools → Console)

### Mobile Testing (If Time Permits)
1. Open site on mobile device (iOS or Android)
2. **✓ VERIFY:** Responsive design works
3. **✓ VERIFY:** Forms are easy to fill on mobile
4. **✓ VERIFY:** Buttons are large enough to tap

### Navigation Testing
1. Test these navigation flows:
   - Homepage → Platforms page → EndoGuard
   - Homepage → RxGuard → Dashboard
   - Dashboard → My Assessments → Homepage
   - Login → Dashboard → Logout → Homepage

2. **✓ VERIFY:** All navigation works smoothly
3. **✓ VERIFY:** No broken links
4. **✓ VERIFY:** Logout works from any page

---

## 📊 Database Verification Checklist

Open Management Dashboard → Database and verify these tables have data:

- [ ] `users` - Your test account exists
- [ ] `platform_trials` - Two trial records (RxGuard, EndoGuard)
- [ ] `assessment_history` - Your EndoGuard assessments saved
- [ ] `user_medication_lists` - Your RxGuard medications saved
- [ ] `subscriptions` - If you completed Stripe test, subscription record exists

---

## 🐛 What to Report If Something Breaks

For each issue you find, note:

1. **What you were doing** (e.g., "Adding medication to RxGuard")
2. **What you expected** (e.g., "Medication should appear in list")
3. **What actually happened** (e.g., "Got error message 'Failed to save'")
4. **Screenshot** (if possible)
5. **Browser/device** (e.g., "Chrome on Mac" or "Safari on iPhone")

Send all issues to Manus AI for immediate fixing.

---

## ✅ Testing Complete!

Once you've completed all tests above, you'll have verified:

- ✅ EndoGuard hybrid freemium model works (anonymous access → signup prompt)
- ✅ RxGuard dashboard works with trial gating
- ✅ Data persistence (assessments and medications saved)
- ✅ Database storage confirmed
- ✅ Payment flow works (Stripe integration)
- ✅ Different user tiers work correctly (trial, expired, paid)
- ✅ Navigation and cross-platform compatibility

**You're ready for beta launch!** 🚀

---

## 🎯 Next Steps After Testing

1. **If all tests pass:** Proceed with beta launch planning
2. **If issues found:** Report to Manus AI for immediate fixes
3. **Beta user preparation:** Prepare welcome emails and onboarding materials
4. **Marketing:** Schedule LinkedIn announcement and beta invitations

---

**Questions?** Contact Manus AI for support during testing.
