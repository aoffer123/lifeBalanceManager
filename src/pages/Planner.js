import { Box, Grid } from '@mui/material'
import React from 'react'
import Navbar from '../components/Navbar'
import CalendarPage from '../components/CalendarPage'

function Planner() {
  return (
    <Box sx={{ display: 'flex', width: '100%'}}>
        <Navbar />
        <Box component="main" sx={{width: '100%', padding: 2, height: '100vh', overflow: 'auto', backgroundColor: "#F3F5FC"}}>
          <Grid container columns={18} spacing={1.5}>
            <Grid item xs={18}>
                <CalendarPage />
            </Grid>
          </Grid>
        </Box>
    </Box>
  )
}

export default Planner