import React, { Component } from 'react'
// import _ from 'lodash'
import Button from '@material-ui/core/Button';
import GitHubTopicList from './GitHubTopicList';
import { IconButton, Grid, List, ListItem, Avatar, ListItemAvatar, Divider, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import GitHubClassificationAdmin from './GitHubClassificationAdmin';


export default class GitHubWatching extends Component {

    state = {
        showRepo: false,
        showGithubTopics: false,
        showClassification: false,
        topicToShow: {}
    }

    onShowGithubTopics = (e) => {
        this.setState({
            showGithubTopics: true,
            showClassification: false
        })
    }

    onShowCustomClassification = (e) => {
        this.setState({
            showGithubTopics: false,
            showClassification: true
        })
    }

    onListSelected = (repos) => {
        this.setState({
            topicToShow: repos,
            showRepo: true
        })
    }

    render() {
        return (
            <div>
                <Grid container>
                    <Grid item={true} lg={12} xs={12} sm={12}>
                        {/* <Button style={{ marginTop: 10, marginLeft: 9 }} variant="contained" color="primary" onClick={this.onShowGithubTopics}>GitHub Topic</Button>
                        <Button style={{ marginTop: 10, marginLeft: 9 }} variant="contained" color="secondary" onClick={this.onShowCustomClassification}>Classification</Button> */}
                        <GitHubClassificationAdmin classificationPanel={true}/>
                    </Grid>
                    {/* <Grid item={true} lg={4} md={4} xs={4} sm={4}>
                        {
                            this.state.showGithubTopics ?
                                <GitHubTopicList listSelected={this.onListSelected} classificationPanel={this.state.showClassification}/>
                                :
                            this.state.showClassification ?
                                <GitHubClassificationAdmin classificationPanel={this.state.showClassification}/>
                                :
                                null
                        }
                    </Grid> */}
                    <Grid item={true} lg={6} md={6} xs={6} sm={6}>
                        {
                            this.state.showRepo ?

                                <List>
                                    {
                                        this.state.topicToShow.value.map((repo, index) => {
                                            return (
                                                <React.Fragment>
                                                    <ListItem alignItems="flex-start">
                                                        <ListItemAvatar>
                                                            <Avatar src={repo.avatarUrl} />
                                                        </ListItemAvatar>
                                                        <ListItemText primary={repo.repo} secondary={repo.description} />
                                                        <ListItemSecondaryAction>
                                                            <IconButton edge="end" aria-label="delete" target="_blank" href={repo.url}>
                                                                <OpenInBrowser />
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                    <Divider variant="inset" component="li" />
                                                </React.Fragment>
                                            )
                                        })
                                    }
                                </List>

                                : null
                        }
                    </Grid>
                </Grid>
            </div>
        )
    }
}

