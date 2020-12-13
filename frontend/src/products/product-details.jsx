import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './product-details.module.scss';
import { selectProdut } from '../store/actions/productActions';
import { Button, Input, InputLabel, FormControl, FormHelperText, TextareaAutosize } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';

// const routerParams = useParams();
export class ProductDetailsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOrderForm: false,
      selectedProduct: props.selectedProduct,
      productLoaded: props.selectedProduct ? true : false,
      orderForm: {},
      selectedAltImgPath: props.selectedProduct && props.selectedProduct.productImages ? props.selectedProduct.productImages[0].path : ''
    }
    this.handleChange = this.handleChange.bind(this);
    // this.onAltImgClick = this.onAltImgClick.bind(this);
  };
  onAltImgClick(index) {
    this.setState((state) => ({
      selectedAltImgPath: this.props.selectedProduct.productImages[index].path
    }));
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    if (!(this.props.selectProdut && this.props.selectProdut.price)) {
      this.props.selectProdut(params);
    }
  }
  placeOrder = (value) => {
    this.setState((state) => ({
      showOrderForm: value,
      orderForm: { productId: state.selectedProduct.productId }
    }));
  }
  handleChange(property, event) {
    const orderForm = this.state.orderForm;
    orderForm[property] = event.target ? event.target.value : event;
    this.setState((state) => ({ orderForm }));
  }
  componentWillReceiveProps(props) {
    this.setState((state) => ({
      selectedProduct: props.selectedProduct,
      productLoaded: true,
      selectedAltImgPath: props.selectedProduct.productImages[0].path
    }));
  }
  render() {
    let placeOrderHTML = '';
    let pageLocation = window.location.href;
    if (!this.state.showOrderForm) {
      placeOrderHTML = <div><Button variant="contained" color="primary" onClick={() => this.placeOrder.bind(this)(true)} >Place Order</Button></div>
    } else if (this.state.showOrderForm && !this.state.orderForm.confimed) {
      placeOrderHTML = <div>
        <FormControl className={styles.element_row}>
          <InputLabel htmlFor="my-input">Mobile No</InputLabel>
          <Input id="my-input" aria-describedby="my-helper-text" onChange={(event) => this.handleChange('mobile', event)} />
          <FormHelperText id="my-helper-text">User Mobile no</FormHelperText>
        </FormControl><br /><br />
        <FormControl className={styles.element_row}>
          <InputLabel htmlFor="my-input">Delivery Adress</InputLabel>
          <TextareaAutosize id="my-input" onChange={(event) => this.handleChange('address', event)} rowsMin={3} rowsMax={3} />
          <FormHelperText id="my-helper-text">Shipping address</FormHelperText>
        </FormControl>
        <div>
          <Button variant="contained" color="primary" onClick={() => this.placeOrder.bind(this)(false)}> Cancel</Button>
          <Button variant="contained" color="primary" onClick={() => this.handleChange('confimed', true)}> Confirm And Pay</Button>
        </div>
      </div>
      // <span className={styles.product_specs_label}> <b>Note:</b> Place an order by msg 7022336741 </span>
    } else if (this.state.showOrderForm && this.state.orderForm.confimed) {
      placeOrderHTML = <span className={styles.product_specs_label}>
        <p>
          At the movement we have not yet integrated with payment gate way, we are regretted for the inconvenience.
        </p>
        <p>
          Nothing to worry you can still get it by making google pay or phone pay to the following phone number.
        </p>
        <p>
          <b>Whats app no: 7022336741 </b>
        </p>

      </span>
    }
    let productDetailsHTML;
    if (this.state.productLoaded) {
      const alImages = this.state.selectedProduct.productImages || [];
      productDetailsHTML =
        <div className={styles.product_selected_image_container}>
          <div className={styles.product_specs_name}>{this.state.selectedProduct.name}</div>
          <div className={styles.produt_details_body}>
            <div className={styles.product_image}>
              <img className={styles.product_selected_image} src={this.state.selectedAltImgPath}></img>
            </div>
            <div className={styles.product_info}>
              <div className={styles.product_specs}>
                <p> <b>Details: </b></p>
                <p className={styles.product_specs_label}>{this.state.selectedProduct.description}</p>
                <span className={styles.product_specs_label}>{this.state.selectedProduct.cost}</span>
                <span className={styles.product_specs_label, styles.product_specs_price}> ₹  {this.state.selectedProduct.price} + Delivery changes(100Rs) </span>

              <div onClick={() => navigator.clipboard.writeText(pageLocation)} className={styles.product_specs_label, styles.product_copy_link} ><ShareIcon></ShareIcon>Share link</div>

            {placeOrderHTML}
          </div>
          <div className={styles.similar_products}>
            <div><b>Similar product with different color &amp; design</b></div>
            <div className={styles.mobile_scroll_width}>
              {alImages.map((altImg, i) => <img onClick={() => this.onAltImgClick.bind(this)(i)} key={i} className={styles.product_alt_img_tile} src={altImg.path}></img>)}
            </div>
          </div>
        </div>
        </div >
      </div >
    }



    return <div className={styles.product_details_page}>
      <div className={styles.previous_product}></div>
      {productDetailsHTML}
      <div className={styles.next_product}></div>
      <div className={styles.more_products}></div>
    </div>
  }
}

const mapStateToProps = (state) => {
  return { selectedProduct: state.products.selectedProduct }
}

// export default Products
export default connect(mapStateToProps, { selectProdut })(ProductDetailsComponent)
