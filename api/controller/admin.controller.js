import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const login = async (req, res) => {
    const { email, password } = req.body;
  
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return res.status(200).json({ success: true, message: 'Admin logged in successfully' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  };
  

export const getUsers = async(req,res)=>{
  try{
    const users = await User.find()
    console.log('users ==>> : ',users)
    res.json({userData:users})
  }catch(err){
    console.log(err)
    res.status(500).json({message: 'Error fetching users'})
  }
}

export const createUsers = async (req, res, next) => { 
  try {
    const { username, email, password, profilePicture } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword,profilePicture});
    await newUser.save();
    res.status(201).json({ success: true, message: "User created successfully!" });
  } catch (error) {
    next(error); 
  }
};


export const updateuser = async(req,res)=>{
  try{
    const userId = req.params.id
    const {username,email,password,profilePicture} = req.body
    const hashedPassword = bcryptjs.hashSync(password,10)
    const existingUser = await User.findOne({email,_id:{$ne: userId}})
    if(existingUser){
      return res.json({already : 'Email already exists'})
    }
    const user = await User.findById(userId)
    if(!user){
      return res.json({already : 'User not found'})
    }

    user.username = username
    user.email = email
    user.password = hashedPassword  
    user.profilePicture = profilePicture
    await user.save()

    res.status(200).json({message: 'User updated successfully',user})
  }catch(err){
    console.log(err)
    res.status(500).json({message : 'Server error'})
  }
}


export const deleteUser = async(req,res)=>{
  try{
    const userId = req.params.id
    const deletedUser = await User.findByIdAndDelete(userId)
    if(!deletedUser){
      return res.status(404).json({message: 'User not found'})
    }
    res.json({message:'User deleted successfully'})
  }catch(err){
    console.log(err)
    res.status(500).json({message: 'Error deleting user'})
  }
}
