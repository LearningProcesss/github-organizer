import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { palette, borders } from '@material-ui/system';
import GitHubPagination from './GitHubPagination'
// import { queryGitHub, getPagesFromLink } from '../lib/utils'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, IconButton, ListItemSecondaryAction, Divider, Checkbox, ListItemIcon, Grid, Box, Button, Typography } from '@material-ui/core'
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';

function GiHubSubscriptions({
    clickable,
    itemActions,
    itemDisabled,
    itemsSelected,
    showTopBox,
    showCheckbox,
    showPagination,
    subscriptions,
    pagesCount,
    classificationName,
    handlerPaginationChanged,
    handlerGitHubSubSelected,
    handlerDeleteSubFromClassificationClicked }) {

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

        if (!clickable) { return }

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

    const onDeleteSubFromClassificationClicked = (idGitHub) => {
        console.log('onDeleteSubFromClassificationClicked', idGitHub);

        handlerDeleteSubFromClassificationClicked(idGitHub)
    }

    const canShowPagination = () => {
        if (showPagination === 'both' || showPagination === 'top') {
            return <GitHubPagination handlerPaginationChanged={onPaginationChanged} pagesCount={pagesCount} />
        }
    }

    const canShowDisplayButton = (html_url) => {
        if (itemActions.show) {
            return (
                <IconButton edge="end" aria-label="delete" target="_blank" href={html_url}>
                    <OpenInBrowser />
                </IconButton>
            )
        }
    }

    const canShowDeleteButton = (id) => {
        if (itemActions.delete) {
            return (
                <IconButton edge="end" aria-label="delete" target="_blank" onClick={onDeleteSubFromClassificationClicked.bind(null, id)}>
                    <DeleteOutlinedIcon />
                </IconButton>
            )
        }
    }

    const canShowTopPanel = () => {
        if (showTopBox) {
            return (
                <Box textAlign="center" borderRadius="borderRadius" boxShadow={3} bgcolor="success.main" color="success.contrastText" p={2}>
                    <Typography variant="caption" align="center">
                        {
                            classificationName
                        }
                    </Typography>

                </Box>
            )
        }
    }

    return (
        <div>
            {
                canShowTopPanel()
            }

            <Grid container justify="center" alignItems="center">
                {
                    canShowPagination()
                }
            </Grid>
            <List>
                {
                    subscriptions.map((repo, index) => {
                        return (
                            <React.Fragment>
                                <ListItem key={repo.id}
                                    disabled=
                                    {
                                        itemDisabled.indexOf(repo.id) >= 0
                                    }
                                    alignItems="flex-start"
                                    button={clickable}
                                    onClick=
                                    {
                                        onListItemClicked(repo.html_url)
                                    }
                                >
                                    {
                                        showCheckbox ?
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={checked.indexOf(repo.html_url) !== -1 || itemsSelected.map(item => item.html_url).indexOf(repo.html_url) !== -1}
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
                                        {
                                            canShowDisplayButton(repo.html_url)
                                        }
                                        {
                                            canShowDeleteButton(repo.id)
                                        }
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider key={index + 1} variant="inset" component="li" />
                            </React.Fragment>
                        )
                    })
                }
            </List>
            <Grid container justify="center" alignItems="center">
                {
                    canShowPagination()
                }
            </Grid>
        </div>
    )
}

GiHubSubscriptions.defaultProps = {
    itemActions: {
        delete: true,
        show: true
    },
    itemDisabled: []
}

GiHubSubscriptions.propTypes = {

}

export default GiHubSubscriptions

