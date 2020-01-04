import React, { Component } from 'react'
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';
import GiHubSubscriptions from './GiHubSubscriptions';
import { queryGitHub, getPagesFromLink, arrayDestructuring } from '../lib/utils';
import { Grid, Fab } from '@material-ui/core';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import GitHubClassificationBox from './GitHubClassificationBox';
import SnackOperation from './SnackOperation';
import GitHubClassificationModal from './GitHubClassificationModal';

export default class GitHubClassificationAdmin extends Component {

    state = {
        stichClient: {},
        stichMongoDb: {},
        classifications: [],
        subscriptions: [],
        subscriptionsSelectedToAdd: [],
        classificationSelected: {},
        pages: -1,
        canAddSubscriptions: false,
        canRenderClassificationSubscriptions: false,
        canShowStichSnack: false,
        canShowClassificationNewModal: false,
        stichOperationSucess: false,
        stichOperationMessage: '',
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

    queryStitch(query = {}, updateState = true, callback) {
        this.state.stichMongoDb.collection('classification').find(query).asArray().then(result => {
            if (updateState) {
                this.setState({
                    classifications: result
                })
            }
        }, error => {

        })
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

                return {
                    subscriptionsSelectedToAdd
                }
            })
        }
    }

    createNewClassification(data) {
        this.state.stichMongoDb.collection('classification').insertOne({
            name: data,
            githubTopics: [],
            githubLinks: [],
            nodes: []
        }).then(result => {

        }, error => {
            console.log(error);
        })
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
            handlerPaginationChanged={this.onPaginationChanged}
            subscriptionsHandler={this.onSubscriptionsSelected}
            showCheckbox={false}
            pagesCount={this.state.pages}
            clickable={false}
            subscriptions={this.state.classificationSelected.githubLinks} />
    }

    render() {
        return (
            <div>
                {
                    this.state.canShowClassificationNewModal ?
                        <GitHubClassificationModal canOpen={true} />
                        :
                        null
                }
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
