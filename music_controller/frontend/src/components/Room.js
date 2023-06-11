import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { Grid, Typography, Button } from '@mui/material';
import CreateRoomPage from './CreateRoomPage';


export default function Room(props) {
    const initialState = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
    }
    const [roomData, setRoomData] = useState(initialState) 
    const { roomCode } = useParams()

    const updateShowSetting = (value) => {
      setRoomData({
        ...roomData,
        showSettings: value,
      })
    };

    const renderSettings = () => {
      return (
        <Grid container spacing={1}>
          <Grid item xs={12} align='center'>
            <CreateRoomPage 
            update={true} 
            votesToSkip={roomData.votesToSkip}
            guestCanPause={roomData.guestCanPause}
            roomCode={roomData.roomCode}
            updateCallback={ ()=> {} }
            />
          </Grid>
          <Grid item xs={12} align='center'>
            <Button variant='contained' color='secondary' onClick={() => updateShowSetting(false)}>
              Close
            </Button>
          </Grid>
        </Grid>
      )
    }

    const renderSettingsButton = () => {
      return (
        <Grid item xs={12} align='center'>
          <Button variant='contained' color='primary' onClick={() => updateShowSetting(true)}>
            Settings
          </Button>
        </Grid>
      );
    };

    const leaveButtonPressed = () => {
      const requestOptions = {
        method:'POST',
        headers: { 'Content-Type': 'application/json'},

      };
      fetch('/api/leave-room', requestOptions).then((_response) => {
        window.location.replace('/');
      });
    };
  
    useEffect(() => {
      fetch("/api/get-room" + "?code=" + roomCode)
        .then(res => {
          if (!res.ok) {
            window.location.replace('/');
          }
          return res.json()
        })
        .then(data => {
          setRoomData({
            ...roomData, 
            votesToSkip: data.votes_to_skip,
            guestCanPause: data.guest_can_pause,
            isHost: data.is_host,
          })
        })
    },[roomCode,setRoomData])
    
    
    
    //It renders when the object changes .If we use roomData and/or roomCode then it rerenders infinite times
    
    if (roomData.showSettings) {
      return renderSettings();
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <Typography variant="h4" component='h4'>
            Code: {roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <Typography variant="h6" component='h6'>
            Guest can pause: {roomData.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <Typography variant="h6" component='h6'>
            Votes to skip: {roomData.votesToSkip.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <Typography variant="h6" component='h6'>
            Host: {roomData.isHost.toString()}
          </Typography>
        </Grid>
        {roomData.isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align='center'>
          <Button color="secondary" variant="contained" onClick={leaveButtonPressed}> 
            Leave Room
          </Button>
        </Grid>
      </Grid>
    )
  }