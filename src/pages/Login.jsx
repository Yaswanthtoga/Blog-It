// eslint-disable-next-line
import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext';

const Login = () => {
  const [inputs,setInputs] = useState({
    username:"",
    password:""
  });
  const { login } = useContext(AuthContext);
  const [error,setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e)=>{
    setInputs((prev)=>({...prev,[e.target.name]:e.target.value}));
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      await login(inputs);
      setError(null);
      navigate("/");
      
    } catch (err) {
      setError(err.response.data);
    }
  }


  return (
    <div className='auth'>
      <h1>Login</h1>
      <form>
        <input type="text" name='username' placeholder='username' onChange={handleChange}/>
        <input type="password" name='password' placeholder='password' onChange={handleChange}/>
        <button onClick={handleSubmit}>Login</button>
        {error && <p>{error}</p>}
        <span>
          Don't have an account? <Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  )
}

export default Login