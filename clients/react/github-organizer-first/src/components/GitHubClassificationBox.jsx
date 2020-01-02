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

function GitHubClassificationBox({ classificationDto, handlerClassificationSelected }) {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const badgeColorByCount = () => {
        return classificationDto.githubLinks.length > 0 ? "primary" : "secondary"
    }

    return (
        <div>
            {/* <Box style={{ marginLeft: 15, marginTop: 15 }} boxShadow={3}>
                <Grid container>
                    <Grid item>
                        <Typography gutterBottom variant="subtitle1">
                            Standard license
                        </Typography>
                    </Grid>
                </Grid>
            </Box> */}
            <Card elevation={2}>
                {/* <ButtonBase>
                    
                </ButtonBase> */}
                <CardHeader
                    title=
                    {
                        // <Typography variant="h6" >
                        //     {
                        //         classificationDto.name
                        //     }
                        // </Typography>
                        <TextField variant="outlined" size="small" label="Classification Names" defaultValue={classificationDto.name} />
                    }
                    action=
                    {
                        <IconButton onClick={() => handlerClassificationSelected(classificationDto)} aria-label={`${classificationDto.githubLinks.length} GitHub repos classified`}>
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
                        <AddBoxIcon color="primary" />
                    </IconButton>
                    <IconButton>
                        <DeleteForeverOutlinedIcon color="secondary" />
                    </IconButton>
                    <IconButton>
                        <SaveIcon />
                    </IconButton>
                </CardActions>
            </Card>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create new Classification</DialogTitle>
                <DialogContent>
                    <GiHubSubscriptions subscriptions={[]} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

GitHubClassificationBox.propTypes = {

}

export default GitHubClassificationBox

