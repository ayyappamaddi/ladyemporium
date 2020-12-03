import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './product-details.module.scss';
import { selectProdut } from '../store/actions/productActions';
// const routerParams = useParams();
export class ProductDetailsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProduct: {},
      productLoaded: false,
      selectedAltImgPath: ''
    }
    this.onAltImgClick = this.onAltImgClick.bind(this);
  };
  onAltImgClick(index) {
    this.setState((state) => ({
      selectedAltImgPath: this.props.selectedProduct.productImages[index].path
    }));
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    this.props.selectProdut(params);
  }
  componentWillReceiveProps(props) {
    this.setState((state) => ({
      selectedProduct: props.selectedProduct,
      productLoaded: true,
      selectedAltImgPath: props.selectedProduct.productImages[0].path
    }));
  }
  render() {

    let productDetailsHTML;
    if (this.state.productLoaded) {
      const alImages = this.state.selectedProduct.productImages;
      productDetailsHTML = <div className={styles.produt_details_body}>
        <div className={styles.product_image}>
          <img className={styles.product_selected_image} src={this.state.selectedAltImgPath}></img>
        </div>
        <div className={styles.product_info}>
          <div className={styles.product_specs}>
            <span className={styles.product_specs_label}>{this.state.selectedProduct.name}</span>
            <span className={styles.product_specs_label}>{this.state.selectedProduct.description}</span>
            <span className={styles.product_specs_label}>{this.state.selectedProduct.cost}</span>
            <span className={styles.product_specs_label}>Price : INR {this.state.selectedProduct.price}</span>
            <span className={styles.product_specs_label}> <b>Note:</b> Place an order by msg 7022336741 </span>
          </div>
          <div className={styles.similar_products}>
            {alImages.map((altImg, i) => <img onClick={() => this.onAltImgClick(i)} key={i} className={styles.product_alt_img_tile} src={altImg.path}></img>)}
          </div>
        </div>
      </div>
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
