import { ON_LOGIN_USER } from '../types'

const initialState = {
    loggedInUser: {},
    
}

export default function (state = initialState, action: any) {

    switch (action.type) {

        case ON_LOGIN_USER:
            return {
                ...state,
                ...action.payload,
            }

        default: return state
    }

}