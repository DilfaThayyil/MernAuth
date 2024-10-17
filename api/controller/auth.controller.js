import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';




const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signup = async (req, res, next) => { 
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false,
      message: "All fields are required", 
      errors: {
        username: !username ? 'Username is required' : undefined,
        email: !email ? 'Email is required' : undefined,
        password: !password ? 'Password is required' : undefined
      }
    });
  }
  if (!passwordValidationRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Password does not meet requirements",
      errors: {
        password: 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      }
    });
  }
  if (!emailValidationRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
      errors: {
        email: 'Please provide a valid email address.'
      }
    });
  }
  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ success: true, message: "User created successfully!" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists", 
        errors: {
          email: 'Email is already in use'
        }
      });
    }
    next(error); 
  }
};




export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
      return res.status(400).json({
          success: false,
          message: "Email and password are required",
          errors: {
              email: !email ? 'Email is required' : undefined,
              password: !password ? 'Password is required' : undefined
          }
      });
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
      return res.status(400).json({
          success: false,
          message: "Invalid email format",
          errors: { email: 'Email is not valid' }
      });
  }
  try {
      const validUser = await User.findOne({ email });
      if (!validUser) return next(errorHandler(404, 'User not found'));
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return next(errorHandler(401, 'Wrong credentials'));
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = validUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
          .status(200)
          .json({ success: true, message: "Sign in successful!", ...rest });
  } catch (error) {
      next(error);
  }
};

  

export const google = async(req,res,next) => {
  try{
    const user = await User.findOne({email:req.body.email})
    if(user){
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
      const {password: hashedPassword,...rest} = user._doc
      const expiryDate = new Date(Date.now()+3600000)//1hour
      res.cookie('access_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest)
    }else{
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
      const hashedPassword = bcryptjs.hashSync(generatedPassword,10)
      const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8),email:req.body.email,password:hashedPassword,profilePicture:req.body.photo})
      await newUser.save()
      const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
      const {password: hashedPassword2,...rest} = newUser._doc
      const expiryDate = new Date(Date.now()+3600000)//1hour
      res.cookie('access_token',{token,httpOnly:true,expires:expiryDate}).status(200).json(rest)
    }
  }catch(error){
    next(error)
  }
}


export const signout = (req,res)=>{
  res.clearCookie('access_token').status(200).json('Signout success')
}