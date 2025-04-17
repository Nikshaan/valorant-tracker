import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home.tsx"
import ProgressGraph from "./pages/ProgressGraph.tsx"
import Profile from "./pages/Profile.tsx"
import MatchStats from "./pages/MatchStats.tsx"

function App() {

  return (
    <>
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
