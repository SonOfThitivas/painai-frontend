"use client"

import dynamic from "next/dynamic";

import { useState } from "react";

import { Box } from "@mui/material";

import SideBarNavigator from "./components/SideBarNavigator";


export default function Home() {
    // const [home, setHome] = useState(true); // home page
    // const [actLobby, setActLobby] = useState(false); // activity lobby page
    // const [createAct, setCreateAct] = useState(false); // create a activty page

    // to avaliable Next.js Fast Reload
    const Map = dynamic(
            () => import("@/app/components/Map"), {
            ssr: false,
            loading: () => <p>Loading...</p>,
        });

  return (
    <div>
        <Box component="div" sx={{width:1, position:"relative"}}>
            <SideBarNavigator />
            <Box component="div" sx={{width: 1}}>
                <Map posix={[13.82152778382708, 100.51345467567444]}/>
            </Box>
        </Box>
    </div>
  );
}