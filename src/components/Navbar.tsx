import React from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <div className="bg-[#02007D] border-2 z-50 border-[#C3C7CB] w-full flex justify-center items-center gap-5 h-14 sticky top-0 left-0 right-0 text-white">
        <Link to="/valorant-tracker/">
            <p className='bg-[#C3C7CB] px-4 py-1 border-2 border-b-black border-r-black border-t-white border-l-white text-black'>Home</p>
        </Link>
        <Link to="/valorant-tracker/progressGraph">
          <p className='bg-[#C3C7CB] px-4 py-1 border-2 border-b-black border-r-black border-t-white border-l-white text-black'>Progress-Graph</p>
        </Link>
    </div>
  )
}

export default Navbar