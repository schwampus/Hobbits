 import {useState} from "react";
 import axios from 'axios';
 import { Link, useNavigate } from 'react-router-dom';

 const LogIn = () => {
    const [username, setUsername] = useState(''); 
    const [userpass, setUserpass] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        userpass,
      });
    setMessage(response.data.message);
    if (response.data.success) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/dashboard')
    }
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Login failed. Please try again.');
      } else {
      setMessage('Login failed. Please try again.');
        }
      }
    };

  return (
  <div className=" h-[420px] w-[400px]  flex flex-col items-center bg-(--brand-dark)  rounded-3xl shadow-lg p-8">
    <button className="self-start ml-8 mb-14 btn-secondary mr-10"><Link to="/" >Go Back</Link>
</button>

  <form onSubmit={handleSubmit}>
    <div className="mb-2">
      <label className="font-bold">Username:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border-2 p-1 w-full mt-2 mb-2 rounded-md"
        required />
    </div>

    <div className="mb-2">
      <label className="font-bold">Password:</label>
      <input
        type="password"
        value={userpass}
        onChange={(e) => setUserpass(e.target.value)}
        className="border-2 p-1 w-full mt-2 mb-2 rounded-md"
        required />
    </div>

    <button type="submit" className="font-texturina btn-primary mt-4 w-full font-black text-cyan-50
    ">Log In</button>
    </form>
    {message && <p className="mt-4" style={{color: message.includes ('successful') ? 'var(--alt-leaves)' : 'var(--alt-earth'}}> {message} </p> } 

    
  </div>
  );

};
export default LogIn;