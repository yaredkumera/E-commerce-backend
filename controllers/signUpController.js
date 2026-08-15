import signUpModel from '../models/signUpModel.js';
import bcrypt from 'bcryptjs';

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

    res.status(201).json({
      _id: userInfo._id,
      fullName: userInfo.fullName,
      email: userInfo.email,
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong on the server' });
  }
}

export default signup;