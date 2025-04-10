import axios from "axios";
import { useEffect, useState } from "react";

interface Match {
    date: string,
    rank: string,
    rank_img: string,
    map: string,
    matchId: string,
    delta: number,
}

type ValorantPlayerData = {
    currenttier: number;
    currenttierpatched: string;
    date: string;
    date_raw: number;
    elo: number;
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
    
    const match: Match = {
        date: matchData.date,
        rank: matchData.images.small,
        rank_img: matchData.images.small,
        map: matchData.map.name,
        matchId: matchData.match_id,
        delta: matchData.mmr_change_to_last_game
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

    if (mapImg == null){
        return (<div className="text-white">Loading...</div>)
    }

  return (
    <div className={`${match.delta > 0 ? "bg-green-900":`${match.delta < 0 ? "bg-red-900" : "bg-gray-400"}`} text-left bg-gray-500 text-white border-2 p-2 m-5 cursor-pointer`}>
    <p>Map : {match.map}</p>
    <p>Date : {match.date}</p>
    <p>Delta : {match.delta}</p>
    <img src={match.rank_img} className="h-8 m-2"/>
    <img src={mapImg} className="border-2 border-black w-full"/>
    </div>
  )
}

export default MatchSlot