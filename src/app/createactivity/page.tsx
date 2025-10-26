"use client"
import dynamic from "next/dynamic";
import { Box, 
    Button, 
    Grid, 
    TextField, 
    ThemeProvider, 
    Typography,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText,
} from "@mui/material"
import { ChangeEventHandler, useEffect } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import theme from "../components/theme";
import dayjs from "dayjs";

import { useRouter, useSearchParams} from 'next/navigation'
import { useState } from "react";
import axios from "axios";
import SideBarNavigator from "../components/SideBarNavigator";

function page() {

    const Map = dynamic(
        () => import("@/app/components/MapPin"), {
        ssr: false,
        loading: () => <p>Loading...</p>,
    });


    // state variables
    const router = useRouter()
    const searchParams = useSearchParams()
    let params = new URLSearchParams(searchParams.toString())
    
    const [title, setTitle] = useState<String | null>("");
    const [location, setLocation] = useState<String | null>("");
    const [description, setDescription] = useState<String | null>("");
    const [participation, setParticipation] = useState<number>(5);
    const [startDatetime, setStartDatetime] = useState<Date | null>(null);
    const [endDatetime, setEndDatetime] = useState<Date | null>(null);
    const [step, setStep] = useState<number | null>(1)
    const [userID, setUserID] = useState<string>("")
    const [openAuth, setOpenAuth] = useState<boolean>(false)
    const [openFill, setOpenFill] = useState<boolean>(false)

    const fetchUserID = async () => {
        const res:any = await axios.get("http://localhost:8000/api/v1/auth/auth/callback", {withCredentials:true})
        const email:string | null = res.data.user.email
        console.log(email)
        
        if (email !== ""){
            const res:any = axios.get(`http://localhost:8000/api/v1/user/email/${email}`)
            .then((res)=>{
                setUserID(res.data.ID)
                console.log(res.data.ID)
            })
            return 0
        }

        return 0
    }

    const handleSubmit = async () => {
        if (!(title === "" || location === "" || description === "" 
            || startDatetime === null || endDatetime === null)){

            const lat:string | null = params.get("lat")
            const lng:string | null = params.get("lng")
            const payload: Object = {
                creator_id: userID,
                title: title,
                description: description,
                start_time: startDatetime.toString(),
                end_time: endDatetime.toString(),
                max_participants: Number(participation),
                visibility: "public",
                latitude: Number(lat),
                longitude: Number(lng),
                location: location
            }

            console.log(payload)

            try {
                const res:any = await axios.post('http://localhost:8000/api/v1/activity/', payload, {withCredentials:true},)
                console.log('Response:', res.data);
                router.push('/')
            } catch (err) {
                console.error(err);
                setOpenAuth(true)
            }
        } else {
            setOpenFill(true)
        }
    }

    useEffect(()=>{
        fetchUserID()
    },[])

    const handleCloseAuth = () => {
        setOpenAuth(false);
        router.push("/login")
    };

    const handleTitle = (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => {
        setTitle(event.target.value)
        // console.log(event.target.value)
        // params.set("ti", event.target.value)
        // router.replace(`?${params.toString()}`)
    }

    const handleLocation = (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocation(event.target.value)
        // console.log(event.target.value)
        // params.set("lo", event.target.value)
        // router.replace(`?${params.toString()}`)
    }

    const handleDescription = (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => {
        setDescription(event.target.value)
        // console.log(event.target.value)
        // params.set("dct", event.target.value)
        // router.replace(`?${params.toString()}`)
    }

    const handleParticipation = (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => {
        setParticipation(event.target.value)
        // console.log(event.target.value)
        // params.set("pt", event.target.value)
        // router.replace(`?${params.toString()}`)
    }

    // -------------- to-do handle datetime overlap --------------
    const handleStartDatetime = (dt: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | Date>) => {
        setStartDatetime(dayjs(dt).format())
        // console.log(datetime)
    }

    const handleEndDatetime = (dt: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | Date>) => {
        setEndDatetime(dayjs(dt).format())
        // console.log(datetime)
    }

    return (
        <ThemeProvider theme={theme}>
            <SideBarNavigator/>
            <div>
                <Box component="div" 
                sx={{
                    // background: `linear-gradient(225deg,#0B2F9F, ${theme.palette.secondary.main})`,
                    background: `linear-gradient(45deg,${theme.palette.background.default}, ${theme.palette.primary.main})`,
                    minHeight: "100vh",
                    position:"relative", 
                    display:"flex", 
                    justifyContent:"center",
                    // alignItems:"center" 
                }}>
                    {/* header */}
                    <Box component="div"
                    sx={{
                        position: step === 1 ? "absolute" : "fixed",
                        zIndex:"1000",
                        textAlign:"center",
                        fontSize: 20,
                        boxShadow: "10px",
                        background: theme.palette.background.default,
                        borderRadius: 3,
                        p: 1,
                        m: 2,
                    }}>
                        {step === 1 && "Mark the Location"}
                        {step === 2 && "Fill the Information"}
                    </Box>

                    {/* MapPin Step: 1*/}
                    {step === 1 &&
                    
                        <Box component="div" sx={{width: 1}}>
                            <Map posix={[13.82152778382708, 100.51345467567444]} />
                        </Box>
                    }

                    {/* MapPin Step: 1*/}
                    {step === 2 &&
                        <Box component="div" 
                        maxWidth={1000}
                        sx={{
                            bgcolor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            background: theme.palette.background.default,
                            boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
                            borderRadius: 3,
                            width: 650,
                            mt:10,
                            pb: 12,
                            }}>
                            <Box component="div" sx={{display: "flex", flexWrap:"wrap", flexDirection:"column"}}>
                                <Typography align="center" sx={{m:2,fontSize:22}}>
                                    Activity Details
                                </Typography>

                                <TextField
                                    // required
                                    // id="outlined-required"   
                                    sx={{
                                        m:2,
                                    }}
                                    label="Title"
                                    variant="outlined"
                                    onChange={handleTitle}
                                />
                        
                                <TextField
                                    // required
                                    // id="outlined-required"
                                    sx={{m:2}}
                                    label="Location"
                                    variant="outlined"
                                    onChange={handleLocation}
                                />
                                <TextField
                                    sx={{m:2}}
                                    id="filled-multiline-static"
                                    label="Description"
                                    multiline
                                    rows={4}
                                    // defaultValue="Default Value"
                                    variant="outlined"
                                    onChange={handleDescription}
                                />
                                <TextField
                                    sx={{m:2}}
                                    // aria-label="Demo number input"
                                    label="Participation"
                                    placeholder="Enter a number…"
                                    type="number"
                                    value={participation}
                                    onChange={handleParticipation}
                                    variant="outlined"
                                    InputProps={{ inputProps: { min: 2, max: 20, step: 1 } }} // optional
                                />

                                <Grid container direction ="row">
                                    <Grid size={6}>
                                        <Box component={"div"} sx={{m:2}}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DateTimePicker']}>
                                                    <DateTimePicker label="Start Date & Time" disablePast onChange={handleStartDatetime}/>
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Box>
                                    </Grid>

                                    <Grid size={6}>
                                        <Box component={"div"} sx={{m:2}}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DateTimePicker']}>
                                                    <DateTimePicker label="End Date & Time" disablePast onChange={handleEndDatetime}/>
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Box>
                                    </Grid>
                                </Grid>

                            </Box>
                        </Box>
                    }

                    {/* button bottom */}
                    <Box component="div" 
                    maxWidth={250}
                    sx={{
                        position:"fixed",
                        display: "flex",
                        justifyContent: "space-between",
                        width: 2/3,
                        height: "svh",
                        bottom:0,
                        zIndex:"1000",
                        textAlign:"center",
                        // border: "2px solid black",
                        m: 5
                    }}>
                        {/* submit button */}
                        {step === 1 &&
                            <Button variant="contained" 
                            color={"info"} 
                            disabled={params.size <= 0} 
                            onClick={()=>setStep(step+1)}
                            >
                                Next
                            </Button>
                        }
                        {step === 2 &&
                            <Button variant="contained" 
                            color={"success"} 
                            onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        }

                        <Button variant="contained" color="error" onClick={()=>router.push("/")}>Cancel</Button>
                    </Box>
                </Box>
            </div>

            <Dialog
                open={openAuth}
                onClose={handleCloseAuth}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Something went wrong."}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Please, sign in.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseAuth} autoFocus>
                    OK
                </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={openFill}
                // onClose={handleCloseAuth}
                // aria-labelledby="alert-dialog-title"
                // aria-describedby="alert-dialog-description"
            >
                <DialogTitle>
                {"Something went wrong."}
                </DialogTitle>
                <DialogContent>
                <DialogContentText >
                    Please, fill all the form.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>setOpenFill(false)} autoFocus>
                    OK
                </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    )
}

export default page