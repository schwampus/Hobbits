import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  interface Hobby {
    hobby_id: number;
    hobby: string;
    times_done: number;
  }

  const [username, setUsername] = useState('Guest');
  const [bits, setBits] = useState(0);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [newHobby, setNewHobby] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('https://hobbits.onrender.com/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setUsername(response.data.username);
          setBits(response.data.bits);
          setHobbies(response.data.hobbies || []);
        } else {
          setError(response.data.message);
          navigate('/login');
        }
      } catch (error:unknown) {
        setError('Failed to fetch user data');
        console.error(error);
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleAddHobby = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newHobby.trim()) {
      setError('Hobby cannot be empty');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/hobbies`,
        { hobby: newHobby },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setHobbies([...hobbies, { hobby_id: response.data.hobby_id, hobby: newHobby, times_done: 0 }]);
        setNewHobby('');
        setError('');
      } else {
        setError(response.data.message);
      }
    } catch (error:unknown) {
      setError('Failed to add hobby');
      console.error(error);
    }
  };

  const handleIncrementHobby = async (hobby_id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/hobbies/${hobby_id}/increment`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setHobbies(
          hobbies.map((hobby) =>
            hobby.hobby_id === hobby_id
              ? { ...hobby, times_done: response.data.times_done }
              : hobby
          )
        );
        setError('');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(`Failed to increment hobby count: ${error.response?.data?.message || error.message}`);
      } else {
        setError('Failed to increment hobby count: Unknown error');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div id="wrapper2">
      <div id="main2" className="flex flex-col items-center p-8">
        <h1 className="mb-2 text-6xl font-new-rocker text-(--alt-reed) [text-shadow:2px_2px_3px_black]">
          DASHBOARD
        </h1>
        <p className="mb-4 font-texturina">
          Welcome to the party{' '}
          <span className="text-(--brand-primary) text-2xl">{username}!</span>
        </p>

     
        <div className="flex flex-wrap md:flex-nowrap md:flex-1 flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 items-center justify-center"> 

          <div className="order-1 md:order-1  w-40 sm:w-xs  p-4 flex justify-center items-center">
              <img src="/hobbit.png" alt="Hobbit" className="h-32 sm:h-40 md:h-98 object-contain" /> </div>
          
          <div className="order-3 md:order-2 flex-1  p-4">
           
            {hobbies.length > 0 ? (
                <div className="mt-4 w-full ">
                  <h1 className="font-bold font-texturina text-(--brand-secondary) text-xs sm:text-3xl text-center ">YOUR TRACKED HOBBITS:</h1>
                  <hr className="border-t-2 border-(--alt-bone) w-full mt-2 mb-6" />
                  <ul className="space-y-4">
                    {hobbies.map((hobby) => (
                      <li key={hobby.hobby_id} className="flex justify-between items-center">
                        <span className="font-texturina font-bold text-2xl text-(--brand-primary)">
                          {hobby.hobby}</span><span className="font-texturina font-bold text-md sm:text-sm text-(--alt-bone)">({hobby.times_done} tracked efforts!)
                        </span>
                        <button
                          onClick={() => handleIncrementHobby(hobby.hobby_id)}
                          className="btn-secondary ml-2 text-sm px-2 py-1"
                        >
                          +
                        </button>
                      </li>
                    ))}
                  </ul>
                  <hr className="border-t-2 border-(--alt-bone) w-full mt-6 mb-6" />
                </div>
              ) : (
                <p className="mt-4">No hobbies added yet.</p>
              )}
           
            <form onSubmit={handleAddHobby} className="mt-4 w-full sm:max-w-md mx-auto">
              <div className="mb-2 mt-4">
                <label className="font-bold font-texturina text-md">Add another Hobby:</label>
                <input
                  type="text"
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  className="input-field"
                  placeholder="enter here"
                />
              </div>
              <button
                type="submit"
                className="font-texturina btn-primary w-full font-black text-cyan-50 py-2"
              >
                ADD NEW HOBBY!
              </button>
            </form>

             

              {error && (
                <p className="mt-4" style={{ color: 'var(--alt-earth)' }}>
                  {error}
                </p>
              )}
            </div>

            <div className="order-2 md:order-3  w-40 sm:w-xs p-4 text-center">
              <h4 className="text-center font-new-rocker text-(--alt-reed)  [text-shadow:2px_2px_3px_black] text-lg sm:text-lg md:text-2xl mt-2 md:mt-10">EARNED BITS:</h4>
              <h1 className="text-6xl sm:text-7xl md:text-9xl text-center mt-2 font-new-rocker [text-shadow:2px_2px_3px_black]">
              {bits}</h1>
            </div>
              
       
        </div>
         <button
          onClick={handleLogout}
          className="self-center  mt-4 btn-secondary"
        >
          Log Out
        </button>
        </div>

       
      </div>
    
  );
};

export default Dashboard;