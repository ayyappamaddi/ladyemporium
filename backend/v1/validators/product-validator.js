const { createValidator } = require('express-joi-validation');
const Joi = require('joi');

const validator = createValidator()
const productIdSchema = Joi.object({
    productId:Joi.number().integer().required()
});
const produtShema = Joi.object({
    name: Joi.string().required() ,
    productType: Joi.string().required(),
    productCategory: Joi.string(),
    productMaterial: Joi.string(),
    price: Joi.number(),
    color: Joi.object(),
    description: Joi.string(),
    visibility: Joi.boolean(),
    productImages:Joi.array()
});


function bodyValidator(){
    return validator.body(produtShema);
}
function prarameterValidator() {
    return validator.params(productIdSchema);
}

module.exports = {
    prarameterValidator,
    bodyValidator
}