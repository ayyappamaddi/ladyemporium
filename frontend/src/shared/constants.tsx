const productTypes: any = [
    { value: 'saree', label: 'Saree' },
    { value: 'jewlary', label: 'Jewlary' },
    { value: 'Kids', label: 'Kids' }

];
const apiBasePath = 'http://localhost:3001';
// const apiBasePath = 'http://52.208.209.4';
const bucketURL = 'https://i-0d2da3be9c27bae0b.s3.amazonaws.com/'
export default {
    productTypes,
    apiBasePath,
    bucketURL
}

