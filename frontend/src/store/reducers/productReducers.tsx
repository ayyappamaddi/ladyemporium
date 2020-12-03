import { GET_PRODUCTS, POST_PRODUCT, SELECT_PRODUCTS } from '../types'

const initialState = {
    products: {},
    loading: true,
    selectedProduct: {}
}

export default function (state = initialState, action: any) {

    switch (action.type) {

        case GET_PRODUCTS:
            return {
                ...state,
                products: action.payload,
                loading: false

            }
        case SELECT_PRODUCTS:
            return {
                ...state,
                selectedProduct: action.payload
            }

        case POST_PRODUCT:
            const a = {
                ...state,
                products: { ...state.products, ...action.payload },
                loading: false
            };

            return JSON.parse(JSON.stringify(a));
        default: return state
    }

}