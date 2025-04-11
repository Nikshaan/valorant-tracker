import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

/*
TODO:
link to profile
types declare
sort by score
baiter
mvp
rank progress bar at matchslots pages
each agent photo + ability data
*/

const MatchStats: React.FC = () => {
    const { matchId } = useParams<Record<string, string | undefined>>();
    const [ matchDetails, setMatchDetails ] = useState<object | null>(null);
    const playersBlue: object[] = [];
    const playersRed: object[] = [];
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

    //console.log(matchDetails);
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
                <div key={player.puuid} className='m-1 flex-col flex p-2 border-2'>
                    <div className='flex justify-between'>
                        <p className='text-nowrap'>{player.name}#{player.tag}</p>
                        <p>lvl: {player.account_level}</p>
                        <p>score: {player.stats.score}</p>
                        <p>rank: {player.tier.name}</p>
                    </div>
                </div>
                )
            }
        </div>
        <div className='bg-blue-400 w-full p-2'>
            {
                playersBlue.map((player)=>
                <div key={player.puuid} className='m-1 flex-col flex p-2 border-2'>
                    <div className='flex justify-between'>
                        <p className='text-nowrap'>{player.name}#{player.tag}</p>
                        <p>lvl: {player.account_level}</p>
                        <p>score: {player.stats.score}</p>
                        <p>rank: {player.tier.name}</p>
                    </div>
                </div>
                )
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