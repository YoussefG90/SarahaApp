import { EventEmitter } from 'events'
import { sendEmail } from '../email/send.email.js'
import { emailTemplate } from '../email/designs/email.template.js'
export const emailEvent = new EventEmitter()


emailEvent.on("Confirm Email" ,async  (data) => {
    await sendEmail({to:data.to , subject: data.subject || "Confirm Email" ,html: emailTemplate({otp:data.otp})}).catch(error=>{
        console.log(`Fail To Send OTP TO ${data.to}`);
        
    })
})
