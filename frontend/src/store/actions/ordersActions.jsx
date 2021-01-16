import { ON_GET_ORDERS, ON_UPDATE_ORDERS, ON_SEARCH_ORDERS } from '../types'
import axios from 'axios'
import constants from '../../shared/constants'
import { async } from 'rxjs'

export const trackOder = (searchKey) => async (dispatch) => {
    try {
        const res = await axios.post(`${constants.apiBasePath}/v1/orders/search`, { searchTerm: searchKey }, { headers: { 'x-request-id': 1 } })
            .catch(error => {
                console.log(error.response.data.error)
                throw error;
            })
        const filteredOrders = (res && res.data && res.data.length) ? res.data : [];
        for (let i = 0; i < filteredOrders.length; i++) {
            const d = new Date(filteredOrders[i].orderDate);
            filteredOrders[i].orderDateTime = `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes()}`;
        }
        dispatch({
            type: ON_SEARCH_ORDERS,
            payload: filteredOrders
        });
        return filteredOrders;

    } catch (e) {
        console.error('An Error occured while user login', e);
        throw e;
    }
}
export const dispatchOrders = (ordersList) => async (dispatch) => {
    try {
        const res = await axios.put(`${constants.apiBasePath}/v1/orders`, ordersList, { headers: { 'x-request-id': 1 } })
        dispatch({
            type: ON_UPDATE_ORDERS,
            payload: ordersList
        })

    } catch (e) {
        console.error('An Error occured while updating the order', e);
        throw e;
    }
}

export const getOrderByTrackId = async (orderId) => {
    try {
        const orderQuery = "?orderNumber=" + orderId;
        const res = await axios.get(`${constants.apiBasePath}/v1/orders${orderQuery}`, { headers: { 'x-request-id': 1 } })
        return res.data && res.data[0];

    } catch (e) {
        console.error('An Error occured while getting order', e);
        throw e;
    }
}

export const updateTrackOrder = async (trackInfo) => {
    try {
        const res = await axios.put(`${constants.apiBasePath}/v1/orders/trackOrder/${trackInfo.orderId}`, trackInfo, { headers: { 'x-request-id': 1 } });
        return res;
    } catch (e) {
        console.error('An Error occured while getting order', e);
        throw e;
    }
}


export const printAndUpdateOrders = (ordersList) => async (dispatch) => {
    try {
        // const res = await axios.put(`${constants.apiBasePath}/v1/orders`, ordersList, { headers: { 'x-request-id': 1 } })
        const orderIdList = [];
        for (let i = 0; i < ordersList.length; i++) {
            orderIdList.push(ordersList[i].orderId);
        }
        const orderStr = orderIdList.toString();
        window.open('http://moksha.ladyemporium.in/print-orders.html?orders=' + orderStr, '_blank');

    } catch (e) {
        console.error('An Error occured while user login', e);
        throw e;
    }
}
export const getOrders = () => async (dispatch) => {
    try {
        const res = await axios.get(`${constants.apiBasePath}/v1/orders`, { headers: { 'x-request-id': 1 } })
        for (let i = 0; res.data && i < res.data.length; i++) {
            const d = new Date(res.data[i].orderDate);
            res.data[i].orderDateTime = `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes()}`;
        }

        dispatch({
            type: ON_GET_ORDERS,
            payload: res.data
        });
    } catch (e) {
        console.error('An Error occured while user login', e);
        throw e;
    }
}
