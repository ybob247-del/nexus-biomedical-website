# Bug Reporting Video Script - Show & Tell Guide

**Purpose:** This script guides you through recording a "how to report bugs" video for yourself and future team members.

**Video Length:** 5-7 minutes  
**Format:** Screen recording with voiceover  
**Tools Needed:** 
- Screen recorder (Loom, OBS Studio, QuickTime, or built-in screen recording)
- Web browser (Chrome recommended for developer tools)
- Screenshot tool (built-in or Snagit)

---

## 🎬 Video Script

### INTRO (30 seconds)

**[Show: Your face on camera or just screen]**

**YOU SAY:**

> "Hi, this is Dr. Pamela Tebebi-Njoh, founder of Nexus Biomedical Intelligence. In this video, I'm going to show you how to properly document and report bugs when testing our website. This process ensures we can quickly identify, reproduce, and fix issues before they affect our users. Let's get started."

---

### SECTION 1: What is a Bug? (1 minute)

**[Show: Nexus website homepage]**

**YOU SAY:**

> "First, let's define what a bug is. A bug is any behavior on the website that doesn't match what we expect to happen. This could be:"

**[Click through examples as you mention them]**

- **Broken links** - "A button that doesn't do anything when you click it"
- **Visual issues** - "Text that's hard to read, images that don't load, or layouts that look broken"
- **Functional problems** - "A demo that crashes, a form that won't submit, or a calculation that gives the wrong answer"
- **Performance issues** - "Pages that take forever to load or freeze your browser"

**YOU SAY:**

> "Not every issue is a bug. For example, if you don't like the color of a button, that's a design preference, not a bug. But if the button is supposed to be blue and shows up as invisible text, that's a bug."

---

### SECTION 2: The 5-Step Bug Reporting Process (3-4 minutes)

**[Show: Open a new document or bug report template]**

**YOU SAY:**

> "When you find a bug, follow these five steps to document it properly. I'll demonstrate with a real example."

---

#### STEP 1: Reproduce the Bug

**[Navigate to RxGuard™ demo page]**

**YOU SAY:**

> "Step 1: Make sure you can reproduce the bug. That means you can make it happen again by following the same steps. Let me show you."

**[Click through the steps]**

1. "I'm going to click 'Learn More' on the RxGuard™ card"
2. "Now I'll click 'Try Interactive Demo'"
3. "And now I'll click 'Try This Scenario' on the Bipolar Treatment card"

**[Demonstrate the bug - for this example, let's say a button doesn't work]**

**YOU SAY:**

> "See? When I click 'Start Free Trial,' nothing happens. Let me try again... still nothing. Okay, I can reproduce this bug consistently."

---

#### STEP 2: Take a Screenshot

**[Show: Taking a screenshot]**

**YOU SAY:**

> "Step 2: Take a screenshot of the problem. On Mac, I press Command+Shift+4 to capture a specific area. On Windows, it's Windows Key + Shift + S."

**[Take screenshot of the broken button]**

**YOU SAY:**

> "Make sure your screenshot shows the entire problem. If it's a button that doesn't work, capture the button. If it's a layout issue, capture the whole section. I'll save this screenshot with a descriptive name like 'rxguard-demo-button-broken.png' so I can find it later."

---

#### STEP 3: Check the Browser Console for Errors

**[Show: Opening Chrome DevTools]**

**YOU SAY:**

> "Step 3: Check the browser console for error messages. This is super important because it tells us what went wrong behind the scenes. To open the console in Chrome, I right-click anywhere on the page and select 'Inspect,' then click the 'Console' tab."

**[Open DevTools Console tab]**

**YOU SAY:**

> "Look for red error messages. See this one here? It says 'Uncaught ReferenceError: Stripe is not defined.' This tells me the Stripe payment system isn't loading properly. I'll copy this error message and include it in my bug report."

**[Copy error message]**

**YOU SAY:**

> "If you don't see any errors, that's okay - just note that in your report. Sometimes bugs don't show console errors."

---

#### STEP 4: Document Browser and Device Information

**[Show: Chrome settings or about page]**

**YOU SAY:**

> "Step 4: Note what browser and device you're using. To find your Chrome version, I'll click the three dots in the top right, go to 'Help,' then 'About Google Chrome.'"

**[Navigate to Chrome version]**

**YOU SAY:**

> "I'm using Chrome version 120.0.6099.109 on macOS Sonoma 14.2. This matters because bugs sometimes only happen on specific browsers or devices. If you're on Windows, note your Windows version. If you're on a phone, note whether it's iPhone or Android and which model."

---

#### STEP 5: Fill Out the Bug Report Template

**[Show: Bug report template document]**

**YOU SAY:**

> "Step 5: Fill out the bug report template. Let me show you how I document this bug."

**[Type while narrating]**

**YOU SAY:**

> "I'll start with a bug number - this is my first bug, so I'll call it BUG-001. Then I'll add today's date: November 18, 2025."

**[Continue filling out template]**

> "For 'Page/Section,' I'll write 'RxGuard™ Demo - Bipolar Scenario.'"

> "For 'Severity,' I need to decide how bad this bug is:
> - **Critical** means the website is completely broken or has a major security issue
> - **High** means a key feature doesn't work
> - **Medium** means something is broken but there's a workaround
> - **Low** means it's a minor visual issue or typo
>
> Since the 'Start Free Trial' button is a key conversion point, I'll mark this as **High** severity."

**[Continue typing]**

> "Now I'll write the steps to reproduce. I'll be very specific:
> 1. Navigate to homepage at www.nexusbiomedical.ai
> 2. Click 'Learn More' on RxGuard™ card
> 3. Click 'Try Interactive Demo' button
> 4. Click 'Try This Scenario' on Bipolar Treatment card
> 5. Click 'Start Free Trial' button at bottom of results screen"

> "For 'Expected Behavior,' I'll write: 'Stripe checkout page should open with RxGuard™ Professional pricing ($49/month) and 14-day free trial.'"

> "For 'Actual Behavior,' I'll write: 'Nothing happens when clicking the button. No Stripe checkout opens. No error message shown to user.'"

> "I'll attach my screenshot here."

> "For 'Browser/Device,' I'll write: 'Chrome 120.0.6099.109 on macOS Sonoma 14.2.'"

> "And finally, in 'Notes,' I'll add the console error: 'Console shows error: Uncaught ReferenceError: Stripe is not defined.'"

**[Show completed bug report]**

**YOU SAY:**

> "And that's a complete bug report! This gives the developer everything they need to fix the issue quickly."

---

### SECTION 3: Bug Severity Guidelines (1 minute)

**[Show: Severity examples on screen]**

**YOU SAY:**

> "Let me give you some examples of each severity level so you know how to categorize bugs:"

**CRITICAL Bugs:**
- "The entire website is down or won't load"
- "A security vulnerability that exposes user data"
- "The payment system charges the wrong amount"
- "Real patient data is visible to the wrong user"

**HIGH Bugs:**
- "A key feature completely doesn't work (like a demo that won't load)"
- "A 'Start Free Trial' button that does nothing"
- "A form that won't submit"
- "The website is unusable on mobile devices"

**MEDIUM Bugs:**
- "A feature works but has errors or unexpected behavior"
- "Some images don't load"
- "A page loads slowly but eventually works"
- "Text is hard to read due to poor color contrast"

**LOW Bugs:**
- "Typos or grammar errors"
- "Minor visual misalignments"
- "A hover effect that doesn't look quite right"
- "A 'Coming Soon' label that's slightly off-center"

**YOU SAY:**

> "When in doubt, mark it as Medium and we can adjust the priority later."

---

### SECTION 4: Where to Send Bug Reports (30 seconds)

**[Show: Email composition window]**

**YOU SAY:**

> "Once you've completed your bug report, send it to support@nexusbiomedical.ai with the subject line 'BUG REPORT: [Brief Description].' For example, 'BUG REPORT: RxGuard Start Free Trial Button Not Working.'"

**[Show example email]**

> "Attach your screenshot and paste the bug report into the email body. If you found multiple bugs, send separate emails for each one so we can track them individually."

---

### CLOSING (30 seconds)

**[Show: Your face or Nexus logo]**

**YOU SAY:**

> "That's it! Remember the five steps:
> 1. Reproduce the bug
> 2. Take a screenshot
> 3. Check the browser console
> 4. Note your browser and device
> 5. Fill out the bug report template
>
> Thorough bug reports help us build a better product for our users. Thank you for taking the time to test properly. If you have any questions, email support@nexusbiomedical.ai. Happy testing!"

---

## 📝 Quick Reference Card (Print This)

### Bug Reporting Checklist

**Before You Report:**
- [ ] Can you reproduce the bug? (Make it happen twice)
- [ ] Did you take a screenshot?
- [ ] Did you check the browser console for errors?
- [ ] Do you know your browser version and device?

**Bug Report Template:**
```
BUG #: [Number]
DATE: [Date]
PAGE/SECTION: [Where it happened]
SEVERITY: [Critical / High / Medium / Low]

STEPS TO REPRODUCE:
1. [Step 1]
2. [Step 2]
3. [Step 3]

EXPECTED BEHAVIOR:
[What should happen]

ACTUAL BEHAVIOR:
[What actually happened]

SCREENSHOT:
[Attach file]

BROWSER/DEVICE:
[Browser version and OS]

NOTES:
[Console errors, additional context]
```

**Severity Guide:**
- **Critical:** Website down, security issue, data loss
- **High:** Key feature broken, unusable functionality
- **Medium:** Feature works but has errors, slow performance
- **Low:** Typos, minor visual issues, cosmetic problems

**Send To:**
support@nexusbiomedical.ai

**Subject Line:**
BUG REPORT: [Brief Description]

---

## 🎥 Recording Tips

### Before Recording:
1. **Close unnecessary tabs and windows** (clean screen)
2. **Test your microphone** (make sure audio is clear)
3. **Prepare your examples** (know which bugs you'll demonstrate)
4. **Have the script open** (so you don't forget steps)

### During Recording:
1. **Speak slowly and clearly** (easier to understand)
2. **Pause between sections** (easier to edit later)
3. **Show, don't just tell** (demonstrate each step visually)
4. **Zoom in on important details** (make text readable)

### After Recording:
1. **Watch the full video** (check for mistakes)
2. **Add captions if possible** (accessibility)
3. **Save in multiple formats** (MP4 for sharing, original for editing)
4. **Upload to private YouTube or Loom** (easy to share with team)

---

## 📊 Sample Bug Reports

### Example 1: Critical Bug

```
BUG #: BUG-042
DATE: November 18, 2025
PAGE/SECTION: All Pages
SEVERITY: Critical

STEPS TO REPRODUCE:
1. Navigate to www.nexusbiomedical.ai
2. Observe page load

EXPECTED BEHAVIOR:
Homepage should load within 3 seconds with all content visible

ACTUAL BEHAVIOR:
Website shows "500 Internal Server Error" and does not load at all

SCREENSHOT:
[500-error-screenshot.png]

BROWSER/DEVICE:
Chrome 120 on Windows 11

NOTES:
This affects all pages on the website. No users can access the site.
Occurred at 2:45 PM EST. May be a server issue.
```

---

### Example 2: High Bug

```
BUG #: BUG-015
DATE: November 18, 2025
PAGE/SECTION: ClinicalIQ™ Demo
SEVERITY: High

STEPS TO REPRODUCE:
1. Navigate to ClinicalIQ™ Learn More page
2. Click "Try Interactive Demo"
3. Select "Hypertension Trial" scenario
4. Click "Generate Recommendations"

EXPECTED BEHAVIOR:
AI should generate trial design recommendations within 5 seconds

ACTUAL BEHAVIOR:
Page shows loading spinner indefinitely. After 2 minutes, still no results.
Browser tab becomes unresponsive.

SCREENSHOT:
[clinicaliq-infinite-loading.png]

BROWSER/DEVICE:
Firefox 121.0 on macOS Ventura 13.6

NOTES:
Console shows error: "Failed to fetch: TypeError: NetworkError when attempting to fetch resource"
Tried 3 times, same result each time.
```

---

### Example 3: Medium Bug

```
BUG #: BUG-028
DATE: November 18, 2025
PAGE/SECTION: ElderWatch™ Learn More Page
SEVERITY: Medium

STEPS TO REPRODUCE:
1. Navigate to homepage
2. Click "Learn More" on ElderWatch™ card
3. Scroll to pricing section

EXPECTED BEHAVIOR:
Pricing tiers should display side-by-side on desktop (Home Care $49/mo, Facility $199/mo)

ACTUAL BEHAVIOR:
Pricing cards are stacked vertically even on wide desktop screen (1920x1080).
Cards appear to be using mobile layout on desktop.

SCREENSHOT:
[elderwatch-pricing-layout-bug.png]

BROWSER/DEVICE:
Safari 17.2 on macOS Sonoma 14.2

NOTES:
Issue only occurs in Safari. Chrome and Firefox display correctly.
Responsive design may need Safari-specific CSS fix.
```

---

### Example 4: Low Bug

```
BUG #: BUG-033
DATE: November 18, 2025
PAGE/SECTION: FAQ Section
SEVERITY: Low

STEPS TO REPRODUCE:
1. Navigate to homepage
2. Scroll to FAQ section
3. Read question #7

EXPECTED BEHAVIOR:
Text should be grammatically correct

ACTUAL BEHAVIOR:
Question reads: "What about regulatory approval—are these systems cleared?"
Should be: "What about regulatory approval—are these systems cleared?"
(Typo: "systems" should be "systems")

SCREENSHOT:
[faq-typo.png]

BROWSER/DEVICE:
Chrome 120 on Windows 11

NOTES:
Minor typo, does not affect functionality. Low priority fix.
```

---

**Document Version:** 1.0  
**Last Updated:** November 18, 2025  
**Video Recording Status:** Not yet recorded  
**Next Steps:** Record video using this script, upload to private YouTube, share link with team
