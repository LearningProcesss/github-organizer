import React from 'react'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Grid } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function GitHubCommands(props) {

    const [open, setOpen] = React.useState(false);

    const [newClassificationName, setClassification] = React.useState("")

    const [githubLinksFromClassification, setGitHubLinksFromClassification] = React.useState([])

    const [selectedClassificationId, setSelectedClassificationsId] = React.useState({})

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const createNew = () => {

        setOpen(false);

        props.handlerClassificationCreate(newClassificationName)
    }

    const onCreateSetClassificationTextChanged = (e) => {
        setClassification(e.target.value)
    }

    // const onClassificationSelectItemChanged = (event, { _id, githubLinks, githubTopics, name, nodes }) => {
    const onClassificationSelectItemChanged = (event, classificationDto) => {
        if(classificationDto === undefined || classificationDto === null || classificationDto === {}) { return }
        console.log('onClassificationSelectItemChanged', classificationDto);

        // setGitHubLinksFromClassification(githubLinks)

        setSelectedClassificationsId(classificationDto._id)

        props.handlerClassificationSelected(classificationDto)
    }

    const onSearchTextChanged = (e) => {
        props.search(e.target.value)
    }

    const onAddButtonClicked = () => {
        props.handlerAddSubscription()
    }

    return (
        <div>
            {//style={{ marginTop: 15, marginLeft: 5, marginBottom: 10 }}
                props.classificationPanel ?
                    <div>
                        <Grid style={{ marginTop: 15 }} container spacing={2} justify="center" alignItems="center">
                            <Grid item>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={props.classifications}
                                    getOptionLabel={classification => `${classification.name} (${classification.githubLinks.length})`}
                                    renderInput={params => (
                                        <TextField {...params} size="small" label="Classifications" variant="outlined" fullWidth />
                                    )}
                                    onChange={onClassificationSelectItemChanged}
                                />
                            </Grid>
                            <Grid item>
                                <Button color="primary" onClick={handleClickOpen} >Create</Button>
                                <Button color="secondary" onClick={handleClickOpen} >Modify</Button>
                                <Button onClick={onAddButtonClicked} disabled={!props.canAddSubscriptions} color="default" >Add..</Button>
                            </Grid>
                        </Grid>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Create new Classification</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Create a brand new classification.
                                </DialogContentText>
                                <TextField
                                    onChange={onCreateSetClassificationTextChanged}
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Classificatin name"
                                    type="text"
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="secondary">
                                    Cancel
                                </Button>
                                <Button onClick={createNew} color="primary">
                                    Create
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    :
                    <TextField style={{ marginTop: 15, marginLeft: 5, marginBottom: 10 }} size="small" variant="outlined" label="Search" onChange={onSearchTextChanged} />

            }
        </div>
    )
}