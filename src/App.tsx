import { Route, Routes } from "react-router-dom"
import Navbar from "../src/components/Navbar"
import Home from "../src/pages/Home"
import ProgressGraph from "../src/pages/ProgressGraph"
import Profile from "../src/pages/Profile"
import MatchStats from "../src/pages/MatchStats"

function App() {

  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/valorant-tracker/" element={<Home />} />
        <Route path="/valorant-tracker/progressGraph" element={<ProgressGraph />} />
        <Route path="/valorant-tracker/profile/:userName/:userId" element={<Profile />} />
        <Route path="/valorant-tracker/match/:matchId" element={<MatchStats />} />
      </Routes>
    </>
  )
}

export default App
