import React from 'react';
import { connect } from 'react-redux';
import { TextareaAutosize } from '@material-ui/core';
import ReactDOM from 'react-dom';
import styles from './add-tracker.module.scss';
import { PageLoader } from '../components/page-loader'
import { Button, Input, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, FormHelperText } from '@material-ui/core';
import { trackOder, getOrderById, updateTrackOrder } from '../store/actions/ordersActions';

export class AddTrackOrder extends React.Component {

    constructor(props) {
        super(props);
        this.state = { searchKey: '', pageLoader: false };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(property, value) {
        const propObj = {};
        propObj[property] = value;
        propObj['orderError'] = false;
        this.setState(propObj);
    }

    confirmTrack() {
        if (this.state.orderNumber && this.state.trackNumber && !this.state.orderError) {
            this.setState({ pageLoader: true });

            updateTrackOrder({ orderId: this.state.orderNumber, trackId: this.state.trackNumber })
                .then((res) => {
                    this.setState({
                        orderNumber: '', trackNumber: '', orderError: false, errorMsg: '', orderDescription: '', pageLoader: false
                    });
                    const childNodes = this.orderNumberRef.childNodes;
                    if (childNodes && childNodes.length) {
                        ReactDOM.findDOMNode(childNodes[0]).focus();
                    }
                }, (err) => {
                    this.setState({ orderError: true,pageLoader: false, errorMsg: ' Something went wrong to update Track Id' });
                })
        }
    }

    onKeyUp(event) {
        if (event.charCode === 13) {
            const childNodes = this.trackNumbRef.childNodes;
            if (event.target.id === "order-number-input") {
                if (childNodes && childNodes.length) {
                    ReactDOM.findDOMNode(childNodes[0]).focus();
                }
            } else if (event.target.id === "track-order-input") {
                if (childNodes && childNodes.length) {
                    ReactDOM.findDOMNode(childNodes[0]).blur();
                }
                this.confirmTrack();
            }
        }
    }
    async getOrderInfo() {
        if (this.state.orderNumber !== '') {
            getOrderById(this.state.orderNumber).then((orderInfo) => {
                if (orderInfo && orderInfo.shippingAddress) {
                    this.setState({ orderError: false, errorMsg: '', orderDescription: orderInfo.shippingAddress });
                } else {
                    this.setState({ orderError: true, errorMsg: 'No orders found for given order number', orderDescription: '' });
                }
            }, (err) => {
                this.setState({ orderError: true, errorMsg: 'No orders found for given order number', orderDescription: '' });
            });
        }
    }

    render() {
        return <Dialog maxWidth="xl" open={true} onClose={this.props.cancelAddProduct}
            aria-labelledby="max-width-dialog-title">
            <DialogTitle id="max-width-dialog-title" disableTypography={true}><b>Add track to an order</b></DialogTitle>
            <DialogContent dividers={true}>
                <div className={styles.add_Tracker} >
                    <FormControl className={styles.element_row}>
                        <InputLabel htmlFor="order-number-input">Order Number </InputLabel>
                        <Input ref={c => (this.orderNumberRef = c)} autoFocus id="order-number-input" value={this.state.orderNumber}
                            onKeyPress={this.onKeyUp.bind(this)} onBlur={this.getOrderInfo.bind(this)}
                            aria-describedby="my-helper-text" onChange={(event) => this.handleChange('orderNumber', event.target.value)} />
                    </FormControl>
                    <FormControl className={styles.element_row}>
                        <InputLabel htmlFor="track-order-input">Track Number </InputLabel>
                        <Input onKeyPress={this.onKeyUp.bind(this)} ref={c => (this.trackNumbRef = c)} id="track-order-input"
                            value={this.state.trackNumber} aria-describedby="my-helper-text" onChange={(event) => this.handleChange('trackNumber', event.target.value)} />
                    </FormControl>
                </div>
                <div className={styles.order_details}>
                    {this.state.orderError ? <span className={styles.error_msg}>{this.state.errorMsg}</span> : <span></span>}
                    <h3>Order Details</h3>
                    <FormControl className={styles.order_address}>
                        <TextareaAutosize value={this.state.orderDescription} id="product-description" aria-describedby="my-helper-text" rowsMin={4} />
                        <FormHelperText id="my-helper-text">Order Address</FormHelperText>
                    </FormControl>

                </div>
                <PageLoader showLoader={this.state.pageLoader}></PageLoader>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.props.cancelTrack()} >Cancel Track</Button>
                <Button variant="contained" color="primary" onClick={this.confirmTrack.bind(this)} > Confirm Track</Button>
            </DialogActions>
        </Dialog>
    }
}
const mapStateToProps = (state) => {

    return { filteredOrders: state.orders.searchOrders, }
}


export default connect(mapStateToProps, { trackOder })(AddTrackOrder);


