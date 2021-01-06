const productTypes: any = [
    {
        value: 'saree', label: 'Saree',
        category: [{ value: 'daily', label: 'Daily wear' },
        { value: 'Fancy', label: 'Fancy wear' },
        { value: 'Ethinic', label: 'Ethinic wear' }],
        materialType: [
            { value: 'silk', label: 'Silk Saree' },
            { value: 'cotton', label: 'Cotton Saree' },
            { value: 'cotton-silk', label: 'Cotton Silk Saree' },
            { value: 'georgette', label: 'Georgette Sarees' },
            { value: 'chiffon', label: 'Chiffon Sarees' },
            { value: 'satin', label: 'Satin Sarees' },
            { value: 'embroidered', label: 'Embroidered Sarees' },
        ]
    },
    {
        value: 'jewlary', label: 'Jewlary',
        category: [{ value: 'studs', label: 'Studs' },
        { value: 'Ear Ring', label: 'Ear Ring' },
        { value: 'Bangles', label: 'Bangles' },
        { value: 'Necklaces', label: 'Necklaces' },
        ],
    },
    {
        value: 'perals', label: 'Perals',
        category: [{ value: 'studs', label: 'Studs' },
        { value: 'Garland', label: 'Garland' },
        { value: 'Bangles', label: 'Bangles' },
        { value: 'Necklaces', label: 'Necklaces' },
        ]
    }

];
let apiBasePath;

if (window.location.hostname === 'localhost') {
    // apiBasePath = 'http://52.208.209.4';
    apiBasePath = 'http://localhost:3001';
} else {
    apiBasePath = 'https://api.ladyemporium.in';
}

const bucketURL = 'https://i-0d2da3be9c27bae0b.s3.amazonaws.com/'
export default {
    productTypes,
    apiBasePath,
    bucketURL
}

