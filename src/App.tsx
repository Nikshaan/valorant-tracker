import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Profile from "./Pages/Profile"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:userName/:userId" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
