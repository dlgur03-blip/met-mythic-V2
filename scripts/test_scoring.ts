/**
 * MET Mythic v6 점수 계산 검증 테스트
 * 실행: npx ts-node scripts/test_scoring.ts
 */

import {
  calculateMotiveScores,
  calculateIgnitionScores,
  calculateDirectionScores,
  calculateOperationScores,
  calculateEnergyScores,
  calculateConflictScores,
  calculateContextScores,
  calculateHiddenScores,
  calculateMaturityScores,
} from '../lib/question_scorer.js';
import { ALL_QUESTIONS_WITH_REVERSE } from '../data/questions/all_questions.js';
import type { Answer, Question } from '../lib/types.js';

// ============================================
// 테스트 유틸리티
// ============================================

function generateRandomAnswers(questions: Question[]): Answer[] {
  return questions.map((q, index) => {
    const optionIndex = Math.floor(Math.random() * q.options.length);
    return {
      questionId: q.id,
      optionId: q.options[optionIndex].id,
      value: q.options[optionIndex].value,
      responseTime: 2000 + Math.random() * 5000, // 2-7초
      timestamp: Date.now() + index * 3000,
    };
  });
}

function log(title: string, data: any) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 ${title}`);
  console.log('='.repeat(50));
  if (typeof data === 'object') {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(data);
  }
}

// ============================================
// 메인 테스트
// ============================================

async function runTests() {
  console.log('\n🧪 MET Mythic v6 점수 계산 테스트 시작\n');
  
  const questions = ALL_QUESTIONS_WITH_REVERSE as Question[];
  console.log(`📋 총 문항 수: ${questions.length}`);
  
  // 카테고리별 문항 수 확인
  const categoryCount: Record<string, number> = {};
  for (const q of questions) {
    categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
  }
  log('카테고리별 문항 수', categoryCount);
  
  // 랜덤 답변 생성
  const answers = generateRandomAnswers(questions);
  console.log(`\n✅ 랜덤 답변 ${answers.length}개 생성 완료`);
  
  // ============================================
  // 1. Direction 점수 테스트
  // ============================================
  try {
    const directionScores = calculateDirectionScores(answers);
    log('Direction 점수 (동기별 접근/회피)', directionScores);
    
    // 검증: 모든 동기에 대해 점수가 있는지
    const hasAllMotives = directionScores.length === 8;
    const hasValidScores = directionScores.every(d => 
      d.approach >= 0 && d.approach <= 100 &&
      d.avoidance >= 0 && d.avoidance <= 100 &&
      Math.abs(d.approach + d.avoidance - 100) < 1
    );
    
    console.log(`\n✅ Direction 검증:`);
    console.log(`   - 8개 동기 모두 포함: ${hasAllMotives ? '✓' : '✗'}`);
    console.log(`   - 점수 범위 유효 (0-100, 합=100): ${hasValidScores ? '✓' : '✗'}`);
    
    // 0% 0% 문제 확인
    const zeroScores = directionScores.filter(d => d.approach === 0 && d.avoidance === 0);
    if (zeroScores.length > 0) {
      console.log(`   ⚠️ 경고: ${zeroScores.length}개 동기가 0% 0%`);
    } else {
      console.log(`   - 0% 0% 문제 없음: ✓`);
    }
  } catch (e) {
    console.error('❌ Direction 점수 계산 실패:', e);
  }
  
  // ============================================
  // 2. Operation 점수 테스트
  // ============================================
  try {
    const operationScores = calculateOperationScores(answers);
    log('Operation 점수 (운영방식 5축)', operationScores);
    
    // 검증
    const expectedAxes = ['rhythm', 'recovery', 'relay', 'resistance', 'scope'];
    const hasExpectedAxes = expectedAxes.every(axis => 
      operationScores.some(op => op.axis === axis)
    );
    
    // pole1, pole2가 한국어인지 확인
    const hasKoreanPoles = operationScores.every(op => 
      /[가-힣]/.test(op.pole1) && /[가-힣]/.test(op.pole2)
    );
    
    console.log(`\n✅ Operation 검증:`);
    console.log(`   - 5개 축 모두 포함: ${hasExpectedAxes ? '✓' : '✗'}`);
    console.log(`   - pole 이름 한국어: ${hasKoreanPoles ? '✓' : '✗'}`);
    
    // 0% 문제 확인
    const zeroOps = operationScores.filter(op => op.pole1Score === 0 && op.pole2Score === 0);
    if (zeroOps.length > 0) {
      console.log(`   ⚠️ 경고: ${zeroOps.length}개 축이 0점`);
    } else {
      console.log(`   - 0점 문제 없음: ✓`);
    }
  } catch (e) {
    console.error('❌ Operation 점수 계산 실패:', e);
  }
  
  // ============================================
  // 3. Energy 점수 테스트
  // ============================================
  try {
    const energyScores = calculateEnergyScores(answers);
    log('Energy 점수', energyScores);
    
    const hasCharge = Object.keys(energyScores.charge).length > 0;
    const hasDrain = Object.keys(energyScores.drain).length > 0;
    
    console.log(`\n✅ Energy 검증:`);
    console.log(`   - charge 데이터 있음: ${hasCharge ? '✓' : '✗'}`);
    console.log(`   - drain 데이터 있음: ${hasDrain ? '✓' : '✗'}`);
    console.log(`   - sustainability: ${energyScores.sustainability}`);
    console.log(`   - burnoutRisk: ${energyScores.burnoutRisk}`);
  } catch (e) {
    console.error('❌ Energy 점수 계산 실패:', e);
  }
  
  // ============================================
  // 4. Conflict 점수 테스트
  // ============================================
  try {
    const conflictScores = calculateConflictScores(answers);
    log('Conflict 점수', conflictScores.slice(0, 5)); // 상위 5개만
    
    console.log(`\n✅ Conflict 검증:`);
    console.log(`   - 갈등 쌍 수: ${conflictScores.length}`);
    
    if (conflictScores.length > 0) {
      const hasValidIntensity = conflictScores.every(c => 
        c.conflictIntensity >= 0 && c.conflictIntensity <= 100
      );
      console.log(`   - 긴장도 범위 유효: ${hasValidIntensity ? '✓' : '✗'}`);
    }
  } catch (e) {
    console.error('❌ Conflict 점수 계산 실패:', e);
  }
  
  // ============================================
  // 5. Context 점수 테스트
  // ============================================
  try {
    const contextScores = calculateContextScores(answers);
    log('Context 점수', contextScores);
    
    const expectedContexts = ['normal', 'pressure', 'crisis', 'growth'];
    const hasAllContexts = expectedContexts.every(ctx => 
      contextScores.some(c => c.context === ctx)
    );
    
    console.log(`\n✅ Context 검증:`);
    console.log(`   - 4개 상황 모두 포함: ${hasAllContexts ? '✓' : '✗'}`);
  } catch (e) {
    console.error('❌ Context 점수 계산 실패:', e);
  }
  
  // ============================================
  // 6. Hidden 점수 테스트
  // ============================================
  try {
    const hiddenScores = calculateHiddenScores(answers);
    log('Hidden 점수', hiddenScores);
    
    console.log(`\n✅ Hidden 검증:`);
    console.log(`   - shadowIntensity: ${hiddenScores.shadowIntensity}`);
    console.log(`   - integrationLevel: ${hiddenScores.integrationLevel}`);
  } catch (e) {
    console.error('❌ Hidden 점수 계산 실패:', e);
  }
  
  // ============================================
  // 7. Maturity 점수 테스트
  // ============================================
  try {
    const maturityScores = calculateMaturityScores(answers);
    log('Maturity 점수', maturityScores);
    
    console.log(`\n✅ Maturity 검증:`);
    console.log(`   - overall: ${maturityScores.overall}`);
    console.log(`   - selfAwareness: ${maturityScores.selfAwareness}`);
  } catch (e) {
    console.error('❌ Maturity 점수 계산 실패:', e);
  }
  
  // ============================================
  // 결과 요약
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log('🎯 테스트 완료');
  console.log('='.repeat(50));
  console.log('\n위 결과에서 다음을 확인하세요:');
  console.log('1. Direction: 모든 동기에 접근/회피 비율이 있는지 (0% 0% 없어야 함)');
  console.log('2. Operation: 5개 축 모두 한국어 pole 이름과 점수가 있는지');
  console.log('3. Energy: charge/drain 데이터가 있는지');
  console.log('4. Conflict: 갈등 쌍과 긴장도가 계산되는지');
  console.log('5. Context: 4개 상황 모두 데이터가 있는지');
  console.log('6. Hidden: shadow/projection 관련 점수가 있는지');
  console.log('7. Maturity: 메타인지 관련 점수가 있는지');
}

runTests().catch(console.error);
