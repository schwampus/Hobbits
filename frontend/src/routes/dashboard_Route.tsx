
import {useNavigate} from 'react-router-dom';

const Dashboard = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
    <main className=" h-[640px] w-[860px]  flex flex-col items-center bg-(--brand-dark)  rounded-3xl shadow-lg p-8">
      <h1 className="text-4xl font-bold">THIS IS DASHBOARD</h1>
      <p className="mt-4">welcome to the party </p>

       <button onClick={handleLogout} className="self-start ml-8 mb-14 btn-secondary mr-10">LogOut</button>

     
    </main></div> 
  )
}

export default Dashboard;

