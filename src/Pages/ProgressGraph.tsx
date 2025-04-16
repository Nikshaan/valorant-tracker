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
                borderColor: "rgb(75, 192, 192)",
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
        responsive: true,
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
        return <div>Loading...</div>
    }
    
  return (
    <div>
        <div className="m-auto bg-gray-400 px-2 border-2">
            <form onSubmit={handleSubmit}>
                <input type="text"  value={userInput} onChange={(e) => {setUserInput(e.target.value)}} className="py-1 px-4 border-2 border-black bg-gray-500" placeholder="Enter player name#id : "/>
                <button type="submit" className="m-2 cursor-pointer border-2 border-black py-1 px-4 bg-gray-500">Search</button>
            </form>
            <p>{error}</p>
      </div>
      <Line options={options} data={data} />
    </div>
  )
}

export default ProgressGraph