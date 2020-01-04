import React from 'react'
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';

export default class Header extends React.Component {

    render() {
        return (
            <div style={{ flexGrow: 1 }}>
                <AppBar position="sticky" color="default">
                    <Toolbar>
                        <IconButton edge="start" style={{ marginRight: 10 }} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" style={{ flexGrow: 1 }}>
                            Github Repo Organizer
                        </Typography>
                        <Button onClick={this.props.handlerCreateNewClassification} color="inherit">Create</Button>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}
