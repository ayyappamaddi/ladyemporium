import React from 'react';
import { connect } from 'react-redux';
import { findOrders } from '../store/actions/ordersActions';
import {
    Select, FormControlLabel, Checkbox, MenuItem, Button, FormControl, InputLabel,
    Table, TableHead, TableRow, TableCell, TableBody, TableContainer
} from '@material-ui/core';
import styles from './reports-component.module.scss'
import { PageLoader } from '../components/page-loader'


export default class ReportsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { orders: [], filter: { orderStatus: ['dispatched', 'confirmed'], dateRage: 'today' }, pageLoader: false };
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }
    handleFilterChange(field, value) {
        const fieldInfo = field.split('__');
        const updatedFilters = this.state.filter;
        if (fieldInfo[0] === "orderStatus") {
            let orderStatus = this.state.filter.orderStatus;
            updatedFilters.orderStatus = value ? [...orderStatus, fieldInfo[1]] : orderStatus.filter(field => field != fieldInfo[1]);
        } else {
            updatedFilters[field] = value;
        }
        this.setState({ filter: updatedFilters });
    }
    searchOrders() {
        console.log('dateRange===>', this.state.dateRage);
        this.setState({ pageLoader: true });
        findOrders({}).then((orderList) => {
            console.log('orderList==>', orderList);
            this.setState({ pageLoader: false, orders: orderList, viewOrders: true });
        });
    }

    printOrders() {
        window.open('C:/ayyappa/practice/ladyemporium/print-reports.html?dateRange=today&orderStatus=confirmed&dispatched' , '_blank');
    }
    render() {
        const columns = [
            { id: 'sno', label: 'S No', align: 'center', width: '50px' },
            { id: 'shippingAddress', label: 'Shipping Address', align: 'left' },
            { id: 'phoneNumbers', label: 'Phone Nos', width: '100px' },
            { id: 'orderDateTime', label: 'Date & Time', width: '100px' }
        ];

        const dispatchedFilter = !!this.state.filter.orderStatus.find(field => field === 'dispatched');
        const confirmedFilter = !!this.state.filter.orderStatus.find(field => field === 'confirmed');
        if (dispatchedFilter) {
            const trackingColumn = { id: 'trackId', label: 'Track Id', width: '100px' }
            columns.splice(1, 0, trackingColumn)
        }
        return <div>Reports Component
            <PageLoader showLoader={this.state.pageLoader}></PageLoader>
            <div>
                <FormControlLabel control={<Checkbox checked={dispatchedFilter}
                    onChange={event => this.handleFilterChange('orderStatus__dispatched', event.target.checked)} />} label="Dispatched" />
                <FormControlLabel control={<Checkbox checked={confirmedFilter} />}
                    onChange={event => this.handleFilterChange('orderStatus__confirmed', event.target.checked)} label="Confirmed" />
                <FormControl className={styles.selectFormControl}>
                    <InputLabel id="demo-simple-select-helper-label">Date Ragene</InputLabel>
                    <Select autoWidth value={this.state.filter.dateRage} onChange={event => this.handleFilterChange('dateRage', event.target.value)}>
                        <MenuItem value="today"> Today </MenuItem>
                        <MenuItem value="yesterday">Yesterday</MenuItem>
                        <MenuItem value="today_yesterday">Today & Yesterday</MenuItem>
                        <MenuItem value="last_week">Last week</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" className={styles.viewOrdersButton} onClick={this.searchOrders.bind(this)} > View Orders</Button>  &nbsp;
                <Button variant="contained" color="primary" onClick={this.printOrders.bind(this)} > Print</Button>
            </div>
            <div>{!this.state.orders.length && this.state.viewOrders}</div>
            <div>
                <TableContainer className={styles.orderTableContainer}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align}
                                        style={{ minWidth: column.minWidth, width: column.width }} className={styles.tableHeaderCell}>
                                        {column.label} </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {this.state.orders.map((order, index) => {
                                return (
                                    <TableRow hover tabIndex={-1} key={index}>
                                        {columns.map((column) => {
                                            let value = order[column.id];
                                            if (column.id === 'phoneNumbers') {
                                                value = order[column.id].map(phoneNo => <div>{phoneNo}</div>);
                                            }

                                            return (
                                                <TableCell key={column.id} align={column.align} className={styles.tableDataCell}>
                                                    {value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    }
}