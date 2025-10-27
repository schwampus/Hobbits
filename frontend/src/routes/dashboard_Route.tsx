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

        <div className="flex w-full justify-around flex-row">
          <div className="flex w-2/6">
            <img src="/hobbit.png" alt="Hobbit" style={{ height: '200px' }} />
          </div>

          <div className="flex flex-col w-4/6">
            <form onSubmit={handleAddHobby} className="mt-4 w-full max-w-xs">
              <div className="mb-2">
                <label className="font-bold">Add Hobby:</label>
                <input
                  type="text"
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  className="border-2 p-1 w-full mt-2 mb-2 rounded-md"
                  placeholder="Enter a hobby"
                />
              </div>
              <button
                type="submit"
                className="font-texturina btn-primary w-full font-black text-cyan-50"
              >
                Add Hobby
              </button>
            </form>

            {hobbies.length > 0 ? (
              <div className="mt-4 w-full max-w-xs">
                <h2 className="font-bold">Your Hobbies:</h2>
                <ul className="list-disc pl-5">
                  {hobbies.map((hobby) => (
                    <li key={hobby.hobby_id} className="flex justify-between items-center">
                      <span>
                        {hobby.hobby} ({hobby.times_done} times this year)
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
              </div>
            ) : (
              <p className="mt-4">No hobbies added yet.</p>
            )}

            {error && (
              <p className="mt-4" style={{ color: 'var(--alt-earth)' }}>
                {error}
              </p>
            )}
          </div>

          <div className="m-4 flex flex-col w-2/6">
            <h4 className="mt-20 text-center font-new-rocker text-(--alt-reed) [text-shadow:2px_2px_3px_black]">
              YOUR AMOUNT OF BITS:
            </h4>
            <h1 className="text-9xl text-center mt-2 font-new-rocker [text-shadow:2px_2px_3px_black]">
              {bits}
            </h1>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="self-start ml-8 mt-4 btn-secondary"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;