# A/B Testing System Documentation

**Last Updated:** December 2, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Admin Panel Access](#admin-panel-access)
4. [Database Schema](#database-schema)
5. [Creating A/B Tests](#creating-ab-tests)
6. [Tracking Conversions](#tracking-conversions)
7. [Analyzing Results](#analyzing-results)
8. [Best Practices](#best-practices)

---

## System Overview

The Nexus Biomedical A/B Testing system allows you to test different variations of features, content, or user experiences to optimize engagement and conversion rates.

### Key Features

- **Flexible Testing:** Test any feature, content, or user flow
- **Traffic Splitting:** Control what percentage of users see each variant
- **Real-time Analytics:** Track participants, conversions, and performance
- **Admin Interface:** Easy-to-use UI for managing tests
- **Statistical Tracking:** Monitor conversion rates and determine winners

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Admin Panel                        │
│              (https://nexus-admin-panel-liart.vercel.app/)   │
│                                                              │
│  - Create/manage A/B tests                                   │
│  - View real-time analytics                                  │
│  - Complete tests and declare winners                        │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    TiDB Cloud Database                       │
│                                                              │
│  Tables:                                                     │
│  - ab_tests (test configurations)                            │
│  - ab_test_participants (user assignments & conversions)     │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Main Website                              │
│              (www.nexusbiomedical.ai)                        │
│                                                              │
│  - Assign users to variants                                  │
│  - Track conversions                                         │
│  - Implement variant logic                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Admin Panel Access

### Accessing the A/B Testing Dashboard

1. **Navigate to:** https://nexus-admin-panel-liart.vercel.app/
2. **Enter Password:** `nexus2025`
3. **Click:** "SMS Management" button
4. **Select Tab:** "🧪 A/B Testing"

### Dashboard Features

#### Create New Test Section
- Test name and description
- Variant A and B names
- Traffic split configuration (10-90%)
- One-click test creation

#### Active Tests Section
- Real-time participant counts
- Conversion tracking for each variant
- Conversion rate calculations
- Complete test button

#### Completed Tests Section
- Historical test results
- Winner declarations
- Performance comparisons

---

## Database Schema

### `ab_tests` Table

Stores A/B test configurations:

```sql
CREATE TABLE ab_tests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  test_name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  variant_a_name VARCHAR(255) NOT NULL,
  variant_b_name VARCHAR(255) NOT NULL,
  traffic_split INT DEFAULT 50,
  status ENUM('active', 'completed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL
);
```

**Fields:**
- `test_name`: Unique identifier for the test (e.g., "SMS Citation Test")
- `description`: What you're testing and why
- `variant_a_name`: Name of control variant (e.g., "With Citations")
- `variant_b_name`: Name of test variant (e.g., "Without Citations")
- `traffic_split`: Percentage assigned to Variant A (remainder goes to B)
- `status`: 'active' or 'completed'

### `ab_test_participants` Table

Tracks user assignments and conversions:

```sql
CREATE TABLE ab_test_participants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  test_id INT NOT NULL,
  user_id INT NOT NULL,
  variant_assigned ENUM('A', 'B') NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  converted BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMP NULL,
  FOREIGN KEY (test_id) REFERENCES ab_tests(id),
  UNIQUE KEY unique_user_test (test_id, user_id)
);
```

**Fields:**
- `test_id`: Links to the A/B test
- `user_id`: User participating in the test
- `variant_assigned`: Which variant the user sees ('A' or 'B')
- `converted`: Whether the user completed the desired action
- `converted_at`: When conversion happened

---

## Creating A/B Tests

### Step 1: Access Admin Panel

Navigate to the A/B Testing tab in the admin panel.

### Step 2: Fill Out Test Form

```
Test Name: SMS Citation Test
Description: Testing whether including scientific citations in SMS messages improves engagement
Variant A Name: With Citations
Variant B Name: Without Citations
Traffic Split: 50
```

### Step 3: Click "Create A/B Test"

The test will immediately become active and start assigning users.

### Example Test Ideas

1. **SMS Content Testing**
   - With vs without citations
   - Short vs long messages
   - Formal vs casual tone

2. **Feature Testing**
   - Different onboarding flows
   - Assessment question order
   - Dashboard layouts

3. **Timing Testing**
   - Morning vs evening notifications
   - Immediate vs delayed follow-ups

---

## Tracking Conversions

### Backend Implementation

When implementing A/B test logic in your application:

```typescript
// Example: Assign user to variant
import { db } from '@/server/db';
import { abTests, abTestParticipants } from '@/server/db/schema';
import { eq, and } from 'drizzle-orm';

async function assignUserToTest(userId: number, testName: string): Promise<'A' | 'B'> {
  // Get active test
  const test = await db.query.abTests.findFirst({
    where: and(
      eq(abTests.test_name, testName),
      eq(abTests.status, 'active')
    )
  });

  if (!test) {
    return 'A'; // Default to A if no active test
  }

  // Check if user already assigned
  const existing = await db.query.abTestParticipants.findFirst({
    where: and(
      eq(abTestParticipants.test_id, test.id),
      eq(abTestParticipants.user_id, userId)
    )
  });

  if (existing) {
    return existing.variant_assigned;
  }

  // Assign new variant based on traffic split
  const variant = Math.random() * 100 < test.traffic_split ? 'A' : 'B';

  await db.insert(abTestParticipants).values({
    test_id: test.id,
    user_id: userId,
    variant_assigned: variant,
    assigned_at: new Date()
  });

  return variant;
}

// Example: Track conversion
async function trackConversion(userId: number, testName: string): Promise<void> {
  const test = await db.query.abTests.findFirst({
    where: eq(abTests.test_name, testName)
  });

  if (!test) return;

  await db.update(abTestParticipants)
    .set({
      converted: true,
      converted_at: new Date()
    })
    .where(and(
      eq(abTestParticipants.test_id, test.id),
      eq(abTestParticipants.user_id, userId)
    ));
}
```

---

## Analyzing Results

### Real-time Metrics

The admin panel automatically calculates:

1. **Participants:** Total users assigned to each variant
2. **Conversions:** Users who completed the desired action
3. **Conversion Rate:** Conversions ÷ Participants × 100%

### Example Results

```
Test: SMS Citation Test
Started: Dec 1, 2025
Participants: 1,000

Variant A (With Citations):
- Participants: 500
- Conversions: 150
- Conversion Rate: 30.00%

Variant B (Without Citations):
- Participants: 500
- Conversions: 175
- Conversion Rate: 35.00%

Winner: Variant B (35.00%)
```

### Completing a Test

1. Review the results in the Active Tests section
2. Ensure you have sufficient sample size (recommend 100+ conversions per variant)
3. Click "Complete Test" button
4. The test moves to Completed Tests with winner declared

---

## Best Practices

### Test Design

✅ **DO:**
- Test one variable at a time
- Define clear success metrics before starting
- Run tests for at least 1-2 weeks
- Aim for 100+ conversions per variant
- Document test hypotheses and learnings

❌ **DON'T:**
- Change test parameters mid-test
- Stop tests too early
- Test multiple variables simultaneously
- Ignore statistical significance

### Traffic Split Guidelines

- **50/50 Split:** Standard for most tests
- **70/30 Split:** When testing risky changes
- **90/10 Split:** For cautious rollouts of new features

### Sample Size Recommendations

| Conversion Rate | Min Participants per Variant |
|----------------|------------------------------|
| 1-5%           | 1,000+                       |
| 5-10%          | 500+                         |
| 10-20%         | 250+                         |
| 20%+           | 100+                         |

### Common Use Cases

1. **SMS Campaigns:** Test message content, timing, and format
2. **Onboarding:** Test different tutorial flows
3. **Assessments:** Test question order and presentation
4. **Notifications:** Test frequency and content
5. **UI/UX:** Test layouts, colors, and copy

---

## Troubleshooting

### Issue: No users being assigned

**Solution:**
1. Verify test status is 'active' in database
2. Check test_name matches exactly in code
3. Ensure assignment logic is implemented correctly

### Issue: Conversion tracking not working

**Solution:**
1. Verify user was assigned to test first
2. Check test_id and user_id match in database
3. Ensure conversion event is being triggered

### Issue: Admin panel not loading tests

**Solution:**
1. Check DATABASE_URL environment variable in Vercel
2. Verify database connection and SSL settings
3. Check browser console for API errors

---

## Version History

### Version 1.0 (December 2, 2025)
- ✅ Initial A/B testing system implementation
- ✅ Admin panel UI with create/view/complete functionality
- ✅ Database schema and API endpoints
- ✅ Real-time analytics and conversion tracking
- ✅ Documentation and best practices guide

---

## Support

For questions or issues with the A/B testing system:
1. Check this documentation first
2. Review the SMS_SYSTEM_ARCHITECTURE.md for related systems
3. Contact the development team for technical support

---

**Remember:** A/B testing is a powerful tool for optimization, but requires patience, proper implementation, and statistical rigor to produce meaningful results.
