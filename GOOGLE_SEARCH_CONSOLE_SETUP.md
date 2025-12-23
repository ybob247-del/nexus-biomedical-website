# Google Search Console Setup Guide

**Website:** nexusbiomedical.ai  
**Date:** December 23, 2025  
**Status:** ✅ Sitemap fixed, ready for submission

---

## ✅ COMPLETED: Sitemap Fixes

### What Was Fixed:

1. **Sitemap URLs Updated**
   - ❌ Before: `https://www.nexusbiomedical.ai/`
   - ✅ After: `https://nexusbiomedical.ai/`
   - All 35+ URLs now use correct domain (no www)

2. **Last Modified Date Updated**
   - ❌ Before: `2025-11-28`
   - ✅ After: `2025-12-23` (today)

3. **robots.txt Fixed**
   - ❌ Before: `Sitemap: https://www.nexusbiomedical.ai/sitemap.xml`
   - ✅ After: `Sitemap: https://nexusbiomedical.ai/sitemap.xml`

---

## 📋 STEP-BY-STEP: Google Search Console Setup

### Step 1: Create Google Search Console Account

1. Go to: **https://search.google.com/search-console**
2. Sign in with your Google account
3. Click **"Add Property"**

---

### Step 2: Add Your Website

**Choose:** Domain property (recommended)

1. Enter: `nexusbiomedical.ai` (without https://)
2. Click **"Continue"**

**OR**

**Choose:** URL prefix property

1. Enter: `https://nexusbiomedical.ai`
2. Click **"Continue"**

**Recommendation:** Use **Domain property** to track both www and non-www versions together.

---

### Step 3: Verify Ownership

Google will provide several verification methods. Choose ONE:

#### Option A: DNS Verification (Recommended - Most Reliable)

1. Google will provide a TXT record like:
   ```
   google-site-verification=abc123xyz456
   ```

2. Add this TXT record to your DNS settings:
   - **Host:** @ (or leave blank)
   - **Type:** TXT
   - **Value:** `google-site-verification=abc123xyz456`
   - **TTL:** 3600 (or default)

3. Wait 5-10 minutes for DNS propagation

4. Click **"Verify"** in Google Search Console

---

#### Option B: HTML File Upload

1. Download the verification file from Google (e.g., `google1234567890abcdef.html`)

2. Upload to your website root:
   ```
   /home/ubuntu/nexus-biomedical-website/public/google1234567890abcdef.html
   ```

3. Verify it's accessible:
   ```
   https://nexusbiomedical.ai/google1234567890abcdef.html
   ```

4. Click **"Verify"** in Google Search Console

---

#### Option C: HTML Meta Tag

1. Google will provide a meta tag like:
   ```html
   <meta name="google-site-verification" content="abc123xyz456" />
   ```

2. Add this to the `<head>` section of `/home/ubuntu/nexus-biomedical-website/index.html`

3. Deploy the updated website

4. Click **"Verify"** in Google Search Console

---

### Step 4: Submit Sitemap

Once verified:

1. In Google Search Console, go to **"Sitemaps"** (left sidebar)

2. Enter sitemap URL:
   ```
   https://nexusbiomedical.ai/sitemap.xml
   ```

3. Click **"Submit"**

4. Also submit the AI sitemap:
   ```
   https://nexusbiomedical.ai/ai-sitemap.json
   ```

5. Google will show status as **"Success"** or **"Pending"**

---

### Step 5: Request Indexing for Key Pages

1. Go to **"URL Inspection"** (left sidebar)

2. Enter your homepage URL:
   ```
   https://nexusbiomedical.ai
   ```

3. Click **"Request Indexing"**

4. Repeat for key pages:
   - `https://nexusbiomedical.ai/platform/endoguard`
   - `https://nexusbiomedical.ai/platform/rxguard`
   - `https://nexusbiomedical.ai/pricing`
   - `https://nexusbiomedical.ai/about`

**Note:** You can request indexing for up to 10 URLs per day.

---

## 🔍 BONUS: Bing Webmaster Tools Setup

Bing indexes faster than Google (1-2 weeks vs 2-4 weeks).

### Step 1: Create Bing Webmaster Account

1. Go to: **https://www.bing.com/webmasters**
2. Sign in with Microsoft account
3. Click **"Add a site"**

---

### Step 2: Add Your Website

1. Enter: `https://nexusbiomedical.ai`
2. Click **"Add"**

---

### Step 3: Verify Ownership

Choose ONE method:

- **Option 1:** XML file upload (similar to Google)
- **Option 2:** Meta tag (add to index.html)
- **Option 3:** DNS verification (TXT record)

**Shortcut:** If you already verified with Google Search Console, you can import your site from Google!

---

### Step 4: Submit Sitemap to Bing

1. Go to **"Sitemaps"** in Bing Webmaster Tools
2. Enter: `https://nexusbiomedical.ai/sitemap.xml`
3. Click **"Submit"**

---

### Step 5: Use IndexNow for Instant Indexing

Bing supports **IndexNow** for instant indexing:

1. Go to **"IndexNow"** in Bing Webmaster Tools
2. Get your API key
3. Submit URLs instantly whenever you update content

---

## 📊 MONITORING & TRACKING

### What to Monitor in Google Search Console:

1. **Coverage Report**
   - Shows which pages are indexed
   - Alerts for indexing errors
   - Check weekly for first month

2. **Performance Report**
   - Search queries bringing traffic
   - Click-through rates (CTR)
   - Average position in search results

3. **Sitemaps Report**
   - Shows how many URLs were submitted vs indexed
   - Alerts for sitemap errors

4. **URL Inspection Tool**
   - Check indexing status of specific pages
   - See how Google sees your page
   - Request re-indexing after updates

---

## ⏱️ EXPECTED TIMELINE

| Timeframe | What to Expect |
|-----------|---------------|
| **Day 1** | Submit sitemap to Google & Bing |
| **Week 1** | Google starts crawling your site |
| **Week 2** | First pages appear in Google index |
| **Week 3-4** | Homepage and main pages indexed |
| **Month 2** | Branded searches start working |
| **Month 3** | More pages indexed, rankings improve |
| **Month 6** | Competitive keywords start ranking |

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue: "Sitemap could not be read"
**Solution:** Verify sitemap is accessible at `https://nexusbiomedical.ai/sitemap.xml`

### Issue: "Submitted URL not found (404)"
**Solution:** Check that all URLs in sitemap actually exist on your website

### Issue: "Submitted URL seems to be a Soft 404"
**Solution:** Ensure pages have substantial content, not just "Coming Soon"

### Issue: "Crawled - currently not indexed"
**Solution:** Normal for new sites. Be patient, add more content, build backlinks

### Issue: "Discovered - currently not indexed"
**Solution:** Google found your page but hasn't indexed it yet. Wait 2-4 weeks.

---

## 📈 NEXT STEPS AFTER SETUP

### Week 1-2:
- [ ] Monitor Google Search Console daily
- [ ] Check if pages are being crawled
- [ ] Fix any crawl errors immediately

### Week 3-4:
- [ ] Check which pages are indexed
- [ ] Request indexing for unindexed important pages
- [ ] Start tracking keyword rankings

### Month 2:
- [ ] Analyze search queries bringing traffic
- [ ] Optimize meta descriptions for low CTR pages
- [ ] Create content for high-volume keywords

### Month 3+:
- [ ] Build backlinks from healthcare directories
- [ ] Guest post on medical technology blogs
- [ ] Create regular blog content (2-4 posts/month)
- [ ] Monitor Core Web Vitals
- [ ] Improve page speed if needed

---

## 🎯 SUCCESS METRICS

Track these metrics monthly:

1. **Indexed Pages**
   - Goal: 30+ pages indexed within 2 months

2. **Impressions**
   - Goal: 1,000+ monthly impressions by month 3

3. **Clicks**
   - Goal: 50+ monthly clicks by month 3

4. **Average Position**
   - Goal: Top 10 for branded searches by month 2
   - Goal: Top 20 for competitive keywords by month 6

5. **Branded Search Rankings**
   - "Nexus Biomedical Intelligence" → Position 1-3
   - "EndoGuard platform" → Position 1-5
   - "RxGuard AI" → Position 1-5

---

## 🔗 USEFUL RESOURCES

- **Google Search Console:** https://search.google.com/search-console
- **Bing Webmaster Tools:** https://www.bing.com/webmasters
- **Google Search Central:** https://developers.google.com/search
- **Sitemap Validator:** https://www.xml-sitemaps.com/validate-xml-sitemap.html
- **IndexNow:** https://www.indexnow.org/
- **Schema Markup Validator:** https://validator.schema.org/

---

## ✅ CHECKLIST

**Before Submitting to Google:**
- [x] Sitemap.xml fixed (no www)
- [x] robots.txt updated
- [x] Last modified dates updated
- [ ] Google Search Console account created
- [ ] Domain verified
- [ ] Sitemap submitted
- [ ] Homepage indexing requested

**After Submission:**
- [ ] Bing Webmaster Tools setup
- [ ] Monitor indexing progress weekly
- [ ] Fix any crawl errors
- [ ] Create LinkedIn company page
- [ ] Submit to Crunchbase
- [ ] Start building backlinks

---

**Bottom Line:** Your sitemap is now ready! Follow the steps above to submit to Google Search Console and Bing Webmaster Tools. Indexing will begin within 1-2 weeks.
