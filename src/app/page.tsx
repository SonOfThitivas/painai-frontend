"use client"

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Box, ThemeProvider} from "@mui/material";
import SideBarNavigator from "./components/SideBarNavigator";
import axios from "axios";
import theme from "./theme";

export default function Home() {

    // to avaliable Next.js Fast Reload
    const Map = dynamic(
            () => import("@/app/components/Map"), {
            ssr: false,
            loading: () => <p>Loading...</p>,
        });

    const [data, setData] = useState<null | Array>(null);

    useEffect(()=>{
        axios
        .get("http://localhost:8080/api/v1/activity/")
        .then((res) => setData(res.data.data))
        .catch((err) => console.error(err));
    },[])



  return (
    <ThemeProvider theme={theme}>
        <div>
            <Box component="div" sx={{width:1, position:"relative"}}>
                <SideBarNavigator />
                <Box component="div" sx={{width: 1}}>
                    <Map 
                    posix={[13.82152778382708, 100.51345467567444]}
                    data={data}
                    />
                </Box>
            </Box>  
        </div>
    </ThemeProvider>
  );
}