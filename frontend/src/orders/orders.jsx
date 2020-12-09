import React from 'react';
import { connect } from 'react-redux';
import { getOrders } from '../store/actions/ordersActions';
import { TextareaAutosize } from '@material-ui/core';
import styles from './orders.module.scss'
import Button from '@material-ui/core/Button'

import messageService from '../shared/message-service.js';

export class Orders extends React.Component {
    shippingAddressList = [];

    constructor(props) {
        super(props);
        this.state = { orders: [] };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.props.getOrders()
    }

    handleChange(value, index) {
        this.shippingAddressList[index].shippingAddress = value;
        this.setState({ orders: this.shippingAddressList });
    }
    componentWillReceiveProps(nextProps) {
        this.shippingProducts = nextProps.orders;
        this.setState({ orders: nextProps.orders });
        this.shippingAddressList = JSON.parse(JSON.stringify(nextProps.orders)) ;

    }


    printShippingAddress() {
        var divToPrint = document.getElementById('divToPrint');
        var popupWin = window.open('', '_blank', 'width=300,height=300');
        popupWin.document.open();
        popupWin.document.write('<html><body onload="window.print()">' + divToPrint.innerHTML + '</html>');
        popupWin.document.close();
    }


    render() {
        let orders = this.state.orders ? this.state.orders : [];

        return <div>
            <button onClick={() => this.printShippingAddress.bind(this)()}> Print Orders</button>
            <div className={styles.hide_print_content}>
                <div id="divToPrint" className={styles.order_shipping_content}>
                
                    {orders.map((order, i) => {
                        return <div className={styles.order_shipping_address}>
                            {order.shippingAddress}

                        </div>
                    })}
                </div>

            </div>
            <div >
                {orders.map((order, i) => {
                    return <div >

                        <TextareaAutosize className={styles.shipping_addess_text} id="shipping-address"
                            aria-describedby="my-helper-text" value={order.shippingAddress}
                            onChange={(event) => this.handleChange(event.target.value, i)} rowsMin={5} />
                        <span>Date: {order.orderDate}</span>
                        <img className={styles.order_img} src={order.orderImages[0]}></img>
                        <img className={styles.order_img} src={order.orderImages[1]}></img>
                    </div>
                })}
            </div>
        </div>
    }
}
const mapStateToProps = (state) => {

    return { orders: state.orders.orders, userRole: state.user.role }
}

// export default Products
export default connect(mapStateToProps, { getOrders })(Orders);


