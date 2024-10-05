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
    console.log(users)
    console.log('jhksjhfs')
    res.json({userData:users})
  }catch(err){
    console.log(err)
  }
}


export const deleteUser = async(req,res)=>{
  try{

  }catch(err){
    console.log(err)
  }
}
