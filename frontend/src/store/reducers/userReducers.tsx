import { ON_LOGIN_USER, ON_LOGOUT_USER } from '../types'

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
        case ON_LOGOUT_USER:
            return {
                loggedInUser: {}
            }

        default: return state
    }

}