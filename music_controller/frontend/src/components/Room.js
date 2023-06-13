import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { Grid, Typography, Button } from '@mui/material';
import CreateRoomPage from './CreateRoomPage';
import MusicPlayer from './MusicPlayer';


export default function Room(props) {
    const initialState = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      spotifyAuthenticated: false,
      song: {},
    }
    const [roomData, setRoomData] = useState(initialState) 
    const { roomCode } = useParams()

    const updateShowSetting = (value) => {
      setRoomData({
        ...roomData,
        showSettings: value,
      })
    };

    const getCurrentSong = () => {
      fetch('/spotify/current-song').then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setRoomData({
        ...roomData,
        song: data });
        console.log(song)
      });
    } 

    const useFetch = () => {
      getCurrentSong();
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
        });
        if (roomData.isHost) {
          authenticateSpotify();
        };
    }

    useEffect(() => {
      useFetch();
    },[roomCode, roomData.guestCanPause, roomData.isHost, roomData.votesToSkip]);

    const authenticateSpotify = () => {
      console.log('wchodze authenticate')
      fetch('/spotify/is-authenticated')
      .then((response) => response.json())
      .then((data) => {
        setRoomData({
          ...roomData,
          spotifyAuthenticated: data.status
        });

        if (!data.status) {
          fetch('/spotify/get-auth-url')
          .then((response) => response.json())
          .then((data) => {
            window.location.replace(data.url)
          })
        }
      })
    }

    const renderSettings = () => {
      return (
        <Grid container spacing={1}>
          <Grid item xs={12} align='center'>
            <CreateRoomPage 
            update={true} 
            votesToSkip={roomData.votesToSkip}
            guestCanPause={roomData.guestCanPause}
            roomCode={roomCode}
            updateCallBack={useFetch}
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
        <MusicPlayer {...roomData.song}/>
        {roomData.isHost ? renderSettingsButton() : null}
        <Grid item xs={12} align='center'>
          <Button color="secondary" variant="contained" onClick={leaveButtonPressed}> 
            Leave Room
          </Button>
        </Grid>
      </Grid>
    )
  }