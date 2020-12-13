import React from 'react';
import { connect } from 'react-redux';
import { TextareaAutosize } from '@material-ui/core';
import styles from './track-orders.module.scss'
import cx from 'classnames'
import { Button, Input, FormControl, InputLabel } from '@material-ui/core';
import { trackOder } from '../store/actions/ordersActions';

export class TrackOrders extends React.Component {
    shippingAddressList = [];

    constructor(props) {
        super(props);
        this.state = { searchKey: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(property, value) {
        const propObj = {};
        propObj[property] = value;
        this.setState(propObj);
    }
    trackOderByPhone() {
        this.props.trackOder(this.state.searchKey);
    }

    render() {
        const trackingOrders = this.props.filteredOrders ? this.props.filteredOrders : [];
        let trackOrdersHtml = ''
        if (trackingOrders && trackingOrders.length) {
            trackOrdersHtml = <div className={styles.shipping_address_table} >
                <div className={styles.row_header}>
                    <div className={cx(styles.column, styles.column1)}> Shipping address</div>
                    <div className={cx(styles.column, styles.column2)}> Date</div>
                    <div className={cx(styles.column, styles.column3)}> Product Images</div>
                </div>
                <div className={styles.shipping_row_list}>
                    {trackingOrders.map((order, i) => {
                        return <div key={'order_row' + i} className={styles.shipping_row} >
                            <div className={styles.column1}>
                                <TextareaAutosize className={styles.shipping_addess_text} id="shipping-address"
                                    aria-describedby="my-helper-text" value={order.shippingAddress} rowsMin={5} />
                            </div>
                            <div onClick={(event) => this.highLightOrder.bind(this)(event, order)} className={styles.column2}>
                                <span> {order.orderDateTime}</span>
                            </div>
                            <div onClick={(event) => this.highLightOrder.bind(this)(event, order)} className={cx(styles.column3, styles.image_rows)}>
                                {(order.orderImages && order.orderImages.length) ?
                                    order.orderImages.map((orderImage, j) => <img className={styles.order_img} src={orderImage}></img>) : ''}
                            </div>
                        </div>
                    })}
                </div>
            </div>
        }else if(this.state.searchKey){
            trackOrdersHtml = <div>No orders found for given number <b>{this.state.searchKey}</b></div>
        }

        return <div className={styles.track_orders_page}>

            <FormControl className={styles.element_row}>
                <InputLabel htmlFor="my-input">Phone number to track</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" onChange={(event) => this.handleChange('searchKey', event.target.value)} />
            </FormControl>
            <Button variant="contained" color="primary" onClick={() => this.trackOderByPhone.bind(this)()}> Track Order</Button>
            {trackOrdersHtml}
        </div>
    }
}
const mapStateToProps = (state) => {

    return { filteredOrders: state.orders.searchOrders }
}

// export default Products
export default connect(mapStateToProps, { trackOder })(TrackOrders);


