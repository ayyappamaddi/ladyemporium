import React from 'react';
import { Button, Input, InputLabel, MenuItem, FormHelperText, FormControl, Select, TextareaAutosize } from '@material-ui/core';
import { SketchPicker } from 'react-color'
import { connect } from 'react-redux';

import constants from '../shared/constants';
import { addProduct } from '../store/actions/productActions';
import styles from './add-product.module.scss';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';


export class AddProduct extends React.Component<any, any> {
  productTypeList = constants.productTypes;
  productAltImages: any[] = [];
  emptyState = { productType: '', price: '', alt_images: [], color: { r: 1, g: 250, b: 250, a: 1 } };
  constructor(prop: any) {
    super(prop);
    this.handleChange = this.handleChange.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.handleAltImgActions = this.handleAltImgActions.bind(this);
    // this.handleColorChange = this.handleColorChange.bind(this);
    this.state = { ...this.emptyState };
  }
  handleChange(property: string, event: any) {
    this.updateState(property, event.target ? event.target.value : event);
  }
  handleAltImg(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.productAltImages.push({ file: event.target.files[i], src: '', visibility: true, });
      const storeKey: string = 'alt_images__' + (this.productAltImages.length - 1) + '__src';
      this.readImageURL(event.target.files[i], storeKey);
    }
    // if no images exist make first image as cover image
    if (!this.state.alt_images.length) {
      this.productAltImages[0].coverImg = true;
    }
    this.updateState('alt_images', this.productAltImages);
  }

  updateState(property: string, value: any) {
    const keys = property.split('__');
    let tempState: any = this.state;
    const newState: any = this.state;

    for (let i = 0; i < keys.length - 1; i++) {
      tempState = tempState[keys[i]];
    }

    const changeProperty = keys[keys.length - 1];
    tempState[changeProperty] = value;
    this.setState(newState);
  }
  handleAltImgActions(index: any, property: any, value: any) {
    if (property === 'delete') {
      this.productAltImages.splice(index, 1);
    } else if (property === 'coverImg') {
      this.productAltImages.map(altProduct => altProduct.coverImg = false);
      this.productAltImages[index].coverImg = value;
    } else if (property === 'visibility') {
      this.productAltImages[index].visibility = !!value;
    } else if (property === 'description') {
      this.productAltImages[index].description = value;
    }
    this.updateState('alt_images', this.productAltImages);
  }
  readImageURL(inputImage: any, imageProperty: string = 'selectedImgObj') {
    if (inputImage) {
      var self = this;
      var reader = new FileReader();
      reader.onload = function (e: any) {
        self.updateState(imageProperty, e.target.result);
      }
      reader.readAsDataURL(inputImage);
    }
  }


  addProduct() {
    const newState: any = { ...this.state };
    this.props.addProduct(newState);
    this.setState({ ...this.emptyState });
  }

  render() {
    let productColor: any = [this.state.color.r, this.state.color.g, this.state.color.b, this.state.color.a];
    productColor = 'rgb(' + productColor.toString() + ')';
    let altImages = [];
    if (this.state.alt_images) {
      altImages = this.state.alt_images;
    }

    return (<div className={styles.add_product}>
      <h1> Product Details</h1>
      <div className={styles.add_product_form}>
        <div className={styles.add_product_left_form} >
          <FormControl className={styles.element_row}>
            <InputLabel htmlFor="my-input">Product Name</InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" onChange={(event) => this.handleChange('name', event)} />
            <FormHelperText id="my-helper-text">Name of the Product</FormHelperText>
          </FormControl>
          <FormControl className={styles.element_row_2} >
            <InputLabel id="demo-simple-select-label">Product Type </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.productType}
              onChange={(event) => this.handleChange('productType', event)}
            >
              {this.productTypeList.map((product: any) => <MenuItem value={product.value}>{product.label}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl className={styles.element_row_2}>
            <InputLabel htmlFor="my-input">Price </InputLabel>
            <Input id="my-input" aria-describedby="my-helper-text" onChange={(event) => this.handleChange('price', event)} />
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
            <TextareaAutosize id="product-description" aria-describedby="my-helper-text" onChange={(event) => this.handleChange('description', event)} rowsMin={3} rowsMax={3} />
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
            {altImages.map((alImg: any, i: any) => {
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

      <Button variant="contained" color="primary" onClick={this.addProduct} > Add Product</Button>
      <Button variant="contained" color="primary" onClick={this.props.cancelAddProduct} >cancel</Button>
    </div>);
  }
}

const mapStateToProps = (state: any) => ({ products: state.products })
export default connect(mapStateToProps, { addProduct })(AddProduct);
