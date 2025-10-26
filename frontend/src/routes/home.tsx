import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div id="wrapper">
    <main>
      <p className="font-texturina m-2 text-(--brand-darkest) "> welcome to</p>
      <h1 className="mb-6 text-6xl  font-new-rocker text-(--brand-darkest) [text-shadow:1px_1px_2px_var(--alt-leaves)]
      ">HOBBITS</h1>
      <p className="mt-4 font-texturina text-center text-(--brand-darkest)">Don't forget about your <span className=" text-(--alt-leaves)">hobbies.</span></p><p className="font-texturina text-center text-(--brand-darkest)">Make them a part of your <span className=" text-(--alt-leaves)">habits</span></p><p className="font-texturina text-center text-(--brand-darkest)"> and have them simulated as a <span className=" text-(--alt-leaves)">hobbit.</span></p>
      <p className="mt-4 font-texturina text-center text-(--brand-darkest)">Get rewarded with 'bits' every time you put time and effort towards your hobbies.</p>


      <div className="mt-8 flex gap-4 min-w-120  p-4  items-center justify-center">
       <button className="btn-primary w-30 ml-0 mr-10"> <Link to="/login" >LOG IN</Link></button>
       <button className="btn-secondary w-30 ml-10 mr-0"> <Link to="/signup" >SIGN UP</Link>
       </button>
      </div>
    </main>
    </div>
  )
}




