import React, { Component } from 'react'
import { List, ListItem, ListItemIcon, ListItemText, ButtonGroup, Button } from '@material-ui/core'
import StarBorder from '@material-ui/icons/StarBorder';
import GitHubCommands from './GitHubCommands';
import { objectToArray, groupBy, orderBy } from '../lib/utils'

export default class GitHubTopicList extends Component {

    state = {
        grouped: [],
        groupedFiltered: [],
        currentPage: 1
    }

    async fetchGitHubApi() {

        const response = await fetch('https://api.github.com/users/learningprocesss/subscriptions', {
            method: 'GET',
            headers: {
                Accept: 'application/vnd.github.mercy-preview+json'
            }
        })

        return await response.json()
    }

    async componentDidMount() {
        this.setState({
            grouped: orderBy(objectToArray(await groupBy(await this.fetchGitHubApi())), '')
        })

        this.setState({
            groupedFiltered: this.state.grouped.slice(0, 12)
        })
    }

    onSearchInputChanged = (searchText) => {
        this.setState({
            groupedFiltered: this.state.grouped.filter(topic => topic.key.includes(searchText)).slice(0, 12)
        })
    }

    render() {
        return (
            <div>
                <GitHubCommands search={this.onSearchInputChanged} classificationPanel={this.props.classificationPanel} />
                <List component="nav">
                    {
                        this.state.groupedFiltered.slice(0, 12).map(topicGrp => {
                            return (
                                <ListItem onClick={this.props.listSelected.bind(this, { key: topicGrp.key, value: topicGrp.value })} key={topicGrp.key} button>
                                    <ListItemIcon>
                                        <StarBorder />
                                    </ListItemIcon>
                                    <ListItemText key={topicGrp.key} primary={`${topicGrp.key} (${topicGrp.value.length})`} />
                                </ListItem>
                            )
                        })
                    }
                </List>
                <ButtonGroup style={{ marginLeft: 5, marginBottom: 5 }} variant="contained" color="primary" aria-label="contained primary button group">
                    <Button style={{ marginRight: 10 }} disabled>Prev</Button>
                    <Button>Next</Button>
                </ButtonGroup>
            </div>
        )
    }
}