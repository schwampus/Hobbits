 import {useState} from "react";
 import axios from 'axios';
 import { Link, useNavigate } from 'react-router-dom';

 const SignUp = () => {
    const [username, setUsername] = useState(''); 
    const [userpass, setUserpass] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://hobbits.onrender.com/signup', {
        username,
        userpass,
      });
    setMessage(response.data.message);
    if (response.data.success) {
     
      navigate('/login')
    }
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || 'Signup failed. Please try again.');
      } else {
      setMessage('Signup failed without errormessage. Please try again.');
        }
      }
    };

    return(
       <div id="wrapper">
       <main>
   



  <form onSubmit={handleSignUpSubmit}>
    <div className="mb-2 flex flex-col">
       <button className=" mb-14 w-30 btn-secondary mr-10"><Link to="/" >GO BACK</Link></button>
      <label className="font-bold text-[var(--alt-leaves)] font-texturina">Choose your Username:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
        required />
    </div>

    <div className="mb-2">
      <label className="font-bold text-[var(--alt-leaves)] font-texturina">Set your Password:</label>
      <input
        type="password"
        value={userpass}
        onChange={(e) => setUserpass(e.target.value)}
        className="input-field"
        required />
    </div>

    <button type="submit" className="font-texturina btn-primary mt-4 w-full font-bold 
    ">CREATE YOUR HOBBIT!</button>
    </form>
    {message && <p className="mt-4" style={{color: message.includes ('successful') ? 'var(--alt-leaves)' : 'var(--alt-earth'}}> {message} </p> } 

    </main>
  </div>
    )
 }

 export default SignUp; 