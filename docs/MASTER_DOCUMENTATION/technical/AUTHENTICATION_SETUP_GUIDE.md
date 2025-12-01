# 🔒 Full Authentication System - Setup Guide

## ✅ WHAT'S BEEN IMPLEMENTED

Your Nexus Biomedical Intelligence website now has a complete authentication system with:

### **Backend (API Routes)**
- ✅ User signup (`/api/auth/signup`)
- ✅ User login (`/api/auth/login`)
- ✅ Get current user (`/api/auth/me`)
- ✅ Check platform access (`/api/access/check`)
- ✅ Stripe webhook integration (grants/revokes access automatically)

### **Frontend (React Components)**
- ✅ Authentication context (manages user state)
- ✅ Protected route component (blocks unauthorized access)
- ✅ Login page
- ✅ Signup page
- ✅ User dashboard (view subscriptions, access platforms)

### **Database Schema**
- ✅ Users table
- ✅ Subscriptions table
- ✅ Platform access table
- ✅ Sessions table
- ✅ Audit log table

### **Security Features**
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens (7-day expiration)
- ✅ User-specific checkout sessions
- ✅ Subscription verification before platform access
- ✅ Automatic access revocation on cancellation

---

## 🚀 DEPLOYMENT STEPS

### **Step 1: Set Up PostgreSQL Database**

You need a PostgreSQL database. **Recommended: Vercel Postgres** (free tier available)

1. Go to your Vercel project dashboard
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Click **"Create"**
6. Vercel will automatically add `DATABASE_URL` to your environment variables

**Alternative:** Use [Supabase](https://supabase.com) or [Neon](https://neon.tech) (both have free tiers)

---

### **Step 2: Initialize Database Schema**

Once you have a database URL, run the schema:

```bash
# Option A: Using psql command line
psql $DATABASE_URL < database-schema.sql

# Option B: Using Vercel Postgres UI
# 1. Go to Vercel → Storage → Your Database → Query
# 2. Copy/paste the contents of database-schema.sql
# 3. Click "Run"
```

The schema file is located at: `/home/ubuntu/nexus-biomedical-website/database-schema.sql`

---

### **Step 3: Add Environment Variables to Vercel**

Go to Vercel → Your Project → Settings → Environment Variables

Add these variables:

```
DATABASE_URL=<your-postgres-connection-string>
STRIPE_SECRET_KEY=sk_test_51SLg6qFPe0gPk8JcMuwMOwAjlKp4c5lEAG6DHs12bAptqjVe6MMnxxvuiC0QqukNcfXgWvpjPta4gRrlni2vV0tM00nOrxXrxZ
STRIPE_WEBHOOK_SECRET=whsec_2fndxAqzPjD7We3SZHwjicJoKYdJ4k2y
JWT_SECRET=<generate-a-random-32-character-string>
```

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### **Step 4: Update App.jsx to Include New Routes**

Add the authentication routes and wrap your app with AuthProvider.

**File:** `src/App.jsx`

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Home from './pages/Home'; // Your existing homepage
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Import platform pages (you'll need to create these or use existing ones)
import RxGuard from './pages/RxGuard';
import ReguReady from './pages/ReguReady';
import ClinicalIQ from './pages/ClinicalIQ';
import PediCalc from './pages/PediCalc';
import SkinSense from './pages/SkinSense';
import DiagnoVision from './pages/DiagnoVision';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute platform="Dashboard">
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Platform routes - all protected */}
          <Route path="/rxguard" element={
            <ProtectedRoute platform="RxGuard">
              <RxGuard />
            </ProtectedRoute>
          } />
          
          <Route path="/reguready" element={
            <ProtectedRoute platform="ReguReady">
              <ReguReady />
            </ProtectedRoute>
          } />
          
          <Route path="/clinicaliq" element={
            <ProtectedRoute platform="ClinicalIQ">
              <ClinicalIQ />
            </ProtectedRoute>
          } />
          
          <Route path="/pedicalc" element={
            <ProtectedRoute platform="PediCalc Pro">
              <PediCalc />
            </ProtectedRoute>
          } />
          
          <Route path="/skinsense" element={
            <ProtectedRoute platform="SkinSense AI">
              <SkinSense />
            </ProtectedRoute>
          } />
          
          <Route path="/diagnovision" element={
            <ProtectedRoute platform="DiagnoVision">
              <DiagnoVision />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

### **Step 5: Update Stripe Checkout to Include Platform Metadata**

Update your `create-checkout-session.js` to include platform name:

```javascript
const session = await stripe.checkout.sessions.create({
  // ... existing code ...
  metadata: {
    platform: 'RxGuard', // or whatever platform they're subscribing to
  },
});
```

---

### **Step 6: Deploy to Vercel**

```bash
cd /home/ubuntu/nexus-biomedical-website
git add .
git commit -m "Add full authentication system"
git push
```

Vercel will automatically deploy your changes.

---

## 🧪 TESTING THE SYSTEM

### **Test Flow:**

1. **Go to your website** (https://nexusbiomedical.ai)
2. **Click "Sign Up"** → Create an account
3. **You'll be redirected to Dashboard** (no subscriptions yet)
4. **Click "View Pricing"** → Select a platform
5. **Complete Stripe checkout** (use test card: 4242 4242 4242 4242)
6. **Stripe webhook fires** → Grants access automatically
7. **Return to Dashboard** → You'll see your subscription
8. **Click "Launch Platform"** → Access granted!

### **Test Access Control:**

1. **Try accessing a platform URL directly** (e.g., /rxguard)
2. **If not logged in** → Redirected to login
3. **If logged in but no subscription** → Access denied, redirected to pricing
4. **If logged in with subscription** → Platform loads!

---

## 🔒 SECURITY FEATURES

### **What's Protected:**

✅ **Payment links** - User-specific, cannot be shared  
✅ **Platform access** - Requires login + active subscription  
✅ **User data** - Passwords hashed, JWT tokens expire  
✅ **Subscription status** - Verified on every platform access  

### **What Happens When:**

**User pays:**
- Stripe webhook creates/updates user account
- Grants access to purchased platform
- Access expires at subscription end date

**Subscription cancelled:**
- Stripe webhook revokes platform access
- User can still login but cannot access platforms

**Subscription expires:**
- Access automatically revoked at period end
- User must renew to regain access

---

## 📊 DATABASE MANAGEMENT

### **View Users:**
```sql
SELECT id, email, first_name, last_name, created_at FROM users;
```

### **View Subscriptions:**
```sql
SELECT u.email, s.platform, s.status, s.current_period_end
FROM subscriptions s
JOIN users u ON s.user_id = u.id;
```

### **View Platform Access:**
```sql
SELECT u.email, pa.platform, pa.is_active, pa.access_expires_at
FROM platform_access pa
JOIN users u ON pa.user_id = u.id;
```

### **Manually Grant Access (for testing):**
```sql
-- First, find the user ID
SELECT id FROM users WHERE email = 'test@example.com';

-- Create a subscription (replace user_id with actual ID)
INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, stripe_price_id, platform, status, current_period_end)
VALUES (1, 'cus_test', 'sub_test', 'price_test', 'RxGuard', 'active', NOW() + INTERVAL '30 days');

-- Grant platform access
INSERT INTO platform_access (user_id, platform, subscription_id, access_expires_at, is_active)
VALUES (1, 'RxGuard', (SELECT id FROM subscriptions WHERE stripe_subscription_id = 'sub_test'), NOW() + INTERVAL '30 days', true);
```

---

## 🐛 TROUBLESHOOTING

### **"Authentication required" error:**
- Check if JWT_SECRET is set in Vercel environment variables
- Check if token is being stored in localStorage (browser dev tools → Application → Local Storage)

### **"No active subscription" error:**
- Check if Stripe webhook is firing (Stripe Dashboard → Webhooks → Event deliveries)
- Check if webhook secret is correct in Vercel environment variables
- Check database: `SELECT * FROM subscriptions WHERE user_id = X;`

### **"Database connection error":**
- Check if DATABASE_URL is set in Vercel environment variables
- Check if database schema has been initialized
- Check database connection string format

### **Platform still accessible without login:**
- Make sure you wrapped the route with `<ProtectedRoute>`
- Make sure AuthProvider is wrapping your entire app
- Check browser console for errors

---

## ✅ CHECKLIST BEFORE LAUNCH

- [ ] PostgreSQL database created
- [ ] Database schema initialized
- [ ] All environment variables added to Vercel
- [ ] JWT_SECRET generated and added
- [ ] Stripe webhook configured and working
- [ ] App.jsx updated with AuthProvider and routes
- [ ] All 6 platforms wrapped with ProtectedRoute
- [ ] Tested signup flow
- [ ] Tested login flow
- [ ] Tested payment flow
- [ ] Tested platform access control
- [ ] Tested subscription cancellation

---

## 🎯 NEXT STEPS

1. **Create platform pages** (RxGuard, ReguReady, etc.) if they don't exist yet
2. **Add password reset functionality** (optional)
3. **Add email verification** (optional)
4. **Switch to live Stripe keys** when ready for production
5. **Add customer portal** for users to manage subscriptions

---

## 📞 NEED HELP?

If you encounter any issues:
1. Check the browser console for errors
2. Check Vercel deployment logs
3. Check Stripe webhook event deliveries
4. Check database tables for data

**Everything is ready to go! Just follow the deployment steps above.** 🚀

