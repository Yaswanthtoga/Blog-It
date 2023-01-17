import axios from 'axios';
import React, { useEffect, useState } from 'react'
// import { posts } from '../data'

const Menu = ({cat}) => {
  const [posts,setPosts] = useState([]);
  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const res = await axios.get(`/posts/?cat=${cat}`);
        setPosts(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  },[cat])
  return (
    <div className='menu'>
        <h2>Posts you may like</h2>
        {posts.map((post)=>(
            <div className="post" key={post.id}>
                <img src={post.image} alt="" />
                <h2>{post.title}</h2>
                <button>Read More</button>
            </div>
        ))}
    </div>
  )
}

export default Menu