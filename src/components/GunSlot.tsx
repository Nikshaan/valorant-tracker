import axios from "axios";
import React, { useEffect, useState } from "react"
import { LazyLoadImage } from "react-lazy-load-image-component";

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
            } else if(gunVal[0] == '' || gunVal[0] == '95336ae4-45d4-1032-cfaf-6bad01910607'){
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
        return <div className="w-full text-sm h-7 text-center border-white border-b-black border-r-black border-2">NA x {gunVal[1]}</div>
    }
  return (
    <div className="flex w-full gap-2 justify-center mx-1 items-center border-white border-b-black border-r-black border-2">
        <div className="flex justify-center items-center text-sm overflow-auto">
            {
                gunImg
                ?<LazyLoadImage alt="gun" loading="lazy" src = {gunImg ? gunImg : "#"} className="h-5 w-full" />
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