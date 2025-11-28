# Bug Report - User Testing (November 27, 2025)

## Testing Environment
- **Device:** Mobile (Samsung Internet browser)
- **URL:** https://www.nexusbiomedical.ai
- **Tester:** Owner (Dr. Pamela)

---

## 🚨 CRITICAL BUGS IDENTIFIED

### BUG #1: Login Page Shows "Welcome Back" for All Users
**Severity:** Medium  
**Status:** CONFIRMED  
**Location:** `/src/pages/Login.jsx` line 49

**Description:**  
The login page displays "Welcome Back" as the heading for ALL users, including first-time visitors. This is confusing UX because "Welcome Back" implies the user is a returning customer.

**Current Code:**
```jsx
<h2>{t('auth.welcomeBack')}</h2>
```

**Expected Behavior:**  
Should say "Sign In" or "Welcome" for generic login page.

**Fix Priority:** HIGH

---

### BUG #2: "Welcome Back" Message When Creating New Account
**Severity:** High  
**Status:** REPORTED (needs verification)  
**Location:** Unknown - possibly signup flow or email validation

**Description:**  
When user tries to create a NEW account with ybob247@gmail.com, the system shows "Welcome back" message instead of allowing account creation.

**Possible Causes:**
1. Email already exists in database (should show "Email already registered" error)
2. Login/Signup page routing issue
3. Form validation incorrectly treating new signups as logins

**Fix Priority:** CRITICAL

---

### BUG #3: Post-Login Interface "Looks Bad"
**Severity:** High  
**Status:** REPORTED (needs verification)  
**Location:** Dashboard or post-login redirect page

**Description:**  
After successful login, the interface appears broken or poorly styled on mobile.

**Possible Causes:**
1. Mobile responsive CSS issues on Dashboard
2. Missing CSS files or broken imports
3. Layout breaking on small screens
4. Elements overlapping or misaligned

**Fix Priority:** HIGH

---

### BUG #4: "Start Free Trial" Goes to Blank Page
**Severity:** High  
**Status:** NOT REPRODUCED (needs more info)  
**Location:** Unknown - which "Start Free Trial" button?

**Description:**  
Clicking "Start Free Trial" button navigates to a blank page.

**Testing Results:**
- ✅ Homepage "Start Free Trial" → Works (goes to /signup)
- ✅ RxGuard page "Start Free Trial" → Works (goes to /signup)
- ✅ Pricing page "Start Free Trial" → Works (goes to /signup)

**Possible Causes:**
1. Specific platform's "Start Free Trial" button has wrong route
2. Mobile-specific JavaScript error preventing page load
3. Deployment issue (production vs dev difference)

**Fix Priority:** HIGH (once identified)

---

### BUG #5: "Learn More" Message Appears and Disappears
**Severity:** Medium  
**Status:** REPORTED (needs verification)  
**Location:** Unknown - which "Learn More" button?

**Description:**  
When clicking "Learn More" → "Start Free Trial", a message appears briefly then disappears.

**Possible Causes:**
1. Toast notification with too-short duration
2. Modal that auto-closes
3. Error message flashing
4. JavaScript timing issue

**Fix Priority:** MEDIUM

---

## 🔍 TESTING NOTES

### What Works ✅
- Signup page loads correctly with "Get Started" heading
- "Start Free Trial" buttons on tested pages route correctly to /signup
- Pricing pages display properly
- Navigation between pages works

### What Needs Investigation ❓
- Actual login flow (need to test with real credentials)
- Dashboard page on mobile
- All "Learn More" buttons (need to test each platform)
- Email validation logic in signup
- Deployment differences between dev and production

---

## 📋 NEXT STEPS

1. **Fix BUG #1** - Change "Welcome Back" to "Sign In" on login page
2. **Investigate BUG #2** - Test signup flow with ybob247@gmail.com
3. **Test BUG #3** - Login and check Dashboard on mobile
4. **Find BUG #4** - Test all "Start Free Trial" buttons systematically
5. **Find BUG #5** - Test all "Learn More" buttons systematically
6. **Deploy fixes** - Push to production and verify
7. **Retest on mobile** - Have owner retest all flows

---

## 🎯 DEPLOYMENT STATUS

**Latest Production Deployment:**  
- Commit: `9508419f` (Dec 23, 2024)
- Status: READY
- Note: Current checkpoint `f2a8cfeb` (Compare/Testimonials) NOT YET DEPLOYED

**Action Required:**  
Owner needs to click "Publish" button in Management UI to deploy latest changes.


---

## 🔧 FIXES APPLIED (November 28, 2025)

### ✅ BUG #1 FIXED
**Change:** Login page heading changed from "Welcome Back" to "Sign In"  
**File:** `/src/pages/Login.jsx` line 49  
**Status:** Fixed in development, ready for deployment

### ✅ BUG #2 RESOLVED  
**Finding:** This was the same issue as BUG #1. The "Welcome back" message user saw was from the login page, not a signup error. The signup API correctly returns "User with this email already exists" error message.

### ⚠️ REMAINING ISSUES TO INVESTIGATE

**BUG #3: Post-Login Interface**  
- Need to test actual login flow on mobile to see Dashboard
- Dashboard code appears to have proper responsive classes
- May be a production deployment issue

**BUG #4 & #5: Start Free Trial / Learn More buttons**  
- Tested several buttons - all work correctly on dev server
- May be specific to certain platforms or production deployment
- Need user to identify which specific button causes the issue

---

## 📱 MOBILE TESTING RECOMMENDATIONS

1. **Test on dev server first:** https://3006-xxx.manusvm.computer
2. **Then publish and test production:** www.nexusbiomedical.ai
3. **Specific flows to test:**
   - Create new account with test email
   - Login with existing account
   - Click each platform's "Learn More" button
   - Click each "Start Free Trial" button
   - Check Dashboard on mobile after login

---

## 🚀 DEPLOYMENT CHECKLIST

- [x] Fix BUG #1 (Welcome Back → Sign In)
- [ ] Test fixes on dev server
- [ ] Save checkpoint
- [ ] Click "Publish" button in Management UI
- [ ] Wait for Vercel deployment (2-3 minutes)
- [ ] Test on production (www.nexusbiomedical.ai)
- [ ] Owner mobile retest
