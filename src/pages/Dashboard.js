import { Box } from '@mui/material'
import React from 'react'
import Navbar from '../components/Navbar'
import RoutinesCard from '../components/RoutinesCard'
import Grid from '@mui/material/Grid';
import CreateTask from '../components/CreateTask';
import CreateAppointment from '../components/CreateAppointment';
import Schedule from '../components/Schedule'


function Dashboard() {

  return (
    <Box sx={{ display: 'flex', width: '100%', backgroundColor: "#F5F6FA"}}>
        <Navbar />
        <Box component="main" sx={{width: '100%', padding: 2, height: '100vh', overflow: 'auto', backgroundColor: "#F3F5FC"}}>
          <Grid container columns={18} spacing={1.5}>
            <Grid item xs={6}>
              <RoutinesCard />
            </Grid>
            <Grid item xs={6}>
              <Schedule />
            </Grid>
          </Grid>
        </Box>
    </Box>
  )
}

export default Dashboard