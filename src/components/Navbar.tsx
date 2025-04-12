import React from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <div className="bg-red-900 border-2 w-full flex justify-center items-center gap-5 h-10 sticky top-0 left-0 right-0 text-white">
        <Link to="/">
            <p>HOME</p>
        </Link>
        <p>GANG</p>
    </div>
  )
}

export default Navbar