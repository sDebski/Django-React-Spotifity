import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const pages = {
    JOIN: 'pages.join',
    CREATE: 'pages.create'
}

export default function Info(props) {

    const [page, setPage] = useState(pages.JOIN);

    function joinInfo() {
        return 'To join a room you need a special room code. After joining you can manage the music if the room has such priviliges for guest.';
    }

    function createInfo() {
        return 'When you create room you need to login to your spotify account to manage music with your friends from the app.';
    }


    return <Grid container spacing={1}>
        <Grid item xs={12} align="center">
            <Typography component='h4' variant='h4'>
                What is Spotifity?
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <Typography variant='body1'>
                { page === pages.JOIN ? joinInfo() : createInfo() }
            </Typography>
        </Grid>
        <Grid item xs={12} align="center">
            <IconButton onClick={() => { page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE)}}>
            { page === pages.CREATE ?  (<ArrowCircleLeftIcon />) : (<ArrowCircleRightIcon/>) }
            </IconButton>
        </Grid>
        <Grid item xs={12} align="center">
            <Button color='secondary' variant='contained' to='/' component={Link}>
                Back
            </Button>    
        </Grid>
    </Grid>
}