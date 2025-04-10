import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

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
            const res = await axios.get(`https://api.henrikdev.xyz/valorant/v2/account/${user[0]}/${user[1]}`);
            if (res.data.status === 200){
                navigate(`profile/${user[0]}/${user[1]}`);
            }
        }
        catch(err){
            setError("Player not Found! TwT");
            console.log("Error : " + err)
        }

    };

  return (
    <div className="text-white h-[100svh] bg-gray-700 relative flex flex-col items-center">
      <div className="bg-red-900 border-2 w-full flex justify-center items-center gap-5 h-16 sticky top-0 left-0 right-0">
        <p>HOME</p>
        <p>GANG</p>
      </div>

      <div className="m-auto bg-gray-400 px-2 border-2">
        <form onSubmit={handleSubmit}>
            <input type="text"  value={userInput} onChange={(e) => {setUserInput(e.target.value)}} className="py-1 px-4 border-2 border-black bg-gray-500" placeholder="Enter player name#id : "/>
            <button type="submit" className="m-2 cursor-pointer border-2 border-black py-1 px-4 bg-gray-500">Search</button>
        </form>
        <p>{error}</p>
      </div>
    </div>
  )
}

export default Home