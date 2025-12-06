# MET Mythic v6.0

심리 테스트 기반 동기 원형 분석 웹앱

## 📋 프로젝트 개요

8개의 동기 원천을 분석하여 사용자의 신화적 원형을 찾아주는 심리 테스트 앱입니다.

### 핵심 기능
- **Lite 버전**: 110문항, 10-12분 소요
- **Full 버전**: 347문항 (역문항 포함), 30-35분 소요
- **AI 보고서**: Gemini API를 활용한 2만자 분석 보고서
- **이메일 발송**: Google Apps Script를 통한 결과 전송

### 8개 동기 원천
| 동기 | 설명 |
|------|------|
| 성취(Achievement) | 목표 달성, 결과 중시 |
| 전문성(Mastery) | 깊이 있는 숙련 추구 |
| 창조(Creation) | 새로운 것을 만드는 기쁨 |
| 인정(Recognition) | 타인의 인정과 평가 |
| 관계(Connection) | 소속감과 유대 |
| 안정(Security) | 예측 가능성과 안전 |
| 자유(Freedom) | 자율성과 독립 |
| 모험(Adventure) | 새로운 경험 추구 |

### 8개 신화 원형
정복자, 현자, 창조자, 군주, 치유자, 수호자, 반역자, 탐험가

---

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.example`을 `.env.local`로 복사하고 값을 입력하세요.

```bash
cp .env.example .env.local
```

### 3. 개발 서버 실행
```bash
npm run dev
```

http://localhost:3000 에서 앱을 확인하세요.

---

## 📁 프로젝트 구조

```
met-mythic-v6/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API Routes
│   │   ├── report/        # AI 보고서 생성 (Gemini)
│   │   └── send-report/   # 이메일 발송
│   ├── about/             # 소개 페이지
│   ├── page.tsx           # 메인 페이지
│   └── layout.tsx         # 루트 레이아웃
│
├── components/             # React 컴포넌트
│   ├── TestScreen.tsx     # 테스트 화면
│   ├── FullResultScreen.tsx # Full 결과 화면
│   ├── ResultScreen.tsx   # Lite 결과 화면
│   ├── ReportViewer.tsx   # AI 보고서 뷰어
│   └── ...
│
├── data/                   # 문항 데이터
│   └── questions/         # 347개 문항 정의
│
├── hooks/                  # React 커스텀 훅
│   └── useTest.ts         # 테스트 진행 상태 관리
│
├── lib/                    # 핵심 로직
│   ├── question_scorer.ts # 점수 계산 (2400+ lines)
│   ├── full_api.ts        # Full 버전 API
│   ├── lite_api.ts        # Lite 버전 API
│   ├── report_generator.ts # 보고서 프롬프트
│   └── types.ts           # TypeScript 타입 정의
│
├── prompts/                # AI 프롬프트 파일
├── public/                 # 정적 파일 (원형별 설명 등)
└── docs/                   # 문서
```

---

## 🔧 환경변수

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API 키 | ✅ |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth 도메인 | ✅ |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase 프로젝트 ID | ✅ |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | 관리자 비밀번호 | ✅ |
| `NEXT_PUBLIC_MASTER_KEY` | 마스터 키 | ✅ |
| `GEMINI_API_KEY` | Gemini API 키 | ⚠️ AI 보고서용 |
| `GOOGLE_SCRIPT_URL` | Google Apps Script URL | ⚠️ 이메일 발송용 |

---

## 📊 핵심 로직 흐름

```
1. 설문 시작
   └── getLiteQuestions() / getFullQuestions()

2. 테스트 진행
   └── useTest 훅 (자동저장, 진행상황 복원)

3. 점수 계산
   └── calculateFullScores() / calculateLiteScores()
       └── calculateAllScores()
           ├── calculateMotiveScores()
           ├── calculateIgnitionScores()
           ├── calculateDirectionScores()
           ├── calculateOperationScores()
           ├── calculateEnergyScores()
           ├── calculateHiddenScores()
           ├── calculateMaturityScores()
           └── calculateValidationScores()

4. 결과 화면
   └── FullResultScreen / ResultScreen

5. AI 보고서 생성
   └── /api/report → Gemini API

6. 이메일 발송
   └── /api/send-report → Google Apps Script
```

---

## 🏗️ 빌드 및 배포

### 프로덕션 빌드
```bash
npm run build
```

### Vercel 배포
```bash
vercel
```

또는 GitHub에 푸시 후 Vercel에서 자동 배포

---

## 📱 앱으로 만들기

### 방법 1: PWA (Progressive Web App)
1. `next-pwa` 패키지 설치
2. `manifest.json` 추가
3. Service Worker 설정

### 방법 2: Capacitor (네이티브 앱)
1. `@capacitor/core`, `@capacitor/cli` 설치
2. `npx cap init`
3. `npx cap add ios` / `npx cap add android`
4. Xcode / Android Studio에서 빌드

### 방법 3: Expo (React Native)
- 현재 Next.js 프로젝트를 Expo로 마이그레이션 필요

자세한 내용은 아래 "앱 변환 가이드" 섹션 참조

---

## 📄 라이선스

Private - All Rights Reserved

---

## 🔒 보안 주의사항

1. `.env.local` 파일은 절대 Git에 커밋하지 마세요
2. `NEXT_PUBLIC_` prefix가 붙은 변수는 클라이언트에 노출됩니다
3. 프로덕션 배포 전 모든 API 키를 변경하세요
