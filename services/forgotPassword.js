import nodemailer from "nodemailer"
import crypto from "crypto"
import SignupModel from '../models/signUpModel.js'
import bcrypt from "bcryptjs"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_GMAIL,
    pass: process.env.APP_PASSWORD?.replace(/\s+/g, ""), 
  },
  pool: true, 
  maxConnections: 1,
  rateLimit: 5, 
});

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

    await new Promise((resolve, reject) => {
      transporter.sendMail({
        from: `"Exclusive Support" <${process.env.APP_GMAIL}>`,
        to: user.email,
        subject: 'Password Reset - Exclusive',
        html: `<p>Click below to reset your password. This link expires in 30 minutes.</p>
               <a href="${resetUrl}">${resetUrl}</a>`,
      }, (err, info) => {
        if (err) return reject(err);
        return resolve(info);
      });
    });

    return res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    })
  } catch (err) {
    console.error("Nodemailer Runtime Error:", err); 
    return res.status(500).json({ success: false, message: err.message || "something went wrong" })
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