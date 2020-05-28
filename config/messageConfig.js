const nodemailer = require('nodemailer');

async function sendMessage(sendInfo) {
  let transporter = nodemailer.createTransport({
    host: '60.205.113.159/firefly/checkPhone',
    prot: 587,
    secure: false,
    auth: {
      user: '188761973@qq.com',
      pass: 'yf920622yf',
    },
  });
  
  const info = await transporter.sendMail({
    from: '"认证邮箱" <188761973@qq.com>',
    to: sendInfo.email,
    subject: '修改密码的验证码，无需回复',
    html: `
      <p>您好，${sendInfo.email}，您的验证码是 ${sendInfo.code}，有效时间 30 分钟。</p>
    `,
  });

  return 'Message sent: %s', info.messageId
};


module.exports = sendEmail;