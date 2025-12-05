/**
 * MET Mythic v6.0 — 원격근무 적합도 (Remote Work Fit)
 * 5문항: 자기관리, 비동기 소통, 고립 내성 측정
 */

import type { Question } from '../../lib/types';

export const REMOTE_WORK_QUESTIONS: Question[] = [
  {
    id: 'RW_FIT_001',
    type: 'choice',
    category: 'remote_work',
    subcategory: 'self_management',
    text: '혼자 일할 때 가장 힘든 점은?',
    options: [
      { id: 'A', text: '진행 상황을 공유할 사람이 없다', value: 1, scores: { remote: 'need_visibility', motive: 'recognition', value: 3 } },
      { id: 'B', text: '집중력 유지가 어렵다', value: 1, scores: { remote: 'need_structure', value: 2 } },
      { id: 'C', text: '막히면 바로 물어볼 수 없다', value: 1, scores: { remote: 'need_support', motive: 'connection', value: 3 } },
      { id: 'D', text: '별로 힘들지 않다', value: 1, scores: { remote: 'independent', motive: 'freedom', value: 5 } },
    ],
    metadata: { layer: 4, isLite: true },
  },
  {
    id: 'RW_FIT_002',
    type: 'choice',
    category: 'remote_work',
    subcategory: 'communication',
    text: '화상 회의에서 의견을 낼 때 어떤가요?',
    options: [
      { id: 'A', text: '대면 회의보다 오히려 편하다', value: 1, scores: { remote: 'async_native', value: 5 } },
      { id: 'B', text: '대면 회의와 비슷하다', value: 1, scores: { remote: 'adaptable', value: 4 } },
      { id: 'C', text: '대면 회의보다 어렵다', value: 1, scores: { remote: 'sync_preferred', value: 2 } },
      { id: 'D', text: '가능하면 채팅으로 의견을 낸다', value: 1, scores: { remote: 'text_preferred', value: 3 } },
    ],
    metadata: { layer: 4, isLite: true },
  },
  {
    id: 'RW_FIT_003',
    type: 'scenario',
    category: 'remote_work',
    subcategory: 'self_management',
    text: '재택근무 중 슬럼프가 왔습니다.',
    subtext: '어떻게 대처하나요?',
    options: [
      { id: 'A', text: '카페나 다른 장소로 이동한다', value: 1, scores: { remote: 'environment_change', value: 4 } },
      { id: 'B', text: '잠깐 산책하고 돌아온다', value: 1, scores: { remote: 'self_regulate', value: 5 } },
      { id: 'C', text: '동료에게 연락해서 수다를 떤다', value: 1, scores: { remote: 'social_recharge', motive: 'connection', value: 3 } },
      { id: 'D', text: '그냥 참고 일한다', value: 1, scores: { remote: 'push_through', value: 2 } },
    ],
    metadata: { layer: 4, isLite: false },
  },
  {
    id: 'RW_FIT_004',
    type: 'choice',
    category: 'remote_work',
    subcategory: 'boundaries',
    text: '업무 시간 외에 슬랙/카톡 알림이 오면?',
    options: [
      { id: 'A', text: '일단 확인한다', value: 1, scores: { remote: 'always_on', value: 2 } },
      { id: 'B', text: '급한 것만 확인한다', value: 1, scores: { remote: 'selective', value: 4 } },
      { id: 'C', text: '업무 시간까지 안 본다', value: 1, scores: { remote: 'strict_boundary', value: 5 } },
      { id: 'D', text: '알림을 꺼놓는다', value: 1, scores: { remote: 'disconnected', value: 3 } },
    ],
    metadata: { layer: 4, isLite: false },
  },
  {
    id: 'RW_FIT_005',
    type: 'scenario',
    category: 'remote_work',
    subcategory: 'isolation',
    text: '동료와 대면으로 못 만난 지 2주가 됐습니다.',
    subtext: '솔직한 기분은?',
    options: [
      { id: 'A', text: '별로 신경 안 쓰인다', value: 1, scores: { remote: 'isolation_tolerant', motive: 'freedom', value: 5 } },
      { id: 'B', text: '약간 외롭다', value: 1, scores: { remote: 'mild_need', motive: 'connection', value: 3 } },
      { id: 'C', text: '꽤 답답하다', value: 1, scores: { remote: 'high_social_need', motive: 'connection', value: 1 } },
      { id: 'D', text: '오히려 편하다', value: 1, scores: { remote: 'prefer_isolation', motive: 'freedom', value: 5 } },
    ],
    metadata: { layer: 4, isLite: true },
  },
];

export default REMOTE_WORK_QUESTIONS;
