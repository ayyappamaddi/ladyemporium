import { combineReducers } from 'redux'
import productReducer from './productReducers'
import userReducer from './userReducers'

export default combineReducers({
  products: productReducer,
  user: userReducer
})