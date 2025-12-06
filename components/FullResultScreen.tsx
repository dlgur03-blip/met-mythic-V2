'use client';

import React, { useState } from 'react';
import type { FullResult } from '@/lib/full_api';

interface FullResultScreenProps {
  result: FullResult;
  onRetry?: () => void;
  onGenerateReport?: () => void;
}

type TabType = 'overview' | 'motives' | 'archetype' | 'energy' | 'hidden' | 'growth' | 'insights';

export function FullResultScreen({ result, onRetry, onGenerateReport }: FullResultScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const motiveNames: Record<string, string> = {
    achievement: '성취', mastery: '전문성', creation: '창조', recognition: '인정',
    connection: '관계', security: '안정', freedom: '자유', adventure: '모험',
  };

  const ignitionNames: Record<string, string> = {
    competition: '경쟁', complexity: '복잡성', deadline: '마감',
    audience: '시선', autonomy: '자율', crisis: '위기',
  };

  const directionNames: Record<string, string> = {
    approach: '접근', avoidance: '회피',
  };

  const operationLabels: Record<string, { left: string; right: string; description?: string }> = {
    // 기존 4축 (하위 호환성) - 의미 있는 한국어로
    internal_external: { left: '내적 동기', right: '외적 동기', description: '동기의 원천' },
    immediate_delayed: { left: '즉각 반응', right: '숙고 반응', description: '반응 속도' },
    active_passive: { left: '능동적', right: '수동적', description: '행동 성향' },
    independent_dependent: { left: '독립적', right: '협력적', description: '협업 스타일' },
    // 실제 문항에서 사용하는 축
    rhythm: { left: '계획형', right: '즉흥형', description: '업무 리듬' },
    recovery: { left: '혼자 충전', right: '함께 충전', description: '에너지 회복' },
    recharge: { left: '혼자 충전', right: '함께 충전', description: '에너지 회복' },
    relay: { left: '마라톤형', right: '스프린트형', description: '에너지 방출' },
    release: { left: '마라톤형', right: '스프린트형', description: '에너지 방출' },
    resistance: { left: '스트레스 성장', right: '스트레스 회피', description: '스트레스 반응' },
    scope: { left: '집중형', right: '멀티형', description: '작업 범위' },
  };

  const levelDescriptions: Record<number, { name: string; desc: string }> = {
    1: { name: '그림자', desc: '동기를 탐색하는 단계' },
    2: { name: '각성', desc: '동기를 인식하는 단계' },
    3: { name: '통합', desc: '동기를 조화시키는 단계' },
    4: { name: '초월', desc: '동기를 자유롭게 다루는 단계' },
  };

  const tabs: { key: TabType; label: string; emoji: string }[] = [
    { key: 'overview', label: '개요', emoji: '🎯' },
    { key: 'motives', label: '동기', emoji: '💫' },
    { key: 'archetype', label: '원형', emoji: '🏛️' },
    { key: 'energy', label: '에너지', emoji: '⚡' },
    { key: 'hidden', label: '숨겨진', emoji: '🌙' },
    { key: 'growth', label: '성장', emoji: '🌱' },
    { key: 'insights', label: '인사이트', emoji: '📊' },
  ];

  // 🔧 FIX: 에너지 데이터 타입 안전하게 추출
  const energyData = result.energy;
  const energyFuel = energyData?.charge || {};
  const energyDrain = energyData?.drain || {};
  // flowPatterns는 EnergyScore에 없으므로 빈 객체 사용
  const energyFlowPatterns: Record<string, number> = {};

  // 🔧 FIX: energyScores 배열은 FullResult에 없으므로 빈 배열 사용
  const energyScores: Array<{ name: string; score: number }> = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 헤더 */}
      <div className="bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{result.primaryArchetype.emoji}</span>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {result.primaryArchetype.archetypeName}
                </h1>
                <p className="text-purple-300 text-sm">
                  {result.primaryFigure.figureName} · {result.primaryArchetype.score}% 싱크로
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">
                Lv.{result.maturity.level}
              </div>
              <div className="text-xs text-purple-300">
                {levelDescriptions[result.maturity.level]?.name || ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-black/20 backdrop-blur-sm sticky top-[72px] z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all
                  ${activeTab === tab.key 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'}
                `}
              >
                <span>{tab.emoji}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* 개요 탭 */}
        {activeTab === 'overview' && (
          <>
            {/* 원형 카드 */}
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-6xl">{result.primaryArchetype.emoji}</span>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                {result.primaryArchetype.archetypeName}
              </h2>
              <p className="text-purple-300 mb-6">
                {result.primaryArchetype.archetypeNameEn}
              </p>
              
              <div className="flex justify-center gap-8 mb-6">
                <div>
                  <div className="text-4xl font-bold text-purple-400">
                    {Math.round(result.primaryArchetype.score)}%
                  </div>
                  <div className="text-sm text-purple-300">싱크로율</div>
                </div>
                <div className="w-px bg-purple-500/30" />
                <div>
                  <div className="text-4xl font-bold text-pink-400">
                    {result.primaryFigure.figureName}
                  </div>
                  <div className="text-sm text-purple-300">{result.primaryFigure.origin}</div>
                </div>
              </div>
              
              {/* 2위 원형 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm">
                <span>{result.secondaryArchetype.emoji}</span>
                <span className="text-purple-200">
                  2위: {result.secondaryArchetype.archetypeName} ({result.secondaryArchetype.score}%)
                </span>
              </div>
            </div>

            {/* Top 3 동기 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">핵심 동기 Top 3</h3>
              <div className="space-y-4">
                {result.motiveScores.slice(0, 3).map((score, index) => (
                  <div key={score.motive} className="flex items-center gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                      ${index === 0 ? 'bg-yellow-500 text-yellow-900' : 
                        index === 1 ? 'bg-gray-400 text-gray-900' : 
                        'bg-orange-400 text-orange-900'}
                    `}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-white">
                          {motiveNames[score.motive]}
                        </span>
                        <span className="text-purple-300">{score.score}점</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${score.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 점화 조건 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">⚡ 점화 조건</h3>
              <div className="grid grid-cols-3 gap-3">
                {result.ignitionScores.slice(0, 6).map((score) => (
                  <div 
                    key={score.condition}
                    className="bg-white/10 rounded-xl p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {score.score}
                    </div>
                    <div className="text-xs text-purple-200">
                      {ignitionNames[score.condition]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 동기 탭 */}
        {activeTab === 'motives' && (
          <>
            {/* 전체 동기 점수 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">동기 원천 8가지</h3>
              <div className="space-y-4">
                {result.motiveScores.map((score) => (
                  <div key={score.motive}>
                    <div className="flex justify-between mb-1">
                      <span className="text-white font-medium">
                        {score.rank}. {motiveNames[score.motive]}
                      </span>
                      <span className="text-purple-300">{score.score}점</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          score.rank <= 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          score.rank <= 4 ? 'bg-purple-500/70' :
                          'bg-purple-500/40'
                        }`}
                        style={{ width: `${score.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 방향 (접근 vs 회피) */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">동기 방향</h3>
              <div className="space-y-4">
                {result.directionScores.slice(0, 4).map((dir) => (
                  <div key={dir.motive}>
                    <div className="text-sm text-purple-200 mb-2">{motiveNames[dir.motive]}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-400 w-12">접근</span>
                      <div className="flex-1 flex h-4 rounded-full overflow-hidden bg-white/10">
                        <div 
                          className="bg-green-500 transition-all"
                          style={{ width: `${dir.approach}%` }}
                        />
                        <div 
                          className="bg-red-500 transition-all"
                          style={{ width: `${dir.avoidance}%` }}
                        />
                      </div>
                      <span className="text-xs text-red-400 w-12 text-right">회피</span>
                    </div>
                    <div className="flex justify-between text-xs text-purple-300 mt-1">
                      <span>{dir.approach}%</span>
                      <span>{dir.avoidance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 운영 방식 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">운영 방식</h3>
              <div className="space-y-4">
                {result.operationScores.map((op) => {
                  const labels = operationLabels[op.axis];
                  // 🔧 FIX: labels가 없으면 pole1/pole2 사용 (이미 한국어)
                  const leftLabel = labels?.left || op.pole1 || '좌';
                  const rightLabel = labels?.right || op.pole2 || '우';
                  const description = labels?.description || '';
                  
                  return (
                    <div key={op.axis}>
                      {description && (
                        <div className="text-xs text-purple-300 mb-1">{description}</div>
                      )}
                      <div className="flex justify-between text-xs text-purple-200 mb-2">
                        <span>{leftLabel}</span>
                        <span>{rightLabel}</span>
                      </div>
                      <div className="relative h-4 bg-white/10 rounded-full">
                        <div 
                          className="absolute top-0 h-4 w-4 bg-purple-500 rounded-full transform -translate-x-1/2 transition-all"
                          style={{ left: `${op.ratio}%` }}
                        />
                        <div className="absolute top-0 left-1/2 h-4 w-0.5 bg-white/30" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* 원형 탭 */}
        {activeTab === 'archetype' && (
          <>
            {/* 전체 원형 순위 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">8개 원형 매칭</h3>
              <div className="space-y-3">
                {result.allArchetypes.map((arch) => (
                  <div 
                    key={arch.archetype}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      arch.rank === 1 ? 'bg-purple-500/30 ring-2 ring-purple-400' :
                      arch.rank === 2 ? 'bg-white/10' : 'bg-white/5'
                    }`}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${arch.rank === 1 ? 'bg-purple-500 text-white' :
                        arch.rank === 2 ? 'bg-white/20 text-white' :
                        'bg-white/10 text-purple-300'}
                    `}>
                      {arch.rank}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{arch.archetypeName}</div>
                      <div className="text-xs text-purple-300">{arch.archetypeNameEn}</div>
                    </div>
                    <div className="text-purple-300 font-medium">
                      {arch.score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 매칭 인물들 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {result.primaryArchetype.archetypeName}의 신화 인물
              </h3>
              <div className="space-y-3">
                {result.topFigures.map((fig, index) => (
                  <div 
                    key={fig.figure}
                    className={`flex items-center gap-4 p-4 rounded-xl ${
                      index === 0 ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30' : 'bg-white/10'
                    }`}
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">
                        {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{fig.figureName}</div>
                      <div className="text-xs text-purple-300">{fig.origin}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-300 font-bold">{fig.similarity}%</div>
                      <div className="text-xs text-purple-400">유사도</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 에너지 탭 - 🔧 수정됨 */}
        {activeTab === 'energy' && (
          <>
            {/* 에너지 스코어 배열이 있는 경우 */}
            {energyScores.length > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🔋 에너지 패턴</h3>
                <div className="space-y-4">
                  {energyScores.map((item) => {
                    const energySourceNames: Record<string, string> = {
                      challenge: '도전', complexity: '복잡성', autonomy: '자율성',
                      mastery: '전문성', connection: '관계', recognition: '인정',
                      creation: '창조', achievement: '성취', freedom: '자유',
                      adventure: '모험', security: '안정', growth: '성장',
                      learning: '학습', impact: '영향력', meaning: '의미',
                    };
                    const label = energySourceNames[item.name] || item.name;
                    return (
                    <div key={item.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-purple-200">{label}</span>
                        <span className="text-white">{item.score}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 에너지 충전 요소 (fuel 객체가 있는 경우) */}
            {Object.keys(energyFuel).length > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🔋 에너지 충전 요소</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(energyFuel).map(([motive, score]) => (
                    <div 
                      key={motive}
                      className="bg-white/10 rounded-xl p-4"
                    >
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        {score as number}
                      </div>
                      <div className="text-sm text-purple-200">
                        {motiveNames[motive] || motive}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 에너지 소모 요소 (drain 객체가 있는 경우) */}
            {Object.keys(energyDrain).length > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🪫 에너지 소모 요소</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(energyDrain).map(([drain, score]) => {
                    const drainNames: Record<string, string> = {
                      // 실제 점수 계산에서 사용하는 drain 요소들
                      no_progress: '진전 없음',
                      control: '과도한 통제',
                      isolation: '고립감',
                      routine: '반복 업무',
                      meaningless: '의미 없음',
                      conflict: '갈등 상황',
                      unrecognized: '인정 부족',
                      uncertainty: '불확실성',
                      // 기존 호환성 (혹시 사용되는 경우)
                      micromanage: '세부 관리',
                      pressure: '압박감',
                      boredom: '지루함',
                      criticism: '비판',
                      restriction: '제한',
                      monotony: '단조로움',
                    };
                    return (
                      <div 
                        key={drain}
                        className="bg-white/10 rounded-xl p-4"
                      >
                        <div className="text-2xl font-bold text-red-400 mb-1">
                          {score as number}
                        </div>
                        <div className="text-sm text-purple-200">
                          {drainNames[drain] || motiveNames[drain] || drain}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 몰입 패턴 (flowPatterns 객체가 있는 경우) */}
            {Object.keys(energyFlowPatterns).length > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🌊 몰입 패턴</h3>
                <div className="space-y-3">
                  {Object.entries(energyFlowPatterns).map(([pattern, score]) => {
                    const patternNames: Record<string, string> = {
                      deepFocus: '깊은 몰입',
                      challenge: '도전 선호',
                      clarity: '명확성 선호',
                      feedback: '피드백 선호',
                      environment: '환경 민감도',
                    };
                    return (
                      <div key={pattern}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-purple-200">{patternNames[pattern] || pattern}</span>
                          <span className="text-white">{score as number}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-cyan-500 h-2 rounded-full"
                            style={{ width: `${score as number}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 데이터가 없는 경우 */}
            {energyScores.length === 0 && 
             Object.keys(energyFuel).length === 0 && 
             Object.keys(energyDrain).length === 0 && 
             Object.keys(energyFlowPatterns).length === 0 && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-white mb-2">에너지 분석</h3>
                <p className="text-purple-300 text-sm">
                  에너지 패턴 데이터가 아직 준비되지 않았습니다.
                </p>
              </div>
            )}
          </>
        )}

        {/* 숨겨진 동기 탭 */}
        {activeTab === 'hidden' && (
          <>
            {/* 그림자 동기 */}
            {result.hiddenMotives?.shadow && Object.keys(result.hiddenMotives.shadow).length > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">🌑 그림자 동기</h3>
                <p className="text-sm text-purple-300 mb-4">
                  인정하기 어렵지만 존재하는 욕구
                </p>
                <div className="space-y-3">
                  {Object.entries(result.hiddenMotives.shadow).map(([motive, score]) => (
                    <div key={motive} className="flex items-center gap-3">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-purple-200">{motiveNames[motive] || motive}</span>
                          <span className="text-white">{score}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-purple-700 h-2 rounded-full"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 투사 */}
            {result.hiddenMotives?.projection && Object.keys(result.hiddenMotives.projection).length > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">🪞 투사</h3>
                <p className="text-sm text-purple-300 mb-4">
                  타인에게서 불편하게 느끼는 동기
                </p>
                <div className="space-y-3">
                  {Object.entries(result.hiddenMotives.projection).map(([motive, score]) => (
                    <div key={motive}>
                      <div className="flex justify-between mb-1">
                        <span className="text-purple-200">{motiveNames[motive] || motive}</span>
                        <span className="text-white">{score}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 보상 동기 */}
            {result.hiddenMotives?.compensation && Object.keys(result.hiddenMotives.compensation).length > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">💫 보상 동기</h3>
                <p className="text-sm text-purple-300 mb-4">
                  과거 결핍을 채우려는 욕구
                </p>
                <div className="space-y-3">
                  {Object.entries(result.hiddenMotives.compensation).map(([comp, score]) => {
                    const compensationNames: Record<string, string> = {
                      achievement_compensation: '성취 보상',
                      recognition_compensation: '인정 보상',
                      connection_compensation: '관계 보상',
                      security_compensation: '안정 보상',
                      freedom_compensation: '자유 보상',
                      mastery_compensation: '전문성 보상',
                      creation_compensation: '창조 보상',
                      adventure_compensation: '모험 보상',
                      childhood_lack: '유년기 결핍',
                      parental_pressure: '부모 압박',
                      peer_rejection: '또래 거절',
                      early_failure: '초기 실패',
                      unmet_potential: '미발휘 잠재력',
                    };
                    return (
                    <div key={comp}>
                      <div className="flex justify-between mb-1">
                        <span className="text-purple-200">{compensationNames[comp] || motiveNames[comp] || comp}</span>
                        <span className="text-white">{score}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-pink-500 h-2 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 동기 충돌 */}
            {result.conflicts && result.conflicts.length > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">⚔️ 동기 충돌</h3>
                <p className="text-sm text-purple-300 mb-4">
                  내면에서 충돌하는 동기 쌍
                </p>
                <div className="space-y-4">
                  {result.conflicts.slice(0, 4).map((conflict, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          {motiveNames[conflict.pair[0]]} vs {motiveNames[conflict.pair[1]]}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          conflict.balanceRatio > 60 || conflict.balanceRatio < 40 
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {conflict.balanceRatio > 60 || conflict.balanceRatio < 40 ? '불균형' : '균형'}
                        </span>
                      </div>
                      <div className="flex h-3 rounded-full overflow-hidden bg-white/10">
                        <div 
                          className="bg-purple-500"
                          style={{ width: `${conflict.balanceRatio}%` }}
                        />
                        <div 
                          className="bg-pink-500"
                          style={{ width: `${100 - conflict.balanceRatio}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-purple-300 mt-1">
                        <span>{motiveNames[conflict.pair[0]]} {conflict.balanceRatio}%</span>
                        <span>{motiveNames[conflict.pair[1]]} {100 - conflict.balanceRatio}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 데이터가 없는 경우 */}
            {(!result.hiddenMotives || 
              (Object.keys(result.hiddenMotives.shadow || {}).length === 0 &&
               Object.keys(result.hiddenMotives.projection || {}).length === 0 &&
               Object.keys(result.hiddenMotives.compensation || {}).length === 0)) &&
             (!result.conflicts || result.conflicts.length === 0) && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">🌙</div>
                <h3 className="text-lg font-semibold text-white mb-2">숨겨진 동기 분석</h3>
                <p className="text-purple-300 text-sm">
                  숨겨진 동기 데이터가 아직 준비되지 않았습니다.
                </p>
              </div>
            )}
          </>
        )}

        {/* 성장 탭 */}
        {activeTab === 'growth' && (
          <>
            {/* 성숙도 상세 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">성숙도 분석</h3>
              
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-purple-400 mb-2">
                  Lv.{result.maturity.level}
                </div>
                <div className="text-xl text-white mb-1">
                  {levelDescriptions[result.maturity.level]?.name || ''}
                </div>
                <div className="text-purple-300">
                  {levelDescriptions[result.maturity.level]?.desc || ''}
                </div>
              </div>
              
              {/* 레벨 프로그레스 */}
              <div className="flex gap-2 mb-6">
                {[1, 2, 3, 4].map(level => (
                  <div 
                    key={level}
                    className={`flex-1 h-4 rounded-full ${
                      level <= result.maturity.level 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>

              {/* 세부 점수 */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-purple-200">자각 (Awareness)</span>
                    <span className="text-white">{result.maturity.awareness}점</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${result.maturity.awareness}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-purple-200">통합 (Integration)</span>
                    <span className="text-white">{result.maturity.integration}점</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${result.maturity.integration}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-purple-200">성장 (Growth)</span>
                    <span className="text-white">{result.maturity.growth}점</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${result.maturity.growth}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 메타인지 점수 */}
            {result.metacognition && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🧠 메타인지 수준</h3>
                
                {/* 종합 점수 */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    {result.metacognition.overall}점
                  </div>
                  <p className="text-purple-200 text-sm">
                    {result.metacognition.interpretation}
                  </p>
                </div>
                
                {/* 세부 점수 */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-purple-200">자기 인식 (Self-Awareness)</span>
                      <span className="text-white">{result.metacognition.selfAwareness}점</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-cyan-500 h-2 rounded-full"
                        style={{ width: `${result.metacognition.selfAwareness}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-purple-200">결정 명확성 (Decision Clarity)</span>
                      <span className="text-white">{result.metacognition.decisionClarity}점</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-teal-500 h-2 rounded-full"
                        style={{ width: `${result.metacognition.decisionClarity}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-purple-200">감정 조절 (Emotional Regulation)</span>
                      <span className="text-white">{result.metacognition.emotionalRegulation}점</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${result.metacognition.emotionalRegulation}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-purple-200">인지 유연성 (Cognitive Flexibility)</span>
                      <span className="text-white">{result.metacognition.cognitiveFlexibility}점</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${result.metacognition.cognitiveFlexibility}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 상황별 변화 */}
            {result.contextShifts && result.contextShifts.length > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">상황별 동기 변화</h3>
                <div className="space-y-4">
                  {result.contextShifts.map((ctx, index) => {
                    const contextNames: Record<string, string> = {
                      normal: '평상시',
                      pressure: '압박 상황',
                      growth: '성장 기회',
                      crisis: '위기 상황',
                    };
                    return (
                      <div key={index} className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">
                            {contextNames[ctx.context] || ctx.context}
                          </span>
                          <span className="text-purple-300">
                            주요: {motiveNames[ctx.dominantMotive]}
                          </span>
                        </div>
                        {ctx.motiveShift && Object.keys(ctx.motiveShift).length > 0 && (
                          <div className="text-sm text-purple-300">
                            변화: {Object.entries(ctx.motiveShift).map(([m, v]) => 
                              `${motiveNames[m]} ${v! > 0 ? '+' : ''}${v}`
                            ).join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 검증 결과 */}
            <div className={`rounded-2xl p-6 ${
              result.validation.isValid 
                ? 'bg-green-500/20' 
                : 'bg-yellow-500/20'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">
                  {result.validation.isValid ? '✅' : '⚠️'}
                </span>
                <h3 className="text-lg font-semibold text-white">
                  응답 검증
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-purple-300">일관성</span>
                  <div className="text-white font-medium">{result.validation.consistency}점</div>
                </div>
                <div>
                  <span className="text-purple-300">정직성</span>
                  <div className="text-white font-medium">{result.validation.honesty}점</div>
                </div>
              </div>
              {result.validation.warnings && result.validation.warnings.length > 0 && (
                <div className="mt-3 text-sm text-yellow-300">
                  주의: {result.validation.warnings.join(', ')}
                </div>
              )}
            </div>
          </>
        )}

        {/* 인사이트 탭 (v5 분석) */}
        {activeTab === 'insights' && (
          <>
            {/* 응답 신뢰도 */}
            {result.reliabilityScore && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📊 응답 신뢰도</h3>
                <div className="flex items-center gap-6 mb-4">
                  <div className={`
                    w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold
                    ${result.reliabilityScore.grade === 'S' || result.reliabilityScore.grade === 'A' 
                      ? 'bg-green-500/30 text-green-400' 
                      : result.reliabilityScore.grade === 'B' || result.reliabilityScore.grade === 'C'
                        ? 'bg-yellow-500/30 text-yellow-400'
                        : 'bg-red-500/30 text-red-400'}
                  `}>
                    {result.reliabilityScore.grade}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{result.reliabilityScore.overall}점</div>
                    <div className="text-purple-300 text-sm">{result.reliabilityScore.recommendation}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-purple-300 text-sm">응답 일관성</div>
                    <div className="text-white font-medium">{result.reliabilityScore.responseConsistency}%</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-purple-300 text-sm">패턴 타당성</div>
                    <div className="text-white font-medium">{result.reliabilityScore.patternValidity}%</div>
                  </div>
                </div>
                {result.reliabilityScore.warnings.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-500/10 rounded-xl">
                    <div className="text-yellow-400 text-sm font-medium mb-1">⚠️ 주의사항</div>
                    {result.reliabilityScore.warnings.map((w, i) => (
                      <div key={i} className="text-yellow-200 text-sm">{w}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 프로파일 고유성 */}
            {result.uniqueness && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">✨ 프로파일 고유성</h3>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-purple-400 mb-2">
                    상위 {result.uniqueness.percentile}%
                  </div>
                  <div className="text-purple-300">{result.uniqueness.interpretation}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-purple-300 text-sm">고유성 점수</div>
                    <div className="text-white font-bold text-xl">{result.uniqueness.overall}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-purple-300 text-sm">프로파일 형태</div>
                    <div className="text-white font-bold text-xl">{result.uniqueness.profileShape}</div>
                  </div>
                </div>
                {result.uniqueness.uniqueTraits.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-purple-300 text-sm">고유한 특성</div>
                    {result.uniqueness.uniqueTraits.map((trait, i) => (
                      <div key={i} className="bg-purple-500/10 rounded-lg p-2 text-purple-200 text-sm">
                        {trait}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 갈등 지도 */}
            {result.conflictMap && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">⚔️ 내적 갈등 지도</h3>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    전체 긴장도: {result.conflictMap.overallTension}점
                  </div>
                  <div className="text-purple-300 text-sm">{result.conflictMap.interpretation}</div>
                </div>
                {result.conflictMap.primaryConflict && (
                  <div className="bg-orange-500/10 rounded-xl p-4 mb-4">
                    <div className="text-orange-400 font-medium mb-2">🔥 주요 갈등</div>
                    <div className="text-white">
                      {motiveNames[result.conflictMap.primaryConflict.motiveA]} vs {motiveNames[result.conflictMap.primaryConflict.motiveB]}
                    </div>
                    <div className="text-orange-300 text-sm">
                      긴장도: {result.conflictMap.primaryConflict.tension}점
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {result.conflictMap.pairs.slice(0, 5).map((pair, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <span className="text-purple-200">
                        {motiveNames[pair.motiveA]} ↔ {motiveNames[pair.motiveB]}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-400">{pair.type}</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          pair.tension > 60 ? 'bg-red-500/20 text-red-400' :
                          pair.tension > 30 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {pair.tension}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 극단 패턴 */}
            {result.extremePatterns && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📈 극단 패턴 분석</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-purple-300 text-sm">극단 응답 비율</div>
                    <div className="text-white font-bold">{result.extremePatterns.extremeResponseRatio ?? '-'}%</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-purple-300 text-sm">양극화 점수</div>
                    <div className="text-white font-bold">{result.extremePatterns.polarizationScore ?? '-'}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-purple-300 text-sm">중립 회피</div>
                    <div className="text-white font-bold">{result.extremePatterns.neutralAvoidance ?? '-'}%</div>
                  </div>
                </div>
                <div className="text-purple-300 text-sm">{result.extremePatterns.interpretation ?? ''}</div>
                {result.extremePatterns.dominantMotives && result.extremePatterns.dominantMotives.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-purple-400 text-sm">강세 동기:</span>
                    {result.extremePatterns.dominantMotives.map((m, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-500/20 rounded text-purple-200 text-sm">
                        {motiveNames[m] || m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 응답 시간 분석 */}
            {result.responseTimeScore && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">⏱️ 응답 패턴 분석</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-purple-300 text-sm">평균 시간</div>
                    <div className="text-white font-bold">{(result.responseTimeScore.avgTimeMs / 1000).toFixed(1)}초</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-purple-300 text-sm">결정 속도</div>
                    <div className="text-white font-bold">{result.responseTimeScore.decisionSpeed}점</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-purple-300 text-sm">응답 품질</div>
                    <div className="text-white font-bold">{result.responseTimeScore.overallQuality}점</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-purple-300 text-sm">피로도</div>
                    <div className="text-white font-bold">{result.responseTimeScore.fatigueLevel}%</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {result.responseTimeScore.impulsivityRisk > 30 && (
                    <div className="bg-yellow-500/10 rounded-lg p-2 text-yellow-300 text-sm">
                      ⚡ 충동적 응답 경향: {result.responseTimeScore.impulsivityRisk}%
                    </div>
                  )}
                  {result.responseTimeScore.avoidanceRisk > 30 && (
                    <div className="bg-orange-500/10 rounded-lg p-2 text-orange-300 text-sm">
                      🚫 회피적 응답 경향: {result.responseTimeScore.avoidanceRisk}%
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 동기 진화 예측 */}
            {result.motiveEvolution && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">🔮 동기 진화 예측</h3>
                <div className="bg-purple-500/10 rounded-xl p-4 mb-4">
                  <div className="text-purple-300 text-sm mb-1">전체 방향성</div>
                  <div className="text-white font-medium">{
                    {
                      expanding: '🚀 확장 중 - 새로운 동기가 성장하고 있습니다',
                      consolidating: '🎯 집중 중 - 핵심 동기로 수렴하고 있습니다',
                      shifting: '🔄 전환 중 - 동기 구조가 변화하고 있습니다',
                      stable: '⚖️ 안정 - 현재 동기 구조가 유지되고 있습니다',
                    }[result.motiveEvolution.overallTrajectory] || result.motiveEvolution.overallTrajectory
                  }</div>
                </div>
                <div className="space-y-3">
                  {result.motiveEvolution.predictedChanges.slice(0, 4).map((change, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <span className="text-white font-medium">{motiveNames[change.motive]}</span>
                        <span className="text-purple-300 text-sm ml-2">({change.currentScore}점)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          change.predictedDirection === 'grow' ? 'bg-green-500/20 text-green-400' :
                          change.predictedDirection === 'decline' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {change.predictedDirection === 'grow' ? '↑ 성장' :
                           change.predictedDirection === 'decline' ? '↓ 감소' : '→ 유지'}
                        </span>
                        <span className="text-purple-400 text-xs">{change.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 발전 제안 */}
            {result.developmentSuggestions && result.developmentSuggestions.length > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">💡 발전 제안</h3>
                <div className="space-y-4">
                  {result.developmentSuggestions.slice(0, 3).map((sugg, i) => (
                    <div key={i} className={`rounded-xl p-4 ${
                      sugg.priority === 'high' ? 'bg-red-500/10 border border-red-500/30' :
                      sugg.priority === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                      'bg-green-500/10 border border-green-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          sugg.priority === 'high' ? 'bg-red-500/30 text-red-300' :
                          sugg.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                          'bg-green-500/30 text-green-300'
                        }`}>
                          {sugg.priority === 'high' ? '높음' : sugg.priority === 'medium' ? '중간' : '낮음'}
                        </span>
                        <span className="text-white font-medium">{sugg.area}</span>
                      </div>
                      <div className="text-purple-200 mb-2">{sugg.suggestion}</div>
                      <div className="text-purple-400 text-sm">{sugg.reason}</div>
                      {sugg.actionItems && sugg.actionItems.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {sugg.actionItems.map((item, j) => (
                            <div key={j} className="text-purple-300 text-sm flex items-start gap-2">
                              <span>•</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* 하단 버튼 */}
        <div className="space-y-3 pt-4">
          {onGenerateReport && (
            <button
              onClick={onGenerateReport}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium
                       hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              🤖 AI 상세 보고서 생성
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full py-4 bg-white/10 text-white rounded-xl font-medium
                       hover:bg-white/20 transition-all"
            >
              다시 검사하기
            </button>
          )}
        </div>

        {/* 완료 시간 */}
        <div className="text-center text-sm text-purple-400 pb-8">
          검사 완료: {result.completedAt.toLocaleString()} · 
          소요 시간: {Math.round(result.totalTimeMs / 60000)}분
        </div>
      </div>
    </div>
  );
}

export default FullResultScreen;