import { ON_LOGIN_USER, ON_LOGOUT_USER } from '../types'
import axios from 'axios'
import constants from '../../shared/constants'
import utilService from '../../shared/utils-service'
import { dispatch } from 'rxjs/internal/observable/range';

export const doUserLogout = () => async (dispatch: any) => {
    try {
        await axios.post(`${constants.apiBasePath}/v1/user/userLogout`, { headers: { 'x-request-id': 1 } })
        utilService.setCookie('userInfo', '', -1);
        dispatch({
            type: ON_LOGOUT_USER
        });
    } catch (e) {
        console.error('An Error occured while user do logout', e);
    }
}

export const doLogin = (user: any) => async (dispatch: any) => {
    try {

        const res = await axios.post(`${constants.apiBasePath}/v1/user/userLogin`, user, { headers: { 'x-request-id': 1 } })
        const userInfo = JSON.stringify(res.data);
        utilService.setCookie('userInfo', userInfo);
        dispatch({
            type: ON_LOGIN_USER,
            payload: res.data
        })

    } catch (e) {
        console.error('An Error occured while user login', e);
    }
}

export const verifyUserLogin = () => (dispatch: any) => {
    let userInfo;
    if (utilService.getCookie('userInfo')) {
        try {
            userInfo = JSON.parse(utilService.getCookie('userInfo'));
        } catch (e) {
            console.log('An error occured while getting userInfo');
        }
    }
    if (userInfo && userInfo.accessToken) {
        userInfo.role = userInfo.role || 'user';
        dispatch({
            type: ON_LOGIN_USER,
            payload: userInfo
        });
    }
}

export const createUser = (user: any) => async (dispatch: any) => {
    try {
        const newUserRes = await axios.post(`${constants.apiBasePath}/v1/user/newUesr`, user, { headers: { 'x-request-id': 1 } });
        user.userName = user.email;
        setTimeout(async () => {
            const res = await axios.post(`${constants.apiBasePath}/v1/user/userLogin`, user, { headers: { 'x-request-id': 1 } })
            const userInfo = JSON.stringify(res.data);
            utilService.setCookie('userInfo', userInfo);
            dispatch({
                type: ON_LOGIN_USER,
                payload: res.data
            })
        }, 2000);
        return newUserRes;
    } catch (err) {
        console.error('An Error occured while creating an user', err);
        throw err;
    }
}