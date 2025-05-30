import axios from "axios";
import { Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Legend,
    Title,
    Tooltip}
    from "chart.js";
import { FormEvent, useState } from "react";
import { Line } from "react-chartjs-2";
import Navbar from "../components/Navbar";
import logo from "../assets/logo-valo.png";
import { LazyLoadImage } from "react-lazy-load-image-component";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Legend,
    Title,
    Tooltip
);

interface Context {
    parsed: {
        x: number;
        y: number;
        [key: string]: number;
      }; 
};
const apiKey = import.meta.env.VITE_API_KEY;

const ProgressGraph = () => {
    const valorantRanks = [
        'Unranked','Iron 1', 'Iron 2', 'Iron 3',
        'Bronze 1', 'Bronze 2', 'Bronze 3',
        'Silver 1', 'Silver 2', 'Silver 3',
        'Gold 1', 'Gold 2', 'Gold 3',
        'Platinum 1', 'Platinum 2', 'Platinum 3',
        'Diamond 1', 'Diamond 2', 'Diamond 3',
        'Ascendant 1', 'Ascendant 2', 'Ascendant 3',
        'Immortal 1', 'Immortal 2', 'Immortal 3',
        'Radiant'
      ];

    const [Xlabels, setXlabels] = useState<string[]>([]);
    const [player, setPlayer] = useState<string[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        const userData = userInput.trim();
        const user = userData.split('#');
       
        try{
            const res = await axios.get(`https://api.henrikdev.xyz/valorant/v3/mmr/ap/pc/${user[0]}/${user[1]}?api_key=${apiKey}`);
            setXlabels([]);
            setPlayer([]);
            const seasons = res.data.data.seasonal;
            for(let i = 0; i < seasons.length; i++){
                setXlabels(Xlabels => [...Xlabels, seasons[i].season.short])
                setPlayer(player => [...player, seasons[i].end_tier.name]);
            }
        }
        catch(err){
            setError("Player not Found! TwT");
            console.log("Error : " + err)
        }

    };
    
    const playerProgressData =  {
        labels: Xlabels,
        datasets: [
            {
                label: "Player",
                data: player,
                borderColor: "#02007D",
            },
        ],
    };
    
    function rankToNumeric(rankName: string) {
        return valorantRanks.indexOf(rankName);
    }

    const parsedData = playerProgressData.datasets[0].data.map(rankToNumeric);

    const data = {
        labels: playerProgressData.labels,
        datasets: [{
          label: playerProgressData.datasets[0].label,
          data: parsedData,
          borderColor: playerProgressData.datasets[0].borderColor
        }]
      }

    const options: object = {
        type: 'line',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Valorant Rank Progression Over Time',
            font: {
              size: 18
            },
          },
          tooltip: {
            callbacks: {
              label: function(context: Context) {
                const rankIndex = context.parsed.y;
                
                return `${valorantRanks[rankIndex]}`;
              }
            }
          },
        },
        scales: {
          y: {
            min: 0,
            max: valorantRanks.length - 1,
            ticks: {
              callback: function(value: number) {
                return valorantRanks[value];
              },
              stepSize: 1
            },
            title: {
                display: true,
                text: 'Rank',
                font: {
                  weight: 'bold'
                }
              }
          },
          x: {
            title: {
              display: true,
              text: 'Episode',
              font: {
                weight: 'bold'
              }
            }
          }
        }
    }
    
    if(!data){
        return <div className="h-[100svh] w-full flex justify-center items-center">
        <div className="m-auto w-fit h-fit text-center flex flex-col justify-center items-center gap-2">
            <LazyLoadImage alt="loader" loading="lazy" src={logo} className="h-32"/>
            <p className="font-bold text-2xl font-silkscreen">Loading...</p>
        </div>
        </div>
    }
    
  return (
    <div className="h-[100svh] flex flex-col pb-16">
        <Navbar />
        <div className="m-auto mt-1 w-[98%] lg:w-[85%] h-[90svh] flex flex-col justify-center items-center">
          <div className="h-[70%] lg:h-[100%] lg:mt-10 w-full border-4 border-t-[#848584] border-l-[#848584] border-b-white border-r-white p-5">
            <Line options={options} data={data} />
          </div>
          <div className="w-fit mt-2 bg-[#C3C7CB] py-2 justify-center items-center border-4 border-b-black border-r-black border-t-white border-l-white">
            <div className="bg-[#C3C7CB] text-black border-4 border-t-[#848584] border-l-[#848584] border-b-white border-r-white">
              <form onSubmit={handleSubmit} className="flex font-raleway m-1 justify-center items-center">
                  <input type="text"  value={userInput} onChange={(e) => {setUserInput(e.target.value)}} className="py-1 px-2 placeholder-black border-2 border-black" placeholder="Enter player name#tag : "/>
                  <button type="submit" className="bg-[#C3C7CB] font-silkscreen px-3 py-1 border-2 border-b-black border-r-black border-t-white border-l-white text-black cursor-pointer">Search</button>
              </form>
              <p className={`text-center text-red-800 ${error?"flex justify-center items-center":"hidden"}`}>{error}</p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ProgressGraph