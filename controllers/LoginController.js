import SignupModel from '../models/signUpModel.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

async function LoginController(req, res) {
  try {
    const { password, email } = req.body
    const user = await SignupModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: "email doesn't exist" })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return res.status(404).json({ success: false, message: "wrong password" })
    }

    const token = jwt.sign(
      { id: user._id ,role:user.role},
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

return res.status(200).json({
  success: true,
  message: "Login successful",
  data: {
    token,
    user: user.fullName,
    role: user.role,
  },
});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export default LoginController