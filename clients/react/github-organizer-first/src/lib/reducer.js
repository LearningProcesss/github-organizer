
export const initialState = {
    classificationsFetched: [],
    githubReposToShowFromClass: [],
    githubReposToAddToClass: [],
    createNewClassificationWithName: ''
}

export function appReducer(state, action) {
    switch (action.type) {
        case 'createNewClassification':

            return [
                ...state,
                {
                    name: action.payload.name,
                    githubTopics: [],
                    githubLinks: [],
                    nodes: []
                }
            ]

        default:
            return state
    }
}