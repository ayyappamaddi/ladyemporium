import { ON_LOGIN_USER } from '../types'
import axios from 'axios'
import constants from '../../shared/constants'
import utilService from '../../shared/utils-service'


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
    const userInfo = JSON.parse(utilService.getCookie('userInfo'));
    if(userInfo && userInfo.role){
        dispatch({
            type: ON_LOGIN_USER,
            payload: userInfo
        });
    }
}