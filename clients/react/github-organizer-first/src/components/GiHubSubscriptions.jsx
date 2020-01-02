import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import GitHubPagination from './GitHubPagination'
// import { queryGitHub, getPagesFromLink } from '../lib/utils'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, ListItemSecondaryAction, Divider, Checkbox, ListItemIcon, Grid } from '@material-ui/core'
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';

function GiHubSubscriptions({ showCheckbox, showPagination, subscriptions, pagesCount, handlerPaginationChanged, handlerGitHubSubSelected }) {

    // const [pagesCount, setPagesCount] = useState(10)

    // const [subscriptions, setSubscriptions] = useState([])

    // useEffect(() => {

    //     async function getDataFromGitHub() {

    //         const pageOneSubResponse = await queryGitHub('subscriptions')

    //         const pageOneSubData = await pageOneSubResponse.json()

    //         const pagesFromLink = await getPagesFromLink(pageOneSubResponse)

    //         setSubscriptions(pageOneSubData)

    //         setPagesCount(pagesFromLink)
    //     }

    //     getDataFromGitHub()

    // }, [])

    const [checked, setChecked] = React.useState(['']);

    const onListItemClicked = value => () => {
    
        const currentIndex = checked.indexOf(value);
    
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);

        handlerGitHubSubSelected(subscriptions.filter(sub => sub.html_url === value)[0])
    }

    const onPaginationChanged = (value) => {
        handlerPaginationChanged(value)
    }

    return (
        <div>
            {
                showPagination === 'both' || showPagination === 'top' ?
                    <Grid container justify="center" alignItems="center">
                        <GitHubPagination handlerPaginationChanged={onPaginationChanged} pagesCount={pagesCount} />
                    </Grid>
                    :
                    null
            }
            <List>
                {
                    subscriptions.map((repo, index) => {
                        return (
                            <React.Fragment>
                                <ListItem key={repo.id} alignItems="flex-start" button onClick={onListItemClicked(repo.html_url)}>
                                    {
                                        showCheckbox ?
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={checked.indexOf(repo.html_url) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-labelledby': repo.html_url }}
                                                />
                                            </ListItemIcon>
                                            :
                                            null
                                    }
                                    <ListItemAvatar>
                                        <Avatar src={repo.avatar_url} />
                                    </ListItemAvatar>
                                    <ListItemText primary={repo.full_name} secondary={repo.description} />
                                    <ListItemSecondaryAction key="1">
                                        <IconButton edge="end" aria-label="delete" target="_blank" href={repo.html_url}>
                                            <DeleteOutlinedIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" target="_blank" href={repo.html_url}>
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
            {
                showPagination === 'both' || showPagination === 'down' ?
                    <Grid container justify="center" alignItems="center">
                        <GitHubPagination handlerPaginationChanged={onPaginationChanged} pagesCount={pagesCount} />
                    </Grid>
                    :
                    null
            }
        </div>
    )
}

GiHubSubscriptions.propTypes = {

}

export default GiHubSubscriptions

