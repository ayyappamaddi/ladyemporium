import React from 'react';
import { connect } from 'react-redux';
import { getProduts, selectProdut, deleteProduct, updateProduct } from '../store/actions/productActions';
import styles from './products.module.scss'
import Button from '@material-ui/core/Button'
import AddProduct from './add-product.jsx';
import messageService from '../shared/message-service.js';
import DeleteIcon from '@material-ui/icons/Delete';
import PancelIcon from '@material-ui/icons/Create';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect";
import Slider from "react-slick";
import utils from '../shared/utils-service'

export class Products extends React.Component {
  showProducts = false;
  editProduct = undefined;

  constructor(props) {
    super(props);
    this.showHideProduct = this.showHideProduct.bind(this);
    this.onProductClick = this.onProductClick.bind(this);
    this.handleProductEvents = this.handleProductEvents.bind(this);
    this.state = { showProducts: false, products: [], userRole: '' };
    this.handleMsg();

  }
  handleMsg() {
    messageService.getMessage().subscribe((msg) => {
      if (msg.event === 'element_entry' && msg.data.element === 'product_img_details' && msg.data.elementIndex > 0) {

        const products = this.state.products;
        products.map(product => product.autoplay = false);
        products[msg.data.elementIndex].autoplay = true;
        this.setState({ products });
      }
    });
  }
  componentDidMount() {
    this.props.getProduts()
  }

  showHideProduct(toggle) {
    this.setState((state) => ({
      showProducts: toggle
    }));
    if (!toggle) {
      this.editProduct = undefined;
    }
  }
  onProductClick(productId) {
    this.props.selectProdut({ productId });
    messageService.sendMessage('route_navigate', { path: '/sarees/' + productId })
  }
  handleProductEvents(event, eventName, index) {
    event.stopPropagation();
    event.preventDefault();
    const product = this.state.products[index];
    const products = this.state.products;
    if (eventName === 'delete') {
      this.props.deleteProduct(product.productId);
    } else if (eventName === 'visibleOff' || eventName === 'visible') {
      products[index].isAvailable = !products[index].isAvailable;
      this.props.updateProduct(product.productId, { isAvailable: products[index].isAvailable });
    } else if (eventName === 'edit') {
      this.editProduct = product;
      this.showHideProduct(true)
    }

  }

  componentDidUpdate(preProps, preState) {
    if (JSON.stringify(preProps.products) !== JSON.stringify(this.props.products)) {
      this.setState({ products: this.props.products });
      utils.loadPages();
    }
  }


  componentWillReceiveProps(props) {
    this.setState((state) => ({
      products: props.products,
      userRole: props.userRole
    }));
  }

  render() {
    var mobileSliderSettings = {
      infinite: true,
      speed: 3000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      accessibility: true,
      slide: 'div',
      lazyLoad: true,
      pauseOnHover: true
    };
    let { products, userRole } = this.state;
    if (!products) {
      products = []
    }

    let actionButton;
    if (!this.state.showProducts && userRole === 'admin') {
      actionButton = <Button variant="contained" color="primary" onClick={() => this.showHideProduct(true)} >Add product</Button>
    }

    return (
      <div className={isMobile ? styles.product_mobile_view : ''}>
        {
          this.state.showProducts ? <AddProduct editProduct={this.editProduct} cancelAddProduct={() => this.showHideProduct(false)} ></AddProduct> : ''
        }
        {actionButton}
        <div className={styles.product_list}>
          {products.map((product, i) => {
            return <div className={'product_img_details ' + styles.box} product_index={i} key={i} onClick={() => this.onProductClick(product.productId)}>



              <MobileView>
                <div className={styles.product_img_div} >
                  {product.autoplay ?
                    <Slider {...mobileSliderSettings}>
                      {product.productImages.map((mobileProdImg, j) =>
                        <div key={j}>
                          <img className={styles.product_img} src={mobileProdImg.src} alt=""></img>
                        </div>
                      )}
                    </Slider>:
                    <img className={styles.product_img} src={product.masterFilePath}></img>
              }
                  <div className={styles.product_mobile_quick_details}>
                    <div className={styles.product_label_name}>&nbsp; {product.name}</div>
                    <div onClick={() => this.onProductClick(product.productId)} className={styles.product_label_link}>View All</div>
                  </div>
                </div>
                <div className={styles.product_mobile_label_price}>₹ {product.price}</div>
              </MobileView>

              <BrowserView>
                <div className={styles.product_img_div} >
                  <img className={styles.product_img} src={product.masterFilePath}></img>
                </div>
                <div className={styles.product_quick_details}>
                  <div className={styles.product_label_name}>{product.name}</div>
                  <div className={styles.product_label_price}>₹ {product.price}</div>
                  <div onClick={() => this.onProductClick(product.productId)} className={styles.product_label_link}>More colors & design ...</div>
                </div>
              </BrowserView>

              {
                userRole === 'admin' ?
                  <div>
                    <PancelIcon className={styles.product_action_icons} onClick={(event) => this.handleProductEvents(event, 'edit', i)}></PancelIcon>
                    <DeleteIcon className={styles.product_action_icons} onClick={(event) => this.handleProductEvents(event, 'delete', i)}></DeleteIcon>
                    {product.isAvailable ?
                      <VisibilityIcon className={styles.product_action_icons} onClick={(event) => this.handleProductEvents(event, 'visible', i)}></VisibilityIcon>
                      :
                      <VisibilityOffIcon className={styles.product_action_icons} onClick={(event) => this.handleProductEvents(event, 'visibleOff', i)}></VisibilityOffIcon>}
                  </div>
                  : <span></span>
              }
            </div>
          })}
        </div>

      </div >
    )
  }
}



function sortProducts(arr) {
  return arr.sort(function (a, b) {
    if (a.productId < b.productId) return 1;
    if (a.productId > b.productId) return -1;
    return 0;
  });
}


const mapStateToProps = (state) => {

  let productsArray = [];
  for (var key in state.products.products) {
    productsArray.push(state.products.products[key]);
  }
  productsArray = sortProducts(productsArray)
  console.log('updated products===>',productsArray);
  return { products: productsArray, userRole: state.user.role }
}

export default connect(mapStateToProps, { getProduts, selectProdut, deleteProduct, updateProduct })(Products)
