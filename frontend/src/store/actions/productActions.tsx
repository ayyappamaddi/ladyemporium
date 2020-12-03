import { GET_PRODUCTS, POST_PRODUCT, SELECT_PRODUCTS } from '../types'
import axios from 'axios'
import constants from '../../shared/constants'

export const selectProdut = (data: any) => async (dispatch: any, getState: any) => {
    try {
        const state = getState();
        const avlProducts = state.products.products;
        let selectedPoduct:any;
        if (avlProducts && avlProducts[data.productId]) {
            selectedPoduct = avlProducts[data.productId];
        } else {
            const res = await axios.get(`${constants.apiBasePath}/v1/products/${data.productId}`, { headers: { 'x-request-id': 1 } })
            res.data.productImages.map((prodImage: any) => {
                prodImage.path = constants.bucketURL + data.productId + '_' + prodImage.fileName;
            });
            selectedPoduct = res.data;
        }

        dispatch({
            type: SELECT_PRODUCTS,
            payload: selectedPoduct
        })
        console.log('==>', data);
    } catch (err) {
        console.error('An Error occured while Selecting a product', data);
    }
};

export const getProduts = () => async (dispatch: any) => {

    try {
        const res = await axios.get(`${constants.apiBasePath}/v1/products`, { headers: { 'x-request-id': 1 } })
        const productInfo: any = {};
        res.data.map((product: any) => {
            if (product.productImages && product.productImages.length) {
                product.masterFilePath = constants.bucketURL + product.productId + '_' + product.productImages[0].fileName;
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
        const productImages = product.alt_images;
        delete product.alt_images;
        delete product.displayColorPicker;
        delete product.selectedImgObj;
        product.productImages = [];
        for (let i = 0; productImages && i < productImages.length; i++) {
            product.productImages.push({ fileName: i + '_' + productImages[i].file.name });
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
                await axios.put(signedURL, productImages[i].file);
            }
        }

        dispatch({
            type: POST_PRODUCT,
            payload: product
        })

    } catch (e) {
        console.error('An Error occured while adding product', e);
    }
}