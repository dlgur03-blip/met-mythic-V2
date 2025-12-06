'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const motives = [
    { key: 'achievement', name: '성취', emoji: '🏆', desc: '목표를 달성하고 결과를 만들어내는 것에서 에너지를 얻습니다.' },
    { key: 'mastery', name: '전문성', emoji: '📚', desc: '깊이 이해하고 전문가가 되는 것을 추구합니다.' },
    { key: 'creation', name: '창조', emoji: '🎨', desc: '새로운 것을 만들고 표현하는 것에서 의미를 찾습니다.' },
    { key: 'recognition', name: '인정', emoji: '⭐', desc: '능력과 가치를 인정받고 싶어합니다.' },
    { key: 'connection', name: '관계', emoji: '💚', desc: '사람들과 깊이 연결되고 싶어합니다.' },
    { key: 'security', name: '안정', emoji: '🛡️', desc: '예측 가능하고 안전한 환경을 선호합니다.' },
    { key: 'freedom', name: '자유', emoji: '🕊️', desc: '자율성과 독립성을 중시합니다.' },
    { key: 'adventure', name: '모험', emoji: '🧭', desc: '새로운 경험과 도전을 추구합니다.' },
  ];

  const ignitions = [
    { key: 'competition', name: '경쟁', emoji: '⚔️', desc: '경쟁 상황에서 에너지가 폭발합니다.' },
    { key: 'complexity', name: '복잡성', emoji: '🧩', desc: '복잡한 문제를 만났을 때 흥분합니다.' },
    { key: 'deadline', name: '마감', emoji: '⏰', desc: '데드라인이 있을 때 집중력이 극대화됩니다.' },
    { key: 'audience', name: '시선', emoji: '👥', desc: '누군가 지켜볼 때 더 잘합니다.' },
    { key: 'autonomy', name: '자율', emoji: '🔓', desc: '스스로 결정할 수 있을 때 몰입합니다.' },
    { key: 'crisis', name: '위기', emoji: '🚨', desc: '위기 상황에서 오히려 강해집니다.' },
  ];

  const archetypes = [
    { key: 'conqueror', name: '정복자', emoji: '⚔️', desc: '목표를 정하고 달성합니다. 승리와 성취가 존재 이유입니다.', figure: '나폴레옹, 알렉산더' },
    { key: 'sage', name: '현자', emoji: '📚', desc: '깊이 이해하고 전문성을 쌓습니다. 지혜와 지식이 힘입니다.', figure: '제갈량, 아테나' },
    { key: 'creator', name: '창조자', emoji: '🎨', desc: '새로운 것을 만듭니다. 창작이 존재의 증명입니다.', figure: '다빈치, 헤파이스토스' },
    { key: 'sovereign', name: '군주', emoji: '👑', desc: '다스리고 보호합니다. 책임과 권위가 함께합니다.', figure: '제우스, 솔로몬' },
    { key: 'healer', name: '치유자', emoji: '💚', desc: '돌보고 치유합니다. 타인의 아픔이 나의 아픔입니다.', figure: '관음, 아스클레피오스' },
    { key: 'guardian', name: '수호자', emoji: '🛡️', desc: '지키고 보호합니다. 안전이 최우선입니다.', figure: '헥토르, 아테나' },
    { key: 'rebel', name: '반역자', emoji: '🔥', desc: '기존 질서에 저항합니다. 변화가 사명입니다.', figure: '프로메테우스, 손오공' },
    { key: 'explorer', name: '탐험가', emoji: '🧭', desc: '새로운 것을 찾습니다. 여정이 목적입니다.', figure: '오디세우스, 현장' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 네비게이션 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <span className="text-2xl">🧭</span>
            MET Mythic
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm hover:opacity-90">
              테스트 시작
            </Link>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* 로고 */}
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20">
              <span className="text-7xl">🧭</span>
            </div>
            {/* 글로우 효과 */}
            <div className="absolute inset-0 w-32 h-32 mx-auto bg-purple-500/20 rounded-full blur-3xl -z-10" />
          </div>

          {/* 타이틀 */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            MET <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Mythic</span>
          </h1>

          {/* 약자 설명 */}
          <div className="flex justify-center gap-4 md:gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400">M</div>
              <div className="text-sm text-purple-200">Motivation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-pink-400">E</div>
              <div className="text-sm text-pink-200">Energy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-indigo-400">T</div>
              <div className="text-sm text-indigo-200">Type</div>
            </div>
          </div>

          <p className="text-xl md:text-2xl text-purple-200 mb-4">
            당신의 <strong className="text-white">동기 에너지 유형</strong>을 신화 원형으로 해석합니다
          </p>
          <p className="text-lg text-white/60">
            8가지 핵심 동기 × 8가지 신화 원형 × 48명의 신화 인물
          </p>
        </div>
      </section>

      {/* 철학 섹션 */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            ✨ 왜 만들었는가
          </h2>
          <p className="text-purple-200 text-center mb-12 text-lg">Our Philosophy</p>

          {/* 🆕 집단무의식 설명 추가 */}
          <div className="bg-gradient-to-r from-purple-900/50 via-pink-900/30 to-indigo-900/50 rounded-3xl p-8 mb-12 border border-purple-500/30">
            <div className="text-center mb-6">
              <span className="text-5xl">🌌</span>
            </div>
            <h3 className="text-2xl font-bold text-white text-center mb-4">
              왜 신화 인물과 싱크로율이 높게 나올까요?
            </h3>
            <p className="text-white/80 text-center leading-relaxed mb-6">
              칼 융(Carl Jung)은 인류가 공유하는 <strong className="text-purple-300">"집단무의식"</strong>이 
              신화와 원형(Archetype)으로 표현된다고 말했습니다.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-3xl mb-2">🧬</div>
                <div className="text-white font-medium mb-1">보편적 패턴</div>
                <p className="text-white/60 text-sm">모든 인간은 비슷한 동기 구조를 공유합니다</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-3xl mb-2">📜</div>
                <div className="text-white font-medium mb-1">수천 년의 지혜</div>
                <p className="text-white/60 text-sm">신화는 인간 본성의 결정체입니다</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-3xl mb-2">🔮</div>
                <div className="text-white font-medium mb-1">당신 안의 신화</div>
                <p className="text-white/60 text-sm">당신도 누군가의 신화를 살고 있습니다</p>
              </div>
            </div>
            <p className="text-purple-300 text-center mt-6 text-sm">
              💡 싱크로율 70% 이상은 해당 원형이 당신의 핵심 정체성과 깊이 연결되어 있다는 의미입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-colors">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-3">진정한 자기 이해</h3>
              <p className="text-white/70 leading-relaxed">
                "나는 왜 이런 선택을 할까?" 
                "왜 어떤 일에는 몰입하고, 어떤 일에는 지칠까?"
                <br /><br />
                MET Mythic은 표면적인 성격이 아닌, 
                당신을 움직이는 <strong className="text-purple-300">근본적인 동기</strong>를 탐색합니다.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-pink-500/50 transition-colors">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold text-white mb-3">신화의 지혜</h3>
              <p className="text-white/70 leading-relaxed">
                수천 년간 인류가 공유해온 신화 속에는 
                인간 본성에 대한 깊은 통찰이 담겨 있습니다.
                <br /><br />
                제갈량의 지혜, 프로메테우스의 반항, 관음의 자비...
                <strong className="text-pink-300">당신은 어떤 신화를 살고 있나요?</strong>
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-indigo-500/50 transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-3">실행 가능한 통찰</h3>
              <p className="text-white/70 leading-relaxed">
                "재미있네요" 에서 끝나는 테스트는 의미가 없습니다.
                <br /><br />
                MET Mythic은 <strong className="text-indigo-300">구체적인 행동 가이드</strong>를 제공합니다.
                언제 에너지를 얻고, 무엇이 당신을 소진시키는지 알려드립니다.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-amber-500/50 transition-colors">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-white mb-3">최고 수준의 분석</h3>
              <p className="text-white/70 leading-relaxed">
                347개 문항, 8가지 동기 원천, 6가지 점화 조건,
                숨겨진 동기, 동기 충돌, 에너지 패턴...
                <br /><br />
                <strong className="text-amber-300">2만자 AI 심층 보고서</strong>까지.
                세상에서 가장 정교한 동기 분석을 경험하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🆕 이론적 기반 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            📖 이론적 기반
          </h2>
          <p className="text-purple-200 text-center mb-6 text-lg">
            MET Mythic은 검증된 심리학 이론들을 통합하여 설계되었습니다
          </p>
          <p className="text-white/50 text-center mb-12 text-sm max-w-2xl mx-auto">
            단순한 재미용 테스트가 아닙니다. 각 분석 축은 학술적 연구에 기반하며,<br />
            여러 이론을 교차 검증하여 더 정확한 결과를 도출합니다.
          </p>

          <div className="space-y-6">
            {/* 1. 동기 원천 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💫</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">8가지 동기 원천</h3>
                  <p className="text-white/70 mb-3">
                    성취, 전문성, 창조, 인정, 관계, 안정, 자유, 모험 — 당신을 움직이는 근본적인 에너지원
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs">
                      자기결정이론 (SDT) — Deci & Ryan
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs">
                      욕구위계이론 — Maslow
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs">
                      성취동기이론 — McClelland
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 점화 조건 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">6가지 점화 조건</h3>
                  <p className="text-white/70 mb-3">
                    경쟁, 복잡성, 마감, 시선, 자율, 위기 — 언제 당신의 잠재력이 폭발하는가
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-orange-500/20 rounded-full text-orange-300 text-xs">
                      몰입이론 (Flow) — Csikszentmihalyi
                    </span>
                    <span className="px-3 py-1 bg-orange-500/20 rounded-full text-orange-300 text-xs">
                      각성이론 — Yerkes-Dodson
                    </span>
                    <span className="px-3 py-1 bg-orange-500/20 rounded-full text-orange-300 text-xs">
                      자기효능감 — Bandura
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 신화 원형 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-pink-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏛️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">8가지 신화 원형 & 48 인물</h3>
                  <p className="text-white/70 mb-3">
                    정복자, 현자, 창조자, 군주, 치유자, 수호자, 반역자, 탐험가 — 집단무의식에 새겨진 인간 유형
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-pink-500/20 rounded-full text-pink-300 text-xs">
                      원형이론 (Archetype) — Carl Jung
                    </span>
                    <span className="px-3 py-1 bg-pink-500/20 rounded-full text-pink-300 text-xs">
                      영웅의 여정 — Joseph Campbell
                    </span>
                    <span className="px-3 py-1 bg-pink-500/20 rounded-full text-pink-300 text-xs">
                      브랜드 원형 — Mark & Pearson
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. 성숙도 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌱</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">4단계 성숙도</h3>
                  <p className="text-white/70 mb-3">
                    그림자 → 각성 → 통합 → 초월 — 같은 동기도 성숙도에 따라 전혀 다르게 발현됩니다
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-500/20 rounded-full text-green-300 text-xs">
                      개성화 (Individuation) — Carl Jung
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 rounded-full text-green-300 text-xs">
                      자아발달이론 — Loevinger
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 rounded-full text-green-300 text-xs">
                      나선역학 (Spiral Dynamics)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. 운영 방식 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">운영 방식 (Operation Style)</h3>
                  <p className="text-white/70 mb-3">
                    내적↔외적 동기, 즉각↔숙고, 능동↔수동, 독립↔협력 — 동기를 실현하는 방식의 차이
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-xs">
                      조절초점이론 — Higgins
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-xs">
                      인지양식이론 — Witkin
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-xs">
                      행동활성화체계 — Gray
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. 에너지 패턴 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">에너지 패턴</h3>
                  <p className="text-white/70 mb-3">
                    충전 요인, 소진 요인, 지속가능성, 번아웃 위험도 — 장기적으로 건강하게 일하는 법
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300 text-xs">
                      번아웃 모델 — Maslach
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300 text-xs">
                      직무요구-자원 모델 — Bakker
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300 text-xs">
                      에너지 관리 — Loehr & Schwartz
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. 숨겨진 동기 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-violet-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌙</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">숨겨진 동기 (Shadow Motives)</h3>
                  <p className="text-white/70 mb-3">
                    그림자, 투사, 보상심리 — 의식하지 못하지만 당신의 선택에 영향을 미치는 것들
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-violet-500/20 rounded-full text-violet-300 text-xs">
                      그림자 (Shadow) — Carl Jung
                    </span>
                    <span className="px-3 py-1 bg-violet-500/20 rounded-full text-violet-300 text-xs">
                      방어기제 — Anna Freud
                    </span>
                    <span className="px-3 py-1 bg-violet-500/20 rounded-full text-violet-300 text-xs">
                      암묵적 동기 — McClelland
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 8. 동기 충돌 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-red-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚔️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">동기 충돌 (Motive Conflicts)</h3>
                  <p className="text-white/70 mb-3">
                    성취 vs 관계, 자유 vs 안정 — 내면의 갈등이 의사결정을 어렵게 만드는 지점
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-red-500/20 rounded-full text-red-300 text-xs">
                      접근-회피 갈등 — Lewin
                    </span>
                    <span className="px-3 py-1 bg-red-500/20 rounded-full text-red-300 text-xs">
                      가치갈등이론 — Schwartz
                    </span>
                    <span className="px-3 py-1 bg-red-500/20 rounded-full text-red-300 text-xs">
                      동기적 양가감정 — Emmons
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 9. 상황별 동기 변화 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔄</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">상황별 동기 변화 (Context Shifts)</h3>
                  <p className="text-white/70 mb-3">
                    평상시, 압박 상황, 성장 기회, 위기 상황 — 상황에 따라 다르게 발현되는 동기 패턴
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-amber-500/20 rounded-full text-amber-300 text-xs">
                      상황주의 — Mischel
                    </span>
                    <span className="px-3 py-1 bg-amber-500/20 rounded-full text-amber-300 text-xs">
                      스트레스-대처 이론 — Lazarus
                    </span>
                    <span className="px-3 py-1 bg-amber-500/20 rounded-full text-amber-300 text-xs">
                      적응적 무의식 — Wilson
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 요약 */}
          <div className="mt-12 bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-indigo-900/30 rounded-2xl p-6 border border-white/10 text-center">
            <p className="text-white/80 leading-relaxed">
              MET Mythic은 <strong className="text-purple-300">30개 이상의 심리학 이론</strong>을 통합하여 
              당신의 동기 구조를 다차원적으로 분석합니다.<br />
              단일 이론의 한계를 넘어, <strong className="text-pink-300">교차 검증</strong>을 통해 
              더 정확하고 실용적인 인사이트를 제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 8가지 동기 원천 상세 */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            💫 8가지 동기 원천
          </h2>
          <p className="text-purple-200 text-center mb-12 text-lg">당신을 움직이는 8가지 근본적인 힘</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {motives.map((m) => (
              <div 
                key={m.key}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors text-center"
              >
                <div className="text-4xl mb-3">{m.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-2">{m.name}</h3>
                <p className="text-sm text-white/60">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6가지 점화 조건 상세 */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            🔥 6가지 점화 조건
          </h2>
          <p className="text-purple-200 text-center mb-12 text-lg">당신의 에너지에 불을 붙이는 조건</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ignitions.map((i) => (
              <div 
                key={i.key}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors text-center"
              >
                <div className="text-4xl mb-3">{i.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-2">{i.name}</h3>
                <p className="text-sm text-white/60">{i.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8가지 신화 원형 상세 */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            🏛️ 8가지 신화 원형
          </h2>
          <p className="text-purple-200 text-center mb-12 text-lg">당신의 동기 패턴과 가장 닮은 신화 속 존재</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {archetypes.map((a) => (
              <div 
                key={a.key}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors text-center"
              >
                <div className="text-4xl mb-3">{a.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-1">{a.name}</h3>
                <p className="text-xs text-purple-400 mb-2">{a.figure}</p>
                <p className="text-sm text-white/60">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4단계 성숙도 */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            🌱 4단계 성숙도
          </h2>
          <p className="text-purple-200 text-center mb-12 text-lg">같은 원형도 성숙도에 따라 다르게 나타납니다</p>
          
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { level: 1, name: '그림자', desc: '동기의 어두운 면이 지배합니다' },
              { level: 2, name: '각성', desc: '동기를 인식하기 시작합니다' },
              { level: 3, name: '통합', desc: '동기를 조화롭게 다룹니다' },
              { level: 4, name: '초월', desc: '동기에서 자유로워집니다' },
            ].map((l) => (
              <div 
                key={l.level}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 text-center"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3 ${
                  l.level === 1 ? 'bg-gray-600 text-gray-300' :
                  l.level === 2 ? 'bg-blue-600 text-white' :
                  l.level === 3 ? 'bg-purple-600 text-white' :
                  'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                }`}>
                  {l.level}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Lv.{l.level} {l.name}</h3>
                <p className="text-sm text-white/60">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 분석 요소 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            📊 무엇을 분석하는가
          </h2>
          <p className="text-purple-200 text-center mb-12 text-lg">Deep Analysis Components</p>

          <div className="space-y-6">
            {[
              { icon: '🎯', title: '8가지 동기 원천', desc: '성취, 전문성, 창조, 인정, 관계, 안정, 자유, 모험 — 당신을 움직이는 근본 에너지' },
              { icon: '🔥', title: '6가지 점화 조건', desc: '경쟁, 복잡성, 마감, 시선, 자율, 위기 — 무엇이 당신의 열정에 불을 붙이는가' },
              { icon: '🧭', title: '8가지 신화 원형', desc: '정복자, 현자, 창조자, 군주, 치유자, 수호자, 반역자, 탐험가' },
              { icon: '👤', title: '48명의 신화 인물', desc: '제갈량, 나폴레옹, 관음, 프로메테우스... 당신과 가장 닮은 신화 속 존재' },
              { icon: '📈', title: '4단계 성숙도', desc: '그림자 → 각성 → 통합 → 초월, 당신의 현재 위치와 성장 방향' },
              { icon: '⚡', title: '에너지 패턴', desc: '무엇이 당신을 충전시키고, 무엇이 소진시키는지' },
              { icon: '🌑', title: '숨겨진 동기', desc: '의식하지 못하지만 당신의 선택에 영향을 미치는 그림자 동기' },
              { icon: '💥', title: '동기 충돌', desc: '내면의 갈등이 발생하는 지점과 해결 방향' },
            ].map((item, i) => (
              <div 
                key={i}
                className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-white/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 활용법 섹션 */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            💡 어떻게 활용하는가
          </h2>
          <p className="text-purple-200 text-center mb-12 text-lg">Practical Applications</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-2xl p-6 border border-purple-500/30">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-lg font-bold text-white mb-2">커리어 설계</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                나의 동기 원천에 맞는 직무와 환경을 찾으세요. 
                왜 어떤 일에서 번아웃이 오는지 이해할 수 있습니다.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 rounded-2xl p-6 border border-pink-500/30">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-bold text-white mb-2">관계 이해</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                파트너, 동료, 친구의 동기를 이해하면 
                갈등의 원인과 소통 방법이 보입니다.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 rounded-2xl p-6 border border-indigo-500/30">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-bold text-white mb-2">자기 성장</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                성숙도 단계와 성장 힌트를 통해 
                다음 레벨로 나아가는 구체적인 방향을 제시합니다.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 rounded-2xl p-6 border border-amber-500/30">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">에너지 관리</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                나를 충전시키는 활동과 소진시키는 상황을 파악하여 
                지속 가능한 삶의 패턴을 만드세요.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-2xl p-6 border border-green-500/30">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-white mb-2">의사결정</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                중요한 선택의 순간, 나의 핵심 동기에 부합하는 
                결정을 내릴 수 있습니다.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 rounded-2xl p-6 border border-cyan-500/30">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="text-lg font-bold text-white mb-2">자기 이해</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                "왜 나는 이럴까?"에 대한 답을 찾고, 
                자신을 있는 그대로 받아들이는 계기가 됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 프리미엄 가치 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            👑 프리미엄 경험
          </h2>
          <p className="text-purple-200 mb-12 text-lg">Why MET Mythic is Different</p>

          <div className="bg-gradient-to-br from-purple-900/50 via-pink-900/30 to-indigo-900/50 rounded-3xl p-8 md:p-12 border border-white/20 relative overflow-hidden">
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div>
                  <div className="text-4xl font-bold text-white mb-2">347</div>
                  <div className="text-purple-200">정교한 문항</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">20,000+</div>
                  <div className="text-purple-200">AI 분석 글자수</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">48</div>
                  <div className="text-purple-200">신화 인물 매칭</div>
                </div>
              </div>

              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                무료 심리테스트의 한계를 넘어,<br />
                <strong className="text-white">전문가 수준의 깊이 있는 분석</strong>을 제공합니다.
              </p>

              <div className="inline-flex items-center gap-2 text-amber-400 text-lg">
                <span>⭐</span>
                <span>당신의 인생을 바꿀 수 있는 투자</span>
                <span>⭐</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            🧭 지금 시작하세요
          </h2>
          <p className="text-white/60 mb-8">
            당신만의 신화가 기다리고 있습니다
          </p>

          <Link 
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30"
          >
            테스트 시작하기
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center text-white/40 text-sm">
          <p>© 2024 MET Mythic. All rights reserved.</p>
          <p className="mt-2">Motivation Energy Type — 당신의 동기 원형을 찾아드립니다</p>
        </div>
      </footer>
    </div>
  );
}