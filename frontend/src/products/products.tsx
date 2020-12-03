import React from 'react';
import { connect, useStore, useSelector } from 'react-redux';
import { getProduts } from '../store/actions/productActions';
import styles from './products.module.scss'
import Button from '@material-ui/core/Button'
import AddProduct from './add-product';
import messageService from '../shared/message-service.js';
import { useHistory, Link } from "react-router-dom";


export class Products extends React.Component<any, any> {
  showProducts = false;

  constructor(props: any) {
    super(props);
    this.showHideProduct = this.showHideProduct.bind(this);
    this.onProductClick = this.onProductClick.bind(this);
    this.state = { showProducts: false };
    this.handleMsg()
  }
  handleMsg() {
    messageService.getMessage().subscribe((inf: any) => {
      console.log('message', inf);
    });
  }
  componentDidMount() {
    console.log('it is from component did mount');
    this.props.getProduts()
  }

  componentWillUpdate() {
    console.log('it is from component will mount');

  }

  showHideProduct(toggle: boolean) {
    this.setState((state: any) => ({
      showProducts: toggle
    }));

  }
  onProductClick(productId: any) {
    messageService.sendMessage('route_navigate', { path: '/sarees/' + productId })
  }
  render() {
    let { products } = this.props;

    if (!products) {
      products = []
    }
    let actionButton;
    if (!this.state.showProducts) {
      actionButton = <Button variant="contained" color="primary" onClick={() => this.showHideProduct(true)} >Add product</Button>
    }


    return (
      <div>

        {this.state.showProducts ? (
          <AddProduct cancelAddProduct={() => this.showHideProduct(false)} ></AddProduct>
        ) : ''}

        {actionButton}
        <div className={styles.product_list}>
          {products.map((product: any, i: any) => {
            return <div className={styles.box} key={i} onClick={() => this.onProductClick(product.productId)}>
              {/* <Link to="/kids">Dashboard */}
              <div className={styles.product_img_div} >
                <img className={styles.product_img} src={product.masterFilePath}></img>
              </div>
              <div> product:<span>{product.name}</span></div>
              <div>Price: <span>{product.price}</span></div>


              {/* </Link> */}
              {/* <div>Colors: <span>{product.color}</span></div> */}

            </div>
          })}
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state: any) => {

  const productsArray: any = [];
  for (var key in state.products.products) {
    productsArray.push(state.products.products[key]);
  }
  return { products: productsArray }
}

// export default Products
export default connect(mapStateToProps, { getProduts })(Products)
