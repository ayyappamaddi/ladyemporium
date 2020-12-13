import { ON_GET_ORDERS, ON_UPDATE_ORDERS } from '../types'
import axios from 'axios'
import constants from '../../shared/constants'
import utilService from '../../shared/utils-service'
import { async } from 'q';



export const dispatchOrders = (ordersList: any) => async (dispatch: any) => {
    try {
        const res = await axios.put(`${constants.apiBasePath}/v1/orders`, ordersList, { headers: { 'x-request-id': 1 } })
        dispatch({
            type: ON_UPDATE_ORDERS,
            payload: ordersList
        })

    } catch (e) {
        console.error('An Error occured while user login', e);
        throw e;
    }
}


export const printAndUpdateOrders = (ordersList: any) => async (dispatch: any) => {
    try {
        const res = await axios.put(`${constants.apiBasePath}/v1/orders`, ordersList, { headers: { 'x-request-id': 1 } })
        const orderIdList = [];
        for (let i = 0; i < ordersList.length; i++) {
            orderIdList.push(ordersList[i].orderId);
        }
        const orderStr = orderIdList.toString();
        window.open('http://moksha.ladyemporium.in?orders=' + orderStr, '_blank');

    } catch (e) {
        console.error('An Error occured while user login', e);
        throw e;
    }
}
export const getOrders = () => async (dispatch: any) => {
    try {
        const res = await axios.get(`${constants.apiBasePath}/v1/orders`, { headers: { 'x-request-id': 1 } })
        for(let i=0;res.data && i<res.data.length;i++){
            const d = new Date(res.data[i].orderDate);
            res.data[i].orderDateTime= `${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:${d.getMinutes()}`;
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
