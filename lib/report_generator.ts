/**
 * MET Mythic v5.0 — AI Report Generator (Enhanced)
 * 
 * Full 결과 데이터를 Claude API용 프롬프트로 변환
 * v5 모든 데이터 포함: 메타인지, 갈등지도, 동기발달, 진화예측 등
 */

import type { FullResult } from './full_api';
import type { Archetype, MotiveSource } from './types';

// ============================================
// 보고서 입력 타입 (v5 확장)
// ============================================

export interface SyncResult {
  archetype: {
    archetype: string;
    archetypeName: string;
    archetypeNameEn: string;
    score: number;
    rank: number;
  };
  figure: {
    figure: string;
    figureName: string;
    figureNameEn: string;
    origin: string;
    similarity: number;
    rank: number;
  };
  level: {
    level: 1 | 2 | 3 | 4;
    levelName: string;
    confidence: number;
    signalMatches: string[];
    nextLevelHint: string;
  };
  overallSync: number;
  allArchetypes: Array<{
    archetype: string;
    archetypeName: string;
    score: number;
    rank: number;
  }>;
  allFigures: Array<{
    figure: string;
    figureName: string;
    similarity: number;
    rank: number;
  }>;
}

export interface UserProfile {
  motivation: Record<MotiveSource, number>;
  ignition: {
    competition: number;
    complexity: number;
    deadline: number;
    audience: number;
    autonomy: number;
    crisis: number;
  };
  direction: Record<string, {
    approach: number;
    avoidance: number;
    dominant: 'approach' | 'avoidance';
    balance?: number;
  }>;
  shadow?: {
    surface: string;
    surfaceScore: number;
    hidden: string;
    hiddenScore: number;
    confidence: number;
    evidence: string[];
  };
  contamination?: {
    authentic: string[];
    contaminated: string;
    contaminatedScore: number;
    source: string;
    severity: number;
    evidence: string[];
  };
  
  // v5 확장 데이터
  energy?: {
    charge: Record<string, number>;
    drain: Record<string, number>;
    sustainability: number;
    peakCondition: string;
    burnoutRisk: number;
    recoverySpeed: number;
    energyBalance: number;
  };
  conflicts?: Array<{
    pair: [string, string];
    dominantPole: string;
    balanceRatio: number;
    conflictIntensity: number;
    resolution: string;
  }>;
  contextShifts?: Array<{
    context: string;
    dominantMotive: string;
    motiveShift: Record<string, number>;
    adaptability: number;
    stressResponse: string;
  }>;
  hiddenMotives?: {
    shadowIntensity: number;
    shadowRank: string;
    projectionPattern: string;
    compensationSource: string;
    integrationLevel: number;
    suppressedMotives: string[];
    unconsciousDrivers: string[];
  };
  
  // 🆕 v5 핵심 추가 데이터
  metacognition?: {
    selfAwareness: number;
    decisionClarity: number;
    emotionalRegulation: number;
    cognitiveFlexibility: number;
    overall: number;
    interpretation: string;
  };
  reliability?: {
    overall: number;
    grade: string;
    responseConsistency: number;
    patternValidity: number;
    warnings: string[];
    isValid: boolean;
    recommendation: string;
  };
  uniqueness?: {
    overall: number;
    percentile: number;
    profileShape: number;
    interpretation: string;
    uniqueTraits: string[];
  };
  motiveDevelopment?: Array<{
    motive: string;
    score: number;
    stage: number;
    stageName: string;
    description: string;
    nextStageHint: string;
  }>;
  conflictMap?: {
    pairs: Array<{
      motiveA: string;
      motiveB: string;
      tension: number;
      type: string;
    }>;
    primaryConflict: { motiveA: string; motiveB: string; tension: number } | null;
    overallTension: number;
    interpretation: string;
  };
  motiveEvolution?: {
    currentProfile: string;
    predictedChanges: Array<{
      motive: string;
      currentScore: number;
      predictedDirection: string;
      confidence: number;
      reason: string;
    }>;
    overallTrajectory: string;
    recommendations: string[];
  };
  developmentSuggestions?: Array<{
    area: string;
    priority: string;
    suggestion: string;
    reason: string;
    actionItems: string[];
  }>;
  responseProfile?: {
    pattern: string;
    decisionSpeed: number;
    consistencyOfPace: number;
    fatigueIndicator: number;
  };
}

// ============================================
// 레벨 이름 매핑
// ============================================

const LEVEL_NAMES: Record<Archetype, Record<1 | 2 | 3 | 4, string>> = {
  conqueror: {
    1: '맹목적 파괴자',
    2: '야망의 전사',
    3: '전략적 정복자',
    4: '승패를 초월한 자',
  },
  sage: {
    1: '은둔하는 천재',
    2: '삼고초려의 군사',
    3: '출사표의 승상',
    4: '영원한 지략가',
  },
  creator: {
    1: '불완전한 창작자',
    2: '기술의 연마자',
    3: '걸작의 장인',
    4: '창조의 화신',
  },
  sovereign: {
    1: '힘에 취한 자',
    2: '왕좌의 수호자',
    3: '현명한 통치자',
    4: '영원한 군주',
  },
  healer: {
    1: '상처받은 치유자',
    2: '공감의 손길',
    3: '치유의 대가',
    4: '자비의 화신',
  },
  guardian: {
    1: '과잉 보호자',
    2: '충실한 파수꾼',
    3: '현명한 수호자',
    4: '영원한 방패',
  },
  rebel: {
    1: '무분별한 파괴자',
    2: '대의의 반역자',
    3: '변혁의 선구자',
    4: '자유의 화신',
  },
  explorer: {
    1: '도피하는 방랑자',
    2: '목적의 탐험가',
    3: '지혜로운 모험가',
    4: '영원한 여행자',
  },
};

const NEXT_LEVEL_HINTS: Record<1 | 2 | 3, string> = {
  1: '목적을 찾을 때',
  2: '책임을 받아들일 때',
  3: '한계를 초월할 때',
};

// ============================================
// FullResult → SyncResult 변환
// ============================================

export function convertToSyncResult(result: FullResult): SyncResult {
  const archetype = result.primaryArchetype.archetype as Archetype;
  const level = result.maturity.level;
  
  return {
    archetype: {
      archetype: result.primaryArchetype.archetype,
      archetypeName: result.primaryArchetype.archetypeName,
      archetypeNameEn: result.primaryArchetype.archetypeNameEn,
      score: result.primaryArchetype.score,
      rank: result.primaryArchetype.rank,
    },
    figure: {
      figure: result.primaryFigure.figure,
      figureName: result.primaryFigure.figureName,
      figureNameEn: result.primaryFigure.figureNameEn,
      origin: result.primaryFigure.origin,
      similarity: result.primaryFigure.similarity,
      rank: result.primaryFigure.rank,
    },
    level: {
      level: level,
      levelName: LEVEL_NAMES[archetype]?.[level] || `레벨 ${level}`,
      confidence: result.maturity.overall,
      signalMatches: generateSignalMatches(result),
      nextLevelHint: level < 4 ? NEXT_LEVEL_HINTS[level as 1 | 2 | 3] : '이미 최고 단계입니다',
    },
    overallSync: result.primaryArchetype.score,
    allArchetypes: result.allArchetypes.map(a => ({
      archetype: a.archetype,
      archetypeName: a.archetypeName,
      score: a.score,
      rank: a.rank,
    })),
    allFigures: result.topFigures.map(f => ({
      figure: f.figure,
      figureName: f.figureName,
      similarity: f.similarity,
      rank: f.rank,
    })),
  };
}

function generateSignalMatches(result: FullResult): string[] {
  const signals: string[] = [];
  
  // 성숙도 기반 신호
  if (result.maturity.awareness >= 70) signals.push('높은 자기 인식');
  if (result.maturity.integration >= 70) signals.push('동기 통합 능력');
  if (result.maturity.growth >= 70) signals.push('성장 지향성');
  
  // 메타인지 기반 신호
  if (result.metacognition?.overall >= 70) signals.push('뛰어난 메타인지');
  if (result.metacognition?.selfAwareness >= 75) signals.push('자기 성찰 능력');
  
  // 검증 기반 신호
  if (result.validation.isValid) signals.push('응답 일관성 확인');
  if (result.reliabilityScore?.grade === 'S' || result.reliabilityScore?.grade === 'A') {
    signals.push('높은 응답 신뢰도');
  }
  
  // 동기 기반 신호
  const topMotive = result.motiveScores[0];
  if (topMotive.score >= 80) signals.push(`강한 ${getMotiveName(topMotive.motive)} 동기`);
  
  // 고유성 기반 신호
  if (result.uniqueness?.overall >= 70) signals.push('독특한 동기 패턴');
  
  return signals.length > 0 ? signals : ['분석 중'];
}

function getMotiveName(motive: MotiveSource): string {
  const names: Record<MotiveSource, string> = {
    achievement: '성취',
    mastery: '전문성',
    creation: '창조',
    recognition: '인정',
    connection: '관계',
    security: '안정',
    freedom: '자유',
    adventure: '모험',
  };
  return names[motive] || motive;
}

// ============================================
// FullResult → UserProfile 변환 (v5 완전 확장)
// ============================================

export function convertToUserProfile(result: FullResult): UserProfile {
  // motivation 변환
  const motivation: Record<MotiveSource, number> = {} as Record<MotiveSource, number>;
  for (const score of result.motiveScores) {
    motivation[score.motive] = score.score;
  }
  
  // ignition 변환
  const ignition = {
    competition: 50,
    complexity: 50,
    deadline: 50,
    audience: 50,
    autonomy: 50,
    crisis: 50,
  };
  for (const score of result.ignitionScores) {
    if (score.condition in ignition) {
      ignition[score.condition as keyof typeof ignition] = score.score;
    }
  }
  
  // direction 변환
  const direction: UserProfile['direction'] = {};
  for (const dir of result.directionScores) {
    direction[dir.motive] = {
      approach: dir.approach,
      avoidance: dir.avoidance,
      dominant: dir.dominant,
      balance: dir.balance,
    };
  }
  
  // shadow 변환
  let shadow: UserProfile['shadow'] = undefined;
  if (Object.keys(result.hiddenMotives.shadow).length > 0) {
    const shadowEntries = Object.entries(result.hiddenMotives.shadow);
    if (shadowEntries.length > 0) {
      const [hiddenMotive, hiddenScore] = shadowEntries[0];
      const surfaceMotive = result.motiveScores[0];
      
      shadow = {
        surface: surfaceMotive.motive,
        surfaceScore: surfaceMotive.score,
        hidden: hiddenMotive,
        hiddenScore: hiddenScore as number,
        confidence: 70,
        evidence: result.hiddenMotives.denialIndicators || ['숨겨진 동기 문항 응답 분석'],
      };
    }
  }
  
  // 🆕 v5 데이터 변환
  const profile: UserProfile = {
    motivation,
    ignition,
    direction,
    shadow,
    
    // 에너지
    energy: result.energy ? {
      charge: result.energy.charge as Record<string, number>,
      drain: result.energy.drain as Record<string, number>,
      sustainability: result.energy.sustainability,
      peakCondition: result.energy.peakCondition,
      burnoutRisk: result.energy.burnoutRisk,
      recoverySpeed: result.energy.recoverySpeed,
      energyBalance: result.energy.energyBalance,
    } : undefined,
    
    // 갈등
    conflicts: result.conflicts?.map(c => ({
      pair: c.pair,
      dominantPole: c.dominantPole,
      balanceRatio: c.balanceRatio,
      conflictIntensity: c.conflictIntensity,
      resolution: c.resolution,
    })),
    
    // 상황별 변화
    contextShifts: result.contextShifts?.map(c => ({
      context: c.context,
      dominantMotive: c.dominantMotive,
      motiveShift: c.motiveShift as Record<string, number>,
      adaptability: c.adaptability,
      stressResponse: c.stressResponse,
    })),
    
    // 숨겨진 동기
    hiddenMotives: {
      shadowIntensity: result.hiddenMotives.shadowIntensity,
      shadowRank: result.hiddenMotives.shadowRank,
      projectionPattern: result.hiddenMotives.projectionPattern,
      compensationSource: result.hiddenMotives.compensationSource,
      integrationLevel: result.hiddenMotives.integrationLevel,
      suppressedMotives: result.hiddenMotives.suppressedMotives,
      unconsciousDrivers: result.hiddenMotives.unconsciousDrivers,
    },
    
    // 🆕 메타인지 (핵심!)
    metacognition: result.metacognition ? {
      selfAwareness: result.metacognition.selfAwareness,
      decisionClarity: result.metacognition.decisionClarity,
      emotionalRegulation: result.metacognition.emotionalRegulation,
      cognitiveFlexibility: result.metacognition.cognitiveFlexibility,
      overall: result.metacognition.overall,
      interpretation: result.metacognition.interpretation,
    } : undefined,
    
    // 🆕 신뢰도
    reliability: result.reliabilityScore ? {
      overall: result.reliabilityScore.overall,
      grade: result.reliabilityScore.grade,
      responseConsistency: result.reliabilityScore.responseConsistency,
      patternValidity: result.reliabilityScore.patternValidity,
      warnings: result.reliabilityScore.warnings,
      isValid: result.reliabilityScore.isValid,
      recommendation: result.reliabilityScore.recommendation,
    } : undefined,
    
    // 🆕 고유성
    uniqueness: result.uniqueness ? {
      overall: result.uniqueness.overall,
      percentile: result.uniqueness.percentile,
      profileShape: result.uniqueness.profileShape,
      interpretation: result.uniqueness.interpretation,
      uniqueTraits: result.uniqueness.uniqueTraits,
    } : undefined,
    
    // 🆕 동기 발달 단계
    motiveDevelopment: result.motiveDevelopment?.map(m => ({
      motive: m.motive,
      score: m.score,
      stage: m.stage,
      stageName: m.stageName,
      description: m.description,
      nextStageHint: m.nextStageHint,
    })),
    
    // 🆕 갈등 지도
    conflictMap: result.conflictMap ? {
      pairs: result.conflictMap.pairs.map(p => ({
        motiveA: p.motiveA,
        motiveB: p.motiveB,
        tension: p.tension,
        type: p.type,
      })),
      primaryConflict: result.conflictMap.primaryConflict,
      overallTension: result.conflictMap.overallTension,
      interpretation: result.conflictMap.interpretation,
    } : undefined,
    
    // 🆕 동기 진화 예측
    motiveEvolution: result.motiveEvolution ? {
      currentProfile: result.motiveEvolution.currentProfile,
      predictedChanges: result.motiveEvolution.predictedChanges.map(p => ({
        motive: p.motive,
        currentScore: p.currentScore,
        predictedDirection: p.predictedDirection,
        confidence: p.confidence,
        reason: p.reason,
      })),
      overallTrajectory: result.motiveEvolution.overallTrajectory,
      recommendations: result.motiveEvolution.recommendations,
    } : undefined,
    
    // 🆕 발전 제안
    developmentSuggestions: result.developmentSuggestions?.map(s => ({
      area: s.area,
      priority: s.priority,
      suggestion: s.suggestion,
      reason: s.reason,
      actionItems: s.actionItems,
    })),
    
    // 🆕 응답 패턴
    responseProfile: result.responseTimeScore ? {
      pattern: getResponsePattern(result.responseTimeScore),
      decisionSpeed: result.responseTimeScore.decisionSpeed,
      consistencyOfPace: result.responseTimeScore.consistency,
      fatigueIndicator: result.responseTimeScore.fatigueLevel,
    } : undefined,
  };
  
  return profile;
}

function getResponsePattern(score: any): string {
  if (score.impulsivityRisk > 50) return 'intuitive';
  if (score.avoidanceRisk > 40) return 'avoidant';
  if (score.fatigueLevel > 50 || score.consistency < 50) return 'conflicted';
  if (score.overallQuality >= 70) return 'deliberate';
  return 'mixed';
}

// ============================================
// 보고서 프롬프트 조합 (v5 확장)
// ============================================

export interface ReportGenerationInput {
  syncResult: SyncResult;
  userProfile: UserProfile;
  archetypeMarkdown: string;
  reportPrompt: string;
}

export function buildReportPrompt(input: ReportGenerationInput): string {
  const { syncResult, userProfile, archetypeMarkdown, reportPrompt } = input;
  
  return `${reportPrompt}

=== SYNC_RESULT ===
${JSON.stringify(syncResult, null, 2)}

=== USER_PROFILE (v5 Enhanced) ===
${JSON.stringify(userProfile, null, 2)}

=== ARCHETYPE_MARKDOWN ===
${archetypeMarkdown}

---

# ⚠️ v5 데이터 활용 지침

## 🆕 새로 추가된 데이터 활용법

### 1. 메타인지 (metacognition) 활용
- **selfAwareness**: 자기 인식 수준 → 원형 분석의 깊이 조절
- **decisionClarity**: 결정 명확성 → 커리어 제안의 구체성
- **emotionalRegulation**: 감정 조절 → 스트레스 대처 조언
- **cognitiveFlexibility**: 인지 유연성 → 성장 가능성 예측

보고서에서: "당신의 메타인지 점수 {overall}점은 {interpretation}를 의미합니다..."

### 2. 갈등 지도 (conflictMap) 활용
- **primaryConflict**: 주요 내적 갈등 → CONFLICT 섹션의 핵심
- **overallTension**: 전체 긴장도 → 에너지 소모 패턴
- **interpretation**: AI 해석 그대로 활용 가능

보고서에서: "{motiveA}와 {motiveB} 사이의 긴장(tension: {tension})이 당신의 주요 내적 갈등입니다..."

### 3. 동기 발달 단계 (motiveDevelopment) 활용
- 각 동기의 발달 단계(1~5)를 시각화
- stage 1: 잠재 / 2: 각성 / 3: 발현 / 4: 성숙 / 5: 통합

보고서에서: "당신의 {motive} 동기는 '{stageName}' 단계에 있습니다. {nextStageHint}"

### 4. 동기 진화 예측 (motiveEvolution) 활용
- **predictedDirection**: grow/decline/stable
- **confidence**: 예측 신뢰도
- **overallTrajectory**: 전체 방향성

보고서에서: "향후 당신의 동기 프로파일은 '{overallTrajectory}' 방향으로 진화할 것으로 예측됩니다..."

### 5. 발전 제안 (developmentSuggestions) 활용
- priority: high/medium/low
- actionItems: 구체적 행동 제안

보고서에서: 각 제안을 PRESCRIPTION 섹션에 통합

### 6. 고유성 (uniqueness) 활용
- **percentile**: "상위 {percentile}%의 독특한 프로파일"
- **uniqueTraits**: 고유한 특성 목록

### 7. 응답 신뢰도 (reliability) 활용
- grade S~F로 응답 품질 표시
- warnings가 있으면 해석 주의 언급

---

# 렌더링 보완 지침

## 형식 변환 규칙

### 금지 형식 → 대체 형식

1. **테이블 (|---|) 금지**
   - ✅ **항목**: 내용 (볼드 + 콜론 형태)
   - ✅ 또는 리스트로: "• 항목 — 내용"

2. **ASCII 박스/그래프 금지**
   - ✅ 텍스트로: "87점 (상위 12%)"
   - ✅ 또는 이모지로: "🔥🔥🔥🔥🔥 (87/100)"

---

# 추가 섹션: 메타인지 & 당신의 무기

## 새 섹션 1: METACOGNITION (메타인지 분석)
DASHBOARD 앞에 삽입. metacognition 데이터 기반으로:
- 전체 메타인지 수준 해석
- 4가지 하위 영역 분석
- 개선 방향 제안

## 새 섹션 2: YOUR WEAPON (당신의 무기)
CLOSING 직전에 삽입. 신화 인물의 핵심 무기를 선물.

---

# 최종 체크리스트

✅ 14개 기본 섹션 + 2개 신규 섹션 (METACOGNITION, YOUR WEAPON)
✅ v5 데이터 (메타인지, 갈등지도, 진화예측 등) 적극 활용
✅ 테이블/ASCII 금지 → 리스트/텍스트로 변환
✅ 신화적 서술 유지
✅ 2만자 이상

이제 보고서를 작성해주세요.
`;
}

// ============================================
// 보고서 요청/응답 타입
// ============================================

export interface ReportRequest {
  fullResult: FullResult;
  archetypeMarkdown: string;
}

export interface ReportResponse {
  success: boolean;
  report?: string;
  error?: string;
  tokensUsed?: number;
}

// ============================================
// 보고서 프리뷰 생성 (v5 확장)
// ============================================

export function generateReportPreview(result: FullResult): string {
  const syncResult = convertToSyncResult(result);
  
  const topMotives = result.motiveScores.slice(0, 3);
  const topIgnitions = result.ignitionScores.slice(0, 2);
  
  // v5 데이터 미리보기
  const metacogText = result.metacognition 
    ? `메타인지: ${result.metacognition.overall}점 (${result.metacognition.interpretation.split('.')[0]})`
    : '';
  
  const uniquenessText = result.uniqueness
    ? `고유성: 상위 ${result.uniqueness.percentile}%`
    : '';
  
  const conflictText = result.conflictMap?.primaryConflict
    ? `주요 갈등: ${getMotiveName(result.conflictMap.primaryConflict.motiveA as MotiveSource)} vs ${getMotiveName(result.conflictMap.primaryConflict.motiveB as MotiveSource)}`
    : '';

  return `# MET Mythic Report Preview

## ${syncResult.archetype.archetypeName} (${syncResult.archetype.archetypeNameEn})

> 싱크로율: ${syncResult.overallSync}%

---

### 신화 인물: ${syncResult.figure.figureName}
- 출처: ${syncResult.figure.origin}
- 유사도: ${syncResult.figure.similarity}%

---

### 성숙도 레벨: Lv.${syncResult.level.level}
**${syncResult.level.levelName}**

신뢰도: ${syncResult.level.confidence}%

---

### 동기 원천 Top 3

- **1위**: ${getMotiveName(topMotives[0].motive)} — ${topMotives[0].score}점
- **2위**: ${getMotiveName(topMotives[1].motive)} — ${topMotives[1].score}점
- **3위**: ${getMotiveName(topMotives[2].motive)} — ${topMotives[2].score}점

---

### 점화 조건 Top 2

- ${topIgnitions[0].condition}: ${topIgnitions[0].score}점
- ${topIgnitions[1].condition}: ${topIgnitions[1].score}점

---

### 🆕 v5 분석 미리보기

${metacogText ? `- ${metacogText}` : ''}
${uniquenessText ? `- ${uniquenessText}` : ''}
${conflictText ? `- ${conflictText}` : ''}
${result.reliabilityScore ? `- 응답 신뢰도: ${result.reliabilityScore.grade}등급 (${result.reliabilityScore.overall}점)` : ''}

---

*이것은 미리보기입니다. 전체 AI 보고서를 생성하려면 "AI 보고서 생성" 버튼을 클릭하세요.*
*AI 보고서는 2만자 내외의 상세한 분석을 제공합니다.*
`;
}

export default {
  convertToSyncResult,
  convertToUserProfile,
  buildReportPrompt,
  generateReportPreview,
};
