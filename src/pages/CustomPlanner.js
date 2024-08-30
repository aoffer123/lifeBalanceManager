import { Box } from '@mui/material'
import React from 'react'
import Navbar from '../components/Navbar'

function CustomPlanner() {
  return (
    <Box sx={{ display: 'flex', width: '100%'}}>
        <Navbar />
        <div>CustomPlanner</div>
    </Box>
  )
}

export default CustomPlanner