import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import logo from "../assets/logo-valo.png";
import yoru from "../assets/yoru.jpg";

const apiKey = import.meta.env.VITE_API_KEY;

const Home : React.FC = () => {

    const [userInput, setUserInput] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const userData = userInput.trim();
        const user = userData.split('#');
       
        try{
            const res = await axios.get(`https://api.henrikdev.xyz/valorant/v2/account/${user[0]}/${user[1]}?api_key=${apiKey}`);
            if (res.data.status === 200){
                navigate(`/profile/${user[0]}/${user[1]}`);
            }
        }
        catch(err){
            setError("Player not Found! TwT");
            console.log("Error : " + err)
        }

    };

  return (
    <div className="text-white h-[100svh] bg-[#C3C7CB] relative flex flex-col items-center pb-16">
      <Navbar />
      <div className="m-auto relative overflow-hidden border-4 border-t-[#848584] border-l-[#848584] border-b-white border-r-white bg-cover bg-center flex flex-col justify-center items-center gap-5 bg-no-repeat w-[80%] h-[50%]">
        <img src={yoru} />
        <div className="flex absolute flex-col bg-[#C3C7CB] p-10 px-20 justify-center items-center gap-5 border-4 border-b-black border-r-black border-t-white border-l-white">
          <img src={logo} className="h-20"/>
          <div className="bg-[#C3C7CB] text-black border-4 border-t-[#848584] border-l-[#848584] border-b-white border-r-white flex flex-col">
            <form onSubmit={handleSubmit}>
                <input type="text"  value={userInput} onChange={(e) => {setUserInput(e.target.value)}} className="py-1 px-2 placeholder-black border-2 w-fit" placeholder="Enter player name#tag : "/>
                <button type="submit" className="bg-[#C3C7CB] px-4 py-1 border-2 border-b-black border-r-black border-t-white border-l-white text-black cursor-pointer">Search</button>
            </form>
            <p className={`text-center text-red-800 ${error?"flex justify-center items-center":"hidden"}`}>{error}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home