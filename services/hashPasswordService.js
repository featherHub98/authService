const bcrypt=require('bcrypt');

const hashPassword=(pwd)=>{
    
    return bcrypt.hash(pwd,10);
}

const comparePassword=async(pwd,hashedPwd)=>{
    return await bcrypt.compare(pwd,hashedPwd);
}

module.exports={hashPassword,comparePassword};