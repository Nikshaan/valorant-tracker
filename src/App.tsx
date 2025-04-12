import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import MatchStats from "./pages/MatchStats"
import Navbar from "./components/Navbar"

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:userName/:userId" element={<Profile />} />
        <Route path="/match/:matchId" element={<MatchStats />} />
      </Routes>
    </>
  )
}

export default App
