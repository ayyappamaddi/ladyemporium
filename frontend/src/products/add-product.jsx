import React from 'react';
import {
  Button, Input, InputLabel, MenuItem, FormHelperText, FormControl, Select, TextareaAutosize, RadioGroup, FormControlLabel, Radio, FormLabel
} from '@material-ui/core';
import { SketchPicker } from 'react-color'
import { connect } from 'react-redux';

import constants from '../shared/constants';
import { addProduct, updateProduct } from '../store/actions/productActions';
import styles from './add-product.module.scss';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';


export class AddProduct extends React.Component {
  productTypeList = constants.productTypes;

  productCategoryList = [];
  materialTypeList = [];
  productAltImages = [];
  emptyState = { productType: 'saree', price: '', productImages: [], color: { r: 1, g: 250, b: 250, a: 1 } };
  editProduct = false;
  constructor(prop) {
    super(prop);
    this.handleChange = this.handleChange.bind(this);
    this.addModifyProduct = this.addModifyProduct.bind(this);
    this.handleAltImgActions = this.handleAltImgActions.bind(this);
    this.editProduct = (prop && prop.editProduct) ? true : false;
    this.state = { ...this.emptyState, ...prop.editProduct };

    this.handleProductTypeChange();
  }


  componentWillReceiveProps(nextProps) {
    if (!this.editProduct) {
      this.editProduct = true;
      this.setState({ ...nextProps, editMode: true });
    }
  }


  handleChange(property, event) {
    this.updateState(property, event.target ? event.target.value : event);
    if (property === 'productType') {
      this.handleProductTypeChange();
    }
  }
  handleProductTypeChange() {
    const productType = this.state.productType;
    for (let i = 0; i < this.productTypeList.length; i++) {
      if (this.productTypeList[i].value === productType) {
        this.materialTypeList = this.productTypeList[i].materialType ? this.productTypeList[i].materialType : [];
        this.productCategoryList = this.productTypeList[i].category ? this.productTypeList[i].category : [];
      }
    }
  }
  handleAltImg(event) {
    const productAltImages = this.state.productImages;
    for (let i = 0; i < event.target.files.length; i++) {
      productAltImages.push({ file: event.target.files[i], src: '', visibility: true, });
      const storeKey = 'productImages__' + (productAltImages.length - 1) + '__src';
      this.readImageURL(event.target.files[i], storeKey);
    }
    // if no images exist make first image as cover image
    if (!this.state.productImages.length) {
      productAltImages[0].coverImg = true;
    }
    this.updateState('productImages', productAltImages);
  }

  updateState(property, value) {
    const keys = property.split('__');
    let tempState = this.state;
    const newState = this.state;

    for (let i = 0; i < keys.length - 1; i++) {
      tempState = tempState[keys[i]];
    }

    const changeProperty = keys[keys.length - 1];
    tempState[changeProperty] = value;
    this.setState(newState);
  }
  handleAltImgActions(index, property, value) {
    const productAltImages = this.state.productImages;
    if (property === 'delete') {
      productAltImages.splice(index, 1);
    } else if (property === 'coverImg') {
      productAltImages.map(altProduct => altProduct.coverImg = false);
      productAltImages[index].coverImg = value;
    } else if (property === 'visibility') {
      productAltImages[index].visibility = !!value;
    } else if (property === 'description') {
      productAltImages[index].description = value;
    }
    this.updateState('productImages', productAltImages);
  }
  readImageURL(inputImage, imageProperty = 'selectedImgObj') {
    if (inputImage) {
      var self = this;
      var reader = new FileReader();
      reader.onload = function (e) {
        self.updateState(imageProperty, e.target.result);
      }
      reader.readAsDataURL(inputImage);
    }
  }


  addModifyProduct() {
    const newState = { ...this.state };
    newState.price = newState.price ? newState.price * 1 : 0;
    if (this.editProduct) {
      this.props.updateProduct(newState.productId, newState).then(()=>{
        console.log('then function works fine...');
      })
    } else {
      this.props.addProduct(newState);
    }
    this.setState({ ...this.emptyState });
  }

  render() {
    let productColor = [this.state.color.r, this.state.color.g, this.state.color.b, this.state.color.a];
    productColor = 'rgb(' + productColor.toString() + ')';
    let altImages = [];
    if (this.state.productImages) {
      altImages = this.state.productImages;
    }

    return (<div className={styles.add_product}>

      <h1> {this.editProduct ? "Edit" : "Add"} Product Details</h1>
      <div className={styles.add_product_form}>
        <div className={styles.add_product_left_form} >
          <FormControl className={styles.element_row}>
            <InputLabel htmlFor="my-input">Product Name</InputLabel>
            <Input id="my-input" value={this.state.name} aria-describedby="my-helper-text" onChange={(event) => this.handleChange('name', event)} />
            <FormHelperText id="my-helper-text">Name of the Product</FormHelperText>
          </FormControl>
          <FormControl className={styles.element_row_2} >
            <FormLabel component="legend">Product Type</FormLabel>
            <RadioGroup row aria-label="position" value={this.state.productType} onChange={(event) => this.handleChange('productType', event)}>
              {this.productTypeList.map((product) => <FormControlLabel control={<Radio />} value={product.value} label={product.label} />)}
            </RadioGroup>
          </FormControl>


          {this.materialTypeList.length ?
            <FormControl className={styles.element_row_2} >
              <FormLabel component="legend">Material Type</FormLabel>
              <RadioGroup row aria-label="position" value={this.state.productMaterial} onChange={(event) => this.handleChange('productMaterial', event)}>
                {this.materialTypeList.map((materialType) => <FormControlLabel control={<Radio />} value={materialType.value} label={materialType.label} />)}
              </RadioGroup>
            </FormControl>
            : ''}
          <FormControl className={styles.element_row_2} >
            <FormLabel component="legend">Product Category</FormLabel>
            <RadioGroup row aria-label="position" value={this.state.productCategory} onChange={(event) => this.handleChange('productCategory', event)}>
              {this.productCategoryList.map((productCategory) => <FormControlLabel control={<Radio />} value={productCategory.value} label={productCategory.label} />)}
            </RadioGroup>
          </FormControl>

          <FormControl className={styles.element_row_2}>
            <InputLabel htmlFor="my-input">Price </InputLabel>
            <Input id="my-input" value={this.state.price} type="number" aria-describedby="my-helper-text" onChange={(event) => this.handleChange('price', event)} />
            <FormHelperText id="my-helper-text">Price of the product</FormHelperText>
          </FormControl>



          <div className={styles.element_row}>
            Product color :
            <div style={{ background: productColor }} className={styles.color_swatch} onClick={(event) => this.handleChange('displayColorPicker', true)}>
            </div>
            {this.state.displayColorPicker ? <div className={styles.color_popover}>
              <div className={styles.color_cover} onClick={(event) => this.handleChange('displayColorPicker', false)} />
              <SketchPicker color={this.state.color} onChange={(event) => this.handleChange('color', event.rgb)} />
            </div> : null}

          </div>

          <FormControl className={styles.element_row}>
            {/* <InputLabel htmlFor="product-description">Product Description </InputLabel> */}
            <TextareaAutosize value={this.state.description} id="product-description" aria-describedby="my-helper-text" onChange={(event) => this.handleChange('description', event)} rowsMin={3} rowsMax={3} />
            <FormHelperText id="my-helper-text">Detailed product description</FormHelperText>
          </FormControl>
        </div>
        <div className={styles.add_product_image_container}>
          <div className={styles.poduct_thumb_images}>
            <div className={styles.poduct_file_tile}>
              <input accept="image/*" className={styles.input} style={{ display: 'none' }}
                id="product-img-file" multiple type="file" onChange={(event) => this.handleAltImg(event)} />
              <label htmlFor="product-img-file">
                <Button component="span" className={styles.button}>
                  {altImages && altImages.length ? 'Add Cover Image' : 'Add Alt Image'}
                </Button>
              </label>
            </div>
            {altImages.map((alImg, i) => {
              return <div key={i} className={styles.alt_poduct_img_row} >
                <img className={styles.poduct_img_tile} onClick={() => this.handleChange('selectedImgObj', alImg.src)}
                  src={alImg.src} width="100" height="100" />
                <div className={styles.product_alt_img_details}>
                  <div className={styles.product_alt_img_actions}>
                    <CheckCircleOutlinedIcon className={alImg.coverImg ? "cover_img_icon" : ''} onClick={() => this.handleAltImgActions(i, 'coverImg', true)} color='secondary'></CheckCircleOutlinedIcon>
                    {alImg.visibility ?
                      <VisibilityIcon onClick={() => this.handleAltImgActions(i, 'visibility', false)}></VisibilityIcon> :
                      <VisibilityOffIcon onClick={() => this.handleAltImgActions(i, 'visibility', true)}></VisibilityOffIcon>}
                    <DeleteIcon onClick={() => this.handleAltImgActions(i, 'delete', false)}></DeleteIcon>
                  </div>
                  <FormControl className={styles.element_row}>
                    {/* <InputLabel htmlFor="my-input">Alt Product Description </InputLabel>   */}
                    <TextareaAutosize id={'alt-img-description_' + i} onChange={(event) => this.handleAltImgActions(i, 'description', event.target.value)} rowsMin={3} rowsMax={3} />
                  </FormControl>
                </div>
              </div>
            })}
          </div>
        </div>
        <div className={styles.selected_image_preview} >
          <img src={this.state.selectedImgObj} width="300" height="200" />
        </div>
      </div>

      <Button variant="contained" color="primary" onClick={this.addModifyProduct} >  {this.editProduct ? "Edit" : "Add"} Product</Button>
      <Button variant="contained" color="primary" onClick={this.props.cancelAddProduct} >cancel</Button>
    </div>);
  }
}

const mapStateToProps = (state) => ({ products: state.products })
export default connect(mapStateToProps, { addProduct, updateProduct })(AddProduct);
