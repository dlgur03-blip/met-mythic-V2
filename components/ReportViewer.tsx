'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { FullResult } from '@/lib/full_api';
import type { ReportResponse } from '@/lib/report_generator';
import type { Answer } from '@/lib/types';
import { generateTalentCardHtml } from '@/lib/talentCardGenerator';

interface ReportViewerProps {
  result: FullResult;
  answers?: Answer[];  // 🆕 v6.0: 증거 수집용 원본 응답
  onBack: () => void;
}

type ViewState = 'idle' | 'generating' | 'ready' | 'sending' | 'sent' | 'error';

export function ReportViewer({ result, answers, onBack }: ReportViewerProps) {
  const [viewState, setViewState] = useState<ViewState>('idle');
  const [aiReport, setAiReport] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 진행률 시뮬레이션 (AI 생성 중) - 3-5분 기준으로 천천히
  useEffect(() => {
    if (viewState === 'generating') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          // 천천히 증가 (3-5분 동안 95%까지)
          const increment = Math.random() * 2 + 0.5;
          return Math.min(95, prev + increment);
        });
      }, 3000); // 3초마다 업데이트
      return () => clearInterval(interval);
    }
  }, [viewState]);

  // AI 보고서 생성 + HTML 카드 생성
  const generateReport = async () => {
    setViewState('generating');
    setProgress(0);
    setError('');

    try {
      // 1. AI 보고서 생성 (Gemini)
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullResult: result,
          answers: answers || []  // 🆕 v6.0: 증거 수집용
        }),
      });

      const data: ReportResponse = await response.json();

      if (data.success && data.report) {
        setAiReport(data.report);
        
        // 2. HTML 인재 카드 생성
        const html = generateTalentCardHtml(result, data.report);
        setHtmlContent(html);
        
        setProgress(100);
        setViewState('ready');
      } else {
        throw new Error(data.error || '보고서 생성에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '네트워크 오류가 발생했습니다.');
      setViewState('error');
    }
  };

  // 이메일 유효성 검사
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // HTML 파일 다운로드 함수
  const downloadHtmlFile = () => {
    if (!htmlContent) return;
    
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MET_Mythic_Report_${result.primaryArchetype.archetypeName}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 이메일 제출 + 다운로드
  const sendEmail = async () => {
    if (!validateEmail(email)) {
      setEmailError('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setEmailError('');
    setViewState('sending');

    try {
      // 1. 서버에 기록 (Google Sheets + 관리자 알림)
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          htmlContent,
          archetypeName: result.primaryArchetype.archetypeName,
          figureName: result.primaryFigure.figureName,
          nickname: result.nickname || '',
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 2. HTML 파일 자동 다운로드
        downloadHtmlFile();
        setViewState('sent');
      } else {
        throw new Error(data.error || '처리에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '처리 중 오류가 발생했습니다.');
      setViewState('error');
    }
  };

  // iframe에 HTML 로드
  useEffect(() => {
    if (htmlContent && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
  }, [htmlContent]);

  // 등급 색상
  const getGradeInfo = () => {
    const syncRate = result.primaryArchetype.score;
    const metacog = result.metacognition?.overall || 50;
    const reliability = result.reliabilityScore?.overall || 50;
    const uniqueness = result.uniqueness?.overall || 50;
    const overallScore = (syncRate * 0.3) + (metacog * 0.25) + (reliability * 0.25) + (uniqueness * 0.2);
    
    if (overallScore >= 90) return { grade: 'S', color: '#FFD700', bg: 'from-yellow-500/20 to-yellow-600/20' };
    if (overallScore >= 75) return { grade: 'A', color: '#9C27B0', bg: 'from-purple-500/20 to-purple-600/20' };
    if (overallScore >= 60) return { grade: 'B', color: '#2196F3', bg: 'from-blue-500/20 to-blue-600/20' };
    if (overallScore >= 40) return { grade: 'C', color: '#4CAF50', bg: 'from-green-500/20 to-green-600/20' };
    return { grade: 'D', color: '#9E9E9E', bg: 'from-gray-500/20 to-gray-600/20' };
  };

  const gradeInfo = getGradeInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      
      {/* 헤더 */}
      <header className="bg-black/40 backdrop-blur-xl sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>결과로 돌아가기</span>
          </button>
          
          <div className="text-purple-400 text-sm">
            🎮 인재 카드 생성기
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* ========== 대기 화면 ========== */}
        {viewState === 'idle' && (
          <div className="text-center py-16">
            {/* 미니 캐릭터 카드 미리보기 */}
            <div className={`inline-block bg-gradient-to-br ${gradeInfo.bg} border-2 rounded-3xl p-8 mb-8`}
                 style={{ borderColor: gradeInfo.color + '44' }}>
              <div className="text-6xl mb-4">{result.primaryArchetype.emoji}</div>
              <div className="text-2xl font-bold text-white mb-1">
                {result.primaryArchetype.archetypeName}
              </div>
              <div className="text-purple-300 mb-4">
                {result.primaryFigure.figureName} · {result.primaryFigure.origin}
              </div>
              <div className="inline-flex items-center gap-3 bg-black/30 px-4 py-2 rounded-full">
                <span className="text-3xl font-bold" style={{ color: gradeInfo.color }}>
                  {gradeInfo.grade}
                </span>
                <span className="text-purple-300">예상 등급</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              🎮 인재 카드를 생성할까요?
            </h2>
            <p className="text-purple-300 mb-2 max-w-lg mx-auto">
              AI가 분석한 상세 보고서와 함께<br />
              인사담당자/리더를 위한 <strong className="text-purple-200">게임 스타일 인재 카드</strong>를 생성합니다.
            </p>
            <p className="text-purple-400 text-sm mb-8">
              ⏱️ 약 3~5분 소요 (AI가 정성껏 분석합니다)
            </p>
            
            <button
              onClick={generateReport}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl
                       hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30
                       transform hover:scale-105"
            >
              🚀 인재 카드 생성하기
            </button>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-purple-200">핵심 역량 분석</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl mb-2">🔥</div>
                <div className="text-purple-200">점화 버튼</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-purple-200">역할 적합도</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl mb-2">💼</div>
                <div className="text-purple-200">관리자 팁</div>
              </div>
            </div>
          </div>
        )}

        {/* ========== 생성 중 ========== */}
        {viewState === 'generating' && (
          <div className="text-center py-8">
            <div className="inline-block relative mb-6">
              <div className="w-28 h-28 border-4 border-purple-500/30 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl animate-bounce">{result.primaryArchetype.emoji}</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              🤖 AI가 정성껏 분석 중입니다
            </h2>
            
            {/* 진행 바 */}
            <div className="max-w-md mx-auto mb-6">
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-purple-400 mt-2">{Math.round(progress)}% · 약 {Math.max(1, Math.round((100 - progress) / 20))}분 남음</div>
            </div>
            
            {/* 단계별 메시지 */}
            <div className="text-purple-300 space-y-2 text-sm mb-8">
              {progress < 15 && <p>📝 347개 문항 응답 패턴 분석 중...</p>}
              {progress >= 15 && progress < 30 && <p>🧠 8가지 동기 원천 깊이 분석 중...</p>}
              {progress >= 30 && progress < 45 && <p>⚔️ 내면의 동기 충돌 패턴 탐색 중...</p>}
              {progress >= 45 && progress < 60 && <p>🌙 숨겨진 그림자 동기 발굴 중...</p>}
              {progress >= 60 && progress < 75 && <p>🏛️ 신화 원형과 매칭 중...</p>}
              {progress >= 75 && progress < 90 && <p>🔮 미래 동기 진화 예측 중...</p>}
              {progress >= 90 && <p>✨ 2만자 보고서 작성 마무리 중...</p>}
            </div>

            {/* 기다리는 동안 재미있는 콘텐츠 */}
            <div className="max-w-lg mx-auto bg-white/5 rounded-2xl p-6 text-left">
              <div className="text-purple-400 text-sm font-medium mb-3">
                💡 알고 계셨나요?
              </div>
              <div className="text-purple-200 text-sm space-y-4">
                {progress < 25 && (
                  <div>
                    <p className="font-medium text-white mb-1">🎭 원형(Archetype)이란?</p>
                    <p>칼 융이 제안한 개념으로, 인류 공통의 무의식에 존재하는 보편적 패턴입니다. 
                    당신의 {result.primaryArchetype.archetypeName} 원형은 {result.primaryFigure.figureName}처럼 
                    특정한 동기와 행동 패턴을 가집니다.</p>
                  </div>
                )}
                {progress >= 25 && progress < 50 && (
                  <div>
                    <p className="font-medium text-white mb-1">🔥 점화 조건(Ignition)이란?</p>
                    <p>당신을 움직이게 하는 특별한 조건들입니다. 어떤 사람은 경쟁에서, 
                    어떤 사람은 마감에서, 어떤 사람은 복잡한 문제에서 에너지를 얻습니다.
                    당신만의 점화 버튼을 알면 동기 관리가 쉬워집니다.</p>
                  </div>
                )}
                {progress >= 50 && progress < 75 && (
                  <div>
                    <p className="font-medium text-white mb-1">🌑 그림자 동기(Shadow Motive)란?</p>
                    <p>의식적으로 인정하기 어렵지만 행동에 영향을 미치는 숨겨진 욕구입니다.
                    예를 들어, "인정받고 싶지 않다"고 말하지만 실제로는 인정 욕구가 높을 수 있습니다.
                    그림자를 인식하면 더 통합된 자아를 만들 수 있습니다.</p>
                  </div>
                )}
                {progress >= 75 && (
                  <div>
                    <p className="font-medium text-white mb-1">📈 동기 성숙도 레벨</p>
                    <p>Lv.1 그림자: 동기를 탐색하는 단계<br/>
                    Lv.2 각성: 동기를 인식하는 단계<br/>
                    Lv.3 통합: 동기를 조화시키는 단계<br/>
                    Lv.4 초월: 동기를 자유롭게 다루는 단계<br/>
                    현재 당신은 Lv.{result.maturity.level}입니다!</p>
                  </div>
                )}
              </div>
            </div>

            {/* 부가 정보 */}
            <div className="mt-6 text-purple-400/70 text-xs">
              <p>⏳ AI가 {result.primaryArchetype.archetypeName}의 관점에서 심층 분석하고 있습니다</p>
              <p className="mt-1">잠시만 기다려주세요. 페이지를 닫지 마세요!</p>
            </div>
          </div>
        )}

        {/* ========== 미리보기 + 이메일 전송 ========== */}
        {(viewState === 'ready' || viewState === 'sending') && (
          <div className="space-y-6">
            
            {/* 이메일 입력 + 다운로드 섹션 */}
            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <div className="text-white font-bold mb-2">📥 보고서 다운로드</div>
                  <p className="text-purple-300 text-sm mb-3">
                    이메일을 입력하고 버튼을 누르면 HTML 보고서가 다운로드됩니다.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                      placeholder="이메일 주소 입력"
                      className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white
                               placeholder:text-purple-400/50 focus:border-purple-500 focus:outline-none"
                    />
                    <button
                      onClick={sendEmail}
                      disabled={viewState === 'sending' || !email}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl
                               hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all whitespace-nowrap"
                    >
                      {viewState === 'sending' ? '처리 중...' : '📥 다운로드'}
                    </button>
                  </div>
                  {emailError && (
                    <p className="text-red-400 text-sm mt-2">{emailError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* HTML 미리보기 */}
            <div className="bg-black/40 rounded-2xl overflow-hidden border border-white/10">
              <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="text-white font-bold">👁️ 미리보기</div>
                <div className="text-purple-400 text-sm">
                  브라우저에서 직접 확인 가능한 HTML 보고서입니다
                </div>
              </div>
              
              {/* iframe 미리보기 */}
              <div className="relative" style={{ height: '70vh' }}>
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0"
                  title="인재 카드 미리보기"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========== 전송 완료 ========== */}
        {viewState === 'sent' && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">✅</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              보고서가 다운로드되었습니다!
            </h2>
            <p className="text-purple-300 mb-2">
              <strong className="text-purple-200">{email}</strong>로 요청 정보가 기록되었습니다.
            </p>
            <p className="text-purple-400 text-sm mb-8">
              다운로드된 HTML 파일을 브라우저에서 열어보세요.
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setViewState('ready')}
                className="px-6 py-3 bg-white/10 text-purple-200 rounded-xl hover:bg-white/20 transition-all"
              >
                📧 다른 이메일로 다시 받기
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl
                         hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                ← 결과로 돌아가기
              </button>
            </div>
          </div>
        )}

        {/* ========== 에러 ========== */}
        {viewState === 'error' && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">❌</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              오류가 발생했습니다
            </h2>
            <p className="text-red-400 mb-8">{error}</p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={generateReport}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl
                         hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                🔄 다시 시도
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-white/10 text-purple-200 rounded-xl hover:bg-white/20 transition-all"
              >
                ← 결과로 돌아가기
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ReportViewer;
