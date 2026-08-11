import User from "../models/signUpModel.js"

async function getAllUsers(req, res) {
  try {
    const users = await User.find().select('-password')
    res.status(200).json({ success: true, message: "Users fetched", data: users })
  } catch (err) {
    res.status(500).json({ success: false, message: "something went wrong" })
  }
}

async function updateUserRole(req, res) {
  try {
    const { role } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password')
    if (!user) return res.status(404).json({ success: false, message: "user not found" })
    res.status(200).json({ success: true, message: "Role updated", data: user })
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" })
  }
}

export { getAllUsers, updateUserRole }