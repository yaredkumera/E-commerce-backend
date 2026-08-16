import { Resend } from 'resend'
import crypto from "crypto"
import SignupModel from '../models/signUpModel.js'
import bcrypt from "bcryptjs"

const resend = new Resend(process.env.RESEND_API_KEY)

async function ForgotPass(req, res) {
  try {
    const { email } = req.body
    const user = await SignupModel.findOne({ email })

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      })
    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000
    await user.save()

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    // Resend sends via HTTP API, bypassing all Render SMTP port blocks
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Default testing domain provided by Resend
      to: user.email,
      subject: 'Password Reset - Exclusive',
      html: `<p>Click below to reset your password. This link expires in 30 minutes.</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    })

    return res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    })
  } catch (err) {
    console.error("Resend API Error:", err)
    return res.status(500).json({ success: false, message: "something went wrong" })
  }
}

async function ResetPass(req, res) {
  try {
    const { password } = req.body
    const { resetPasswordToken } = req.params

    const user = await SignupModel.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired",
      })
    }

    user.password = await bcrypt.hash(password, 10)
    user.resetPasswordExpires = undefined
    user.resetPasswordToken = undefined
    await user.save()

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: "something went wrong" })
  }
}

export { ResetPass, ForgotPass }