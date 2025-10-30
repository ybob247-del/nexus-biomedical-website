# Pricing Audit & Fix Plan

## Pricing Rule
**< $500/month = Stripe Checkout**
**>= $500/month = Contact Sales**

---

## Current Stripe Payment Links (6 total)
1. RxGuard™ Professional - $39/month (14-day trial) ✅
2. ReguReady™ Starter - $10,000 one-time ✅
3. ReguReady™ Professional - $25,000/year ✅
4. ElderWatch™ Facility - $400/month (7-day trial) ✅
5. PediCalc Pro™ Individual - $99/month (14-day trial) ✅
6. SkinScan Pro™ Group - $79/month (14-day trial) ✅

---

## FIXED PRICING STRUCTURE (Option A)

### 1. RxGuard™ - Medication Interaction Predictor
| Tier | Price | Action | Payment Link | Status |
|------|-------|--------|--------------|--------|
| Free | $0/month | No payment | N/A | ✅ Correct |
| Professional | $39/month | Stripe | ✅ Have link | ✅ Correct |
| Enterprise | Custom | Contact Sales | N/A | ✅ Correct |

---

### 2. ReguReady™ - FDA Regulatory Navigator
| Tier | Price | Action | Payment Link | Status |
|------|-------|--------|--------------|--------|
| Starter | $10,000 one-time | Contact Sales | ❌ Remove Stripe | ⚠️ FIX: Too expensive for self-service |
| Professional | $25,000/year | Contact Sales | ❌ Remove Stripe | ⚠️ FIX: Too expensive for self-service |
| Enterprise | Custom | Contact Sales | N/A | ✅ Correct |

**DECISION:** ReguReady is B2B enterprise product. ALL tiers should be Contact Sales.

---

### 3. ClinicalIQ™ - Clinical Trial Optimizer
| Tier | Price | Action | Payment Link | Status |
|------|-------|--------|--------------|--------|
| Professional | $150,000/year | Contact Sales | N/A | ✅ Correct |
| Enterprise | Custom | Contact Sales | N/A | ✅ Correct |

**DECISION:** Add lower tier for self-service:
| Tier | Price | Action | Payment Link | Status |
|------|-------|--------|--------------|--------|
| **Starter** | **$299/month** | **Stripe** | **❌ Need to create** | **⚠️ ADD NEW TIER** |
| Professional | $150,000/year | Contact Sales | N/A | ✅ Correct |
| Enterprise | Custom | Contact Sales | N/A | ✅ Correct |

---

### 4. ElderWatch™ - Senior Health Monitoring
**CURRENT (with ranges):**
| Tier | Price | Action |
|------|-------|--------|
| Home Care | $200/month | Stripe |
| Facility (10-50) | $300-500/month | ??? |
| Enterprise (50+) | Custom | Contact Sales |

**FIXED (no ranges):**
| Tier | Price | Action | Payment Link | Status |
|------|-------|--------|--------------|--------|
| Home Care | $200/month | Stripe | ❌ Need to create | ⚠️ MISSING |
| Facility | $400/month | Stripe | ✅ Have link | ✅ Correct |
| Enterprise | Custom | Contact Sales | N/A | ✅ Correct |

---

### 5. PediCalc Pro™ - Pediatric Dosing Calculator
**CURRENT (from screenshots):**
| Tier | Price | Action |
|------|-------|--------|
| Individual | $15/month | ??? |
| Group (5-20) | $10/month/provider | ??? |
| Hospital/Enterprise | Custom | Contact Sales |

**FIXED:**
| Tier | Price | Action | Payment Link | Status |
|------|-------|--------|--------------|--------|
| Individual | $99/month | Stripe | ✅ Have link | ✅ Correct |
| Group | $79/month/provider | Stripe | ❌ Need to create | ⚠️ MISSING |
| Enterprise | Custom | Contact Sales | N/A | ✅ Correct |

**NOTE:** Screenshot shows $15/month, but payment link is for $99/month. Which is correct?

---

### 6. SkinScan Pro™ - Skin Cancer Detection
**CURRENT (from screenshots):**
| Tier | Price | Action |
|------|-------|--------|
| Individual | $99/month | ??? |
| Group (5-20) | $79/month/provider | ??? |
| Hospital/Enterprise | Custom | Contact Sales |

**FIXED:**
| Tier | Price | Action | Payment Link | Status |
|------|-------|--------|--------------|--------|
| Individual | $99/month | Stripe | ❌ Need to create | ⚠️ MISSING |
| Group | $79/month | Stripe | ✅ Have link | ✅ Correct |
| Enterprise | Custom | Contact Sales | N/A | ✅ Correct |

---

## SUMMARY OF FIXES NEEDED

### Stripe Payment Links to CREATE:
1. ❌ ElderWatch™ Home Care - $200/month
2. ❌ PediCalc Pro™ Group - $79/month/provider  
3. ❌ SkinScan Pro™ Individual - $99/month
4. ❌ ClinicalIQ™ Starter - $299/month (NEW TIER)

### Stripe Payment Links to REMOVE:
1. ❌ ReguReady™ Starter - $10,000 (change to Contact Sales)
2. ❌ ReguReady™ Professional - $25,000/year (change to Contact Sales)

### platformData.js Updates:
1. ✅ RxGuard™ - No changes needed
2. ⚠️ ReguReady™ - Change ALL tiers to Contact Sales
3. ⚠️ ClinicalIQ™ - Add Starter tier ($299/month)
4. ⚠️ ElderWatch™ - Remove price range, use fixed $400
5. ⚠️ PediCalc Pro™ - Clarify pricing (is it $15 or $99?)
6. ⚠️ SkinScan Pro™ - Add Individual tier

### Code Updates:
1. ⚠️ Update stripePaymentLinks.js
2. ⚠️ Update LearnMore.jsx button logic
3. ⚠️ Audit ALL hyperlinks
4. ⚠️ Test Contact Us button
5. ⚠️ Test all Stripe checkout flows

---

## QUESTIONS FOR USER:
1. **PediCalc pricing conflict:** Screenshot shows $15/month, but we created payment link for $99/month. Which is correct?
2. **ReguReady:** Confirm ALL tiers should be Contact Sales (too expensive for self-service)?
3. **ClinicalIQ Starter tier:** Should we add a $299/month tier for small companies?

