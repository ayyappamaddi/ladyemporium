import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from './header.module.scss'
import TitleBarComponent from "./title-bar/title-bar";
// import SimpleTabs from './nav-bar/nav-bar.js';
var Carousel = require('react-responsive-carousel').Carousel;


class HeaderComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

    }

    render() {

        return (<div>
            <TitleBarComponent></TitleBarComponent>
            <Carousel showThumbs={false} >
                <div>
                    <img className={styles.carousel_image} src={require('../assets/images/carosal_saree1.jpg')}></img>
                    <p className="legend">Legend 1</p>
                </div>
                <div>
                    <img className={styles.carousel_image} src={require('../assets/images/carosal_saree2.jpg')}></img>
                    <p className="legend">Legend 2</p>
                </div>
                <div>
                    <img className={styles.carousel_image} src={require('../assets/images/carosal_saree.jpg')}></img>
                    <p className="legend">Legend 3</p>
                </div>
            </Carousel>
            
        </div>);
    }
};

export default HeaderComponent;
