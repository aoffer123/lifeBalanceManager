import { Box } from '@mui/material'
import React from 'react'
import Navbar from '../components/Navbar'

function GoalsHabits() {
  return (
    <Box sx={{ display: 'flex', width: '100%'}}>
        <Navbar />
        <div>Goals and Habits</div>
    </Box>
  )
}

export default GoalsHabits