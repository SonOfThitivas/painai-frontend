"use client"

import dynamic from "next/dynamic";

import { Box } from "@mui/material";

import SideBarNavigator from "./components/SideBarNavigator";

import theme from "./components/theme";

import {ThemeProvider} from "@mui/material";

export default function Home() {
    
    // to avaliable Next.js Fast Reload
    const Map = dynamic(
        () => import("@/app/components/Map"), {
        ssr: false,
        loading: () => <p>Loading...</p>,
    });

  return (
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

  );
}