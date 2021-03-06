import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import AddBoxIcon from '@material-ui/icons/AddBox';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Typography, Card, CardHeader, CardContent, TextField, InputAdornment, CardActions, IconButton, Badge, ButtonBase, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core'
import GiHubSubscriptions from './GiHubSubscriptions';

function GitHubClassificationBox({ classificationDto, gitHubDto, stichOperationSucess,
    handlerSearchSubscriptions,
    handlerAddSubToClassification,
    handlerPaginationChanged,
    handlerClassificationSelected,
    handlerDeleteClassification }) {

    const [open, setOpen] = React.useState(false);

    const [subscriptionsToAdd, setSubscriptionsToAdd] = React.useState([])

    const [cardElevation, setCardElevation] = React.useState(1)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const badgeColorByCount = () => {
        return classificationDto.githubLinks.length > 0 ? "primary" : "secondary"
    }

    const onPaginationChanged = async (value) => {
        console.log('onPaginationChanged GitHubClassificationBox', value);
        handlerPaginationChanged(value)
    }

    const onGitHubItemSelected = (value) => {
        console.log('onGitHubItemSelected GitHubClassificationBox', value);

        setSubscriptionsToAdd(previousStateArray => [...previousStateArray, value])
    }

    const onDialogSaveButtonClicked = (value) => {

        classificationDto.githubLinks.push(...subscriptionsToAdd)

        setOpen(false)

        setSubscriptionsToAdd([])

        handlerAddSubToClassification(classificationDto)
    }

    const onButtonDeleteClicked = () => {
        handlerDeleteClassification(classificationDto)
    }

    const onSearchTextChanged = (value) => {
        handlerSearchSubscriptions(value)
    }

    return (
        <div>
            <Card elevation={cardElevation} onMouseOver={() => setCardElevation(5)} onMouseLeave={() => setCardElevation(1)}>
                <CardHeader
                    title=
                    {
                        <TextField variant="outlined" size="small" label="Classification Names" defaultValue={classificationDto.name} />
                    }
                    action=
                    {
                        <IconButton onClick={() => {
                            handlerClassificationSelected(classificationDto)
                            setCardElevation(5)
                        }
                        } aria-label={`${classificationDto.githubLinks.length} GitHub repos classified`}>
                            <Badge badgeContent={classificationDto.githubLinks.length} showZero color={badgeColorByCount()}>
                                <GitHubIcon />
                            </Badge>
                        </IconButton>
                    }
                />
                <CardContent>
                    <TextField
                        id="input-with-icon-textfield"
                        label="Search"
                        onChange={(e) => onSearchTextChanged(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchTwoToneIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </CardContent>
                <CardActions>
                    <IconButton onClick={() => handleClickOpen()} >
                        <AddBoxIcon fontSize="large" color="primary" />
                    </IconButton>
                    <IconButton onClick={onButtonDeleteClicked}>
                        <DeleteForeverOutlinedIcon color="secondary" />
                    </IconButton>
                    <IconButton onClick={onDialogSaveButtonClicked} disabled={subscriptionsToAdd.length == 0}>
                        <Badge badgeContent={stichOperationSucess ? 0 : subscriptionsToAdd.length} color="secondary">
                            <SaveIcon fontSize="large" />
                        </Badge>
                    </IconButton>
                </CardActions>
            </Card>
            <Dialog onKeyPress={(e) => e.charCode === 13 ? onDialogSaveButtonClicked() : null} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Classify these repos as: {classificationDto.name}</DialogTitle>
                <DialogContent>
                    <GiHubSubscriptions
                        handlerGitHubSubSelected={onGitHubItemSelected}
                        handlerPaginationChanged={onPaginationChanged}
                        itemActions={
                            {
                                delete: false,
                                show: true
                            }
                        }
                        showTopBox={false}
                        showCheckbox={true}
                        showPagination="both"
                        subscriptions={gitHubDto.gitHubSubscriptions}
                        clickable={true}
                        itemsSelected={subscriptionsToAdd}
                        itemDisabled={classificationDto.githubLinks.map(sub => sub.id)}
                        pagesCount={gitHubDto.gitHubPages} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Dismiss
                    </Button>
                    <Button onClick={onDialogSaveButtonClicked} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

GitHubClassificationBox.propTypes = {

}

export default GitHubClassificationBox

