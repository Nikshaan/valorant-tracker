import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import GunSlot from './GunSlot';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface Player {
    player: PlayerGameData,
    guns: object
}

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

const PlayerSlot: React.FC<Player> = ({player, guns}) => {
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

    useEffect(() => {
        fetchAgentData();
    }, []);

    if (playerData == null){
        return (<div className="text-white font-silkscreen text-center my-2">Loading player...</div>)
    }

  return (
    <div className='m-1 flex-col flex p-2 border-2 border-t-[#848584] border-l-[#848584] border-b-white border-r-white bg-[#c4c8cc]'>
        <div className='flex text-sm lg:text-base font-raleway gap-2 p-2 pr-2 font-semibold justify-around overflow-auto items-center border-2 border-t-[#848584] border-l-[#848584] border-b-white border-r-white'>
            <LazyLoadImage alt="agent" loading="lazy" src={playerData.agent_icon} className='h-10 border-4 border-white border-b-black border-r-black'/>
            <Link to={`/profile/${player.name}/${player.tag}`}>
                <p className='text-nowrap font-extrabold'>{player.name}#{player.tag}</p>
            </Link>
            <p><span className='font-bold'>Lvl: </span>{playerData.level}</p>
            <p><span className='font-bold'>Score: </span>{playerData.stats.score}</p>
            <p><span className='font-bold'>Rank: </span>{playerData.rank}</p>
        </div>
        <div className='flex mt-2 w-full justify-center items-center'>
            <div className='flex text-sm lg:text-base font-silkscreen overflow-auto justify-around items-center gap-5 w-full border-4 p-1 px-2 border-t-[#848584] border-l-[#848584] border-b-white border-r-white'>
                <div className='flex flex-col text-center'><p>KDA:</p><p>{playerData.stats.kills}|{playerData.stats.deaths}|{playerData.stats.assists}</p></div>
                <div className='flex flex-col text-center'><p>HBL:</p><p className='text-nowrap'>{playerData.stats.headshots} | {playerData.stats.bodyshots} | {playerData.stats.legshots}</p></div>
                <p className='text-center'>AFK: {playerData.afk_rounds}</p>
                <p className='text-center'>AVG_SPENT: {playerData.avg_spent} </p>
            </div>
        </div>
        <div className='flex mt-2 w-full font-silkscreen text-sm text-nowrap justify-center items-center'>
            <div className='flex justify-around gap-10 overflow-auto w-full lg:text-base border-4 p-1 px-2 border-t-[#848584] border-l-[#848584] border-b-white border-r-white bg-gray-400 text-white'>
                <div className='flex text-nowrap'>
                    <LazyLoadImage alt="ability1" loading="lazy" src={playerData.ability_icons[0]} className='h-6'/>
                    <p>&nbsp; X {playerData.abilities.ability1}</p>
                </div>
                <div className='flex'>
                    <LazyLoadImage alt="ability2" loading="lazy" src={playerData.ability_icons[1]} className='h-6'/>
                    <p>&nbsp; X {playerData.abilities.ability2}</p>
                </div>
                <div className='flex'>
                    <LazyLoadImage alt="ability3" loading="lazy" src={playerData.ability_icons[2]} className='h-6'/>
                    <p>&nbsp; X {playerData.abilities.grenade}</p>
                </div>
                <div className='flex'>
                    <LazyLoadImage alt="ultimate" loading="lazy" src={playerData.ability_icons[3]} className='h-6'/>
                    <p>&nbsp; X {playerData.abilities.ultimate}</p>
                </div>
            </div>
        </div>
        <div className='flex  justify-center items-center'>
        <div className='w-fit -ml-1 grid grid-cols-2 sm:grid-cols-4 font-silkscreen my-2 justify-center items-center'>
            {
                Object.entries(guns).map((gun, index) => (
                    <GunSlot key={index} gunVal = {gun} />
                )
                )
            }
        </div>
        </div>
    </div>
  )
}

export default PlayerSlot