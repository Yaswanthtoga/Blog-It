import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req,res)=>{

    // Check the existing user
    const q = "SELECT * FROM users WHERE email = ? OR username = ?";
    db.query(q,[req.body.email,req.body.username],(err,data)=>{
        if(err)return res.json(err);
        if(data.length) return res.status(409).json("User already exist");

        // Hash the Password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
        const values = [req.body.username,req.body.email,hashedPassword]
        db.query(q,[values],(err,data)=>{
            if(err)return res.json(err);
            return res.status(200).json("User Added Succesully");
        })
    })

};
export const login = (req,res)=>{
    // Check the user existence
    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q,[req.body.username],(err,data)=>{
        if(err)return res.json(err);
        if(data.length === 0) return res.status(404).json("User Not Existed!! Please Register First");
        
        // Validation
        const isPass = bcrypt.compareSync(req.body.password,data[0].password);

        if(!isPass) return res.status(400).json("Wrong Username or Password");

       
        const token = jwt.sign({id:data[0].id},process.env.JWT_SECRET_KEY);

        const { password,...other } = data[0];
        res.cookie(
            "access_token",token,{
                httpOnly:true
            }
        ).status(200).json(other);
    })
};
export const logout = (req,res)=>{
    res.clearCookie("access_token",{
        sameSite:"none",
        secure:true
    }).status(200).json("User has been Logged Out");
};