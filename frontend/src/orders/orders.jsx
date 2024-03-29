import React from 'react';
import { connect } from 'react-redux';
import { getOrders, printAndUpdateOrders, dispatchOrders } from '../store/actions/ordersActions';
import { TextareaAutosize } from '@material-ui/core';
import styles from './orders.module.scss'
import cx from 'classnames'
import { Button, Checkbox } from '@material-ui/core';
import { AddTrackOrder } from './add-tracker';
import { PageLoader } from '../components/page-loader'

export class Orders extends React.Component {
    shippingAddressList = [];

    constructor(props) {
        super(props);
        this.state = { orders: [], filter: { orderStatus: 'confirmed' }, pageLoader: false };
        this.handleChange = this.handleChange.bind(this);
        this.addTrackOrders = this.addTrackOrders.bind(this);
    }

    componentDidMount() {
        this.props.getOrders();
    }

    handleChange(value, index) {
        this.shippingAddressList[index].shippingAddress = value;
        this.setState({ orders: this.shippingAddressList });
    }
    onOrderSelectChange(event, index) {
        // const orders = this.state.orders;
        let orders = this.state.orders ? this.state.orders : [];
        orders = orders.filter(order => order.orderStatus === this.state.filter.orderStatus);
        if (index === 'all') {
            for (let i = 0; i < orders.length; i++) {
                orders[i].selected = event.target.checked && orders[i].orderStatus === this.state.filter.orderStatus;
            }
        } else {
            orders[index].selected = event.target.checked;
        }
        this.setState({ orders });
    }

    componentWillReceiveProps(nextProps) {
        this.shippingProducts = nextProps.orders;
        this.setState({ orders: nextProps.orders });
        this.shippingAddressList = JSON.parse(JSON.stringify(nextProps.orders));
    }


    printShippingAddress() {
        const orders = this.state.orders;
        const shippingAddress = [];
        for (let i = 0; i < orders.length; i++) {
            if (orders[i].selected) {
                shippingAddress.push({ orderId: orders[i].orderId, shippingAddress: orders[i].shippingAddress });
            }
        }
        this.props.printAndUpdateOrders(shippingAddress);
    }
    dispatchOrders() {
        const orders = this.state.orders;
        const dispatchedOrders = [];
        for (let i = 0; i < orders.length; i++) {
            if (orders[i].selected) {
                dispatchedOrders.push({ orderId: orders[i].orderId, orderStatus: 'dispatched' });
            }
        }
        this.setState({ pageLoader: true });
        this.props.dispatchOrders(dispatchedOrders).then(res => {
            this.setState({ pageLoader: false });
            this.props.getOrders();
        });
    }
    filterOrders(orderStatus) {
        const stateFilter = this.state.filter;
        stateFilter.orderStatus = orderStatus;
        this.setState({ filter: stateFilter });
    }

    highLightOrder(event, order) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ currentOrder: order });
    }
    addTrackOrders(toggle) {
        this.setState({ showAddTracker: toggle });
    }
    render() {
        let orders = this.state.orders ? this.state.orders : [];
        orders = orders.filter(order => order.orderStatus === this.state.filter.orderStatus);

        let currentOrderHtml = <div></div>;
        if (this.state.currentOrder && this.state.currentOrder.orderId) {
            const currentOrder = this.state.currentOrder;
            currentOrderHtml = <div className={styles.current_order_details}>
                <div className={styles.shipping_row} >
                    <div className={styles.column1}>
                        <TextareaAutosize className={styles.shipping_addess_text} id="shipping-address"
                            aria-describedby="my-helper-text" value={currentOrder.shippingAddress} rowsMin={5} />
                    </div>
                    <div className={styles.column2}>
                        <span> {currentOrder.orderDateTime}</span>
                    </div>
                    <div className={cx(styles.column3, styles.image_rows)}>
                        {(currentOrder.orderImages && currentOrder.orderImages.length) ?
                            currentOrder.orderImages.map((orderImage, j) => <img className={styles.order_img} src={orderImage}></img>) : ''}
                    </div>
                    <Button variant="contained" color="primary" onClick={(event) => this.highLightOrder.bind(this)(event, undefined)}> Close</Button>
                </div>
                <div className={styles.current_order_img}>
                    {(currentOrder.orderImages && currentOrder.orderImages.length) ?
                        <img className={styles.highlighted_current_order_img} src={currentOrder.orderImages[0]}></img> : ''}
                </div>
            </div>
        }

        return <div>
            <iframe src="https://web.whatsapp.com/" width="300px" height="300px"></iframe>
            {/* <PageLoader showLoader={this.state.pageLoader}></PageLoader>
            <div className={styles.shipping_actions}>
                <Button onClick={() => this.filterOrders.bind(this)('confirmed')} >Confirmed</Button>
                <Button onClick={() => this.filterOrders.bind(this)('dispatched')} >Dispatched</Button>
                <Button className={styles.shipping_actions_btn} variant="contained" color="primary" onClick={() => this.printShippingAddress.bind(this)()}> Print</Button> &nbsp;&nbsp;&nbsp;
                <Button className={styles.shipping_actions_btn} variant="contained" color="primary" onClick={() => this.dispatchOrders.bind(this)()}> Dispatch All </Button> &nbsp;&nbsp;&nbsp;
                <Button className={styles.shipping_actions_btn} variant="contained" color="primary" onClick={() => this.addTrackOrders(true)}> Add Tracker</Button> &nbsp;&nbsp;&nbsp;
            </div>
            <b> Displaying {this.state.filter.orderStatus} orders, count: {orders.length} </b>
            <div className={styles.shipping_address_table} >
                <div className={styles.row_header}>
                    <div className={cx(styles.column, styles.column0)}> <Checkbox onChange={(event) => this.onOrderSelectChange(event, 'all')} /></div>
                    <div className={cx(styles.column, styles.column1)}> Shipping address</div>
                    <div className={cx(styles.column, styles.column2)}> Date</div>
                    <div className={cx(styles.column, styles.column3)}> Product Images</div>
                </div>
                <div className={styles.shipping_row_list}>
                    {orders.map((order, i) => {
                        return <div key={'order_row' + i} className={styles.shipping_row} >

                            <div className={styles.column0}> <Checkbox checked={!!order.selected} onChange={(event) => this.onOrderSelectChange(event, i)} /></div>
                            <div className={styles.column1}>
                                <TextareaAutosize className={styles.shipping_addess_text} id="shipping-address"
                                    aria-describedby="my-helper-text" value={order.shippingAddress}
                                    onChange={(event) => this.handleChange(event.target.value, i)} rowsMin={5} />
                            </div>
                            <div onClick={(event) => this.onOrderSelectChange({ target: { checked: !order.selected } }, i)} className={styles.column2}>
                                <span> {order.orderDateTime}</span>
                            </div>
                            <div onClick={(event) => this.onOrderSelectChange({ target: { checked: !order.selected } }, i)} className={cx(styles.column3, styles.image_rows)}>
                                {(order.orderImages && order.orderImages.length) ?
                                    order.orderImages.map((orderImage, j) => <img className={styles.order_img} src={orderImage}></img>) : ''}
                            </div>
                        </div>
                    })}
                </div>
            </div>
            {currentOrderHtml}
            {(this.state.showAddTracker) ? <AddTrackOrder cancelTrack={() => this.addTrackOrders(false)} ></AddTrackOrder> : <div></div>} */}
        </div>
    }
}
const mapStateToProps = (state) => {

    return { orders: state.orders.orders, userRole: state.user.role }
}

// export default Products
export default connect(mapStateToProps, { getOrders, printAndUpdateOrders, dispatchOrders })(Orders);


