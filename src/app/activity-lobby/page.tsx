"use client"

import React from 'react';
import { Box, Typography, Grid } from "@mui/material";
import SideBarNavigator from "../components/SideBarNavigator";
import ActivityCard from "../components/ActivityCard";


export default function ActivityLobby() {
  return (
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
              <ActivityCard
                username='เจ ไข่มันก้าว'
                title="เตะบอล"
                date="15/10/2025 10:12"
                place="ตึก40 ชั้น 3 KMUTNB"
                description="เตะหมูเตะหมาเตะหน้ามึงด้วย"
              />

        
        </Grid>
      </Box>
    </Box>
  );
}
