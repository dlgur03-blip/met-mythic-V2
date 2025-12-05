import { NextRequest, NextResponse } from 'next/server';

// Google Apps Script 웹 앱 URL (환경변수로 관리)
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

export async function POST(request: NextRequest) {
  try {
    const { email, htmlContent, archetypeName, figureName, nickname } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: '이메일이 필요합니다.' },
        { status: 400 }
      );
    }

    // Google Sheets에 기록 (URL이 설정된 경우에만)
    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            archetypeName,
            figureName,
            nickname,
          }),
        });
      } catch (sheetError) {
        console.error('Google Sheets 기록 실패:', sheetError);
        // 시트 기록 실패해도 계속 진행 (치명적 에러 아님)
      }
    }

    // 관리자에게 알림 (선택사항 - 이메일 설정된 경우)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'MET Mythic <onboarding@resend.dev>',
            to: ['k.nig.information72@gmail.com'], // 관리자에게만 알림
            subject: `📊 새 보고서 요청 - ${archetypeName}: ${figureName}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h2>새로운 보고서 요청이 있습니다</h2>
                <p><strong>이메일:</strong> ${email}</p>
                <p><strong>원형:</strong> ${archetypeName}</p>
                <p><strong>인물:</strong> ${figureName}</p>
                <p><strong>닉네임:</strong> ${nickname || '없음'}</p>
                <p><strong>시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
              </div>
            `,
          }),
        });
      } catch (emailError) {
        console.error('관리자 알림 이메일 실패:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: '보고서 요청이 접수되었습니다.',
    });

  } catch (error) {
    console.error('Send Report Error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}