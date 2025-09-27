import { NextRequest, NextResponse } from 'next/server';
import { tokenStore } from '../../shared/token-store';
// Using Replit Mail integration for sending password reset emails
import { sendEmail } from '../../../../src/utils/replitmail';

// Function to send password reset email using Replit Mail service
async function sendPasswordResetEmail(email: string, resetToken: string) {
  console.log(`📧 Sending password reset email to: ${email}`);
  
  const resetUrl = `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
  
  const emailSubject = 'Đặt lại mật khẩu - Trung tâm tiếng Nhật';
  
  // Create email content in both text and HTML formats
  const textContent = `
Xin chào,

Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản tại Trung tâm tiếng Nhật.

Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn:
${resetUrl}

Liên kết này sẽ hết hạn sau 1 giờ vì lý do bảo mật.

Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.

Trân trọng,
Đội ngũ Trung tâm tiếng Nhật
`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Đặt lại mật khẩu</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🔒 Đặt lại mật khẩu</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Trung tâm tiếng Nhật</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Xin chào,</p>
        
        <p style="margin-bottom: 20px;">
            Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản tại <strong>Trung tâm tiếng Nhật</strong>.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                🔑 Đặt lại mật khẩu
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
            Hoặc sao chép và dán liên kết sau vào trình duyệt:
        </p>
        
        <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace; word-break: break-all; font-size: 12px; color: #555;">
            ${resetUrl}
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #888; font-size: 14px; margin-bottom: 10px;">
                ⏰ <strong>Lưu ý quan trọng:</strong> Liên kết này sẽ hết hạn sau <strong>1 giờ</strong> vì lý do bảo mật.
            </p>
            
            <p style="color: #888; font-size: 14px;">
                🚨 Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #888; font-size: 14px; margin: 0;">
                Trân trọng,<br>
                <strong>Đội ngũ Trung tâm tiếng Nhật</strong>
            </p>
        </div>
    </div>
</body>
</html>
`;

  try {
    const result = await sendEmail({
      to: email,
      subject: emailSubject,
      text: textContent,
      html: htmlContent,
    });
    
    console.log(`✅ Email sent successfully to: ${result.accepted.join(', ')}`);
    
    if (result.rejected && result.rejected.length > 0) {
      console.warn(`⚠️ Some emails were rejected: ${result.rejected.join(', ')}`);
    }
    
    return result.accepted.length > 0;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error('Không thể gửi email đặt lại mật khẩu');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email là bắt buộc' },
        { status: 400 }
      );
    }

    // Generate and store reset token
    const resetToken = tokenStore.generateToken();
    tokenStore.storeToken(email, resetToken, 60 * 60 * 1000); // 1 hour expiry

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({
      message: 'Nếu email này tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu.',
      success: true
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi gửi email đặt lại mật khẩu' },
      { status: 500 }
    );
  }
}