import { useParams } from "react-router-dom"
import axios from "axios";
import { useEffect, useState } from "react";
import MatchSlot from "../components/MatchSlot";
import Navbar from "../components/Navbar";
import logo from "../assets/logo-valo.png";
import { LazyLoadImage } from "react-lazy-load-image-component";
const apiKey = import.meta.env.VITE_API_KEY;

interface User {
    name: string | undefined,
    tag: string | undefined,
    level: number,
    card: string | undefined,
    title: string,
    curr_rank: string,
    peak_rank: string,
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
            const matches = await axios.get(`https://api.henrikdev.xyz/valorant/v1/mmr-history/ap/${userName}/${userId}?api_key=${apiKey}`);
            
            setUserData({
                name: userName,
                tag: userId,
                level: res1.data.data.account_level,
                card : card.config.url,
                title: title.data.data.titleText,
                curr_rank: res2.data.data.current.tier.name,
                peak_rank: res2.data.data.peak.tier.name,
                curr_rr: matches.data.data[0].ranking_in_tier,
            });
            setMatchData(matches?.data?.data);
        }
        catch(err){
            console.log("Error : " + err);
        }
    };

    if(matchData != null && netCalc == "NET"){
        for(let i = 0; i < 5 ; i++){
            netRR = netRR + matchData[i].mmr_change_to_last_game;
        }

        if(netRR > 0){
            setNetColor("bg-green-700");
        } else if (netRR < 0){
            setNetColor("bg-red-700");
        }
        setNetCalc(netRR);
    }

    useEffect(() => {
        fetchData();
    }, []);

    if (userData == null || matchData == null || netCalc == "NET"){
        return (<div className="h-[100svh] w-full flex justify-center items-center">
            <div className="m-auto w-fit h-fit text-center flex flex-col justify-center items-center gap-2">
                <LazyLoadImage alt="loader" loading="lazy" src={logo} className="h-32"/>
                <p className="font-bold text-2xl font-silkscreen">Loading...</p>
            </div>
            </div>)
    }
    
    return (
    <div className="min-h-[100svh] pb-12">
        <Navbar />
        <div className="w-[95%] sm:w-[80%] lg:w-[65%] xl:w-[55%] 2xl:w-[40%] font-raleway text-sm relative m-auto mt-8 border-4 border-t-[#848584] border-l-[#848584] border-b-white border-r-white">
            <LazyLoadImage alt="PlayerCard" loading="lazy" src={userData.card} className="w-full"/>
            <div className="absolute bg-black w-full h-full top-0 opacity-50" />
            <p className="absolute right-3 bottom-3 text-white text-2xl font-semibold">{userData.name}#{userData.tag}</p>
            <p className="text-nowrap absolute top-3 left-3 text-white font-medium">{userData.title}</p>
        </div>
        <div className="font-thin text-sm font-silkscreen overflow-auto p-1 xl:w-[55%] w-[95%] sm:w-[80%] lg:w-[65%] 2xl:w-[40%] m-auto gap-2 flex justify-around text-black border-4 border-t-[#848584] border-l-[#848584] border-b-white border-r-white">
            <p className="text-nowrap"><span className="font-bold">Level</span> : {userData.level}</p>
            <p className="text-nowrap"><span className="font-bold">Current-rank</span> : {userData.curr_rank}</p>
            <p className="text-nowrap"><span className="font-bold">Peak-rank</span> : {userData.peak_rank}</p>
        </div>
        <div className={`w-[95%] sm:w-[80%] lg:w-[65%] xl:w-[55%] 2xl:w-[40%] font-raleway mb-8 m-auto mt-2 flex justify-end items-center text-white font-medium text-sm`}>
            <p className={`${netColor} px-5 py-1 text-center border-4 border-[#848584] border-b-white border-r-white`}>Net RR since past 5 matches : {netCalc}</p>
        </div>
        {
            matchData.map((match) => (
                <MatchSlot key={match.match_id} matchData = {match}/>
            ))
        }
    </div>
  )
}

export default Profile