"use client"

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { Box, ThemeProvider} from "@mui/material";

import SideBarNavigator from "./components/SideBarNavigator";
import axios from "axios";
import theme from "./components/theme";


import theme from "./components/theme";

import {ThemeProvider} from "@mui/material";

export default function Home() {

    // to avaliable Next.js Fast Reload
    const Map = dynamic(
        () => import("@/app/components/Map"), {
        ssr: false,
        loading: () => <p>Loading...</p>,
    });

    const [data, setData] = useState<Array<any>>([]);
    const [filter, setFilter] = useState<Array<any>>([]);
    const title = useRef<string>("")
    
    const fetchData = async () => {
        await axios
        .get("http://localhost:8000/api/v1/activity/")
        .then((res) => setData(res.data.data))
        .catch((err) => console.error(err));
    }
    
    useEffect(()=>{
        fetchData()
    },[])

  return (
<<<<<<< HEAD
    <ThemeProvider theme={theme}>
        <Box component="div" sx={{width:1, position:"relative"}}>
            <SideBarNavigator />
            <Box component="div" sx={{width: 1}}>
                <Map 
                posix={[13.82152778382708, 100.51345467567444]}
                data={data}
                // title={title}
                />
            </Box>
            {/* <SearchBox label={"Search Activities"} data={data} title={title} /> */}
        </Box> 
    </ThemeProvider>
=======
    <div>
        <ThemeProvider theme={theme}>
            <Box component="div" sx={{width:1, position:"relative"}}>
                <SideBarNavigator />
                <Box component="div" sx={{width: 1}}>
                    <Map posix={[13.82152778382708, 100.51345467567444]}/>
                </Box>
            </Box>  
        </ThemeProvider>
    </div>

>>>>>>> features/user_profile
  );
}