import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from './header.module.scss'
import TitleBarComponent from "./title-bar/title-bar";
import { connect } from "react-redux";
// import SimpleTabs from './nav-bar/nav-bar.js';
var Carousel = require('react-responsive-carousel').Carousel;


class HeaderComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

    }

    render() {
        let carosalHTML;
        if (!(this.props.selectedProduct && this.props.selectedProduct.name)) {
            carosalHTML = <Carousel showThumbs={false} >
                <div>
                    <img className={styles.carousel_image} src={require('../assets/images/carosal_saree1.jpg')}></img>
                </div>
                <div>
                    <img className={styles.carousel_image} src={require('../assets/images/carosal_saree2.jpg')}></img>
                </div>
            </Carousel>
        }else{
            carosalHTML = '';
        }
        return (<div className={styles.header_content}>
            <TitleBarComponent></TitleBarComponent>
            {carosalHTML}
        </div>);
    }
};



const mapStateToProps = (state: any) => {
    return { selectedProduct: state.products.selectedProduct }
}

export default connect(mapStateToProps, {})(HeaderComponent)
// export default HeaderComponent
