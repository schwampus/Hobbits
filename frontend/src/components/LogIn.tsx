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
      const response = await axios.post('https://hobbits.onrender.com/login', {
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
  <div id="wrapper">
    <main>
    

  <form onSubmit={handleSubmit}>
    <div className="mb-2 flex flex-col">
      <button className=" mb-14 w-30 btn-secondary "><Link to="/" >GO BACK</Link>
</button>
      <label className="font-bold text-[var(--alt-leaves)] font-texturina">Username:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
        required />
    </div>

    <div className="mb-2">
      <label className="font-bold text-[var(--alt-leaves)] font-texturina">Password:</label>
      <input
        type="password"
        value={userpass}
        onChange={(e) => setUserpass(e.target.value)}
        className="input-field"
        required />
    </div>

    <button type="submit" className="font-texturina btn-primary mt-4 w-full font-bold
    ">LOG IN</button>
    </form>
    {message && <p className="mt-4" style={{color: message.includes ('successful') ? 'var(--alt-leaves)' : 'var(--alt-earth'}}> {message} </p> } 

    
  </main>
  </div>
  );

};
export default LogIn;