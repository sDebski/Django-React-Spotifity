import React, { Component } from "react"
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { TextField, FormHelperText, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default class CreateRoomPage extends Component {
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallBack: () => {}
    }

    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
        };

        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuesCanPauseChange = this.handleGuesCanPauseChange.bind(this);
    }

    handleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value,
        });
    }

    handleGuesCanPauseChange(e) {
        this.setState({
            guestCanPause: e.target.value == 'true' ? true : false,
        })
    }

    renderUpdateButtons = () => {
        return ( 
            <Grid item xs={12} align="center">
                <Button 
                color="primary" 
                variant="contained" 
                onClick={this.handleRoomButtonPressed}> 
                    Update a Room
                </Button>
            </Grid>
    
        );
    }

    renderCreateButtons = () => {
        return ( 
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleRoomButtonPressed}> 
                        Create a Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}> 
                        Back
                    </Button>
                </Grid>
            </Grid>      
            );
    }

    handleRoomButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'votes_to_skip': this.state.votesToSkip,
                'guest_can_pause': this.state.guestCanPause
            }),
        };
        fetch('/api/create-room', requestOptions)
        .then((response) =>
            response.json()
        )
        .then((data) => {
            window.location.replace('/room/' + data.code);
        });
    }

    render () {
        const title = this.props.update ? "Update Room" : "Create a Room"
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography component='h4' variant='h4'>
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component="span">
                        <FormHelperText>
                            Guest Control of Playback State
                        </FormHelperText>
                        <RadioGroup row defaultValue="true" onChange={this.handleGuesCanPauseChange}>
                            <FormControlLabel 
                                value='true' 
                                control={<Radio color="primary"/>}
                                label='Play/Pause'
                                labelPlacement='bottom' />
                            <FormControlLabel 
                                value='false' 
                                control={<Radio color="secondary"/>}
                                label='No Control'
                                labelPlacement='bottom' />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component='span'>
                        <TextField 
                        required={true} 
                        type='number' 
                        defaultValue={this.state.votesToSkip}
                        onChange={this.handleVotesChange}
                        inputProps={{
                                min:1,
                                style: {
                                    textAlign: "center"
                                }
                            }}>
                        </TextField>
                        <FormHelperText align='center'>
                            Votes Required To Skip Song
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {this.props.update ? 
                this.renderUpdateButtons() : 
                this.renderCreateButtons()}
            </Grid>
        );
    }
}



