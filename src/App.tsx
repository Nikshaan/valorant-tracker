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
        <Route path="/" element={<Home />} />
        <Route path="/progressGraph" element={<ProgressGraph />} />
        <Route path="/profile/:userName/:userId" element={<Profile />} />
        <Route path="/match/:matchId" element={<MatchStats />} />
      </Routes>
    </>
  )
}

export default App
