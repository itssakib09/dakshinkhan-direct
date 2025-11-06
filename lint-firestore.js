#!/usr/bin/env node

/**
 * Firestore Rules Linter
 * Validates firestore.rules syntax and checks for common security issues
 * Run: node scripts/lint-firestore.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RULES_PATH = path.join(__dirname, '..', 'firestore.rules');

// Color codes for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function lintRules() {
  log('\n🔍 Linting Firestore Security Rules...\n');

  if (!fs.existsSync(RULES_PATH)) {
    log('❌ ERROR: firestore.rules not found!', 'red');
    process.exit(1);
  }

  const rulesContent = fs.readFileSync(RULES_PATH, 'utf8');
  let errors = 0;
  let warnings = 0;

  // Check 1: Must have rules_version = '2'
  if (!rulesContent.includes("rules_version = '2'")) {
    log('❌ ERROR: Missing rules_version = \'2\'', 'red');
    errors++;
  }

  // Check 2: No wildcard allow read/write without conditions
  const dangerousPatterns = [
    /allow\s+read\s*:\s*if\s+true\s*;/g,
    /allow\s+write\s*:\s*if\s+true\s*;/g,
    /allow\s+read,\s*write\s*:\s*if\s+true\s*;/g
  ];

  dangerousPatterns.forEach(pattern => {
    const matches = rulesContent.match(pattern);
    if (matches && matches.length > 2) {
      log(`⚠️  WARNING: Multiple 'allow ... if true' rules found (${matches.length})`, 'yellow');
      warnings++;
    }
  });

  // Check 3: Analytics/Payments should not allow direct writes
  const protectedCollections = ['analytics', 'payments', 'auditLogs'];
  protectedCollections.forEach(collection => {
    const regex = new RegExp(`match\\s+\\/${collection}\\/.*?allow\\s+write\\s*:\\s*if\\s+(?!false)`, 'gs');
    if (regex.test(rulesContent)) {
      log(`❌ ERROR: ${collection} collection allows direct writes (must be Cloud Function only)`, 'red');
      errors++;
    }
  });

  // Check 4: Must have isAuthenticated helper
  if (!rulesContent.includes('function isAuthenticated()')) {
    log('⚠️  WARNING: Missing isAuthenticated() helper function', 'yellow');
    warnings++;
  }

  // Check 5: Must have default deny rule
  if (!rulesContent.includes('match /{document=**}') || 
      !rulesContent.includes('allow read, write: if false')) {
    log('❌ ERROR: Missing default deny-all rule', 'red');
    errors++;
  }

  // Check 6: Syntax check - balanced braces
  const openBraces = (rulesContent.match(/{/g) || []).length;
  const closeBraces = (rulesContent.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    log(`❌ ERROR: Unbalanced braces (open: ${openBraces}, close: ${closeBraces})`, 'red');
    errors++;
  }

  // Summary
  log('\n─────────────────────────────────────');
  if (errors === 0 && warnings === 0) {
    log('✅ All checks passed! Rules are ready for deployment.', 'green');
  } else {
    if (errors > 0) {
      log(`❌ ${errors} error(s) found`, 'red');
    }
    if (warnings > 0) {
      log(`⚠️  ${warnings} warning(s) found`, 'yellow');
    }
  }
  log('─────────────────────────────────────\n');

  process.exit(errors > 0 ? 1 : 0);
}

lintRules();