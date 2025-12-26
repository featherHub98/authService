
const bcrypt = require('bcrypt');

async function hashPassword(plainPassword) {
  const saltRounds = 10; 

  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword; 
  } catch (err) {
    console.error(err);
    throw new Error('Error hashing password');
  }
}


const comparePassword=async(pwd,hashedPwd)=>{
    return await bcrypt.compare(pwd,hashedPwd);
}

module.exports={hashPassword,comparePassword};