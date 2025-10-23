"use client"

import React from 'react';
import { Box, Typography, Grid , createTheme, ThemeProvider} from "@mui/material";
import SideBarNavigator from "../components/SideBarNavigator";
import ActivityCard from "../components/ActivityCard";
import axios from 'axios';
import dayjs from 'dayjs';

export default function ActivityLobby() {
    const theme = createTheme({
        typography: {
            fontFamily: "var(--font-mitr)",
        },
    })

    const [data, setData] = React.useState<null | Array<any>>([]);
    const [username, setUsername] = React.useState<null | Array<any>>([]);

    // fetch username from creator id
    const fetchUser = async (userID:String) => {
        const res:any = await axios.get(`http://localhost:8080/api/v1/user/id/${userID}`).catch((err)=>alert(err))
        return res.data.data.DisplayName
    } 

    // fetch activity + username
    const fetchData = async () => {
        const res:any = await axios.get("http://localhost:8080/api/v1/activity/").catch((err)=>alert(err))
        let fData:Array<any> = res.data.data

        // sort decreasing date

        fData.sort((a,b)=>{
            const dateA = dayjs(a.StartTime)
            const dateB = dayjs(b.StartTime)
            if (dateA.isBefore(dateB)) {
                return 1;
            }
            if (dateA.isSame(dateB) || dateA.isAfter(dateB)) {
                return -1;
            }
        })
        
        for (const [index, item] of fData.entries()){
            const username = await fetchUser(item.CreatorID)
            fData[index].username = username
        }

        // console.log(fData)
        setData(fData)
    }


    React.useEffect(() => {
        fetchData()
    },[])

    
  return (
    <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
        <SideBarNavigator />
        <Box component="main" 
        sx={{ 
            flexGrow: 1, p: 3, 
            justifyItems: 'center',
            minHeight: '100vh', 
            backgroundColor: '#f5f5f5' 
            }}>
            
            <Typography variant="h4" gutterBottom>
                Activity Lobby
            </Typography>

            <Grid container spacing={2} direction="column">
                {   // display all activities, ordering by decreasing date
                    data.map((act:any) => {
                    return (<ActivityCard
                        key={act.ID}
                        username={act.username}
                        title={act.Title}
                        date={dayjs(act.StartTime).format("ddd DD MMM YYYY HH:mm")} // https://day.js.org/docs/en/display/format
                        place={act.Location}
                        description={act.Description}>
                    </ActivityCard>)
                    })
                } 

            </Grid>
        </Box>
        </Box>
    </ThemeProvider>
  );
}
