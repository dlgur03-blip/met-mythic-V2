/**
 * MET Mythic v5 — Talent Card Generator
 * 
 * 인사담당자/리더를 위한 게임 스타일 인재 카드 HTML 생성
 * 
 * 핵심 질문:
 * - 이 사람의 강점은 무엇인가?
 * - 어떻게 일을 시키면 잘 할까?
 * - 얼마나 인재인가?
 */

import type { FullResult } from './full_api';
import { getTheme } from './archetypeThemes';

// ============================================
// 타입 정의
// ============================================

interface TalentGrade {
  overall: 'S' | 'A' | 'B' | 'C' | 'D';
  potential: 'S' | 'A' | 'B' | 'C' | 'D';
  reliability: 'S' | 'A' | 'B' | 'C' | 'D';
  uniqueness: 'S' | 'A' | 'B' | 'C' | 'D';
}

interface CoreStat {
  name: string;
  nameEn: string;
  value: number;
  description: string;
  icon: string;
}

interface IgnitionButton {
  condition: string;
  name: string;
  power: number;
  effect: string;
  icon: string;
}

interface RoleFit {
  role: string;
  fit: number;
  reason: string;
  icon: string;
}

interface ManagementTip {
  type: 'do' | 'dont';
  tip: string;
  reason: string;
}

// ============================================
// 데이터 변환 함수들
// ============================================

const MOTIVE_NAMES: Record<string, string> = {
  achievement: '성취', mastery: '전문성', creation: '창조', recognition: '인정',
  connection: '관계', security: '안정', freedom: '자유', adventure: '모험',
};

const IGNITION_NAMES: Record<string, string> = {
  competition: '경쟁', complexity: '복잡성', deadline: '마감',
  audience: '시선', autonomy: '자율', crisis: '위기',
};

const IGNITION_ICONS: Record<string, string> = {
  competition: '⚔️', complexity: '🧩', deadline: '⏰',
  audience: '👥', autonomy: '🦅', crisis: '🔥',
};

const IGNITION_EFFECTS: Record<string, string> = {
  competition: '경쟁 상황에서 승부욕이 폭발합니다',
  complexity: '복잡한 문제일수록 집중력이 올라갑니다',
  deadline: '마감이 다가오면 초인적 집중을 발휘합니다',
  audience: '주목받을 때 퍼포먼스가 극대화됩니다',
  autonomy: '자율권이 주어지면 창의성이 폭발합니다',
  crisis: '위기 상황에서 진가를 발휘합니다',
};

// 등급 계산
function calculateTalentGrade(result: FullResult): TalentGrade {
  const toGrade = (score: number): 'S' | 'A' | 'B' | 'C' | 'D' => {
    if (score >= 90) return 'S';
    if (score >= 75) return 'A';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C';
    return 'D';
  };

  // 종합 점수 계산
  const syncRate = result.primaryArchetype.score;
  const metacog = result.metacognition?.overall || 50;
  const reliability = result.reliabilityScore?.overall || 50;
  const uniqueness = result.uniqueness?.overall || 50;
  
  const overallScore = (syncRate * 0.3) + (metacog * 0.25) + (reliability * 0.25) + (uniqueness * 0.2);
  
  return {
    overall: toGrade(overallScore),
    potential: toGrade((metacog + result.maturity.level * 20) / 2 + 10),
    // 🔧 FIX: F 등급은 D로 매핑
    reliability: (result.reliabilityScore?.grade === 'F' ? 'D' : result.reliabilityScore?.grade) || toGrade(reliability),
    uniqueness: toGrade(100 - (result.uniqueness?.percentile || 50)), // percentile이 낮을수록 고유
  };
}

// 핵심 스탯 추출 (HR 관점)
function extractCoreStats(result: FullResult): CoreStat[] {
  const stats: CoreStat[] = [];
  
  // 1. 성과 지향성 (성취 + 인정)
  const achievementScore = result.motiveScores.find(m => m.motive === 'achievement')?.score || 0;
  const recognitionScore = result.motiveScores.find(m => m.motive === 'recognition')?.score || 0;
  stats.push({
    name: '성과 지향',
    nameEn: 'Result-Driven',
    value: Math.round((achievementScore + recognitionScore) / 2),
    description: '목표 달성과 성과에 대한 욕구',
    icon: '🎯',
  });
  
  // 2. 전문성 (통달 + 창조)
  const masteryScore = result.motiveScores.find(m => m.motive === 'mastery')?.score || 0;
  const creationScore = result.motiveScores.find(m => m.motive === 'creation')?.score || 0;
  stats.push({
    name: '전문성',
    nameEn: 'Expertise',
    value: Math.round((masteryScore + creationScore) / 2),
    description: '깊이 있는 지식과 기술 추구',
    icon: '🔬',
  });
  
  // 3. 협업력 (연결 + 안정)
  const connectionScore = result.motiveScores.find(m => m.motive === 'connection')?.score || 0;
  const securityScore = result.motiveScores.find(m => m.motive === 'security')?.score || 0;
  stats.push({
    name: '협업력',
    nameEn: 'Teamwork',
    value: Math.round((connectionScore + securityScore) / 2),
    description: '팀과 조화롭게 일하는 능력',
    icon: '🤝',
  });
  
  // 4. 자율성 (자유 + 모험)
  const freedomScore = result.motiveScores.find(m => m.motive === 'freedom')?.score || 0;
  const adventureScore = result.motiveScores.find(m => m.motive === 'adventure')?.score || 0;
  stats.push({
    name: '자율성',
    nameEn: 'Autonomy',
    value: Math.round((freedomScore + adventureScore) / 2),
    description: '독립적으로 판단하고 행동하는 성향',
    icon: '🦅',
  });
  
  // 5. 메타인지 (자기인식)
  stats.push({
    name: '자기인식',
    nameEn: 'Self-Awareness',
    value: result.metacognition?.overall || 50,
    description: '자신의 강점과 약점을 이해하는 능력',
    icon: '🧠',
  });
  
  // 6. 스트레스 내성
  const conflictTension = result.conflictMap?.overallTension || 50;
  const stressResistance = Math.max(0, 100 - conflictTension);
  stats.push({
    name: '스트레스 내성',
    nameEn: 'Resilience',
    value: Math.round(stressResistance),
    description: '압박 상황에서의 안정성',
    icon: '🛡️',
  });
  
  return stats;
}

// 점화 버튼 추출
function extractIgnitionButtons(result: FullResult): IgnitionButton[] {
  return result.ignitionScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(ig => ({
      condition: ig.condition,
      name: IGNITION_NAMES[ig.condition] || ig.condition,
      power: ig.score,
      effect: IGNITION_EFFECTS[ig.condition] || '특별한 동기부여가 발생합니다',
      icon: IGNITION_ICONS[ig.condition] || '⚡',
    }));
}

// 역할 적합도 계산
function calculateRoleFits(result: FullResult): RoleFit[] {
  const motives = Object.fromEntries(
    result.motiveScores.map(m => [m.motive, m.score])
  );
  
  const roles: RoleFit[] = [];
  
  // 리더십
  const leadershipFit = Math.round(
    (motives.recognition || 0) * 0.3 +
    (motives.achievement || 0) * 0.3 +
    (result.metacognition?.overall || 50) * 0.4
  );
  roles.push({
    role: '리더',
    fit: leadershipFit,
    reason: leadershipFit > 70 ? '비전 제시와 팀 통솔에 강점' : '팀 관리보다 개인 기여에 적합',
    icon: '👑',
  });
  
  // 전문가
  const expertFit = Math.round(
    (motives.mastery || 0) * 0.4 +
    (motives.creation || 0) * 0.3 +
    (motives.achievement || 0) * 0.3
  );
  roles.push({
    role: '전문가',
    fit: expertFit,
    reason: expertFit > 70 ? '깊이 있는 전문성 개발에 적합' : '다양한 영역을 넓게 다루는 것이 적합',
    icon: '🎓',
  });
  
  // 기획자
  const plannerFit = Math.round(
    (motives.creation || 0) * 0.35 +
    (motives.mastery || 0) * 0.25 +
    (result.metacognition?.cognitiveFlexibility || 50) * 0.4
  );
  roles.push({
    role: '기획자',
    fit: plannerFit,
    reason: plannerFit > 70 ? '창의적 아이디어와 구조화 능력' : '실행과 운영에 더 적합',
    icon: '💡',
  });
  
  // 실행자
  const executorFit = Math.round(
    (motives.achievement || 0) * 0.35 +
    (motives.security || 0) * 0.25 +
    (100 - (result.conflictMap?.overallTension || 50)) * 0.4
  );
  roles.push({
    role: '실행자',
    fit: executorFit,
    reason: executorFit > 70 ? '목표를 향한 추진력과 안정성' : '기획이나 전략 역할이 더 적합',
    icon: '⚡',
  });
  
  // 협력자
  const collaboratorFit = Math.round(
    (motives.connection || 0) * 0.4 +
    (motives.security || 0) * 0.3 +
    (result.metacognition?.emotionalRegulation || 50) * 0.3
  );
  roles.push({
    role: '협력자',
    fit: collaboratorFit,
    reason: collaboratorFit > 70 ? '팀 조화와 관계 구축에 강점' : '독립적 업무 환경이 더 적합',
    icon: '🤝',
  });
  
  // 혁신가
  const innovatorFit = Math.round(
    (motives.freedom || 0) * 0.3 +
    (motives.adventure || 0) * 0.3 +
    (motives.creation || 0) * 0.4
  );
  roles.push({
    role: '혁신가',
    fit: innovatorFit,
    reason: innovatorFit > 70 ? '새로운 시도와 변화 주도에 적합' : '안정적 환경에서 역량 발휘',
    icon: '🚀',
  });
  
  return roles.sort((a, b) => b.fit - a.fit);
}

// 관리 팁 생성
function generateManagementTips(result: FullResult): ManagementTip[] {
  const tips: ManagementTip[] = [];
  const motives = Object.fromEntries(
    result.motiveScores.map(m => [m.motive, m.score])
  );
  
  // 점화조건 기반
  const topIgnition = result.ignitionScores.sort((a, b) => b.score - a.score)[0];
  if (topIgnition) {
    switch (topIgnition.condition) {
      case 'competition':
        tips.push({ type: 'do', tip: '팀 내 건강한 경쟁 요소를 만드세요', reason: '경쟁에서 최고 성과를 냅니다' });
        tips.push({ type: 'dont', tip: '항상 협력만 강조하지 마세요', reason: '경쟁 없는 환경은 동기를 저하시킵니다' });
        break;
      case 'complexity':
        tips.push({ type: 'do', tip: '복잡하고 도전적인 프로젝트를 맡기세요', reason: '난이도가 높을수록 집중합니다' });
        tips.push({ type: 'dont', tip: '반복적이고 단순한 업무만 주지 마세요', reason: '지루함은 이탈을 유발합니다' });
        break;
      case 'deadline':
        tips.push({ type: 'do', tip: '명확한 마감일을 설정하세요', reason: '마감이 가까워질수록 집중력이 폭발합니다' });
        tips.push({ type: 'dont', tip: '"천천히 해도 돼"라고 하지 마세요', reason: '시간 압박 없이는 동력을 잃습니다' });
        break;
      case 'audience':
        tips.push({ type: 'do', tip: '발표, 프레젠테이션 기회를 주세요', reason: '주목받을 때 최고 퍼포먼스를 발휘합니다' });
        tips.push({ type: 'dont', tip: '뒤에서 묵묵히 일만 시키지 마세요', reason: '인정받지 못하면 동기가 떨어집니다' });
        break;
      case 'autonomy':
        tips.push({ type: 'do', tip: '"어떻게"는 본인이 결정하게 하세요', reason: '자율성이 주어지면 창의성이 폭발합니다' });
        tips.push({ type: 'dont', tip: '마이크로매니징 하지 마세요', reason: '통제는 성과를 급격히 저하시킵니다' });
        break;
      case 'crisis':
        tips.push({ type: 'do', tip: '어려운 상황에서 투입하세요', reason: '위기에서 진가를 발휘하는 타입입니다' });
        tips.push({ type: 'dont', tip: '항상 안정적인 업무만 주지 마세요', reason: '도전이 없으면 성장을 멈춥니다' });
        break;
    }
  }
  
  // 동기 기반 추가 팁
  if ((motives.freedom || 0) > 75) {
    tips.push({ type: 'do', tip: '유연한 근무 환경을 제공하세요', reason: '자유 동기가 매우 높습니다' });
  }
  if ((motives.connection || 0) > 75) {
    tips.push({ type: 'do', tip: '팀 활동과 1:1 면담을 자주 하세요', reason: '관계가 동기부여의 핵심입니다' });
  }
  if ((motives.security || 0) < 30) {
    tips.push({ type: 'dont', tip: '안정성만 강조하지 마세요', reason: '변화와 도전을 원합니다' });
  }
  
  // 갈등 기반
  if (result.conflictMap?.overallTension && result.conflictMap.overallTension > 50) {
    tips.push({ 
      type: 'do', 
      tip: '내적 갈등을 이해하고 업무를 조율하세요', 
      reason: `${MOTIVE_NAMES[result.conflictMap.primaryConflict?.motiveA || '']}와 ${MOTIVE_NAMES[result.conflictMap.primaryConflict?.motiveB || '']} 사이에서 갈등 중` 
    });
  }
  
  return tips.slice(0, 6);
}

// ============================================
// HTML 생성
// ============================================

export function generateTalentCardHtml(result: FullResult, aiReport?: string): string {
  const theme = getTheme(result.primaryArchetype.archetype);
  const grade = calculateTalentGrade(result);
  const coreStats = extractCoreStats(result);
  const ignitionButtons = extractIgnitionButtons(result);
  const roleFits = calculateRoleFits(result);
  const managementTips = generateManagementTips(result);
  
  const now = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  
  // 등급 색상
  const gradeColors: Record<string, string> = {
    'S': '#FFD700', 'A': '#9C27B0', 'B': '#2196F3', 'C': '#4CAF50', 'D': '#9E9E9E'
  };
  
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🎮 인재 카드 - ${result.primaryArchetype.archetypeName}: ${result.primaryFigure.figureName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Noto Sans KR', sans-serif;
      background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%);
      color: #e0e0e0;
      min-height: 100vh;
      line-height: 1.6;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
    }
    
    /* ========== 히어로 카드 ========== */
    .hero-card {
      background: linear-gradient(180deg, ${theme.primary}44 0%, ${theme.bgDark}ee 100%);
      border: 2px solid ${theme.secondary}44;
      border-radius: 24px;
      padding: 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
      margin-bottom: 24px;
    }
    
    .hero-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, ${theme.accent}, ${theme.secondary}, ${theme.accent});
    }
    
    .grade-badge {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, ${gradeColors[grade.overall]}44 0%, ${gradeColors[grade.overall]}22 100%);
      border: 3px solid ${gradeColors[grade.overall]};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 900;
      color: ${gradeColors[grade.overall]};
      box-shadow: 0 0 30px ${gradeColors[grade.overall]}66;
    }
    
    .archetype-emoji {
      font-size: 80px;
      margin-bottom: 16px;
      filter: drop-shadow(0 0 20px ${theme.accent}66);
    }
    
    .archetype-name {
      font-size: 32px;
      font-weight: 900;
      color: white;
      margin-bottom: 4px;
      text-shadow: 0 0 20px ${theme.accent}66;
    }
    
    .archetype-name-en {
      font-size: 14px;
      color: ${theme.secondary};
      letter-spacing: 2px;
      margin-bottom: 16px;
    }
    
    .figure-name {
      font-size: 24px;
      color: ${theme.accent};
      margin-bottom: 4px;
    }
    
    .figure-origin {
      font-size: 14px;
      color: ${theme.secondary};
    }
    
    .sync-rate {
      margin-top: 24px;
      display: inline-flex;
      align-items: baseline;
      gap: 8px;
      background: ${theme.primary}66;
      padding: 12px 24px;
      border-radius: 100px;
    }
    
    .sync-value {
      font-size: 48px;
      font-weight: 900;
      color: ${theme.accent};
    }
    
    .sync-label {
      font-size: 14px;
      color: ${theme.secondary};
    }
    
    .level-badge {
      margin-top: 16px;
      display: inline-block;
      background: linear-gradient(90deg, ${theme.accent}44, ${theme.secondary}44);
      padding: 8px 20px;
      border-radius: 100px;
      font-size: 14px;
      color: white;
    }
    
    /* ========== 섹션 공통 ========== */
    .section {
      background: rgba(30, 30, 60, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 28px;
      margin-bottom: 24px;
    }
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      font-weight: 700;
      color: white;
      margin-bottom: 20px;
    }
    
    .section-title .icon {
      font-size: 28px;
    }
    
    .section-subtitle {
      font-size: 13px;
      color: ${theme.secondary};
      margin-left: auto;
    }
    
    /* ========== 등급 카드 ========== */
    .grades-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    
    .grade-card {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
    }
    
    .grade-card .label {
      font-size: 12px;
      color: ${theme.secondary};
      margin-bottom: 8px;
    }
    
    .grade-card .value {
      font-size: 36px;
      font-weight: 900;
    }
    
    /* ========== 스탯 바 ========== */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .stat-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: white;
    }
    
    .stat-name .icon {
      font-size: 20px;
    }
    
    .stat-value {
      font-weight: 700;
      color: ${theme.accent};
    }
    
    .stat-bar {
      height: 12px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 6px;
      overflow: hidden;
    }
    
    .stat-fill {
      height: 100%;
      background: linear-gradient(90deg, ${theme.primary}, ${theme.accent});
      border-radius: 6px;
      transition: width 1s ease;
    }
    
    .stat-desc {
      font-size: 12px;
      color: ${theme.secondary};
    }
    
    /* ========== 점화 버튼 ========== */
    .ignition-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    
    .ignition-button {
      background: linear-gradient(180deg, rgba(255, 100, 50, 0.2) 0%, rgba(255, 50, 50, 0.1) 100%);
      border: 2px solid rgba(255, 100, 50, 0.4);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .ignition-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #ff6b35, #f7931e);
    }
    
    .ignition-icon {
      font-size: 36px;
      margin-bottom: 8px;
    }
    
    .ignition-name {
      font-size: 16px;
      font-weight: 700;
      color: #ff6b35;
      margin-bottom: 4px;
    }
    
    .ignition-power {
      font-size: 24px;
      font-weight: 900;
      color: white;
      margin-bottom: 8px;
    }
    
    .ignition-effect {
      font-size: 12px;
      color: #ffa07a;
      line-height: 1.4;
    }
    
    /* ========== 역할 적합도 ========== */
    .roles-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .role-item {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(0, 0, 0, 0.2);
      padding: 16px 20px;
      border-radius: 12px;
    }
    
    .role-icon {
      font-size: 28px;
      width: 50px;
      text-align: center;
    }
    
    .role-info {
      flex: 1;
    }
    
    .role-name {
      font-weight: 700;
      color: white;
      margin-bottom: 4px;
    }
    
    .role-reason {
      font-size: 13px;
      color: ${theme.secondary};
    }
    
    .role-bar-container {
      width: 120px;
    }
    
    .role-bar {
      height: 8px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 4px;
    }
    
    .role-fill {
      height: 100%;
      border-radius: 4px;
    }
    
    .role-fit-value {
      font-size: 14px;
      font-weight: 700;
      text-align: right;
    }
    
    /* ========== 관리 팁 ========== */
    .tips-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .tip-card {
      padding: 20px;
      border-radius: 12px;
    }
    
    .tip-card.do {
      background: rgba(76, 175, 80, 0.15);
      border: 1px solid rgba(76, 175, 80, 0.3);
    }
    
    .tip-card.dont {
      background: rgba(244, 67, 54, 0.15);
      border: 1px solid rgba(244, 67, 54, 0.3);
    }
    
    .tip-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-weight: 700;
    }
    
    .tip-card.do .tip-header {
      color: #4CAF50;
    }
    
    .tip-card.dont .tip-header {
      color: #F44336;
    }
    
    .tip-content {
      font-size: 14px;
      color: white;
      margin-bottom: 8px;
    }
    
    .tip-reason {
      font-size: 12px;
      color: ${theme.secondary};
    }
    
    /* ========== 성장 예측 ========== */
    .evolution-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .evolution-item {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(0, 0, 0, 0.2);
      padding: 12px 16px;
      border-radius: 10px;
    }
    
    .evolution-motive {
      font-weight: 600;
      color: white;
      width: 80px;
    }
    
    .evolution-score {
      color: ${theme.secondary};
      width: 50px;
    }
    
    .evolution-direction {
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
    }
    
    .evolution-direction.grow {
      background: rgba(76, 175, 80, 0.3);
      color: #81C784;
    }
    
    .evolution-direction.stable {
      background: rgba(158, 158, 158, 0.3);
      color: #BDBDBD;
    }
    
    .evolution-direction.decline {
      background: rgba(244, 67, 54, 0.3);
      color: #E57373;
    }
    
    .evolution-confidence {
      font-size: 12px;
      color: ${theme.secondary};
      margin-left: auto;
    }
    
    /* ========== AI 보고서 ========== */
    .ai-report {
      background: rgba(30, 30, 60, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 32px;
      margin-top: 32px;
    }
    
    .ai-report h2 {
      color: ${theme.accent};
      font-size: 20px;
      margin: 24px 0 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid ${theme.secondary}33;
    }
    
    .ai-report h3 {
      color: white;
      font-size: 16px;
      margin: 16px 0 8px;
    }
    
    .ai-report p {
      color: #d0d0d0;
      margin-bottom: 12px;
    }
    
    .ai-report strong {
      color: ${theme.accent};
    }
    
    .ai-report ul, .ai-report ol {
      margin: 12px 0;
      padding-left: 24px;
      color: #c0c0c0;
    }
    
    .ai-report li {
      margin-bottom: 6px;
    }
    
    .ai-report blockquote {
      background: ${theme.primary}22;
      border-left: 4px solid ${theme.accent};
      padding: 16px 20px;
      margin: 16px 0;
      border-radius: 0 12px 12px 0;
      font-style: italic;
      color: ${theme.secondary};
    }
    
    /* ========== 푸터 ========== */
    .footer {
      text-align: center;
      padding: 32px;
      color: ${theme.secondary};
      font-size: 14px;
    }
    
    .footer-logo {
      font-size: 32px;
      margin-bottom: 8px;
    }
    
    /* ========== 반응형 ========== */
    @media (max-width: 768px) {
      .grades-grid { grid-template-columns: repeat(2, 1fr); }
      .stats-grid { grid-template-columns: 1fr; }
      .ignition-grid { grid-template-columns: 1fr; }
      .tips-grid { grid-template-columns: 1fr; }
      .hero-card { padding: 24px; }
      .grade-badge { width: 60px; height: 60px; font-size: 28px; }
      .archetype-emoji { font-size: 60px; }
      .archetype-name { font-size: 24px; }
      .sync-value { font-size: 36px; }
    }
    
    @media print {
      body { background: white; color: #333; }
      .section { border: 1px solid #ddd; }
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- ========== 히어로 카드 ========== -->
    <div class="hero-card">
      <div class="grade-badge">${grade.overall}</div>
      <div class="archetype-emoji">${theme.emoji}</div>
      <div class="archetype-name">${result.primaryArchetype.archetypeName}</div>
      <div class="archetype-name-en">THE ${result.primaryArchetype.archetype.toUpperCase()}</div>
      <div class="figure-name">${result.primaryFigure.figureName}</div>
      <div class="figure-origin">${result.primaryFigure.origin}</div>
      <div class="sync-rate">
        <span class="sync-value">${result.primaryArchetype.score.toFixed(0)}</span>
        <span class="sync-label">% 싱크로율</span>
      </div>
      <div class="level-badge">🎮 Lv.${result.maturity.level} — ${getLevelName(result.primaryArchetype.archetype, result.maturity.level)}</div>
    </div>
    
    <!-- ========== 인재 등급 ========== -->
    <div class="section">
      <div class="section-title">
        <span class="icon">🏆</span>
        인재 등급
        <span class="section-subtitle">Talent Grade</span>
      </div>
      <div class="grades-grid">
        <div class="grade-card">
          <div class="label">종합 등급</div>
          <div class="value" style="color: ${gradeColors[grade.overall]}">${grade.overall}</div>
        </div>
        <div class="grade-card">
          <div class="label">성장 잠재력</div>
          <div class="value" style="color: ${gradeColors[grade.potential]}">${grade.potential}</div>
        </div>
        <div class="grade-card">
          <div class="label">응답 신뢰도</div>
          <div class="value" style="color: ${gradeColors[grade.reliability]}">${grade.reliability}</div>
        </div>
        <div class="grade-card">
          <div class="label">프로파일 희소성</div>
          <div class="value" style="color: ${gradeColors[grade.uniqueness]}">${grade.uniqueness}</div>
        </div>
      </div>
    </div>
    
    <!-- ========== 핵심 스탯 ========== -->
    <div class="section">
      <div class="section-title">
        <span class="icon">📊</span>
        핵심 역량
        <span class="section-subtitle">Core Stats</span>
      </div>
      <div class="stats-grid">
        ${coreStats.map(stat => `
          <div class="stat-item">
            <div class="stat-header">
              <span class="stat-name"><span class="icon">${stat.icon}</span> ${stat.name}</span>
              <span class="stat-value">${stat.value}</span>
            </div>
            <div class="stat-bar">
              <div class="stat-fill" style="width: ${stat.value}%"></div>
            </div>
            <div class="stat-desc">${stat.description}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- ========== 점화 버튼 ========== -->
    <div class="section">
      <div class="section-title">
        <span class="icon">🔥</span>
        점화 버튼
        <span class="section-subtitle">이 버튼을 누르면 폭발합니다</span>
      </div>
      <div class="ignition-grid">
        ${ignitionButtons.map(btn => `
          <div class="ignition-button">
            <div class="ignition-icon">${btn.icon}</div>
            <div class="ignition-name">${btn.name}</div>
            <div class="ignition-power">${btn.power}%</div>
            <div class="ignition-effect">${btn.effect}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- ========== 역할 적합도 ========== -->
    <div class="section">
      <div class="section-title">
        <span class="icon">🎯</span>
        역할 적합도
        <span class="section-subtitle">어떤 역할에 적합할까?</span>
      </div>
      <div class="roles-list">
        ${roleFits.slice(0, 4).map(role => `
          <div class="role-item">
            <div class="role-icon">${role.icon}</div>
            <div class="role-info">
              <div class="role-name">${role.role}</div>
              <div class="role-reason">${role.reason}</div>
            </div>
            <div class="role-bar-container">
              <div class="role-bar">
                <div class="role-fill" style="width: ${role.fit}%; background: ${role.fit >= 70 ? 'linear-gradient(90deg, #4CAF50, #81C784)' : role.fit >= 50 ? 'linear-gradient(90deg, #FFC107, #FFD54F)' : 'linear-gradient(90deg, #9E9E9E, #BDBDBD)'}"></div>
              </div>
              <div class="role-fit-value" style="color: ${role.fit >= 70 ? '#81C784' : role.fit >= 50 ? '#FFD54F' : '#BDBDBD'}">${role.fit}%</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- ========== 관리 팁 ========== -->
    <div class="section">
      <div class="section-title">
        <span class="icon">💼</span>
        관리자를 위한 팁
        <span class="section-subtitle">이렇게 하면 최고 성과를 냅니다</span>
      </div>
      <div class="tips-grid">
        ${managementTips.map(tip => `
          <div class="tip-card ${tip.type}">
            <div class="tip-header">
              ${tip.type === 'do' ? '✅ DO' : '❌ DON\'T'}
            </div>
            <div class="tip-content">${tip.tip}</div>
            <div class="tip-reason">→ ${tip.reason}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- ========== 성장 예측 ========== -->
    ${result.motiveEvolution ? `
    <div class="section">
      <div class="section-title">
        <span class="icon">🔮</span>
        성장 예측
        <span class="section-subtitle">${result.motiveEvolution.overallTrajectory}</span>
      </div>
      <div class="evolution-list">
        ${result.motiveEvolution.predictedChanges.slice(0, 5).map(change => `
          <div class="evolution-item">
            <div class="evolution-motive">${MOTIVE_NAMES[change.motive] || change.motive}</div>
            <div class="evolution-score">${change.currentScore}점</div>
            <div class="evolution-direction ${change.predictedDirection}">
              ${change.predictedDirection === 'grow' ? '↑ 성장' : change.predictedDirection === 'decline' ? '↓ 감소' : '→ 유지'}
            </div>
            <div class="evolution-confidence">신뢰도 ${change.confidence}%</div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
    
    <!-- ========== AI 상세 보고서 ========== -->
    ${aiReport ? `
    <div class="ai-report">
      <div class="section-title">
        <span class="icon">🤖</span>
        AI 상세 분석
        <span class="section-subtitle">Powered by Gemini</span>
      </div>
      ${markdownToHtml(aiReport)}
    </div>
    ` : ''}
    
    <!-- ========== 푸터 ========== -->
    <div class="footer">
      <div class="footer-logo">🧭</div>
      <div>MET Mythic — 당신의 동기 원형을 찾아드립니다</div>
      <div style="margin-top: 8px; font-size: 12px; color: #666;">생성일: ${now}</div>
    </div>
    
  </div>
</body>
</html>`;
}

// 레벨 이름
function getLevelName(archetype: string, level: number): string {
  const levelNames: Record<string, Record<number, string>> = {
    conqueror: { 1: '맹목적 파괴자', 2: '야망의 전사', 3: '전략적 정복자', 4: '승패를 초월한 자' },
    sage: { 1: '은둔하는 천재', 2: '삼고초려의 군사', 3: '출사표의 승상', 4: '영원한 지략가' },
    creator: { 1: '불완전한 창작자', 2: '기술의 연마자', 3: '걸작의 장인', 4: '창조의 화신' },
    sovereign: { 1: '힘에 취한 자', 2: '왕좌의 수호자', 3: '현명한 통치자', 4: '영원한 군주' },
    healer: { 1: '상처받은 치유자', 2: '공감의 손길', 3: '치유의 대가', 4: '자비의 화신' },
    guardian: { 1: '과잉 보호자', 2: '충실한 파수꾼', 3: '현명한 수호자', 4: '영원한 방패' },
    rebel: { 1: '무분별한 파괴자', 2: '대의의 반역자', 3: '변혁의 선구자', 4: '자유의 화신' },
    explorer: { 1: '도피하는 방랑자', 2: '목적의 탐험가', 3: '지혜로운 모험가', 4: '영원한 여행자' },
  };
  return levelNames[archetype.toLowerCase()]?.[level] || `레벨 ${level}`;
}

// 간단한 마크다운 → HTML
function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

// Export
export default generateTalentCardHtml;
