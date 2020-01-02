import React, { Component } from 'react'
import { Stitch, AnonymousCredential, RemoteMongoClient } from 'mongodb-stitch-browser-sdk';
import GitHubCommands from './GitHubCommands';
import GiHubSubscriptions from './GiHubSubscriptions';
import { queryGitHub, getPagesFromLink, arrayDestructuring } from '../lib/utils';
import { Grid } from '@material-ui/core';
import GitHubClassificationBox from './GitHubClassificationBox';

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
        canRenderClassificationSubscriptions: false
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
        const result = await this.updateStitch({
            _id: { $eq: this.state.classificationSelected._id }
        }, {
            $push: {
                githubLinks: { $each: this.state.subscriptionsSelectedToAdd }
            }
        })
        console.log('onAddSubscriptions', result);
    }

    onPaginationChanged = async (value) => {
        console.log('onPaginationChanged', value);
        const response = await queryGitHub(`subscriptions?page=${value}`)

        this.setState({
            subscriptions: arrayDestructuring(await response.json(), '')
        })
    }

    onGetGithubSubscrition = async () => {
        
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
            subscriptions={this.state.classificationSelected.githubLinks} />
    }

    render() {
        return (
            <div>
                {/* <GitHubCommands
                    handlerClassificationSelected={this.onClassificationSelected}
                    handlerAddSubscription={this.onAddSubscriptions}
                    handlerClassificationCreate={this.onCreate}
                    classificationPanel={this.props.classificationPanel}
                    classifications={this.state.classifications}
                    canAddSubscriptions={this.state.canAddSubscriptions} /> */}
                <Grid container>
                    <Grid item lg={2} md={4} sm={4} xs={4}>

                        {/* // this.renderSubscriptions() */}
                        <Grid style={{ marginTop: 10 }} container direction="column" spacing={1}>
                            {
                                this.state.classifications.map(classification => {
                                    return (
                                        <Grid item key={classification._id}>
                                            <GitHubClassificationBox
                                                handlerClassificationSelected={this.onClassificationSelected}
                                                handlerGetGithubSubscrition={this.}
                                                classificationDto={classification} />
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
