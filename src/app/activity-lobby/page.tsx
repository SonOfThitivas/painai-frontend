"use client"

import React from 'react';
import { Box, Typography, Grid, ThemeProvider} from "@mui/material";
import SideBarNavigator from "../components/SideBarNavigator";
import ActivityCard from "../components/ActivityCard";
import axios from 'axios';
import dayjs from 'dayjs';
import theme from '../components/theme';
import SearchBox from '../components/SearchBox';

export default function ActivityLobby() {
    const [data, setData] = React.useState<null | Array<any>>([]);
    const [isAuth, setIsAuth] = React.useState<boolean>(false);
    const [userID, setUserID] = React.useState<string>("");
    const [title, setTitle] = React.useState<string>("");
    const [dataAct, setDataAct] = React.useState<Array<any>>([])
    
    // fetch browsing user ID
    const fetchUserID = async () => {
        // Get the token from localStorage (set when user logs in)
        const token = localStorage.getItem("jwt_token"); 
        if (!token) {
            setIsAuth(false);
            return "";
        }

        try {
            // Send token to backend for verification
            const res: any = await axios.get(
                `https://painai-backend.graypebble-936b89d4.japanwest.azurecontainerapps.io/api/v1/auth/auth/callback`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setIsAuth(true);

            // Get user ID from backend response
            const email = res.data.user.email;
            const resUser: any = await axios.get(
                `https://painai-backend.graypebble-936b89d4.japanwest.azurecontainerapps.io/api/v1/user/email/${email}`
            );

            return resUser.data.ID;
        } catch (err) {
            setIsAuth(false);
            return "";
        }
    };

    // fetch username from creator id
    const fetchUser = async (userID:String) => {
        const res:any = await axios.get(`https://painai-backend.graypebble-936b89d4.japanwest.azurecontainerapps.io/api/v1/user/id/${userID}`).catch((err)=>alert(err))
        return res.data.data.DisplayName
    } 

    // fetch number of activiy member
    const fetchMember = async (activityID:String) => {
        const res:any = await axios.get(`https://painai-backend.graypebble-936b89d4.japanwest.azurecontainerapps.io/api/v1/activity/${activityID}/members`).catch((err)=>alert(err))
        const data:Array<any> = res.data
        return {
            "count": data.length,
            "data" : data
        }
    }

    // fetch activity + username
    const fetchData = async () => {
        const res:any = await axios.get("https://painai-backend.graypebble-936b89d4.japanwest.azurecontainerapps.io/api/v1/activity/").catch((err)=>alert(err))
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
            const member = await fetchMember(item.ID)
            fData[index].username = username
            fData[index].participants = member.count
            // fData[index].member = member.data
            fData[index].members = member.data.map((data)=>(data.user_id))
            // console.log(fData[index].member)
        }
        
        setUserID(await fetchUserID())
        setData(fData)
    }

    const fetchFilterData = () => {
        let filtAct = data.filter((item)=>{
            let text = item.Title
            text = text.toLowerCase()
            return text.match(title.toLowerCase())
        })
        setDataAct(filtAct)
        // console.log(data)
        // console.log(filtAct)
    }

    // fetch dat at first
    React.useEffect(() => {
        fetchData()
    },[])

    // call dunction when data and title are changed
    React.useEffect(() => {
        fetchFilterData()
    },[title,data])
    
  return (
      <ThemeProvider theme={theme}>
        <SideBarNavigator />
        <Box sx={{ display: 'flex' }}>
        <Box component="main" 
        sx={{ 
            // display:"flex",
            flexGrow: 1, p: 3, 
            justifyItems: 'center',
            minHeight: '100vh', 
            background: `linear-gradient(45deg,${theme.palette.background.default}, ${theme.palette.primary.main})`
            }}>
            <Typography variant="h4" gutterBottom>
                Activity Lobby
            </Typography>
            <SearchBox label={"Search Activities"} position={"static"} setTitle={setTitle} data={data}/>

            <Grid container spacing={2} direction="column">
                {   // display all activities, ordering by decreasing date
                    dataAct.map((act:any) => {
                    return (<ActivityCard
                        key={act.ID}
                        username={act.username}
                        title={act.Title}
                        date={dayjs(act.StartTime).format("ddd DD MMM YYYY HH:mm")} // https://day.js.org/docs/en/display/format
                        place={act.Location}
                        description={act.Description}
                        maxParticipants={act.MaxParticipants}
                        participants={act.participants}
                        isAuth={isAuth}
                        members={act.members}
                        userID={userID}
                        activityID={act.ID}
                        >
                    </ActivityCard>)
                    })
                } 

            </Grid>
        </Box>
        </Box>
    </ThemeProvider>
  );
}
