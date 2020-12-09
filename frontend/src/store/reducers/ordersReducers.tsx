import { ON_GET_ORDERS } from '../types'

const initialState = {
    orders: []
}

export default function (state = initialState, action: any) {

    switch (action.type) {

        case ON_GET_ORDERS:
            return {
                ...state,
                orders: [...action.payload],
            }

        default: return state
    }

}