import React, { useContext, useEffect, useState } from 'react'
import Edit from "../img/edit.png"
import Delete from "../img/delete.png"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Menu from '../components/Menu'
import moment from "moment";
import {AuthContext} from "../context/authContext.js";
import axios from 'axios'



const Single = () => {
  const [post,setPost] = useState({});
  const location = useLocation();
  const postId = location.pathname.split('/')[2];
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchData = async ()=>{
      const res = await axios.get(`/posts/${postId}`);
      setPost(res.data);
    };
    fetchData();
  },[postId]);

  const handleDelete = async ()=>{
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='single'>
      <div className="content">
        <img src={post? require("../uploads/"+post.pimg):null} alt="" />
        <div className="user">
          {post.uimg&&<img src={post.uimg} alt="" />}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser.username===post?.username && 
            <div className="edit">
            <Link to={`/write/?edit=${postId}`} state={post}>
              <img src={Edit} alt="" />
            </Link>
            <img onClick={handleDelete} src={Delete} alt="" />
          </div>
          }
        </div>
        <h1>{post.title}</h1>
        {post.desc}
      </div>
      <Menu cat={post.cat}/>
    </div>
  )
}

export default Single