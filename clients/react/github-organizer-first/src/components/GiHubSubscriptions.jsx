import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import GitHubPagination from './GitHubPagination'
// import { queryGitHub, getPagesFromLink } from '../lib/utils'
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, ListItemSecondaryAction, Divider, Checkbox, ListItemIcon } from '@material-ui/core'
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';

function GiHubSubscriptions({ subscriptions, pagesCount, subscriptionsHandler }) {

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
        console.log('onListItemClicked', value);
        
        const currentIndex = checked.indexOf(value);
        console.log('[0]', currentIndex);
        const newChecked = [...checked];
        console.log('[1]', newChecked);
        
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        
        console.log('[2]', newChecked);
        
        setChecked(newChecked);
        
        subscriptionsHandler(value)
    }

    return (
        <div>
            <List>
                {
                    subscriptions.map((repo, index) => {
                        return (
                            <React.Fragment>
                                <ListItem key={repo.id} alignItems="flex-start" button onClick={onListItemClicked(repo.html_url)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked.indexOf(repo.html_url) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': repo.html_url }}
                                        />
                                    </ListItemIcon>
                                    <ListItemAvatar>
                                        <Avatar src={repo.avatar_url} />
                                    </ListItemAvatar>
                                    <ListItemText primary={repo.full_name} secondary={repo.description} />
                                    <ListItemSecondaryAction>
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
            <GitHubPagination pagesCount={pagesCount} />
        </div>
    )
}

GiHubSubscriptions.propTypes = {

}

export default GiHubSubscriptions

