import { Box } from '@mui/material'
import React from 'react'
import Navbar from '../components/Navbar'

function Family() {
  return (
    <Box sx={{ display: 'flex', width: '100%'}}>
        <Navbar />
        <div>Family</div>
    </Box>
  )
}

export default Family