import { combineReducers } from 'redux';
import productReducer from './productReducers';
import userReducer from './userReducers';
import ordersReducer from './ordersReducers';

export default combineReducers({
  products: productReducer,
  user: userReducer,
  orders:ordersReducer
})