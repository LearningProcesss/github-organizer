import _ from 'lodash';

export function objectToArray(data) {
    return Object.entries(data).map(([key, value]) => ({ key, value }))
}

export function groupBy(data) {

    return new Promise(function (resolve, reject) {
        let topics = []

        data.forEach(repo => {
            repo.topics.forEach(topic => {
                topics.push({
                    topic: topic,
                    repo: repo.full_name,
                    url: repo.html_url,
                    description: repo.description,
                    avatarUrl: repo.owner.avatar_url
                })
            })
        })

        resolve(_.groupBy(topics, 'topic'))
    })
}

/**
 * order an array by a property.
 * @param {Array} data 
 * @param {String} orderBy 
 */
export function orderBy(data, orderBy) {
    return data.sort((a, b) => {
        return b.value.length - a.value.length
    })
}

/**
 * 
 * @param {string} url subscriptions (/ char automatically added)
 * @param {string} method POST,GET,PUT,PATCH,DELETE
 * @param {object} headers { Accept: '' }
 */
export function queryGitHubPromise(url, method = 'GET', headers = { Accept: 'application/vnd.github.mercy-preview+json' }) {

    const baseUrl = "https://api.github.com/users/learningprocesss"
    console.log('process 2');
    
    return fetch(`${baseUrl}/${url}`, {
        method: method,
        headers: headers
    })
}

/**
 * 
 * @param {string} url subscriptions (/ char automatically added)
 * @param {string} method POST,GET,PUT,PATCH,DELETE
 * @param {object} headers { Accept: '' }
 */
export async function queryGitHub(url, method = 'GET', headers = { Accept: 'application/vnd.github.mercy-preview+json' }) {

    const baseUrl = "https://api.github.com/users/learningprocesss"

    const response = await fetch(`${baseUrl}/${url}`, {
        method: method,
        headers: headers
    })

    return response
}

/**
 * 
 * @param {Response} response 
 */
export async function getPagesFromLink(response) {

    const linkHeader = await response.headers.get("link")

    if (linkHeader === undefined || linkHeader === null) { return }

    const paginationData = linkHeader.split(',')
        .map(link => { return link.split(';')[0] })
        .map(link => { return link.replace('<', '').replace('>', '') })
        .map(link => {
            return {
                link: link,
                number: link.split('=')[1]
            }
        })

    const max = paginationData.reduce(function (prev, current) {
        return (prev.number < current.number) ? prev : current
    })
    
    return Number(max.number)
}

/**
 * 
 * @param {[{}]} arrayObjects 
 * @param  {string[]} paths 
 */
export function arrayDestructuring(arrayObjects, ...paths) {
    
    return arrayObjects.map(({ id, name, full_name, description, html_url, topics, owner: { avatar_url } }) => {
        return {
            id,
            name,
            full_name,
            avatar_url,
            description,
            html_url,
            topics
        }
    })

    // console.log(result);

}