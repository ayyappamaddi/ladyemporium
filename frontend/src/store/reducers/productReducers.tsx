import { GET_PRODUCTS, POST_PRODUCT, SELECT_PRODUCTS, DELETE_PRODUCT, UPDATE_PRODUCT } from '../types'

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
        case UPDATE_PRODUCT:
            return {
                ...state,
                products: { ...state.products, ...action.payload },
                loading: false
            }
        case DELETE_PRODUCT:
            const currentProducts: any = state.products;

            delete currentProducts[action.payload.productId];
            return { ...state, products: currentProducts };
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