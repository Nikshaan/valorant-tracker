import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import MatchStats from "./pages/MatchStats"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:userName/:userId" element={<Profile />} />
        <Route path="/match/:matchId" element={<MatchStats />} />
      </Routes>
    </>
  )
}

export default App
