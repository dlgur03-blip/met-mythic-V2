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

    // Google Apps Script로 전송 (Sheets 기록 + 이메일 발송)
    if (GOOGLE_SCRIPT_URL) {
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            htmlContent,  // HTML 내용도 함께 전송
            archetypeName,
            figureName,
            nickname,
          }),
        });
        
        const result = await response.json();
        
        if (!result.success) {
          console.error('Google Script Error:', result.error);
          return NextResponse.json({
            success: false,
            error: '이메일 발송에 실패했습니다.',
          }, { status: 500 });
        }
      } catch (sheetError) {
        console.error('Google Script 호출 실패:', sheetError);
        return NextResponse.json({
          success: false,
          error: '서버 연결에 실패했습니다.',
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({
        success: false,
        error: '이메일 서비스가 설정되지 않았습니다.',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '이메일이 발송되었습니다.',
    });

  } catch (error) {
    console.error('Send Report Error:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}