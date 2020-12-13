import { ON_GET_ORDERS, ON_UPDATE_ORDERS, ON_SEARCH_ORDERS } from '../types'

const initialState: any = {
    orders: []
}

export default function (state = initialState, action: any) {

    switch (action.type) {

        case ON_GET_ORDERS:
            return {
                ...state,
                orders: [...action.payload],
            }
        case ON_SEARCH_ORDERS:
            return {
                ...state,
                searchOrders: [...action.payload]
            }
        case ON_UPDATE_ORDERS:
            const orders = state.orders;
            const updatedOrders = action.payload;
            for (let i = 0; i < updatedOrders.length; i++) {
                for (let j = 0; j < orders.length; j++) {
                    if (updatedOrders[i].orderId === orders[j].orderId) {
                        orders[j] = { ...orders[j], ...updatedOrders[i] };
                    }
                }
            }
            return { ...state, orders }
            break;
        default: return state
    }

}