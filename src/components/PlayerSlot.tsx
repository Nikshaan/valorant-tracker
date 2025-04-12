import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

interface Player {
    player: PlayerGameData,
};

interface PlayerGameData {
    ability_casts: {
        ability1: number;
        ability2: number;
        grenade: number;
        ultimate: number;
    };
    account_level: number;
    agent: {
        id: string;
        name: string;
    };
    behavior: {
        afk_rounds: number;
        friendly_fire: {
        incoming: number;
        outgoing: number;
        };
        rounds_in_spawn: number;
    };
    customization: {
        card: string;
        preferred_level_border: string;
        title: string;
    };
    economy: {
        loadout_value: {
        average: number;
        overall: number;
        };
        spent: {
        average: number;
        overall: number;
        };
    };
    name: string;
    party_id: string;
    platform: string;
    puuid: string;
    session_playtime_in_ms: number;
    stats: {
        assists: number;
        bodyshots: number;
        damage: {
        dealt: number;
        received: number;
        };
        deaths: number;
        headshots: number;
        kills: number;
        legshots: number;
        score: number;
    };
    tag: string;
    team_id: string;
    tier: {
        id: number;
        name: string;
    };  
}

interface PlayerData {
    abilities: {
        ability1: number,
        ability2: number,
        grenade: number,
        ultimate: number,
    },
    level: number,
    rank: string,
    afk_rounds: number,
    avg_spent: number,
    stats: {
        assists: number;
        bodyshots: number;
        damage: {
          dealt: number;
          received: number;
        };
        deaths: number;
        headshots: number;
        kills: number;
        legshots: number;
        score: number;
    },
    ability_icons: string[],
    agent_name: string,
    agent_icon: string,
}

const PlayerSlot: React.FC<Player> = ({player}) => {
    const [playerData, setPlayerData] = useState<PlayerData | null>(null);
    async function fetchAgentData(): Promise<void>{
        try{
            const res = await axios.get(`https://valorant-api.com/v1/agents/${player.agent.id}`);
            
            setPlayerData({
                abilities: player.ability_casts,
                level: player.account_level,
                rank: player.tier.name,
                afk_rounds: player.behavior.afk_rounds,
                avg_spent: Math.ceil(player.economy.spent.average),
                stats: player.stats,
                ability_icons: [res.data.data.abilities[0].displayIcon, res.data.data.abilities[1].displayIcon, res.data.data.abilities[2].displayIcon, res.data.data.abilities[3].displayIcon],
                agent_name: res.data.data.displayName,
                agent_icon: res.data.data.displayIcon,
            });
        }
        catch(err){
            console.log("Error : " + err)
        }
    };
    console.log(player)
    useEffect(() => {
        fetchAgentData();
    }, []);

    if (playerData == null){
        return (<div className="text-white">Loading...</div>)
    }

  return (
    <div className='m-1 flex-col flex p-2 border-2'>
        <div className='flex justify-between'>
            <img src={playerData.agent_icon} className='h-6'/>
            <Link to={`/profile/${player.name}/${player.tag}`}>
                <p className='text-nowrap'>{player.name}#{player.tag}</p>
            </Link>
            <p>lvl: {playerData.level}</p>
            <p>score: {playerData.stats.score}</p>
            <p>rank: {playerData.rank}</p>
        </div>
        <div className='flex mt-2'>
            <div className='flex gap-5'>
                <p>KDA: {playerData.stats.kills}|{playerData.stats.deaths}|{playerData.stats.assists}</p>
                <p>HBL: {playerData.stats.headshots} | {playerData.stats.bodyshots} | {playerData.stats.legshots}</p>
                <p>AFK: {playerData.afk_rounds} | AVG_SPENT: {playerData.avg_spent} </p>
            </div>
        </div>
        <div className='mt-2 w-full'>
            <div className='flex justify-between items-center'>
                <div className='flex'>
                    <img src={playerData.ability_icons[0]} className='h-6'/>
                    <p> X {playerData.abilities.ability1}</p>
                </div>
                <div className='flex'>
                    <img src={playerData.ability_icons[1]} className='h-6'/>
                    <p> X {playerData.abilities.ability2}</p>
                </div>
                <div className='flex'>
                    <img src={playerData.ability_icons[2]} className='h-6'/>
                    <p> X {playerData.abilities.grenade}</p>
                </div>
                <div className='flex'>
                    <img src={playerData.ability_icons[3]} className='h-6'/>
                    <p> X {playerData.abilities.ultimate}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PlayerSlot