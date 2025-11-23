# Authentication Safeguards Audit
**Date:** November 23, 2025  
**Purpose:** Document all authentication mechanisms to prevent accidental blocking of intended user access

---

## Summary

This audit identifies all authentication safeguards in the codebase and their intended purpose. This documentation prevents future issues where authentication blocks unintended routes.

---

## Authentication Components

### 1. ProtectedRoute Component
**Location:** `/src/components/ProtectedRoute.jsx`

**Purpose:** Route-level authentication wrapper that checks if user is logged in and has platform access

**Current Usage:**
- `/rxguard/dashboard` - ✅ **CORRECT** (dashboard requires login to save medication lists)

**How it works:**
- Checks `isAuthenticated` from AuthContext
- Redirects to `/login?redirect={current_path}` if not authenticated
- Optionally checks platform-specific access with `checkPlatformAccess(platform)`

---

### 2. TrialGate Component
**Location:** `/src/components/TrialGate.jsx`

**Purpose:** Component-level authentication wrapper that checks trial/subscription status

**Current Usage:**
- `RxGuardDashboard.jsx` (line 176) - ✅ **CORRECT** (dashboard requires paid access)
- ~~`EndoGuardAssessment.jsx`~~ - ❌ **REMOVED** (assessment should be free/anonymous)

**How it works:**
- Checks if user is logged in
- Redirects to `/login?redirect={current_path}` if not authenticated
- Checks trial/subscription status via `/api/trial?action=check-access`
- Checks platform-specific access via `/api/platform-access/check?platform={platform}`

**⚠️ CRITICAL:** TrialGate is MORE restrictive than ProtectedRoute because it also checks subscription status

---

### 3. AdminProtectedRoute Component
**Location:** `/src/components/AdminProtectedRoute.jsx`

**Purpose:** Password-protected admin routes (simple password check, not user authentication)

**Current Usage:**
- Admin routes (waitlist management, analytics, etc.)

**How it works:**
- Checks sessionStorage for `admin_authenticated` flag
- Prompts for password if not authenticated
- Does NOT use user authentication system

---

## Routes Requiring Authentication

### ✅ SHOULD Require Login (Paid Features)

| Route | Component | Protection | Reason |
|-------|-----------|------------|--------|
| `/rxguard/dashboard` | RxGuardDashboard | ProtectedRoute + TrialGate | Saves medication lists, requires subscription |
| `/my-assessments` | MyAssessments | Manual check (useEffect) | Shows saved assessment history |

### ✅ SHOULD NOT Require Login (Free/Freemium Features)

| Route | Component | Protection | Reason |
|-------|-----------|------------|--------|
| `/endoguard/assessment` | EndoGuardAssessment | ~~TrialGate~~ REMOVED | Hybrid freemium - free assessment, paid features gated later |
| `/` | Homepage | None | Public landing page |
| `/about` | About | None | Public information page |
| `/login` | Login | None | Authentication page |
| `/signup` | Signup | None | Registration page |
| `/beta-signup` | BetaSignup | None | Waitlist signup |
| `/platforms` | PlatformsPage | None | Public platform showcase |

---

## Hybrid Freemium Model (EndoGuard)

**Strategy:** Allow anonymous users to take the full assessment, then gate premium features behind signup

**Implementation:**
1. ❌ **DO NOT** wrap component in `<TrialGate>`
2. ❌ **DO NOT** wrap route in `<ProtectedRoute>`
3. ✅ **DO** check `user` state within component to conditionally show premium features
4. ✅ **DO** show signup prompts at strategic points (after results, before PDF download)

**Premium Features (require signup):**
- PDF export of results
- Saving assessment history
- Personalized recommendations over time

**Free Features (no signup required):**
- Complete 6-step assessment
- View EDC exposure risk score
- See basic test recommendations

---

## Future Platform Rollout Checklist

When adding new platforms, decide the monetization model:

### Option A: Fully Paid (like RxGuard Dashboard)
```jsx
// In App.jsx
<Route 
  path="/platform/feature" 
  element={
    <ProtectedRoute platform="platform-name">
      <PlatformComponent />
    </ProtectedRoute>
  } 
/>

// In PlatformComponent.jsx
return (
  <TrialGate platform="PlatformName">
    <div>...</div>
  </TrialGate>
);
```

### Option B: Hybrid Freemium (like EndoGuard Assessment)
```jsx
// In App.jsx
<Route 
  path="/platform/assessment" 
  element={<PlatformAssessment />}
/>

// In PlatformAssessment.jsx
// NO TrialGate wrapper!
// Check user state for premium features only
return (
  <div>
    {/* Free content */}
    {user ? (
      <button onClick={downloadPDF}>Download PDF</button>
    ) : (
      <SignupPrompt />
    )}
  </div>
);
```

---

## Common Mistakes to Avoid

1. ❌ **Adding TrialGate to freemium assessment pages**
   - This blocks ALL access, not just premium features
   - Use conditional rendering instead

2. ❌ **Forgetting to remove BOTH ProtectedRoute AND TrialGate**
   - Check route-level (App.jsx) AND component-level (component file)
   - TrialGate is often hidden deep in the component

3. ❌ **Using TrialGate when you only need ProtectedRoute**
   - TrialGate checks subscription status (more restrictive)
   - ProtectedRoute only checks if user is logged in

4. ❌ **Not testing on production after deployment**
   - Always test authentication flows on live site
   - CDN caching can hide issues temporarily

---

## Testing Checklist

Before deploying authentication changes:

- [ ] Test route in incognito/private browser (logged out)
- [ ] Test route with logged-in user
- [ ] Test route with expired trial/subscription
- [ ] Check BOTH App.jsx routing AND component file
- [ ] Verify no TrialGate wrapper on freemium pages
- [ ] Test on production after deployment

---

## Maintenance

**Last Updated:** November 23, 2025  
**Next Review:** Before adding new platform features  
**Owner:** Development Team

**Update this document when:**
- Adding new authentication-protected routes
- Changing monetization model for existing features
- Adding new authentication components
- Discovering authentication-related bugs
