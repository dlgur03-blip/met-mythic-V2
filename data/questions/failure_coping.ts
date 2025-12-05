/**
 * MET Mythic v6.0 — 실패 대처 방식 (Failure Coping)
 * 5문항: 회복 탄력성, 실패 후 행동 패턴, 자기 보호 메커니즘 측정
 */

import type { Question } from '../../lib/types';

export const FAILURE_COPING_QUESTIONS: Question[] = [
  {
    id: 'FC_COP_001',
    type: 'choice',
    category: 'failure_coping',
    subcategory: 'initial_response',
    text: '중요한 프로젝트가 실패했습니다. 가장 먼저 하는 것은?',
    options: [
      { id: 'A', text: '무엇이 잘못됐는지 분석한다', value: 1, scores: { failure: 'analytical', motive: 'mastery', value: 5 } },
      { id: 'B', text: '일단 쉬면서 마음을 정리한다', value: 1, scores: { failure: 'emotional_first', motive: 'security', value: 3 } },
      { id: 'C', text: '다음에 어떻게 다르게 할지 계획한다', value: 1, scores: { failure: 'future_focused', motive: 'achievement', value: 4 } },
      { id: 'D', text: '다른 사람들의 반응이 먼저 신경 쓰인다', value: 1, scores: { failure: 'image_focused', motive: 'recognition', value: 2 } },
    ],
    metadata: { layer: 6, isLite: true },
  },
  {
    id: 'FC_COP_002',
    type: 'choice',
    category: 'failure_coping',
    subcategory: 'long_term_impact',
    text: '실패 경험이 당신에게 미치는 영향은?',
    options: [
      { id: 'A', text: '더 신중해진다', value: 1, scores: { failure: 'cautious', motive: 'security', value: 3 } },
      { id: 'B', text: '더 도전적이 된다', value: 1, scores: { failure: 'resilient', motive: 'achievement', value: 5 } },
      { id: 'C', text: '한동안 자신감이 떨어진다', value: 1, scores: { failure: 'confidence_hit', value: 2 } },
      { id: 'D', text: '큰 영향 없이 넘어간다', value: 1, scores: { failure: 'detached', value: 4 } },
    ],
    metadata: { layer: 6, isLite: true },
  },
  {
    id: 'FC_COP_003',
    type: 'scenario',
    category: 'failure_coping',
    subcategory: 'retry_willingness',
    text: '실패 후 같은 일을 다시 맡게 됐습니다.',
    subtext: '솔직한 마음은?',
    options: [
      { id: 'A', text: '이번엔 제대로 해보겠다', value: 1, scores: { failure: 'determined', motive: 'achievement', value: 5 } },
      { id: 'B', text: '솔직히 좀 부담스럽다', value: 1, scores: { failure: 'anxious', value: 3 } },
      { id: 'C', text: '왜 또 나한테 주지?', value: 1, scores: { failure: 'avoidant', value: 1 } },
      { id: 'D', text: '다른 방식으로 시도해볼 기회다', value: 1, scores: { failure: 'growth_mindset', motive: 'creation', value: 5 } },
    ],
    metadata: { layer: 6, isLite: true },
  },
  {
    id: 'FC_COP_004',
    type: 'scenario',
    category: 'failure_coping',
    subcategory: 'empathy',
    text: '동료가 중요한 일에서 실패했습니다.',
    subtext: '당신의 반응은?',
    options: [
      { id: 'A', text: '뭘 도와줄 수 있는지 물어본다', value: 1, scores: { failure: 'supportive', motive: 'connection', value: 4 } },
      { id: 'B', text: '조용히 지켜본다 (부담 줄까봐)', value: 1, scores: { failure: 'respectful_distance', value: 3 } },
      { id: 'C', text: '내가 대신 처리해준다', value: 1, scores: { failure: 'rescuer', motive: 'achievement', value: 3 } },
      { id: 'D', text: '왜 실패했는지 분석해서 알려준다', value: 1, scores: { failure: 'advisor', motive: 'mastery', value: 4 } },
    ],
    metadata: { layer: 6, isLite: false },
  },
  {
    id: 'FC_COP_005',
    type: 'scenario',
    category: 'failure_coping',
    subcategory: 'psychological_safety',
    text: '"실패해도 괜찮아"라는 말을 들으면?',
    subtext: '솔직한 생각은?',
    options: [
      { id: 'A', text: '그래도 실패하기 싫다', value: 1, scores: { failure: 'perfectionist', motive: 'achievement', value: 3 } },
      { id: 'B', text: '마음이 좀 편해진다', value: 1, scores: { failure: 'reassured', motive: 'security', value: 4 } },
      { id: 'C', text: '진심인지 의심된다', value: 1, scores: { failure: 'skeptical', value: 2 } },
      { id: 'D', text: '당연히 괜찮지, 배우는 거니까', value: 1, scores: { failure: 'growth_oriented', motive: 'mastery', value: 5 } },
    ],
    metadata: { layer: 6, isLite: true },
  },
];

export default FAILURE_COPING_QUESTIONS;
