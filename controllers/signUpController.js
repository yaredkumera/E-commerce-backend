 import signUpModel from '../models/signUpModel.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
async function signup(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await signUpModel.findOne({ email });
    if (existingUser) { 
      return res.status(400).json({  message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userInfo = await signUpModel.create({    
      fullName,
      email,
      password: hashedPassword,
    });
const token=jwt.sign(
  {_id:userInfo._id,
    fullName,
    email,
  },process.env.JWT_SECRET,
  {expiresIn:"7d"}
)
    res.status(201).json({
  success: true,
  message: "Login successful",
  data: {
    token,
    user: userInfo.fullName,
    role: userInfo.role,
  },
});
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong on the server' });
  }
}

export default signup;