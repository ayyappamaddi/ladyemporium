import React from 'react';
import { connect } from 'react-redux';
import { getProduts, selectProdut, deleteProduct } from '../store/actions/productActions';
import styles from './products.module.scss'
import Button from '@material-ui/core/Button'
import AddProduct from './add-product';
import messageService from '../shared/message-service.js';
import DeleteIcon from '@material-ui/icons/Delete';
import PancelIcon from '@material-ui/icons/Create';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

export class Products extends React.Component<any, any> {
  showProducts = false;

  constructor(props: any) {
    super(props);
    this.showHideProduct = this.showHideProduct.bind(this);
    this.onProductClick = this.onProductClick.bind(this);
    this.handleProductEvents = this.handleProductEvents.bind(this);
    this.state = { showProducts: false };
    this.handleMsg()
  }
  handleMsg() {
    messageService.getMessage().subscribe((inf: any) => {
      console.log('message', inf);
    });
  }
  componentDidMount() {
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
    this.props.selectProdut({ productId });
    messageService.sendMessage('route_navigate', { path: '/sarees/' + productId })
  }
  handleProductEvents(event: any,eventName:string, productId:any) {
    event.stopPropagation();
    event.preventDefault();
    if(eventName === 'delete'){
      this.props.deleteProduct(productId);
    }
  }

  render() {
    let { products, userRole } = this.props;
    if (!products) {
      products = []
    }
    let actionButton;
    if (!this.state.showProducts && userRole === 'admin') {
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
              <div className={styles.product_label_name}>{product.name}</div>
              <div className={styles.product_label_price}>₹ {product.price}</div>
              {userRole === 'admin' ?
               <div>
                 <PancelIcon  onClick={(event) => this.handleProductEvents(event,'edit' ,product.productId)}></PancelIcon>
                 <DeleteIcon onClick={(event) => this.handleProductEvents(event,'delete' ,product.productId)}></DeleteIcon> 
                 <VisibilityIcon onClick={(event) => this.handleProductEvents(event,'visible' ,product.productId)}></VisibilityIcon> 
                 <VisibilityOffIcon onClick={(event) => this.handleProductEvents(event,'visibleOff' ,product.productId)}></VisibilityOffIcon> 
              </div>
               : <span></span>}

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
  return { products: productsArray, userRole: state.user.role }
}

// export default Products
export default connect(mapStateToProps, { getProduts, selectProdut, deleteProduct })(Products)
