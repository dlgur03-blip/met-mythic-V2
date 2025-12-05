# question_scorer.ts 검수 결과 보고서

## 검수 요약

`question_scorer.ts` 파일(1,897줄)을 검수한 결과, **심각한 타입 불일치 오류 4건**, **누락된 반환값 1건**, **잠재적 런타임 오류 2건**, **불필요한 코드 1건**이 발견되었습니다.

---

## 🔴 심각 (Critical) - 즉시 수정 필요

### 1. OperationAxis 타입 완전 불일치

**위치**: line 1447-1472, 1474-1486

**문제**: `types.ts`에 정의된 `OperationAxis`와 실제 사용값이 완전히 다름

```typescript
// types.ts (line 44)
export type OperationAxis = 'rhythm' | 'recharge' | 'release' | 'recovery';

// question_scorer.ts (line 1447-1451) - 실제 사용값
const accumulators: Record<string, ...> = {
  'internal_external': { pole1: createAccumulator(), pole2: createAccumulator() },
  'immediate_delayed': { pole1: createAccumulator(), pole2: createAccumulator() },
  'active_passive': { pole1: createAccumulator(), pole2: createAccumulator() },
  'independent_dependent': { pole1: createAccumulator(), pole2: createAccumulator() },
};
```

**수정 방안**: types.ts의 OperationAxis 타입을 실제 사용값으로 변경하거나, question_scorer.ts의 키값을 types.ts에 맞게 수정

---

### 2. OperationScore 반환 구조 불일치

**위치**: line 1474-1486

**문제**: `types.ts`의 `OperationScore` 인터페이스와 실제 반환 객체 구조가 다름

```typescript
// types.ts (line 129-133)
export interface OperationScore {
  axis: OperationAxis;
  score: number;              // -50 ~ +50
  tendency: 'left' | 'balanced' | 'right';
}

// question_scorer.ts (line 1478-1485) - 실제 반환 객체
return {
  axis: axis as OperationAxis,
  pole1: axisNames[axis][0],          // ❌ 정의에 없음
  pole2: axisNames[axis][1],          // ❌ 정의에 없음
  pole1Score, pole2Score,             // ❌ 정의에 없음
  ratio: round2((pole1Score / total) * 100),  // ❌ 정의에 없음
  // ❌ score, tendency 필드 누락!
};
```

**수정 방안**: types.ts의 OperationScore 인터페이스를 실제 반환 구조에 맞게 수정

---

### 3. ContextScore 타입의 context 값 불일치

**위치**: line 1098, 1626

**문제**: `types.ts`의 `ContextType`과 실제 사용 값이 다름

```typescript
// types.ts (line 47)
export type ContextType = 'normal' | 'pressure' | 'burnout';

// question_scorer.ts (line 1098)
export interface ContextScore {
  context: 'normal' | 'pressure' | 'growth' | 'crisis';  // ❌ 'growth', 'crisis' 추가됨
  ...
}
```

**수정 방안**: types.ts의 ContextType에 'growth', 'crisis' 추가, 또는 'burnout'을 다시 사용

---

### 4. DirectionScore에 추가 필드 존재

**위치**: line 1438-1443

**문제**: `balance` 필드가 types.ts에 정의되지 않음

```typescript
// types.ts (line 121-126)
export interface DirectionScore {
  motive: MotiveSource;
  approach: number;
  avoidance: number;
  dominant: Direction;
  // ❌ balance 필드 없음
}

// question_scorer.ts (line 1441)
balance: round2(Math.abs(approach - avoidance)),  // ❌ 추가 필드
```

**수정 방안**: types.ts의 DirectionScore에 `balance?: number` 추가

---

## 🟠 중요 (High) - 빠른 수정 권장

### 5. motiveShiftAnalysis 계산 후 반환 누락

**위치**: line 1348, 1355-1382

**문제**: `calculateAllScores`에서 `motiveShiftAnalysis`를 계산하지만 반환하지 않음

```typescript
// line 1348
const motiveShiftAnalysis = calculateMotiveShifts(baselineMotives, context);

// line 1355-1382 (반환 객체)
return {
  motive, ignition, direction, operation, energy, conflict, context,
  hidden, maturity, validation, responseTimeScore, reliabilityScore,
  confidenceMap, metacognition, uniqueness, responseProfile,
  extremePatterns, motiveDevelopment, conflictMap, consistencyBreakdown,
  confidenceIntervals, motiveEvolution, developmentSuggestions,
  reverseItemValidation, correlationValidation, socialDesirabilityCorrection,
  // ❌ motiveShiftAnalysis 누락!
};
```

**수정 방안**: 
1. AllScores 인터페이스에 `motiveShiftAnalysis: MotiveShiftAnalysis[]` 추가
2. return 객체에 `motiveShiftAnalysis` 추가

---

### 6. analyzeResponseTime에서 stdDev 미계산

**위치**: line 1870

**문제**: `stdDev`가 항상 0으로 하드코딩됨

```typescript
return {
  avgTime: score.avgTimeMs,
  medianTime: score.medianTimeMs,
  stdDev: 0,  // ❌ 항상 0 - 실제 계산 필요
  ...
};
```

**수정 방안**: 실제 표준편차 계산 로직 추가

---

## 🟡 보통 (Medium) - 수정 권장

### 7. calculateUniqueness에서 배열 인덱스 위험

**위치**: line 1843

**문제**: `motiveScores[7]` 접근 시 배열 길이가 8 미만이면 런타임 오류 발생 가능

```typescript
if (gap > 60) uniqueTraits.push(
  `${translateMotive(motiveScores[0].motive)}-${translateMotive(motiveScores[7].motive)} ...`
  // ❌ motiveScores.length < 8이면 undefined 오류
);
```

**수정 방안**: 
```typescript
const lastIndex = motiveScores.length - 1;
if (gap > 60 && lastIndex >= 0) {
  uniqueTraits.push(`${translateMotive(motiveScores[0].motive)}-${translateMotive(motiveScores[lastIndex].motive)} ...`);
}
```

---

### 8. question_scorer.ts에서 자체 정의한 타입들

**위치**: line 1078-1176

**상황**: 다음 타입들이 `question_scorer.ts`에 자체 정의되어 있고 `types.ts`에는 없음:
- `EnergyScore` (line 1078-1086)
- `ConflictScore` (line 1088-1095)
- `ContextScore` (line 1097-1103)
- `HiddenMotiveScore` (line 1105-1118)
- `MaturityScore` (line 1120-1128)
- `ValidationScore` (line 1130-1137)
- `ConfidenceMap` (line 1139-1144)
- `MetacognitionScore` (line 1146-1153)
- `UniquenessScore` (line 1155-1163)
- `ResponseTimeProfile` (line 1165-1176)

**권장 사항**: 이 타입들을 `types.ts`로 이동하여 중앙 집중 관리

---

## 🟢 경미 (Low) - 개선 권장

### 9. 불필요한/오해 유발 주석

**위치**: line 1315, 1385-1386

```typescript
// line 1315
// ... (나머지 calculate 함수들은 v4와 동일)  // ❌ 모호한 주석

// line 1385-1386  
// 나머지 함수들은 v4에서 복사 (calculateIgnitionScores, calculateDirectionScores 등)
// 길이 제한으로 생략 - 실제로는 v4의 모든 함수 포함  // ❌ 실제로는 함수가 있음
```

**수정 방안**: 불필요하거나 부정확한 주석 삭제

---

### 10. axisNames 키 타입 단언 불필요

**위치**: line 1480-1481

```typescript
pole1: axisNames[axis as OperationAxis][0],
pole2: axisNames[axis as OperationAxis][1],
```

**문제**: `OperationAxis` 타입과 실제 키가 다르므로 타입 단언이 무의미함

---

## 수정 우선순위 정리

| 우선순위 | 항목 | 영향도 |
|---------|------|--------|
| 1 | OperationAxis 타입 불일치 | 컴파일 오류 / 런타임 오류 가능 |
| 2 | OperationScore 반환 구조 불일치 | 다른 모듈에서 사용 시 오류 |
| 3 | ContextScore context 값 불일치 | 타입 안정성 저하 |
| 4 | DirectionScore balance 필드 | 타입 안정성 저하 |
| 5 | motiveShiftAnalysis 누락 | 계산된 데이터 유실 |
| 6 | stdDev 미계산 | 부정확한 데이터 |
| 7 | 배열 인덱스 위험 | 잠재적 런타임 오류 |
| 8 | 타입 분산 관리 | 유지보수성 저하 |

---

## 권장 조치

1. **types.ts 업데이트**: OperationAxis, OperationScore, ContextType, DirectionScore 수정
2. **question_scorer.ts 수정**: motiveShiftAnalysis 반환 추가, stdDev 계산, 인덱스 안전 처리
3. **타입 통합**: question_scorer.ts의 자체 정의 타입들을 types.ts로 이동
4. **코드 정리**: 불필요한 주석 제거

---

*검수일: 2025-12-05*
*검수 대상: /lib/question_scorer.ts (1,897 lines)*
