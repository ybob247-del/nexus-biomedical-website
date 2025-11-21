/**
 * Comprehensive Legal & Content Compliance Audit
 * 
 * This script audits all website content to identify:
 * 1. False/misleading claims about features
 * 2. Unsubstantiated statistics
 * 3. Regulatory compliance issues
 * 4. Liability risks
 * 5. Broken promises
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Platform features that actually exist
const IMPLEMENTED_FEATURES = {
  rxguard: {
    working: [
      'Drug search (RxNorm API)',
      'Drug information display',
      'Basic interaction checking',
      'FDA adverse event data',
      'Risk scoring',
      'User authentication',
      'Subscription payment (Stripe)',
      'Save medication lists (database)'
    ],
    notWorking: [
      'AI-powered alternative medication suggestions',
      'Clinical mitigation strategies',
      'Patient-friendly PDF reports',
      'EHR integration',
      'Pharmacy integration',
      'Real-time monitoring',
      'Email notifications'
    ]
  },
  endoguard: {
    working: [
      'Symptom assessment quiz',
      'EDC exposure calculator',
      'Basic results display',
      'User authentication',
      'Subscription payment (Stripe)',
      'Save assessment results (database)'
    ],
    notWorking: [
      'AI-powered hormone health analysis',
      'Personalized recommendations engine',
      'Lab test interpretation',
      'Progress tracking over time',
      'Supplement recommendations',
      'Provider dashboard',
      'EHR integration',
      'Lab testing integration (Quest, LabCorp)',
      'Telemedicine integration',
      'Wearable data sync'
    ]
  }
};

// Red flag keywords that indicate medical claims
const MEDICAL_CLAIM_KEYWORDS = [
  'diagnose', 'diagnosis', 'treat', 'treatment', 'cure', 'prevent', 'prevention',
  'medical device', 'FDA approved', 'clinically proven', 'guaranteed',
  'doctor replacement', 'replace your doctor', 'medical advice'
];

// Statistics that need verification
const STATISTICS_TO_VERIFY = [];

function auditFile(filePath, content) {
  const issues = [];
  const fileName = path.basename(filePath);
  
  // Check for medical claims
  MEDICAL_CLAIM_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      issues.push({
        severity: 'HIGH',
        type: 'MEDICAL_CLAIM',
        file: fileName,
        keyword: keyword,
        count: matches.length,
        message: `Contains medical claim keyword "${keyword}" which may violate FDA regulations`
      });
    }
  });
  
  // Check for percentage claims
  const percentageRegex = /(\d+)%\s+([^\.]+)/g;
  let match;
  while ((match = percentageRegex.exec(content)) !== null) {
    issues.push({
      severity: 'MEDIUM',
      type: 'STATISTIC',
      file: fileName,
      claim: match[0],
      message: 'Percentage claim needs citation/verification'
    });
  }
  
  // Check for "AI-powered" claims
  if (content.includes('AI-powered') || content.includes('AI powered')) {
    issues.push({
      severity: 'HIGH',
      type: 'FEATURE_CLAIM',
      file: fileName,
      message: 'Claims AI-powered features - verify OpenAI integration is working'
    });
  }
  
  // Check for integration claims
  const integrationKeywords = ['EHR integration', 'Epic', 'Cerner', 'pharmacy integration', 
                                'lab integration', 'Quest', 'LabCorp', 'telemedicine'];
  integrationKeywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      issues.push({
        severity: 'CRITICAL',
        type: 'FALSE_FEATURE',
        file: fileName,
        feature: keyword,
        message: `Claims "${keyword}" but this feature is NOT implemented`
      });
    }
  });
  
  return issues;
}

function scanDirectory(dir, issues = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(filePath, issues);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.md')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileIssues = auditFile(filePath, content);
      issues.push(...fileIssues);
    }
  });
  
  return issues;
}

console.log('🔍 COMPREHENSIVE COMPLIANCE AUDIT\n');
console.log('='.repeat(80));
console.log('\nScanning all website content for legal and compliance issues...\n');

const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

const issues = scanDirectory(srcDir);

// Group by severity
const critical = issues.filter(i => i.severity === 'CRITICAL');
const high = issues.filter(i => i.severity === 'HIGH');
const medium = issues.filter(i => i.severity === 'MEDIUM');

console.log(`\n📊 AUDIT SUMMARY`);
console.log('='.repeat(80));
console.log(`Total Issues Found: ${issues.length}`);
console.log(`  🔴 CRITICAL: ${critical.length} (False feature claims)`);
console.log(`  🟠 HIGH: ${high.length} (Medical claims, liability risks)`);
console.log(`  🟡 MEDIUM: ${medium.length} (Unverified statistics)`);

if (critical.length > 0) {
  console.log(`\n\n🔴 CRITICAL ISSUES (Must fix immediately)`);
  console.log('='.repeat(80));
  critical.forEach((issue, i) => {
    console.log(`\n${i + 1}. ${issue.message}`);
    console.log(`   File: ${issue.file}`);
    console.log(`   Feature: ${issue.feature}`);
  });
}

if (high.length > 0) {
  console.log(`\n\n🟠 HIGH PRIORITY ISSUES`);
  console.log('='.repeat(80));
  high.forEach((issue, i) => {
    console.log(`\n${i + 1}. ${issue.message}`);
    console.log(`   File: ${issue.file}`);
    if (issue.keyword) console.log(`   Keyword: "${issue.keyword}" (${issue.count} occurrences)`);
  });
}

if (medium.length > 0) {
  console.log(`\n\n🟡 MEDIUM PRIORITY ISSUES`);
  console.log('='.repeat(80));
  medium.slice(0, 20).forEach((issue, i) => {
    console.log(`\n${i + 1}. ${issue.claim}`);
    console.log(`   File: ${issue.file}`);
  });
  if (medium.length > 20) {
    console.log(`\n   ... and ${medium.length - 20} more statistics to verify`);
  }
}

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: issues.length,
    critical: critical.length,
    high: high.length,
    medium: medium.length
  },
  issues: issues
};

const reportPath = path.join(projectRoot, 'COMPLIANCE_AUDIT_REPORT.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`\n\n📄 Detailed report saved to: COMPLIANCE_AUDIT_REPORT.json`);
console.log('='.repeat(80));
