# Stripe Payment Integration Test Plan
**Date:** October 30, 2025  
**Status:** ✅ Payment Links Integrated (TEST MODE)

---

## Integration Complete

All 11 Stripe payment links have been successfully integrated into the website:

### ✅ Integrated Payment Links:

1. **RxGuard™ Professional** ($49/mo) → `https://buy.stripe.com/test_7sYbJ1cg5ajR3HKge1aMU06`
2. **ReguReady™ Starter** ($199/mo) → `https://buy.stripe.com/test_9B6cN50xn77FbacbXLaMU07`
3. **ReguReady™ Professional** ($399/mo) → `https://buy.stripe.com/test_8x23cvcg5crZ5PSf9XaMU08`
4. **ClinicalIQ™ Starter** ($299/mo) → `https://buy.stripe.com/test_6oUaEX6VLcrZ4LO1j7aMU09`
5. **ClinicalIQ™ Professional** ($699/mo) → `https://buy.stripe.com/test_bJe3cv0xn0Jhceg1j7aMU0a`
6. **ElderWatch™ Home Care** ($49/mo) → `https://buy.stripe.com/test_8x25kDdk977F2DG1j7aMU0b`
7. **ElderWatch™ Facility** ($199/mo) → `https://buy.stripe.com/test_dRmfZh7ZPfEbfqs0f3aMU0c`
8. **PediCalc Pro™ Individual** ($19.99/mo) → `https://buy.stripe.com/test_fZu6oH3JzgIfemo5znaMU0f`
9. **PediCalc Pro™ Group** ($14.99/mo) → `https://buy.stripe.com/test_bJe3cveod63B4LO2nbaMU0e`
10. **SkinScan Pro™ Individual** ($59/mo) → `https://buy.stripe.com/test_aFaeVd2FvbnV5PS9PDaMU0g`
11. **SkinScan Pro™ Group** ($49/mo) → `https://buy.stripe.com/test_9B6cN51Br0Jh4LO8LzaMU0h`

---

## Testing Checklist

### Phase 1: Button Functionality (After Deployment)
- [ ] Visit https://nexusbiomedical.ai (wait 2-3 min for Vercel deployment)
- [ ] Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- [ ] Test each platform's "Start Free Trial" button:
  - [ ] RxGuard™ Professional
  - [ ] ReguReady™ Starter
  - [ ] ReguReady™ Professional
  - [ ] ClinicalIQ™ Starter
  - [ ] ClinicalIQ™ Professional
  - [ ] ElderWatch™ Home Care
  - [ ] ElderWatch™ Facility
  - [ ] PediCalc Pro™ Individual
  - [ ] PediCalc Pro™ Group
  - [ ] SkinScan Pro™ Individual
  - [ ] SkinScan Pro™ Group

### Phase 2: Stripe Checkout Flow
For each payment link, verify:
- [ ] Clicking button opens Stripe checkout in new tab
- [ ] Correct product name displays
- [ ] Correct price displays
- [ ] Correct trial period displays (7-day or 14-day)
- [ ] Payment form loads properly
- [ ] Can enter test card: 4242 4242 4242 4242
- [ ] Can complete test checkout
- [ ] Redirects to success page after checkout

### Phase 3: LearnMore Page Integration
- [ ] Visit each platform's "Learn More" page
- [ ] Verify pricing tiers display correctly
- [ ] Test "Start Free Trial" buttons on pricing cards
- [ ] Test tier selection buttons (Starter/Professional)
- [ ] Verify correct Stripe link opens for each tier

### Phase 4: Demo Page Integration
- [ ] Complete interactive demo for each platform
- [ ] Verify "Start Free Trial" button appears on results screen
- [ ] Test button opens correct Stripe checkout
- [ ] Verify pricing matches the tier

---

## Test Card Numbers (Stripe Test Mode)

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Declined Payment:**
- Card: `4000 0000 0000 0002`

**Requires Authentication:**
- Card: `4000 0025 0000 3155`

---

## Expected Behavior

### ✅ Correct Behavior:
1. Button click opens Stripe checkout in NEW TAB
2. Stripe page shows correct product name and price
3. Free trial period displayed prominently
4. Can complete checkout with test card
5. Success page displays after checkout
6. No console errors

### ❌ Incorrect Behavior:
1. Button does nothing when clicked
2. Alert message: "This payment option is being set up..."
3. Wrong product/price displays in Stripe
4. Checkout page doesn't load
5. Console errors appear
6. Redirect fails after checkout

---

## Current Status

**✅ COMPLETED:**
- All 11 payment links integrated into `stripePaymentLinks.js`
- Build succeeds with no errors
- Code committed and pushed to GitHub
- Vercel auto-deployment triggered

**⏳ WAITING:**
- Vercel deployment to complete (2-3 minutes)
- User testing and verification

**❌ TODO:**
- Replace TEST mode links with LIVE mode links before production
- Test all 11 payment flows end-to-end
- Verify success/cancel redirects
- Set up webhook handlers for subscription events (optional)

---

## Switching to Production Mode

When ready to accept real payments:

1. **Create LIVE payment links in Stripe:**
   - Follow same process as test links
   - Use LIVE mode instead of TEST mode
   - Copy all 11 LIVE payment link URLs

2. **Update stripePaymentLinks.js:**
   - Replace all `test_` URLs with `live_` URLs
   - Commit and push changes

3. **Test with real card:**
   - Use actual credit card (will charge real money)
   - Verify subscription created in Stripe Dashboard
   - Verify customer receives confirmation email
   - Cancel test subscription immediately

4. **Monitor Stripe Dashboard:**
   - Watch for successful payments
   - Check for failed payments
   - Monitor subscription renewals
   - Handle customer support issues

---

## Support & Troubleshooting

**If buttons don't work:**
1. Check browser console for errors
2. Verify Stripe links are not placeholders
3. Clear browser cache and hard refresh
4. Test in incognito/private mode
5. Try different browser

**If Stripe checkout doesn't load:**
1. Verify Stripe payment link is active
2. Check Stripe Dashboard for link status
3. Ensure link hasn't been deactivated
4. Try accessing link directly in browser

**If payment fails:**
1. Use correct test card number (4242...)
2. Verify Stripe account is in test mode
3. Check Stripe logs for error messages
4. Ensure payment link settings are correct

---

## Next Steps

1. **Wait 2-3 minutes** for Vercel deployment
2. **Hard refresh** https://nexusbiomedical.ai
3. **Test all 11 payment links** using checklist above
4. **Report any issues** found during testing
5. **Approve for production** once all tests pass

---

**Questions?** Contact support or review Stripe Dashboard for detailed logs.

