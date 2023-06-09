import React, { Component } from "react"
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import Info from "./Info";
import { Grid, Button, ButtonGroup, Typography, linkClasses } from "@mui/material";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
  } from "react-router-dom";
  
  export default class HomePage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        roomCode: null
      };

      // this.setState = this.setState.bind(this)
    }

    

    async componentDidMount () {
      fetch('/api/user-in-room')
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code
        })
      });
    }

  renderHomePage() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align='center'>
          <Typography variant='h3' component='h3'>
            Spotifity
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <ButtonGroup disableElevation variant='contained' color='primary'>
            <Button color='primary' to='/join' component={Link}>
              Join a Room
            </Button>
            <Button variant="contained" color='inherit' to='/info' component={Link}>
              Info
            </Button>
            <Button color='secondary' to='/create' component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    )
  }
  
    render() {
      return (
        <Router>
          <Routes>
            <Route exact path="/"
            element={ this.state.roomCode ? (<Navigate to={`/room/${this.state.roomCode}`}/>) : this.renderHomePage() }/>
            <Route path="/join" element={<RoomJoinPage />}/>
            <Route path='/info' element={<Info />}/>
            <Route path="/create" element={<CreateRoomPage />}/>
            <Route path="/room/:roomCode" element={<Room />}/>
          </Routes>
        </Router>
      );
    }
  }