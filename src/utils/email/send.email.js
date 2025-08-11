import nodemailer from "nodemailer"
import  * as dotenv from "dotenv"
import path from "path"
dotenv.config({path:path.join('./src/config/.env') , quiet:true});

export async function sendEmail ({
    from= process.env.EMAIL_USER,to ="",cc="",bcc="",text="",
    html=`
      <h3>Welcome!</h3>
      <p>Your confirmation code is:</p>
      <h2>${otp}</h2>
      <p>Code expires in 2 minutes.</p>
    `,
    subject="Confirm Your Account",attachment=[]
} = {}) {
    const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  }
})

 
  const info = await transporter.sendMail({
    from: `"Saraha" <${from}>`,
    to,cc,bcc,text,html,subject,attachment,subject,html
  })

  return info
}

