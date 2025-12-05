/**
 * MET Mythic v6.0 — AI Report Generation API
 * 
 * POST /api/report
 * 새 프롬프트 체계 (PART 1/2/3_CLEAN) 사용
 * 증거 기반 분석 + 메타인지/갈등지도/진화예측 포함
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import {
  convertToSyncResult,
  convertToUserProfile,
  type ReportRequest,
  type ReportResponse,
} from '@/lib/report_generator';
import { collectEvidence, formatEvidenceSummary } from '@/lib/question_scorer';
import type { Archetype, Answer, Question } from '@/lib/types';
import { ALL_QUESTIONS_WITH_REVERSE } from '@/data/questions/all_questions';

// ============================================
// 환경 변수 (하드코딩 금지!)
// ============================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

// ============================================
// 프롬프트 로더 (새 체계)
// ============================================

interface PromptParts {
  part1: string;  // 상세 스테이터스
  part2: string;  // 개별 해석 + 신화
  part3: string;  // 융합 + HOW TO USE ME
}

async function loadNewPrompts(): Promise<PromptParts> {
  const promptDir = path.join(process.cwd(), 'prompts');
  
  try {
    const [part1, part2, part3] = await Promise.all([
      fs.readFile(path.join(promptDir, 'PROMPT_PART1_CLEAN.md'), 'utf-8'),
      fs.readFile(path.join(promptDir, 'PROMPT_PART2_CLEAN.md'), 'utf-8'),
      fs.readFile(path.join(promptDir, 'PROMPT_PART3_CLEAN.md'), 'utf-8'),
    ]);
    
    return { part1, part2, part3 };
  } catch (error) {
    console.error('Failed to load prompts:', error);
    throw new Error('Prompt files not found');
  }
}

async function loadArchetypeMarkdown(archetype: string): Promise<string> {
  const mdPath = path.join(process.cwd(), 'public', 'archetypes', `archetypes_${archetype}.md`);
  try {
    const markdown = await fs.readFile(mdPath, 'utf-8');
    return markdown;
  } catch (error) {
    console.error(`Failed to load archetype markdown for ${archetype}:`, error);
    throw new Error(`Archetype markdown not found: ${archetype}`);
  }
}

// ============================================
// 새 프롬프트 빌더 (v6.0)
// ============================================

interface ReportDataV6 {
  syncResult: ReturnType<typeof convertToSyncResult>;
  userProfile: ReturnType<typeof convertToUserProfile>;
  archetypeMarkdown: string;
  evidenceSummary: string;
  prompts: PromptParts;
}

function buildReportPromptV6(data: ReportDataV6): string {
  const { syncResult, userProfile, archetypeMarkdown, evidenceSummary, prompts } = data;
  
  return `
# MET Mythic v6.0 Report Generation

당신은 MET Mythic의 수석 분석가입니다. 아래 3개의 프롬프트 지침과 데이터를 기반으로 완전한 보고서를 생성하세요.

---

# PART 1 지침: 상세 스테이터스

${prompts.part1}

---

# PART 2 지침: 개별 해석 + 신화 이야기

${prompts.part2}

---

# PART 3 지침: 융합 분석

${prompts.part3}

---

# 입력 데이터

## SYNC_RESULT (점수 데이터)
\`\`\`json
${JSON.stringify(syncResult, null, 2)}
\`\`\`

## USER_PROFILE (사용자 프로필)
\`\`\`json
${JSON.stringify(userProfile, null, 2)}
\`\`\`

## ARCHETYPE_MARKDOWN (신화 인물 정보)
${archetypeMarkdown}

## EVIDENCE_SUMMARY (증거 데이터)
${evidenceSummary}

---

# 출력 지침

## 형식
1. PART 1 (상세 스테이터스) → PART 2 (16개 섹션) → PART 3 (2개 섹션) 순서로 작성
2. 총 20,000자 이상
3. 마크다운 형식 사용 (테이블 금지, 리스트 형식 사용)
4. 한국어 용어 사용 (전문성, 관계, 시선 등)

## 필수 포함 사항
- 메타인지 분석 (4개 하위 점수)
- 갈등지도 (주요/부차 갈등)
- 동기 진화 예측
- 증거 기반 해석 (실제 응답 인용)
- 발전 제안

## 시작
`;
}

// ============================================
// Gemini API 호출
// ============================================

async function callGeminiAPI(prompt: string): Promise<{ text: string; tokensUsed: number }> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 60000,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Gemini API error:', response.status, errorData);
    throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const tokensUsed = (data.usageMetadata?.promptTokenCount || 0) + (data.usageMetadata?.candidatesTokenCount || 0);
  
  return { text, tokensUsed };
}

// ============================================
// POST Handler (v6.0)
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse<ReportResponse>> {
  try {
    // 0. API 키 확인
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { success: false, error: 'AI service is not configured. Please check environment variables.' },
        { status: 500 }
      );
    }

    // 1. 요청 파싱
    const body = await request.json() as ReportRequest & { answers?: Answer[] };
    const { fullResult, answers } = body;

    if (!fullResult) {
      return NextResponse.json(
        { success: false, error: 'fullResult is required' },
        { status: 400 }
      );
    }

    // 2. 데이터 변환
    const syncResult = convertToSyncResult(fullResult);
    const userProfile = convertToUserProfile(fullResult);
    const archetype = fullResult.primaryArchetype.archetype as Archetype;

    // 3. 증거 수집 (answers가 있으면)
    let evidenceSummary = '증거 데이터 없음 (원본 응답 미제공)';
    if (answers && answers.length > 0) {
      try {
        const evidenceCollection = collectEvidence(answers, ALL_QUESTIONS_WITH_REVERSE as Question[]);
        evidenceSummary = formatEvidenceSummary(evidenceCollection);
      } catch (e) {
        console.warn('Evidence collection failed:', e);
        evidenceSummary = '증거 수집 실패';
      }
    }

    // 4. 프롬프트 및 마크다운 로드
    const [prompts, archetypeMarkdown] = await Promise.all([
      loadNewPrompts(),
      loadArchetypeMarkdown(archetype),
    ]);

    // 5. 최종 프롬프트 조합 (v6.0)
    const finalPrompt = buildReportPromptV6({
      syncResult,
      userProfile,
      archetypeMarkdown,
      evidenceSummary,
      prompts,
    });

    console.log(`[Report API] Prompt length: ${finalPrompt.length} chars`);

    // 6. Gemini API 호출
    const { text: report, tokensUsed } = await callGeminiAPI(finalPrompt);

    console.log(`[Report API] Generated report: ${report.length} chars, ${tokensUsed} tokens`);

    // 7. 응답 반환
    return NextResponse.json({
      success: true,
      report,
      tokensUsed,
    });

  } catch (error) {
    console.error('Report generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// ============================================
// GET Handler (상태 확인용)
// ============================================

export async function GET(): Promise<NextResponse> {
  const isConfigured = !!GEMINI_API_KEY;
  
  return NextResponse.json({
    status: isConfigured ? 'ok' : 'error',
    configured: isConfigured,
    model: 'Gemini 2.5 Pro',
    version: 'v6.0',
    features: [
      '새 프롬프트 체계 (PART 1/2/3_CLEAN)',
      '증거 기반 분석',
      '메타인지/갈등지도/진화예측',
      '347문항 지원',
    ],
    maxTokens: 60000,
    message: isConfigured 
      ? 'AI 보고서 생성 API v6.0이 준비되었습니다.' 
      : '⚠️ GEMINI_API_KEY가 설정되지 않았습니다.',
  });
}