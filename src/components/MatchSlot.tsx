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
            setDeltaColor("bg-green-900");
        } else if (match.delta < 0){
            setDeltaColor("bg-red-900");
        } else {
            setDeltaColor("bg-gray-500")
        }
    }

    if (mapImg == null || deltaColor == "None"){
        return (<div className="text-white">Loading...</div>)
    }

  return (
    <div className={`${deltaColor} text-left bg-gray-500 text-white border-2 p-2 m-5 cursor-pointer`}>
        <Link to={`/valorant-tracker/match/${match.matchId}`}>
            <p>Map : {match.map}</p>
            <p>Date : {match.date}</p>
            <p>Delta : {match.delta}</p>
            <img src={match.rank} className="h-5" />
            <img src={mapImg} className="border-2 border-black w-full"/>
            <p>Current RR: {match.curr_rr}</p>
            <div className="w-full bg-white h-2 my-2 border-2 border-black">
                <div style={{ width: `${match.curr_rr}%` }} className="bg-blue-600 h-2" />
            </div>
        </Link>
    </div>
  )
}

export default MatchSlot