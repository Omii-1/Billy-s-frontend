import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function Loader() {
  return (
    <div className='w-full min-h-[83vh] flex justify-center items-center bg-zinc-900'>
      <Box sx={{ display: 'flex' }} >
        <CircularProgress />
      </Box>
    </div>
  )
}

export default Loader