import React from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core'

function GitHubClassificationModal() {

    const [open, setOpen] = React.useState(true);

    const [newClassificationName, setNewClassificationName] = React.useState('')

    // react components re-render when state or props changes!
    // the array parameter specify to what changes useEffect should re-run. a emty array indicates taht useEffect and his optionally return function , will runs only mount and unmount phase.
    // useEffect can return a function, that function is run before useEffect run next time.
    // React.useEffect(() => {
    //     console.log('from useEffect!');
    //     setOpen(true)
    //     console.log(open);
    // }, [open])

    const onCreateNewButtonClicked = () => {
        
    }

    const onCreateSetClassificationTextChanged = () => {

    }

    return (
        <div>
            <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create new Classification</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create a brand new classification.
                    </DialogContentText>
                    <TextField
                        onChange={(e) => setNewClassificationName(e.target.value)}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Classificatin name"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

GitHubClassificationModal.propTypes = {

}

export default GitHubClassificationModal

