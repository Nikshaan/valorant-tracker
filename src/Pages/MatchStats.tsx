import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import PlayerSlot from '../components/PlayerSlot';

/*
TODO:
types declare players*
baiter***
rank progress bar at matchslots pages***
gang*****
go through apis again
optimization // images
*/

interface MatchDetails {
    score: Score[],
    rounds: Round[],
    players: Players[],
    kills: object[],
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
    const playersBlue: Players[] = [];
    const playersRed: Players[] = [];
    //const alive_time: {[id: string]: number} = {}; 

    async function fetchMatchData(): Promise<void>{
        try{
            const res = await axios.get(`https://api.henrikdev.xyz/valorant/v4/match/ap/${matchId}`);
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
        //console.log(playersBlue, playersRed);
    }

    /*if(matchDetails != null){
        let j = 0;
        let vic_blue = 0;
        let vic_red = 0;

        while(j < matchDetails.kills.length; j++){
            let round_no = matchDetails.kills[j].round;
            let copyRed = playersRed.slice();
            let copyBlue = playersBlue.slice();

            while(matchDetails.kill[j].round == round){
                let victim_team = matchDetails.kill[j].victim.team;
                if(victim_team == "Blue"){
                    vic_blue += 1;
                    copyBlue.pop(matchDetails.kill[j].victim.name)
                } else {
                    vic_red += 1;
                }

                if(vic_blue == 4){
                    alive_time[]
                }
                j += 1;
            }
        }
    }*/

    useEffect(() => {
            fetchMatchData();
        }, []);

    if(matchDetails == null){
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
    <div className='flex flex-col gap-1 text-center border-2 m-2'>
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