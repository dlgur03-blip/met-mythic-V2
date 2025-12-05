/**
 * MET Mythic v6.0 — 피드백 수용성 (Feedback Receptivity)
 * 5문항: 비판 수용, 실수 인정, 방어 성향 측정
 */

import type { Question } from '../../lib/types';

export const FEEDBACK_QUESTIONS: Question[] = [
  {
    id: 'FB_REC_001',
    type: 'choice',
    category: 'feedback',
    subcategory: 'receptivity',
    text: '비판적 피드백을 받으면 가장 먼저 드는 생각은?',
    options: [
      { id: 'A', text: '어떻게 개선할지 구체적으로 생각한다', value: 1, scores: { feedback: 'growth', value: 5 } },
      { id: 'B', text: '왜 그렇게 생각하는지 이유를 묻고 싶다', value: 1, scores: { feedback: 'analytical', value: 4 } },
      { id: 'C', text: '일단 기분이 상한다', value: 1, scores: { feedback: 'defensive', value: 2 } },
      { id: 'D', text: '피드백 준 사람의 의도가 궁금하다', value: 1, scores: { feedback: 'suspicious', value: 3 } },
    ],
    metadata: { layer: 7, isLite: false },
  },
  {
    id: 'FB_REC_002',
    type: 'scenario',
    category: 'feedback',
    subcategory: 'receptivity',
    text: '동료가 내 작업에서 실수를 발견해서 알려줬습니다.',
    subtext: '솔직한 반응은?',
    options: [
      { id: 'A', text: '고맙다, 덕분에 고칠 수 있었다', value: 1, scores: { feedback: 'grateful', value: 5 } },
      { id: 'B', text: '내가 왜 못 봤지? 자책스럽다', value: 1, scores: { feedback: 'self_critical', value: 3 } },
      { id: 'C', text: '공개적으로 말하지 말았으면 좋겠다', value: 1, scores: { feedback: 'image_conscious', value: 2 } },
      { id: 'D', text: '그 실수가 정말 문제인가 확인하고 싶다', value: 1, scores: { feedback: 'validating', value: 4 } },
    ],
    metadata: { layer: 7, isLite: true },
  },
  {
    id: 'FB_REC_003',
    type: 'scenario',
    category: 'feedback',
    subcategory: 'receptivity',
    text: '상사가 "이 부분은 다시 해야 할 것 같아"라고 했습니다.',
    subtext: '당신의 반응은?',
    options: [
      { id: 'A', text: '알겠습니다, 어떤 방향으로 수정할까요?', value: 1, scores: { feedback: 'constructive', value: 5 } },
      { id: 'B', text: '왜요? 제가 보기엔 괜찮은데요', value: 1, scores: { feedback: 'resistant', value: 2 } },
      { id: 'C', text: '(속으로) 처음부터 명확하게 말해주지...', value: 1, scores: { feedback: 'blaming', value: 1 } },
      { id: 'D', text: '네, 다시 해볼게요 (하지만 기분이 좀 상함)', value: 1, scores: { feedback: 'compliant_hurt', value: 3 } },
    ],
    metadata: { layer: 7, isLite: true },
  },
  {
    id: 'FB_REC_004',
    type: 'choice',
    category: 'feedback',
    subcategory: 'receptivity',
    text: '팀 회고에서 개선점을 이야기할 때 나는?',
    options: [
      { id: 'A', text: '내 실수도 솔직하게 이야기한다', value: 1, scores: { feedback: 'transparent', value: 5 } },
      { id: 'B', text: '시스템 문제 위주로 이야기한다', value: 1, scores: { feedback: 'deflecting', value: 3 } },
      { id: 'C', text: '듣는 편이다', value: 1, scores: { feedback: 'passive', value: 2 } },
      { id: 'D', text: '다른 사람 실수를 (부드럽게) 지적한다', value: 1, scores: { feedback: 'critical', value: 2 } },
    ],
    metadata: { layer: 7, isLite: false },
  },
  {
    id: 'FB_REC_005',
    type: 'scenario',
    category: 'feedback',
    subcategory: 'receptivity',
    text: '"네가 틀렸어"라는 말을 들으면?',
    subtext: '첫 반응은?',
    options: [
      { id: 'A', text: '어디가 틀렸는지 궁금하다', value: 1, scores: { feedback: 'curious', value: 5 } },
      { id: 'B', text: '일단 방어적이 된다', value: 1, scores: { feedback: 'defensive', value: 1 } },
      { id: 'C', text: '맞다면 인정한다', value: 1, scores: { feedback: 'accepting', value: 4 } },
      { id: 'D', text: '그 사람이 맞는지 먼저 확인하고 싶다', value: 1, scores: { feedback: 'counter_validating', value: 3 } },
    ],
    metadata: { layer: 7, isLite: true },
  },
];

export default FEEDBACK_QUESTIONS;
