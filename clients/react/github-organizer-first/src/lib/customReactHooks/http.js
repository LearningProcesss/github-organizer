
import { useState } from 'react'

export const useHttp = ({ url, headersToExtract = [] }) => {

    const [fetchedData, setFetchedData] = useState([])
    const [responseHeader, setResponseHeader] = useState([])

    fetch(url)
        .then(response => {

            if (headersToExtract.length > 0) {
                setResponseHeader(headersToExtract.map(header => { return { name: header, value: response.headers.get(header) } }))
            }

            return response.json()
        }).then(responseJson => {
            setFetchedData(responseJson)
        }).catch(rejected => {

        })

    return [responseHeader, fetchedData]
}