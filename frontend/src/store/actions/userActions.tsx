import { ON_LOGIN_USER } from '../types'
import axios from 'axios'
import constants from '../../shared/constants'


export const doLogin = (user: any) => async (dispatch: any) => {
    try {

        const res = await axios.post(`${constants.apiBasePath}/v1/user/userLogin`, user, { headers: { 'x-request-id': 1 } })

        dispatch({
            type: ON_LOGIN_USER,
            payload: res.data
        })

    } catch (e) {
        console.error('An Error occured while adding product', e);
    }
}