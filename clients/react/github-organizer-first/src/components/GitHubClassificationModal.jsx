import React from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core'

function GitHubClassificationModal({ canOpen }) {

    console.log(canOpen);
    

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false)
    }

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
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={onCreateNewButtonClicked} color="primary">
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

