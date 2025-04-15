import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import PlayerSlot from '../components/PlayerSlot';
const apiKey = import.meta.env.VITE_API_KEY;

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
    },
    killer: {
        puuid: string,
    },
    weapon: {
        id: string,
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
    const [ baiterBlue, setBaiterBlue ] = useState<string | null>(null);
    const [ baiterRed, setBaiterRed ] = useState<string | null>(null);
    const [ gunCheck, setGunCheck ] = useState<object[] | null>(null);
    const playersBlue: Players[] = [];
    const playersRed: Players[] = [];
    const aliveBlue = new Map<string, number>();
    const aliveRed = new Map<string, number>(); 
    const p0 = new Map<string, number>();
    const p1 = new Map<string, number>();
    const p2 = new Map<string, number>();
    const p3 = new Map<string, number>();
    const p4 = new Map<string, number>();
    const p5 = new Map<string, number>();
    const p6 = new Map<string, number>();
    const p7 = new Map<string, number>();
    const p8 = new Map<string, number>();
    const p9 = new Map<string, number>();
    
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

    function mapToJson<K extends string | number, V>(map: Map<K, V>): Record<K, V> {
        const obj: Partial<Record<K, V>> = {};
        
        map.forEach((value, key) => {
        obj[key] = value;
        });
        
        return obj as Record<K, V>;
    }
    
    
    
    const gunChecker = () => {
        let i = 0;
        while ( matchDetails != null && i < matchDetails.kills.length ){
            if(matchDetails.kills[i].killer.puuid == playersRed[0].puuid){
                if(p0.has(matchDetails.kills[i].weapon.id)){
                    p0.set(matchDetails.kills[i].weapon.id, p0.get(matchDetails.kills[i].weapon.id)! + 1);
                }
                else {
                    p0.set(matchDetails.kills[i].weapon.id, 1);
                }
             } else if(matchDetails.kills[i].killer.puuid == playersRed[1].puuid){
                if(p1.has(matchDetails.kills[i].weapon.id)){
                    p1.set(matchDetails.kills[i].weapon.id, p1.get(matchDetails.kills[i].weapon.id)! + 1);
                }
                else {
                    p1.set(matchDetails.kills[i].weapon.id, 1);
                }
             } else if(matchDetails.kills[i].killer.puuid == playersRed[2].puuid){
                if(p2.has(matchDetails.kills[i].weapon.id)){
                    p2.set(matchDetails.kills[i].weapon.id, p2.get(matchDetails.kills[i].weapon.id)! + 1);
                }
                else {
                    p2.set(matchDetails.kills[i].weapon.id, 1);
                }
             } else if(matchDetails.kills[i].killer.puuid == playersRed[3].puuid){
                if(p3.has(matchDetails.kills[i].weapon.id)){
                    p3.set(matchDetails.kills[i].weapon.id, p3.get(matchDetails.kills[i].weapon.id)! + 1);
                }
                else {
                    p3.set(matchDetails.kills[i].weapon.id, 1);
                }
             } else if(matchDetails.kills[i].killer.puuid == playersRed[4].puuid){
                if(p4.has(matchDetails.kills[i].weapon.id)){
                    p4.set(matchDetails.kills[i].weapon.id, p4.get(matchDetails.kills[i].weapon.id)! + 1);
                }
                else {
                    p4.set(matchDetails.kills[i].weapon.id, 1);
                }
             } else if(matchDetails.kills[i].killer.puuid == playersBlue[0].puuid){
                if(p5.has(matchDetails.kills[i].weapon.id)){
                    p5.set(matchDetails.kills[i].weapon.id, p5.get(matchDetails.kills[i].weapon.id)! + 1);
                }
                else {
                    p5.set(matchDetails.kills[i].weapon.id, 1);
                }
             } else if(matchDetails.kills[i].killer.puuid == playersBlue[1].puuid){
                if(p6.has(matchDetails.kills[i].weapon.id)){
                    p6.set(matchDetails.kills[i].weapon.id, p6.get(matchDetails.kills[i].weapon.id)! + 1);
                }
                else {
                    p6.set(matchDetails.kills[i].weapon.id, 1);
                }
             }else if(matchDetails.kills[i].killer.puuid == playersBlue[2].puuid){
                if(p7.has(matchDetails.kills[i].weapon.id)){
                    p7.set(matchDetails.kills[i].weapon.id, p7.get(matchDetails.kills[i].weapon.id)! + 1);
                }
                else {
                    p7.set(matchDetails.kills[i].weapon.id, 1);
                }
             }else if(matchDetails.kills[i].killer.puuid == playersBlue[3].puuid){
                if(p8.has(matchDetails.kills[i].weapon.id)){
                    p8.set(matchDetails.kills[i].weapon.id, p8.get(matchDetails.kills[i].weapon.id)! + 1);
                }
                else {
                    p8.set(matchDetails.kills[i].weapon.id, 1);
                }
             } else if(matchDetails.kills[i].killer.puuid == playersBlue[4].puuid){
                if(p9.has(matchDetails.kills[i].weapon.id)){
                    p9.set(matchDetails.kills[i].weapon.id, p9.get(matchDetails.kills[i].weapon.id)! + 1);
                }
                else {
                    p9.set(matchDetails.kills[i].weapon.id, 1);
                }
             }

             i += 1
        }
        const Objp0 = mapToJson(p0);
        const Objp1 = mapToJson(p1);
        const Objp2 = mapToJson(p2);
        const Objp3 = mapToJson(p3);
        const Objp4 = mapToJson(p4);
        const Objp5 = mapToJson(p5);
        const Objp6 = mapToJson(p6);
        const Objp7 = mapToJson(p7);
        const Objp8 = mapToJson(p8);
        const Objp9 = mapToJson(p9);
       
        setGunCheck([Objp0, Objp1, Objp2, Objp3, Objp4, Objp5, Objp6, Objp7, Objp8, Objp9])
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
        if(gunCheck == null){
            gunChecker();
        }
    }

    if(matchDetails != null && baiterRed == null && baiterBlue == null){
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
                    if(aliveBlue.has(copyBlue[0])){
                        aliveBlue.set(copyBlue[0], aliveBlue.get(copyBlue[0])! + 1);
                    } else {
                        aliveBlue.set(copyBlue[0], 1);
                    }
                }

                if(vic_red == 4 && round_no != roundCheck2){
                    roundCheck2 = round_no;
                    if(aliveRed.has(copyRed[0])){
                        aliveRed.set(copyRed[0], aliveRed.get(copyRed[0])! + 1);
                    } else {
                        aliveRed.set(copyRed[0], 1);
                    }
                }

                j += 1;
            }
        }
        
        const maxBaiterBlue: string | null = getKeyWithMaxValue(aliveBlue);
        const maxBaiterRed: string | null = getKeyWithMaxValue(aliveRed);

        for(let x = 0; x < 10; x++){
            if(matchDetails.players[x].puuid === maxBaiterBlue){
                setBaiterBlue(matchDetails.players[x].name + "#" + matchDetails.players[x].tag);
            } else if (matchDetails.players[x].puuid === maxBaiterRed){
                setBaiterRed(matchDetails.players[x].name + "#" + matchDetails.players[x].tag);
            }
        }
    }   
    
    useEffect(() => {
            fetchMatchData();
        }, []);

    if(matchDetails == null || baiterBlue == null || baiterRed == null || gunCheck == null){
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
    <div className='text-white flex justify-center items-center m-2 gap-2'>
        <p className='border-2 px-2 py-1'>Heavy Baiter Red: {baiterRed}</p>
        <p className='border-2 px-2 py-1'>Heavy Baiter Blue: {baiterBlue}</p>
    </div>
    <div className='flex flex-col gap-1 text-center border-2'>
        <div className='bg-red-400 w-full p-2'>
            {
            playersRed.map((player, index)=>
            (
                <PlayerSlot player = {player} key={player.puuid} guns={gunCheck[index]} />   
            ))
            }
        </div>
        <div className='bg-blue-400 w-full p-2'>
            {
                playersBlue.map((player, index)=>
                (
                <PlayerSlot player = {player} key={player.puuid} guns={gunCheck[index + 5]}/>   
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