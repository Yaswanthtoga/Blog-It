import {db} from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req,res)=>{
    const q = req.query.cat? "SELECT * FROM posts WHERE cat=?" : "SELECT * FROM posts";
    db.query(q,[req.query.cat],(err,data)=>{
        if(err)return res.status(500).send(err);

        return res.status(200).json(data);
    })
};


export const getPost = (req,res)=>{
    const q = "SELECT p.id,`username`,`title`,`desc`,p.image as `pimg`,u.image as `uimg`,`cat`,`date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id=?";

    db.query(q,[req.params.id],(err,data)=>{
        if(err)return res.status(500).json(err);

        return res.status(200).json(data[0]);
    })
};


export const addPost = (req,res)=>{
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("Not Authenticated");

    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,userInfo)=>{
        if(err)return res.status(403).json("Token is not valid");

        const q = "INSERT INTO posts(`title`,`desc`,`image`,`date`,`cat`,`uid`) VALUES(?) ";
        const values =[
            req.body.title,
            req.body.desc,
            req.body.image,
            req.body.date,
            req.body.cat,
            userInfo.id
        ]

        db.query(q,[values],(err,data)=>{
            if(err)return res.status(500).json(err);
            return res.status(200).json("Post has been Created");
        })
    })

};


export const deletePost = (req,res)=>{
    const token = req.cookies.access_token;
    if(!token) return res.status(401).json("Not Authenticated");

    // Check for Existed token is authorized or not
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,userInfo)=>{
        if(err)return res.status(403).json("Token is not valid");

        const postId = req.params.id;
        const q = "DELETE FROM posts WHERE `id`=? AND `uid`=?";

        db.query(q,[postId,userInfo.id],(err,data)=>{
            if(err)return res.status(403).json("You can delete only your posts");
            return res.status(200).json("Post has been deleted");
        })
    })

};
export const updatePost = (req,res)=>{
    
    const token = req.cookies.access_token;
    if(!token)return res.status(401).json("Not Authenticated");

    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,userInfo)=>{
        if(err)return res.status(403).json("Token is not valid");

        const postId = req.params.id;
        const q = "UPDATE posts SET `title`=?,`desc`=?,`image`=?,`cat`=? WHERE `id`=? AND `uid`=?";
        db.query(q,[req.body.title,req.body.desc,req.body.image,req.body.cat,postId,userInfo.id],(err,data)=>{
            if(err)return res.status(403).json("You can update only your posts");

            return res.status(200).json("Updated Successfully");
        });

    })
};