import { GET_PRODUCTS, POST_PRODUCT, SELECT_PRODUCTS, DELETE_PRODUCT, UPDATE_PRODUCT } from '../types'
import axios from 'axios'
import constants from '../../shared/constants'
import { async } from 'q';

export const selectProdut = (data: any) => async (dispatch: any, getState: any) => {
    try {
        const state = getState();
        const avlProducts = state.products.products;
        const loggedInUser = state.user;
        let selectedPoduct: any;
        if (avlProducts && avlProducts[data.productId]) {
            selectedPoduct = avlProducts[data.productId];
        } else {
            const res = await axios.get(`${constants.apiBasePath}/v1/products/${data.productId}`, { headers: { 'x-request-id': 1 } })
            selectedPoduct = res.data;
        }
        let visibilityImages = [];
        if(loggedInUser && loggedInUser.role === 'admin'){
            visibilityImages = selectedPoduct.productImages;
        }else{
            visibilityImages = selectedPoduct.productImages.filter((prodImag:any) => prodImag.visibility);
        }
        
        visibilityImages.map((prodImage: any) => {
            prodImage.path = constants.bucketURL + data.productId + '_' + prodImage.fileName;
        });
        selectedPoduct.productImages = visibilityImages;
        dispatch({
            type: SELECT_PRODUCTS,
            payload: selectedPoduct
        })

    } catch (err) {
        console.error('An Error occured while Selecting a product', data);
    }
};

export const deleteProduct = (productId: any) => async (dispatch: any) => {
    try {
        const res = await axios.delete(`${constants.apiBasePath}/v1/products/${productId}`, { headers: { 'x-request-id': 1 } })
        dispatch({
            type: DELETE_PRODUCT,
            payload: res
        })
    } catch (err) {
        console.error('An error occured while deleting a product', err);
        throw err;
    }
}
export const updateProduct = (productId: any, data: any) => async (dispatch: any) => {
    try {
        
        const res = await axios.put(`${constants.apiBasePath}/v1/products/${productId}`, data, { headers: { 'x-request-id': 1 } })
        dispatch({
            type: UPDATE_PRODUCT,
            payload: { productId: res }
        })

    } catch (err) {
        console.error('An error occured while updating a product', err);
        throw err;
    }
}

export const getProduts = () => async (dispatch: any) => {

    try {
        const res = await axios.get(`${constants.apiBasePath}/v1/products`, { headers: { 'x-request-id': 1 } })
        const productInfo: any = {};
        res.data.map((product: any) => {
            if (product.productImages && product.productImages.length) {
                for (let i = 0; i < product.productImages.length; i++) {
                    product.productImages[i].src = constants.bucketURL + product.productId + '_' + product.productImages[i].fileName;
                    if (product.productImages[i].coverImg) {
                        product.masterFilePath = constants.bucketURL + product.productId + '_' + product.productImages[i].fileName;
                    }
                }
                if (!product.masterFilePath) {
                    product.masterFilePath = constants.bucketURL + product.productId + '_' + product.productImages[0].fileName;
                }
            }
            productInfo[product.productId] = product;

        })
        dispatch({
            type: GET_PRODUCTS,
            payload: productInfo
        })
    }
    catch (e) {
        dispatch({
            type: POST_PRODUCT,
            payload: console.log(e),
        })
    }
}

export const addProduct = (product: any) => async (dispatch: any) => {
    try {
        const productImages = product.productImages;

        delete product.productImages;
        delete product.displayColorPicker;
        delete product.selectedImgObj;
        product.productImages = [];
        const productFiles = [];
        for (let i = 0; productImages && i < productImages.length; i++) {
            productFiles.push(productImages[i].file);
            productImages[i].fileName = i + '_' + productImages[i].file.name;
            delete productImages[i].file;
            delete productImages[i].src;
            product.productImages.push(productImages[i]);
        }

        const res = await axios.post(`${constants.apiBasePath}/v1/products`, product, { headers: { 'x-request-id': 1 } })
        let productId;
        if (res && res.data) {
            productId = res.data.productId;
        }
        if (productImages) {
            // await axios.get("http://localhost:3001/v1/products/upload?fileName=" + productImage.name
            //     + "&fileType=" + productImage.type,
            //     { headers: { 'x-request-id': 1 } });

            // const signedURL = signedURLINfo.data;
            for (let i = 0; i < product.productImages.length; i++) {
                const signedURL = constants.bucketURL + productId + '_' + product.productImages[i].fileName;
                await axios.put(signedURL, productFiles[i]);
            }
        }

        dispatch({
            type: POST_PRODUCT,
            payload: { productId: res }
        })

    } catch (e) {
        console.error('An Error occured while adding product', e);
    }
}