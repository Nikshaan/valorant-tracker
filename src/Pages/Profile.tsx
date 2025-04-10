import { useParams } from "react-router-dom"
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
    name: string | undefined,
    tag: string | undefined,
    level: number,
    card: string | undefined,
    title: string,
    curr_rank: string,
    peak_rank: string,
}

const Profile: React.FC = () => {

    const { userName, userId } = useParams<Record<string, string | undefined>>();
    const [userData, setUserData ] = useState<User | null>(null);

    async function fetchData(): Promise<void>{
        try{
            const res1 = await axios.get(`https://api.henrikdev.xyz/valorant/v2/account/${userName}/${userId}`);
            const res2 = await axios.get(`https://api.henrikdev.xyz/valorant/v3/mmr/ap/pc/${userName}/${userId}`);
            const card = await axios.get(`https://media.valorant-api.com/playercards/${res1.data.data.card}/wideart.png`);
            const title = await axios.get(`https://valorant-api.com/v1/playertitles/${res1.data.data.title}`);
            
            setUserData({
                name: userName,
                tag: userId,
                level: res1.data.data.account_level,
                card : card.config.url,
                title: title.data.data.titleText,
                curr_rank: res2.data.data.current.tier.name,
                peak_rank: res2.data.data.peak.tier.name,
            });

        }
        catch(err){
            console.log("Error : " + err);
        }
    };
    console.log(userData);
    useEffect(() => {
        fetchData();
    }, []);

    if (userData == null){
        return (<div className="text-white">Loading...</div>)
    }
    return (
    <>
        <div className="text-white">{userName} {userId}</div>
        <img src={userData.card} />
    </>
  )
}

export default Profile