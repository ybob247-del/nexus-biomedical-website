# Tour A/B Testing Guide

## Overview

The Tour A/B Testing infrastructure allows you to optimize onboarding tour effectiveness by testing different configurations and measuring their impact on user engagement and completion rates.

## Architecture

### Database Tables

#### `tour_ab_tests`
Stores A/B test configurations:
- `test_name`: Unique identifier for the test
- `tour_name`: Name of the tour being tested
- `variant_a_config`: JSON configuration for control variant
- `variant_b_config`: JSON configuration for test variant
- `variant_a_weight`: Percentage of users assigned to variant A (0-100)
- `variant_b_weight`: Percentage of users assigned to variant B (0-100)
- `start_date`: When the test started
- `end_date`: When the test ended (NULL if ongoing)
- `is_active`: Whether the test is currently running
- `winner_variant`: Declared winner ('A', 'B', or 'none')

#### `tour_ab_assignments`
Tracks user assignments to variants:
- `test_id`: Foreign key to `tour_ab_tests`
- `user_id`: User ID or anonymous session ID
- `variant`: Assigned variant ('A' or 'B')
- `assigned_at`: Timestamp of assignment

### API Endpoints

#### `GET /api/ab-test/get-variant`
Get or assign a variant for a user.

**Query Parameters:**
- `userId`: User ID or anonymous session ID
- `tourName`: Name of the tour

**Response:**
```json
{
  "variant": "A",
  "config": { /* variant configuration */ },
  "hasActiveTest": true,
  "testName": "dashboard-tour-v2"
}
```

#### `GET /api/ab-test/results`
Get A/B test results with statistical analysis.

**Query Parameters:**
- `testName`: Name of the test

**Response:**
```json
{
  "test": {
    "id": 1,
    "name": "dashboard-tour-v2",
    "tourName": "Dashboard Tour",
    "startDate": "2025-12-01T00:00:00Z",
    "endDate": null,
    "isActive": true,
    "winner": "none"
  },
  "variantA": {
    "assignments": 500,
    "starts": 450,
    "completions": 350,
    "skips": 100,
    "conversionRate": 0.778,
    "config": { /* variant A config */ }
  },
  "variantB": {
    "assignments": 500,
    "starts": 450,
    "completions": 380,
    "skips": 70,
    "conversionRate": 0.844,
    "config": { /* variant B config */ }
  },
  "statistics": {
    "rateA": 0.778,
    "rateB": 0.844,
    "zScore": 2.15,
    "pValue": 0.0316,
    "isSignificant": true,
    "relativeImprovement": 8.48,
    "confidenceLevel": 96.84,
    "winner": "B",
    "message": "Variant B is statistically better with 8.5% improvement (p=0.0316)"
  },
  "recommendations": {
    "minSampleSize": 385,
    "currentSampleSize": 450,
    "hasEnoughData": true,
    "message": "Test has reached statistical significance. Winner: Variant B. Safe to end test."
  }
}
```

#### `POST /api/ab-test/declare-winner`
Declare a winner and end the test.

**Request Body:**
```json
{
  "testName": "dashboard-tour-v2",
  "winner": "B"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Variant B declared as winner",
  "test": { /* updated test object */ }
}
```

## Usage Guide

### 1. Creating an A/B Test

Insert a new test into the database:

```sql
INSERT INTO tour_ab_tests (
  test_name,
  tour_name,
  variant_a_config,
  variant_b_config,
  variant_a_weight,
  variant_b_weight
) VALUES (
  'dashboard-tour-v2',
  'Dashboard Tour',
  '{"steps": 5, "highlightColor": "cyan"}',
  '{"steps": 4, "highlightColor": "purple"}',
  50,
  50
);
```

### 2. Integrating with Your Tour Component

Update your tour component to use A/B testing:

```javascript
import { getVariantForUser, trackABTestEvent } from '../utils/tourABTesting';

function MyTourComponent() {
  const [variant, setVariant] = useState(null);
  const [config, setConfig] = useState(null);
  
  useEffect(() => {
    async function loadVariant() {
      const userId = user?.id || `anon-${sessionId}`;
      const { variant, config } = await getVariantForUser(userId, 'Dashboard Tour');
      setVariant(variant);
      setConfig(config);
    }
    loadVariant();
  }, []);
  
  const handleTourStart = () => {
    trackABTestEvent(userId, 'Dashboard Tour', variant, 'started');
  };
  
  const handleTourComplete = () => {
    trackABTestEvent(userId, 'Dashboard Tour', variant, 'completed');
  };
  
  // Use config to customize tour behavior
  return (
    <OnboardingTour
      steps={config?.steps || 5}
      highlightColor={config?.highlightColor || 'cyan'}
      onStart={handleTourStart}
      onComplete={handleTourComplete}
    />
  );
}
```

### 3. Monitoring Results

Check test results regularly:

```javascript
import { getABTestResults } from '../utils/tourABTesting';

async function checkResults() {
  const results = await getABTestResults('dashboard-tour-v2');
  
  console.log('Variant A conversion rate:', results.variantA.conversionRate);
  console.log('Variant B conversion rate:', results.variantB.conversionRate);
  console.log('Statistical significance:', results.statistics.isSignificant);
  console.log('Winner:', results.statistics.winner);
  console.log('Recommendation:', results.recommendations.message);
}
```

### 4. Declaring a Winner

When the test has sufficient data and shows statistical significance:

```javascript
import { declareWinner } from '../utils/tourABTesting';

async function endTest() {
  const results = await getABTestResults('dashboard-tour-v2');
  
  if (results.statistics.isSignificant && results.recommendations.hasEnoughData) {
    await declareWinner('dashboard-tour-v2', results.statistics.winner);
    console.log(`Winner declared: Variant ${results.statistics.winner}`);
  }
}
```

## Statistical Analysis

### Z-Test for Proportions

The system uses a two-tailed Z-test to compare conversion rates between variants:

**Formula:**
```
z = (p̂₂ - p̂₁) / SE

where:
p̂₁ = conversion rate of variant A
p̂₂ = conversion rate of variant B
SE = √[p̄(1-p̄)(1/n₁ + 1/n₂)]
p̄ = pooled proportion = (x₁ + x₂) / (n₁ + n₂)
```

**Significance Level:** α = 0.05 (95% confidence)

A test is considered statistically significant if p-value < 0.05.

### Sample Size Calculation

Minimum sample size per variant:

```
n = (z_α + z_β)² × 2p̄(1-p̄) / (p₂ - p₁)²

where:
z_α = 1.96 (for α = 0.05, two-tailed)
z_β = 0.84 (for power = 0.8)
p̄ = average of baseline and expected rates
```

**Default Parameters:**
- Baseline conversion rate: 50%
- Minimum detectable effect: 10%
- Statistical power: 80%
- Significance level: 5%

**Typical minimum sample size:** ~385 users per variant

## Best Practices

### 1. Test One Variable at a Time
Only change one aspect of the tour between variants to isolate the effect.

**Good:**
- Variant A: 5 steps
- Variant B: 4 steps

**Bad:**
- Variant A: 5 steps, cyan highlight, modal overlay
- Variant B: 4 steps, purple highlight, inline tooltips

### 2. Run Tests Long Enough
- Wait for at least the minimum sample size
- Run for at least 1-2 weeks to account for day-of-week effects
- Don't stop early even if results look promising

### 3. Define Success Metrics
Common metrics for tour A/B tests:
- **Completion rate:** % of users who complete the tour
- **Skip rate:** % of users who skip the tour
- **Time to complete:** Average time spent on tour
- **Feature adoption:** % of users who use features after tour

### 4. Segment Analysis
Consider analyzing results by:
- User type (new vs. returning)
- Device type (mobile vs. desktop)
- Traffic source
- User role

### 5. Document Everything
- Hypothesis: What are you testing and why?
- Expected outcome: What do you expect to happen?
- Actual outcome: What actually happened?
- Learnings: What did you learn?

## Example Test Scenarios

### Scenario 1: Number of Steps
**Hypothesis:** Shorter tours have higher completion rates

**Variant A (Control):**
```json
{
  "steps": 6,
  "title": "Welcome Tour"
}
```

**Variant B (Test):**
```json
{
  "steps": 4,
  "title": "Quick Start Guide"
}
```

### Scenario 2: Highlight Color
**Hypothesis:** Purple highlights are more engaging than cyan

**Variant A (Control):**
```json
{
  "highlightColor": "cyan",
  "borderColor": "#06b6d4"
}
```

**Variant B (Test):**
```json
{
  "highlightColor": "purple",
  "borderColor": "#8b5cf6"
}
```

### Scenario 3: Timing
**Hypothesis:** Showing tour after first action increases completion

**Variant A (Control):**
```json
{
  "triggerTiming": "immediate"
}
```

**Variant B (Test):**
```json
{
  "triggerTiming": "after_first_action"
}
```

## Troubleshooting

### Test Not Showing Results
- Check if test is active: `is_active = TRUE`
- Verify tour name matches exactly
- Ensure users are being assigned variants
- Check if analytics events are being tracked

### Low Sample Size
- Increase test duration
- Increase traffic to the page
- Consider reducing minimum detectable effect
- Check if tour is being triggered

### No Statistical Significance
- May need more data (check minimum sample size)
- Effect size might be too small
- Variants might be too similar
- Consider ending test and trying a different variation

## Admin Dashboard (Coming Soon)

A visual admin interface for managing A/B tests is planned, featuring:
- Create and configure tests via UI
- Real-time results dashboard
- Visual charts and graphs
- Automated winner declaration
- Test history and archive

## References

- [A/B Testing Statistics](https://www.evanmiller.org/ab-testing/)
- [Sample Size Calculator](https://www.optimizely.com/sample-size-calculator/)
- [Statistical Significance](https://www.statisticshowto.com/probability-and-statistics/z-test/)
