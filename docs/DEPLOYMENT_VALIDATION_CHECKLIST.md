# DEPLOYMENT VALIDATION CHECKLIST (Vercel)
**Source:** ChatGPT Blueprint (https://chatgpt.com/share/6900aa2f-b2cc-8010-85b8-caf873415805)  
**Date:** October 30, 2025  
**Website:** https://nexusbiomedical.ai

---

## Priority: High

### Build & Deployment
- [ ] ✅ Build succeeds on Vercel (prod env)
- [ ] ✅ No build errors or warnings
- [ ] ✅ Environment variables properly set

### Navigation & Links
- [ ] ✅ All nav links resolve (Home, Suite, 6 Apps, About, Contact)
- [ ] ✅ Home page loads correctly
- [ ] ✅ All 6 platform pages accessible:
  - [ ] RxGuard™
  - [ ] ReguReady™
  - [ ] ClinicalIQ™
  - [ ] ElderWatch™
  - [ ] PediCalc Pro™
  - [ ] SkinScan Pro™
- [ ] ✅ About page exists and loads
- [ ] ✅ Contact page exists and loads
- [ ] ✅ No broken links (404 errors)

### Demo Interactivity
- [ ] ✅ Demo interactivity works (tooltips/override, exports, upload sims)
- [ ] ✅ RxGuard™ interactive demo functional
- [ ] ✅ ReguReady™ interactive demo functional
- [ ] ✅ ClinicalIQ™ interactive demo functional
- [ ] ✅ ElderWatch™ interactive demo functional
- [ ] ✅ PediCalc Pro™ interactive demo functional
- [ ] ✅ SkinScan Pro™ interactive demo functional
- [ ] ✅ All scenario buttons work
- [ ] ✅ Results screens display properly
- [ ] ✅ Back buttons navigate correctly

### SEO & Metadata
- [ ] ✅ JSON-LD validates (Google Rich Results + schema validator)
- [ ] ✅ AT meta tags present on all pages (title, description, OG tags)
- [ ] ✅ `/ai-sitemap.json` is reachable and accurate
- [ ] ✅ `/ai/embeddings.json` loads and contains all pages
- [ ] ✅ Proper canonical URLs set
- [ ] ✅ Robots.txt configured correctly

### Performance
- [ ] ✅ Lighthouse scores meet targets on prod URL:
  - [ ] Performance: 90+
  - [ ] Accessibility: 90+
  - [ ] Best Practices: 90+
  - [ ] SEO: 95+
- [ ] ✅ Page load time < 3 seconds
- [ ] ✅ Images optimized and lazy-loaded
- [ ] ✅ No console errors

### Call-to-Actions (CTAs)
- [ ] ✅ CTAs route to Contact or Calendly; form sends and displays success
- [ ] ✅ "Start Free Trial" buttons route to Stripe checkout
- [ ] ✅ "Contact Sales" buttons open email or form
- [ ] ✅ "Try Interactive Demo" buttons work
- [ ] ✅ All Stripe payment links functional (11 total)
- [ ] ✅ Stripe test mode works correctly
- [ ] ✅ Form submissions send emails
- [ ] ✅ Success messages display after form submission

### Mobile Responsiveness
- [ ] ✅ Mobile view verified (iOS + Android)
- [ ] ✅ Navigation menu works on mobile
- [ ] ✅ All buttons clickable on mobile
- [ ] ✅ Text readable on small screens
- [ ] ✅ Images scale properly
- [ ] ✅ Forms usable on mobile
- [ ] ✅ Demos work on mobile devices

### Error Handling
- [ ] ✅ 404 page exists and is branded
- [ ] ✅ 500 error page exists
- [ ] ✅ Graceful fallbacks for failed API calls
- [ ] ✅ Error messages user-friendly

---

## Notes to Manus AI (from Blueprint)

1. **Do not invent app names.** Parse real app titles and 1-liners from existing site sections/content.

2. **Use this template to scaffold each product page**; preserve factual accuracy from on-page copy.

3. **If any page lacks sufficient copy**, duplicate the template structure with placeholder text marked `TODO:` for human fill-in.

---

## Current Status (October 30, 2025)

### ✅ COMPLETED:
1. All 6 platform demos built and functional
2. Premium pricing implemented across all platforms
3. Stripe payment links created (11 total)
4. Interactive demos working (RxGuard scenarios fixed)
5. Navigation structure complete
6. Mobile responsive design
7. Contact Us button functional (email link)

### ⏳ IN PROGRESS:
1. Integrating 11 Stripe payment links into website code
2. Mapping payment links to correct product tiers
3. Testing Stripe checkout flows

### ❌ TODO:
1. Verify JSON-LD schema markup
2. Create `/ai-sitemap.json`
3. Create `/ai/embeddings.json`
4. Run Lighthouse performance audit
5. Test on iOS and Android devices
6. Create branded 404 page
7. Test all CTAs end-to-end
8. Verify SEO meta tags on all pages
9. Final QA testing before production launch

---

## Stripe Payment Links Integration

### Payment Links to Integrate (11 total):

**Waiting for mapping from user:**

1. `https://buy.stripe.com/test_7sYbJ1cg5ajR3HKge1aMU06` = ?
2. `https://buy.stripe.com/test_9B6cN50xn77FbacbXLaMU07` = ?
3. `https://buy.stripe.com/test_8x23cvcg5crZ5PSf9XaMU08` = ?
4. `https://buy.stripe.com/test_6oUaEX6VLcrZ4LO1j7aMU09` = ?
5. `https://buy.stripe.com/test_bJe3cv0xn0Jhceg1j7aMU0a` = ?
6. `https://buy.stripe.com/test_8x25kDdk977F2DG1j7aMU0b` = ?
7. `https://buy.stripe.com/test_dRmfZh7ZPfEbfqs0f3aMU0c` = ?
8. `https://buy.stripe.com/test_bJe3cveod63B4LO2nbaMU0e` = ?
9. `https://buy.stripe.com/test_fZu6oH3JzgIfemo5znaMU0f` = ?
10. `https://buy.stripe.com/test_aFaeVd2FvbnV5PS9PDaMU0g` = ?
11. `https://buy.stripe.com/test_9B6cN51Br0Jh4LO8LzaMU0h` = ?

**Expected Mapping:**
1. RxGuard™ Professional ($49/mo)
2. ReguReady™ Starter ($199/mo)
3. ReguReady™ Professional ($399/mo)
4. ClinicalIQ™ Starter ($299/mo)
5. ClinicalIQ™ Professional ($699/mo)
6. ElderWatch™ Home Care ($49/mo)
7. ElderWatch™ Facility ($199/mo)
8. PediCalc Pro™ Individual ($19.99/mo)
9. PediCalc Pro™ Group ($14.99/mo)
10. SkinScan Pro™ Individual Provider ($59/mo)
11. SkinScan Pro™ Group ($49/mo)

---

## Next Steps

1. **User Action:** Provide mapping of Stripe URLs to product tiers
2. **Manus Action:** Integrate payment links into `stripePaymentLinks.js`
3. **Manus Action:** Test all payment flows
4. **Manus Action:** Complete remaining checklist items
5. **User Action:** Final approval and QA testing
6. **Manus Action:** Deploy to production
7. **Both:** Monitor for issues post-launch

---

## Success Criteria

✅ All checklist items marked complete  
✅ All Stripe payment links functional  
✅ All demos working on desktop and mobile  
✅ Lighthouse scores meet targets  
✅ No console errors or broken links  
✅ User approval obtained

**Target Launch Date:** After all checklist items complete + user approval

