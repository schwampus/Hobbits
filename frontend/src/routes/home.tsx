import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex flex-row justify-center min-h-screen min-w-screen items-center">
    <main className=" h-[420px] w-[400px]  flex flex-col items-center bg-(--brand-dark)  rounded-3xl shadow-lg p-8">
      <p className="font-texturina m-2 text-(--brand-darkest) "> welcome to</p>
      <h1 className="mb-6 text-6xl  font-new-rocker [text-shadow:4px_4px_10px_rgba(0,0,0,0.4)] text-(--brand-darkest) text-outline ">HOBBITS</h1>
      <p className="mt-4 font-texturina text-center text-(--brand-darkest)">Don't forget about your <span className=" text-(--alt-leaves)">hobbies</span>, make them in to <span className=" text-(--alt-leaves)">habits</span> and have them simulated as a <span className=" text-(--alt-leaves)">hobbit.</span></p>
      <p className="mt-4 font-texturina text-center text-(--brand-darkest)">Get rewarded with 'bits' every time you out time and effort towards one of your hobbies.</p>


      <div className="mt-6 flex gap-4 min-w-120  p-4  items-center justify-center">
       <button className="btn-primary ml-0 mr-10"> <Link to="/login" >Log In</Link></button>
       <button className="btn-secondary ml-10 mr-0"> <Link to="/signup" >Sign Up</Link>
       </button>
      </div>
    </main>
    </div>
  )
}




