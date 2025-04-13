import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import PlayerSlot from '../components/PlayerSlot';
const apiKey = import.meta.env.VITE_API_KEY;

/*
TODO:
rank progress bar at matchslots pages***
gang*****
go through apis again
optimization // images
date
*/

interface MatchDetails {
    score: Score[],
    rounds: Round[],
    players: Players[],
    kills: Kills[],
}

interface Score {
    team_id: string,
    rounds: {
        won: number,
        lost: number,
        [key: string]: unknown,
    }
}

interface Players {
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

interface Kills {
    round: number,
    victim: {
        name: string,
        puuid: string,
        team: string,
    }
}

interface Round {
    id: number,
    result: string | null,
    plant: {
        site: string | null
    } | null,
    winning_team: string
}

const MatchStats: React.FC = () => {
    const { matchId } = useParams<Record<string, string | undefined>>();
    const [ matchDetails, setMatchDetails ] = useState<MatchDetails | null>(null);
    const [ baiter, setBaiter ] = useState<string | null>(null);
    const playersBlue: Players[] = [];
    const playersRed: Players[] = [];
    const alive = new Map<string, number>(); 
    
    async function fetchMatchData(): Promise<void>{
        try{
            const res = await axios.get(`https://api.henrikdev.xyz/valorant/v4/match/ap/${matchId}?api_key=${apiKey}`);
            setMatchDetails({
                score: res.data.data.teams,
                rounds: res.data.data.rounds,
                players: res.data.data.players,
                kills: res.data.data.kills,
            });
        }
        catch(err){
            console.log("Error : " + err)
        }
    };

    function getKeyWithMaxValue<K>(map: Map<K, number>): K | null {
        let maxKey = null;
        let maxValue = -Infinity;
        
        map.forEach((value, key) => {
        if (value > maxValue) {
            maxValue = value;
            maxKey = key;
        }
    });
        
        return maxKey;
      }

    if(matchDetails != null && playersBlue.length == 0 && playersRed.length == 0){
        for(let i = 0; i < 10; i++){
            if(matchDetails.players[i].team_id == "Blue"){
                playersBlue.push(matchDetails.players[i]);
            } else {
                playersRed.push(matchDetails.players[i]);
            }
        }
        playersBlue.sort((a, b) => b.stats.score - a.stats.score);
        playersRed.sort((a, b) => b.stats.score - a.stats.score);
    }

    if(matchDetails != null && baiter == null){
        let j = 0;
        let roundCheck1 = Infinity;
        let roundCheck2 = Infinity;

        while(j < matchDetails.kills.length){
            const round_no = matchDetails.kills[j].round;
            let copyRed = [playersRed[0].puuid, playersRed[1].puuid, playersRed[2].puuid, playersRed[3].puuid, playersRed[4].puuid];
            let copyBlue = [playersBlue[0].puuid, playersBlue[1].puuid, playersBlue[2].puuid, playersBlue[3].puuid, playersBlue[4].puuid];
            let vic_blue = 0;
            let vic_red = 0;

            while(matchDetails.kills[j]?.round == round_no){
                const victim_team = matchDetails.kills[j].victim.team;

                if(victim_team == "Blue"){
                    vic_blue += 1;
                    copyBlue = copyBlue.filter(id => id != matchDetails.kills[j].victim.puuid);
                    
                } else {
                    vic_red += 1;
                    copyRed = copyRed.filter(id => id != matchDetails.kills[j].victim.puuid);
                }

                if(vic_blue == 4 && round_no != roundCheck1){
                    roundCheck1 = round_no;
                    if(alive.has(copyBlue[0])){
                        alive.set(copyBlue[0], alive.get(copyBlue[0])! + 1);
                    } else {
                        alive.set(copyBlue[0], 1);
                    }
                }

                if(vic_red == 4 && round_no != roundCheck2){
                    roundCheck2 = round_no;
                    if(alive.has(copyRed[0])){
                        alive.set(copyRed[0], alive.get(copyRed[0])! + 1);
                    } else {
                        alive.set(copyRed[0], 1);
                    }
                }

                j += 1;
            }
        }

        const maxBaiter: string | null = getKeyWithMaxValue(alive);
        for(let x = 0; x < 10; x++){
            if(matchDetails.players[x].puuid === maxBaiter){
                setBaiter(matchDetails.players[x].name + "#" + matchDetails.players[x].tag)
            }
        }
    }   

    useEffect(() => {
            fetchMatchData();
        }, []);

    if(matchDetails == null || baiter == null){
        return(<><p className='text-white'>Loading...</p></>)
    }

    return (
    <div className=''>
    <div className='flex border-2 bg-gray-500 justify-center items-center'>
        <div className={`${matchDetails.score[0].team_id == "Red" ? "bg-red-600" : "bg-blue-600"} p-2 border-2`}>
            {matchDetails.score[0].rounds.won}
        </div>
        <p className='mx-1'>-</p>
        <div className={`${matchDetails.score[1].team_id == "Red" ? "bg-red-600" : "bg-blue-600"} p-2 border-2`}>
            { matchDetails.score[0].rounds.lost}
        </div>
    </div>
    <div className='text-white flex justify-center items-center m-2'>
        <p className='border-2 px-2 py-1'>Heavy Baiter : {baiter}</p>
    </div>
    <div className='flex flex-col gap-1 text-center border-2'>
        <div className='bg-red-400 w-full p-2'>
            {
            playersRed.map((player)=>
            (
                <PlayerSlot player = {player} key={player.puuid} />   
            ))
            }
        </div>
        <div className='bg-blue-400 w-full p-2'>
            {
                playersBlue.map((player)=>
                (
                <PlayerSlot player = {player} key={player.puuid} />   
            ))
            }
        </div>
    </div>
    <div>
        <div className='bg-gray-500 my-2 border-2 flex overflow-auto'>
            {
                matchDetails.rounds.map((round)=>
                <div key={round.id} className={`flex flex-col justify-center items-center text-center m-2 px-2 border-2 ${round.winning_team == "Red" ? "bg-red-500": "bg-blue-500"}`}>
                    <p className='text-nowrap'>
                        {round.id}.&nbsp;
                        {round.result}
                    </p>
                    <p>
                        plant: {round.plant?.site ? round.plant.site : "X"}
                    </p>
                </div>
                )
            }
        </div>
    </div>
    </div>
  )
}

export default MatchStats