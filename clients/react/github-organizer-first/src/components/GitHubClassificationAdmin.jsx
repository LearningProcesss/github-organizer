import React, { Component } from 'react'
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';
import GiHubSubscriptions from './GiHubSubscriptions';
import { queryGitHub, getPagesFromLink, arrayDestructuring } from '../lib/utils';
import { Grid, Fab, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@material-ui/core';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import GitHubClassificationBox from './GitHubClassificationBox';

export default class GitHubClassificationAdmin extends Component {

    state = {
        stichClient: {},
        stichMongoDb: {},
        classifications: [],
        subscriptions: [],
        subscriptionsRenderedFilter: '',
        subscriptionsSelectedToAdd: [],
        classificationSelected: {},
        pages: -1,
        canAddSubscriptions: false,
        canRenderClassificationSubscriptions: false,
        canShowStichSnack: false,
        canShowClassificationNewModal: false,
        stichOperationSucess: false,
        stichOperationMessage: '',
        newClassificationName: ''
    }

    async componentDidMount() {
        this.setupStichClient()

        await this.setupGithub()
    }

    setupStichClient() {
        if (Object.entries(this.state.stichClient).length === 0) {

            this.setState({
                stichClient: Stitch.initializeDefaultAppClient('test1-dnckz')
            }, this.loginStitch)
        }
    }

    loginStitch() {
        this.state.stichClient
            .auth
            .loginWithCredential(new AnonymousCredential())
            .then(user => {
                console.log(`logged: ${user}`)

                this.setState({
                    stichMongoDb: this.state.stichClient.getServiceClient(
                        RemoteMongoClient.factory,
                        "mongodb-atlas"
                    ).db('github')
                }, this.queryStitch)
            }, error => {

            })
    }

    async queryStitch(query = {}, updateState = true, callback) {

        let result

        try {
            result = await this.state.stichMongoDb.collection('classification').find(query).asArray()

            if (updateState) {
                this.setState({
                    classifications: result
                })
            }
        } catch (err) {

        }
    }

    async updateStitch(query = {}, update = {}) {
        const result = await this.state.stichMongoDb
            .collection('classification')
            .updateOne(query, update)

        return result
    }

    async deleteStich(query = {}) {
        const result = await this.state.stichMongoDb
            .collection('classification')
            .deleteOne(query)

        return result
    }

    async setupGithub() {

        const response = await queryGitHub('subscriptions')

        const pages = await getPagesFromLink(response)

        this.setState({
            subscriptions: arrayDestructuring(await response.json(), ''),
            pages: pages
        })
    }

    onCreate = (data) => {
        this.createNewClassification(data)
    }

    onCreateClassificationButtonClicked = () => {
        this.setState({
            canShowClassificationNewModal: true
        })
    }

    onSubscriptionsSelected = (subscriptionLink) => {
        console.log('onSubscriptionsSelected', subscriptionLink);
        const subscriptionDto = this.state.subscriptions.filter(subscription => { return subscription.html_url === subscriptionLink })[0]
        console.log('onSubscriptionsSelected', subscriptionDto);
        this.setState(state => {
            const subscriptionsSelectedToAdd = [...state.subscriptionsSelectedToAdd, subscriptionDto]

            return {
                subscriptionsSelectedToAdd
            }
        })
    }

    onClassificationSelected = (classificationDto) => {
        console.log('onClassificationSelected', classificationDto);
        this.setState({
            canAddSubscriptions: true,
            canRenderClassificationSubscriptions: true,
            classificationSelected: classificationDto
        })
    }

    onAddSubscriptions = async () => {
        const result = await this.updateStitch(
            {
                _id: { $eq: this.state.classificationSelected._id }
            },
            {
                $push: {
                    githubLinks: {
                        $each: this.state.subscriptionsSelectedToAdd
                    }
                }
            }
        )
        //TODO toaster
        console.log('onAddSubscriptions', result);
    }

    onPaginationChanged = async (value) => {
        console.log('onPaginationChanged GitHubClassificationAdmin', value);
        const response = await queryGitHub(`subscriptions?page=${value}`)

        this.setState({
            subscriptions: arrayDestructuring(await response.json(), '')
        })
    }

    onAddSubToClassification = async (classificationDto) => {

        let snackModel = {
            message: ``,
            variant: ``
        }

        try {
            const result = await this.updateStitch(
                {
                    _id: { $eq: classificationDto._id }
                },
                {
                    $addToSet: {
                        githubLinks: {
                            $each: classificationDto.githubLinks
                        }
                    }
                }
            )
            console.log('onAddSubToClassification', result);

            snackModel.message = `Updated`
            snackModel.variant = `success`
        } catch (err) {
            snackModel.message = `Error`
            snackModel.variant = `error`
        }

        this.props.handlerShowSnackBar(snackModel)

        this.setState({
            stichOperationSucess: true
        })
    }

    onDeleteClassification = async (classificationDto) => {

        let snackModel = {
            message: ``,
            variant: ``
        }

        let result

        try {
            result = await this.deleteStich({ _id: { $eq: classificationDto._id } })
            console.log(result);

            snackModel.message = `Updated`
            snackModel.variant = `success`
        } catch (err) {
            snackModel.message = `Error`
            snackModel.variant = `error`
        }

        this.props.handlerShowSnackBar(snackModel)

        if (result !== null && 'deletedCount' in result) {

            this.setState(state => {

                const subscriptionsSelectedToAdd = state.subscriptionsSelectedToAdd.filter(item => item._id !== classificationDto._id)

                const classifications = state.classifications.filter(item => item._id !== classificationDto._id)

                return {
                    subscriptionsSelectedToAdd,
                    classifications
                }
            })
        }
    }

    onHandlerDeleteSubFromClassificationClicked = async (idGitHub) => {
        console.log('onHandlereleteSubFromClassificationClicked', idGitHub, this.state.classificationSelected._id);

        let result

        try {
            result = await this.updateStitch({ _id: { $eq: this.state.classificationSelected._id } },
                {
                    $pull: {
                        githubLinks: {
                            id: idGitHub
                        }
                    }
                })

            console.log(result);

        } catch (err) {

        }

        if (result !== null && 'modifiedCount' in result && result.modifiedCount > 0) {

            this.setState(state => {

                const classifications = [...state.classifications]

                const links = classifications.filter(item => item._id === state.classificationSelected._id)[0].githubLinks.filter(item => item.id !== idGitHub)

                classifications.filter(item => item._id === state.classificationSelected._id)[0].githubLinks = links

                const classificationSelected = { ...state.classificationSelected }

                const subscriptions = classificationSelected.githubLinks.filter(item => item.id !== idGitHub)

                classificationSelected.githubLinks = [...subscriptions]

                return {
                    classifications,
                    classificationSelected
                }
            })
        }
    }

    onSearchSubscriptions = (text) => {
        this.setState({
            subscriptionsRenderedFilter: text
        })
    }

    startCreateNeClassification() {
        this.createNewClassification(this.state.newClassificationName)
        this.setState({ canShowClassificationNewModal: false })
    }

    async createNewClassification(data) {

        let result

        try {
            result = await this.state.stichMongoDb.collection('classification').insertOne({
                name: data,
                githubTopics: [],
                githubLinks: [],
                nodes: []
            })

            if ('insertedId' in result) {
                await this.queryStitch()
            }
        } catch (err) {

        }
    }

    renderSubscriptions() {
        if (!this.state.subscriptions.length || this.state.pages === -1) { return null }

        return <GiHubSubscriptions
            handlerPaginationChanged={this.onPaginationChanged}
            showCheckbox={true}
            showPagination='both'
            subscriptionsHandler={this.onSubscriptionsSelected}
            pagesCount={this.state.pages}
            subscriptions={this.state.subscriptions} />
    }

    renderClassificationSubscriptions() {
        if (!this.state.canRenderClassificationSubscriptions) { return null }

        return <GiHubSubscriptions
            handlerDeleteSubFromClassificationClicked={this.onHandlerDeleteSubFromClassificationClicked}
            handlerPaginationChanged={this.onPaginationChanged}
            subscriptionsHandler={this.onSubscriptionsSelected}
            showCheckbox={false}
            pagesCount={this.state.pages}
            clickable={false}
            classificationName={this.state.classificationSelected.name}
            subscriptions={this.state.subscriptionsRenderedFilter != '' ?
                this.state.classificationSelected.githubLinks.filter(item =>
                    item.name.includes(this.state.subscriptionsRenderedFilter)
                    ||
                    item.full_name.includes(this.state.subscriptionsRenderedFilter)
                    ||
                    item.description.includes(this.state.subscriptionsRenderedFilter)
                ) : this.state.classificationSelected.githubLinks} />
    }

    render() {
        return (
            <div>
                <Dialog open={this.state.canShowClassificationNewModal} onClose={() => this.setState({ canShowClassificationNewModal: false })} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create new Classification</DialogTitle>
                    <DialogContent>
                        <TextField
                            onChange={(e) => this.setState({ newClassificationName: e.target.value })}
                            onKeyPress={(e) => e.charCode === 13 ? this.startCreateNeClassification() : null }
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Classificatin name"
                            type="text"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ canShowClassificationNewModal: false })} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={this.startCreateNeClassification} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
                <Grid container>
                    <Grid item lg={2} md={4} sm={4} xs={4}>
                        <Grid style={{ marginTop: 10 }} container direction="column" spacing={1}>
                            <Fab onClick={this.onCreateClassificationButtonClicked} variant="extended">
                                <LibraryAddIcon />
                                Create
                            </Fab>
                            {
                                this.state.classifications.map(classification => {
                                    return (
                                        <Grid item key={classification._id}>
                                            <GitHubClassificationBox
                                                handlerSearchSubscriptions={this.onSearchSubscriptions}
                                                handlerDeleteClassification={this.onDeleteClassification}
                                                handlerAddSubToClassification={this.onAddSubToClassification}
                                                handlerPaginationChanged={this.onPaginationChanged}
                                                handlerClassificationSelected={this.onClassificationSelected}
                                                handlerGetGithubSubscrition={this.onGetGithubSubscrition}
                                                classificationDto={classification}
                                                stichOperationSucess={this.state.stichOperationSucess}
                                                gitHubDto={
                                                    {
                                                        gitHubSubscriptions: this.state.subscriptions,
                                                        gitHubPages: this.state.pages
                                                    }
                                                } />
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                    <Grid style={{ marginTop: 7 }} item lg={6} md={6} sm={6} xs={6}>
                        {
                            this.renderClassificationSubscriptions()
                        }
                    </Grid>
                </Grid>
            </div>
        )
    }
}
