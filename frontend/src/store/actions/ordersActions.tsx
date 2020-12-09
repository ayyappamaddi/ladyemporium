import { ON_GET_ORDERS } from '../types'
import axios from 'axios'
import constants from '../../shared/constants'
import utilService from '../../shared/utils-service'


export const getOrders = () => async (dispatch: any) => {
    try {
        const res = await axios.get(`${constants.apiBasePath}/v1/orders`, { headers: { 'x-request-id': 1 } })
        dispatch({
            type: ON_GET_ORDERS,
            payload: res.data
        })
    } catch (e) {
        console.error('An Error occured while user login', e);
    }
}
