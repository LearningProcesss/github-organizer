import React from 'react'
import PropTypes from 'prop-types'
import { TextField, MenuItem } from '@material-ui/core';

function GitHubPagination({ pagesCount }) {

    const menuPages = Array.from({
        length: pagesCount
    }, (v, i) => i)

    console.log(menuPages);


    const onSelectTextChanged = (e) => {
        console.log(e);

    }

    return (
        <div>
            <TextField
                id="pagination-page-select"
                select
                label="Page"
                value={menuPages}
                onChange={onSelectTextChanged}
                helperText="Select page"
            >
                {
                    menuPages.map(page => (
                        <MenuItem key={page} value={page}>
                            {page}
                        </MenuItem>
                    ))
                }
            </TextField>
        </div>
    )
}

GitHubPagination.propTypes = {

}

export default GitHubPagination

