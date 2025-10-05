"use client"
import dynamic from "next/dynamic";
import { Box, Button, TextField } from "@mui/material"
import { ChangeEventHandler } from "react";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";

import { useRouter, useSearchParams} from 'next/navigation'
import { useState } from "react";


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
    const [datetime, setDatetime] = useState<Date | null>(null);

    const [step, setStep] = useState<number | null>(1)

    // handle function
    const handleSubmit = () => {
        if (!(title === "" || location === "" || description === "" || datetime === null)){
            router.push("/")
        }
    }
    
    const handleStep = () => {
        if (step == 1){
            setStep(step+1)
        }
    }

    const handleTitle = (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => {
        setTitle(event.target.value)
        console.log(event.target.value)
    }

    const handleLocation = (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocation(event.target.value)
        console.log(event.target.value) 
    }

    const handleDescription = (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => {
        setDescription(event.target.value)
        console.log(event.target.value) 
    }

    const handleParticipation = (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => {
        setParticipation(event.target.value)
        console.log(event.target.value)
    }

    const handleDatetime = (date: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | Date>) => {
        setDatetime(date)
        console.log(dayjs(date).format()) 
    }

    return (
        <div>
            <Box component="div" 
            sx={{
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
                    backgroundColor:"white",
                    border: "2px solid black",
                    borderRadius: 10,
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
                        width: 1,
                        mt:10,
                        // border: "2px solid red",
                        }}>
                        <Box component="div" sx={{display: "flex", flexWrap:"wrap", flexDirection:"column",}}>
                            <TextField
                                // required
                                // id="outlined-required"
                                sx={{m:2}}
                                label="Title"
                                variant="filled"
                                onChange={handleTitle}
                            />
                            <TextField
                                // required
                                // id="outlined-required"
                                sx={{m:2}}
                                label="Location"
                                variant="filled"
                                onChange={handleLocation}
                            />
                            <TextField
                                sx={{m:2}}
                                id="filled-multiline-static"
                                label="Description"
                                multiline
                                rows={4}
                                // defaultValue="Default Value"
                                variant="filled"
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
                                variant="filled"
                                InputProps={{ inputProps: { min: 2, max: 20, step: 1 } }} // optional
                            />
                            <Box component={"div"} sx={{m:2}}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['DateTimePicker']}>
                                        <DateTimePicker label="Start datetime" onChange={handleDatetime}/>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Box>
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
                        onClick={handleStep}
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
    )
}

export default page