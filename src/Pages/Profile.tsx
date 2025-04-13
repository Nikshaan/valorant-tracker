import { useParams } from "react-router-dom"
import axios from "axios";
import { useEffect, useState } from "react";
import MatchSlot from "../components/MatchSlot";
const apiKey = import.meta.env.VITE_API_KEY;

interface User {
    name: string | undefined,
    tag: string | undefined,
    level: number,
    card: string | undefined,
    title: string,
    curr_rank: string,
    peak_rank: string,
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
    last_change: number;
    ranking_in_tier: number;
    season_id: string;
    [key: string]: unknown;
  }

const Profile: React.FC = () => {
    const { userName, userId } = useParams<Record<string, string | undefined>>();
    const [ userData, setUserData ] = useState<User | null>(null);
    const [ matchData, setMatchData ] = useState<ValorantPlayerData[] | null>(null);
    const [ netCalc, setNetCalc ] = useState<number | string>("NET");
    const [ netColor, setNetColor ] = useState<string>("bg-gray-600");
    let netRR = 0; 

    async function fetchData(): Promise<void>{
        try{
            const res1 = await axios.get(`https://api.henrikdev.xyz/valorant/v2/account/${userName}/${userId}?api_key=${apiKey}`);
            const res2 = await axios.get(`https://api.henrikdev.xyz/valorant/v3/mmr/ap/pc/${userName}/${userId}?api_key=${apiKey}`);
            const card = await axios.get(`https://media.valorant-api.com/playercards/${res1.data.data.card}/wideart.png`);
            const title = await axios.get(`https://valorant-api.com/v1/playertitles/${res1.data.data.title}`);
            const matches = await axios.get(`https://api.henrikdev.xyz/valorant/v2/mmr-history/ap/pc/tabaahi/tabah?api_key=${apiKey}`);
            
            setUserData({
                name: userName,
                tag: userId,
                level: res1.data.data.account_level,
                card : card.config.url,
                title: title.data.data.titleText,
                curr_rank: res2.data.data.current.tier.name,
                peak_rank: res2.data.data.peak.tier.name,
            });
            setMatchData(matches?.data?.data?.history);
        }
        catch(err){
            console.log("Error : " + err);
        }
    };

    if(matchData != null && netCalc == "NET"){
        for(let i = 0; i < 5 ; i++){
            netRR = netRR + matchData[i].last_change;
        }

        if(netRR > 0){
            setNetColor("bg-green-900");
        } else if (netRR < 0){
            setNetColor("bg-red-900");
        }
        setNetCalc(netRR);
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (userData == null || matchData == null || netCalc == "NET"){
        return (<div className="text-white">Loading...</div>)
    }
    
    return (
    <div className="p-5">
        <img src={userData.card} className="w-full"/>
        <div className="text-white m-2 font-semibold">
            <p>{userData.name}#{userData.tag}</p>
            <p>level : {userData.level}</p>
            <p>title : {userData.title}</p>
            <p>current rank : {userData.curr_rank}</p>
            <p>peak rank : {userData.peak_rank}</p>
        </div>
        <div className={`${netColor} border-2 border-white p-2 text-white rounded-xl font-bold`}>
            <p>Net RR since past 5 matches : {netCalc}</p>
        </div>
        <div className="w-full h-1 bg-white my-5" />  
        {
            matchData.map((match) => (
                <MatchSlot key={match.match_id} matchData = {match}/>
            ))
        }
    </div>
  )
}

export default Profile