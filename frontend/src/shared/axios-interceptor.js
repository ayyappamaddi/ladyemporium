import axios from "axios";
import utilSerice from './utils-service';

function initInterceptor() {
    console.log('axis interceptor is added.. line 8');
    axios.interceptors.request.use(
        config => {
            let userInfo
            try {
                userInfo = JSON.parse(utilSerice.getCookie('userInfo'))
            } catch (e) {

            }
            if (userInfo && userInfo.accessToken) {
                config.headers['Authorization'] = 'Bearer ' + userInfo.accessToken;
            }
            return config;
        },
        error => {
            Promise.reject(error)
        });

    axios.interceptors.response.use(
        function (res) {

            return res;
        },
        (err) => {
            if (err.response && err.response.status === 401) {
                utilSerice.setCookie('userInfo', '', -1)
            }
            return Promise.reject(err);
        }
    );

}

export default {
    initInterceptor
}