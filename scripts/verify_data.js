/**
 * 데이터 구조 검증 스크립트
 */

const fs = require('fs');
const path = require('path');

// 파일 읽기
function readTsFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

console.log('🔍 MET Mythic v6 데이터 구조 검증\n');

// 1. question_scorer.ts에서 category 지원 확인
const scorerContent = readTsFile('./lib/question_scorer.ts');

const categoryChecks = [
  { name: 'Energy', pattern: /energyCategories\s*=\s*\[([^\]]+)\]/ },
  { name: 'Operation', pattern: /operatingCategories\s*=\s*\[([^\]]+)\]/ },
  { name: 'Context', pattern: /contextCategories\s*=\s*\[([^\]]+)\]/ },
  { name: 'Hidden', pattern: /hiddenCategories\s*=\s*\[([^\]]+)\]/ },
  { name: 'Maturity', pattern: /maturityCategories\s*=\s*\[([^\]]+)\]/ },
  { name: 'Conflict', pattern: /conflictCategories\s*=\s*\[([^\]]+)\]/ },
];

console.log('📊 question_scorer.ts 카테고리 지원 현황:');
for (const check of categoryChecks) {
  const match = scorerContent.match(check.pattern);
  if (match) {
    console.log(`  ✅ ${check.name}: ${match[1].trim()}`);
  } else {
    console.log(`  ⚠️ ${check.name}: 패턴 없음 (기본 category만 체크할 수 있음)`);
  }
}

// 2. Direction 점수 계산 로직 확인
console.log('\n📊 Direction 점수 계산 로직:');
if (scorerContent.includes('approachCounts') && scorerContent.includes('avoidanceCounts')) {
  console.log('  ✅ 횟수 기반 비율 계산 방식 사용');
} else {
  console.log('  ⚠️ 횟수 기반 비율 계산 방식 미확인');
}

// 3. Operation axisNames 확인
console.log('\n📊 Operation axis 한국어 이름:');
const axisNamesMatch = scorerContent.match(/axisNames[^{]*{([^}]+)}/s);
if (axisNamesMatch) {
  const lines = axisNamesMatch[1].split('\n').filter(l => l.includes(':'));
  for (const line of lines.slice(0, 10)) {
    console.log(`  ${line.trim()}`);
  }
}

// 4. report_generator.ts에서 operation 포함 확인
const reportContent = readTsFile('./lib/report_generator.ts');
console.log('\n📊 report_generator.ts operation 데이터 전달:');
if (reportContent.includes('operation:') && reportContent.includes('operationScores')) {
  console.log('  ✅ operation 데이터가 UserProfile에 포함됨');
} else {
  console.log('  ❌ operation 데이터 누락');
}

// 5. FullResultScreen.tsx operationLabels 확인
const screenContent = readTsFile('./components/FullResultScreen.tsx');
console.log('\n📊 FullResultScreen.tsx operationLabels:');
const labelsMatch = screenContent.match(/operationLabels[^{]*{([^}]+(?:{[^}]+}[^}]+)*)}/s);
if (labelsMatch) {
  const lines = labelsMatch[1].split('\n').filter(l => l.includes(':') && l.includes('left'));
  for (const line of lines.slice(0, 8)) {
    console.log(`  ${line.trim()}`);
  }
}

// 6. warnings 한국어 확인
console.log('\n📊 warnings 메시지 언어 확인:');
const warningPatterns = [
  'EXTREME_BIAS',
  'EXTREME_TENDENCY', 
  'MIDDLE_BIAS',
  'PATTERN_DETECTED',
  'SPEED_WARNING',
  'EXTREME_STREAK'
];

let hasEnglishWarnings = false;
for (const pattern of warningPatterns) {
  if (scorerContent.includes(`'${pattern}:`)) {
    console.log(`  ❌ 영어 경고 발견: ${pattern}`);
    hasEnglishWarnings = true;
  }
}

if (!hasEnglishWarnings) {
  console.log('  ✅ 모든 경고 메시지가 한국어화됨');
}

console.log('\n✅ 검증 완료');
