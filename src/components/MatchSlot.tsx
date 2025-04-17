import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Match {
    date: string,
    rank: string,
    map: string,
    matchId: string,
    delta: number,
    curr_rr: number,
}

type ValorantPlayerData = {
    currenttier: number;
    currenttierpatched: string;
    date: string;
    date_raw: number;
    elo: number;
    tier: {
        name: string;
    };
    images: {
      large: string;
      small: string;
      triangle_down: string;
      triangle_up: string;
      [key: string]: unknown;
    };
    map: {
      id: string;
      name: string;
      [key: string]: unknown;
    };
    match_id: string;
    mmr_change_to_last_game: number;
    ranking_in_tier: number;
    season_id: string;
    [key: string]: unknown;
  }

interface MatchCardProps {
    matchData: ValorantPlayerData;
  }

const MatchSlot: React.FC<MatchCardProps> = ({ matchData }) => {
    const [mapImg, setMapImg] = useState<string | null>(null);
    const [ deltaColor, setDeltaColor ] = useState<string>("None");

    const match: Match = {
        date: matchData.date,
        rank: matchData.images.small,
        map: matchData.map.name,
        matchId: matchData.match_id,
        delta: matchData.mmr_change_to_last_game,
        curr_rr: matchData.ranking_in_tier,
    };

    async function fetchMap(): Promise<void>{
        try{
            const res = await axios.get(`https://valorant-api.com/v1/maps/${matchData.map.id}`);
            setMapImg(res.data.data.listViewIcon);
        }
        catch(err){
            console.log("Error : " + err)
        }
    };

    useEffect(() => {
            fetchMap();
        }, []);

    if(matchData != null && deltaColor == "None"){
        if(match.delta > 0){
            setDeltaColor("bg-green-700");
        } else if (match.delta < 0){
            setDeltaColor("bg-red-700");
        } else {
            setDeltaColor("bg-gray-500")
        }
    }

    if (mapImg == null || deltaColor == "None"){
        return (<div className="text-white">Loading...</div>)
    }

  return (
    <div className={`bg-[#c4c8cc] w-[80%] h-fit m-auto mt-4 cursor-pointer border-4 pt-2 px-2 border-white border-b-black border-r-black`}>
        <Link to={`/valorant-tracker/match/${match.matchId}`}>
            <div className="w-full bg-[#02007D] h-8 text-white flex justify-between items-center px-2">
                <p>{match.date}</p>
                <p>{match.map}</p>
            </div>
            <div className="w-full bg-black h-40 my-2 relative">
                <img src={mapImg}  className="w-full h-full"/>
                <div className="absolute top-0 w-full h-full bg-black opacity-50" />
                <div className="absolute top-0 w-full h-full text-white">
                    <div className={`${deltaColor} m-0.5 absolute right-0 p-0.5 px-1 text-center border-2 border-b-black border-r-black border-t-white border-l-white`}>
                        <p className="">RR change : {match.delta}</p>
                    </div>
                    <img src={match.rank} className="h-8 m-1 left-0" />
                    <div className="w-full bottom-0 absolute bg-white h-5 border-t-black border-2 border-l-black border-b-white overflow-hidden border-r-white">
                        <div style={{ width: `${match.curr_rr}%` }} className={`flex ${deltaColor} h-4 justify-center items-center`}>
                            <p className="text-sm px-1">{match.curr_rr}</p>    
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default MatchSlot