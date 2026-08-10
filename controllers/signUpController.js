import signUpModel from '../models/signUpModel.js'
import bcrypt from 'bcryptjs'
async function signup(req,res) {
    try{
        const {password}=req.body
        
        const hashedpassword=await bcrypt.hash(password,10)
        const userInfo=await signUpModel.create({...req.body,password:hashedpassword})
    res.status(201).json(userInfo)}
    catch(err){
        res.status(404).json({message:'something went wrong'})
    }
}
export default signup