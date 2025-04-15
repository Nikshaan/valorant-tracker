import axios from "axios";
import React, { useEffect, useState } from "react"

interface GunProps {
    gunVal: string | number[]
}

const GunSlot: React.FC<GunProps> = ({ gunVal }) => {
   const [gunImg, setGunImg] = useState<string | null>(null);
   const [gunValue, setGunValue] = useState<string | null>(null);

    async function fetchGunData(): Promise<void>{
        try{
            if(gunVal[0] == "Ultimate" || gunVal[0] == "Ability1" || gunVal[0] == "Ability2" || gunVal[0] == "GrenadeAbility"){
                setGunValue(gunVal[0]);
            } else if(gunVal[0] == ''){
                setGunValue("Melee");
            }
            else {
            const res = await axios.get(`https://valorant-api.com/v1/weapons/${gunVal[0]}`);
            setGunImg(res.data.data.displayIcon);
            }
        }
        catch(err){
            console.log("Error : " + err)
        }
    };

    useEffect(() => {
            fetchGunData();
        }, []);

    if(gunImg == null && gunValue == null){
        return <div>Loading...</div>
    }
  return (
    <div className="flex mt-1 text-nowrap w-full gap-2 justify-start mx-1 items-center">
        <div className="flex justify-center items-center">
            {
                gunImg
                ?<img src = {gunImg ? gunImg : "#"} className="h-5" />
                :<p className="">{gunValue ? gunValue : ""}</p>
            }
            
        </div>
        <p>x</p>
        <div>
            {gunVal[1] || "-"}
        </div>
    </div>
  )
}

export default GunSlot