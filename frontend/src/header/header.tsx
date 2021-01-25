import React from "react";
import styles from './header.module.scss'
import TitleBarComponent from "./title-bar/title-bar";
import { connect } from "react-redux";
import Slider from "react-slick";

class HeaderComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

    }

    render() {
        var settings = {
            
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            accessibility: true,
            slide: 'div',
        };
        let carosalHTML;
        if (!(this.props.selectedProduct && this.props.selectedProduct.name) && !this.props.userRole) {
            carosalHTML = <Slider {...settings}>
                <div>
                    <img className={styles.carousel_image} src={require('../assets/images/carosal_saree1.jpg')}></img>
                </div>
                <div>
                    <img className={styles.carousel_image} src={require('../assets/images/carosal_saree2.jpg')}></img>
                </div>

            </Slider>
        } else {
            carosalHTML = '';
        }
        return (<div className={styles.header_content}>
            <TitleBarComponent></TitleBarComponent>
            {carosalHTML}
        </div>);
    }
};



const mapStateToProps = (state: any) => {
    return { selectedProduct: state.products.selectedProduct, userRole: state.user.role }
}
export default connect(mapStateToProps, {})(HeaderComponent)

