import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import styles from './app.module.scss';
import Products from './products/products';
import ColorContext from './colorContext';
import HeaderComponent from './header/header';
import KidsComponent from './products/kids/kids';
import ProductDetailsComponent from './products/product-details';
import Orders from './orders/orders'
import TrackOrders from './orders/track-orders'
import ReportsComponent from './reports/reports-component'


import SimpleTabs from './header/nav-bar/nav-bar.js'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axiosInterceptor from './shared/axios-interceptor';

class App extends React.Component<any, any> {
  studentList: any = [];
  constructor(props: any) {
    super(props);
    axiosInterceptor.initInterceptor();
    this.state = { studentList: [], studentId: '1234', data: { name: "ayyappa" } };
    this.addStudent = this.addStudent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.studentList = [{ name: 'ayyappa', id: 'sdfjljo' }];
  }
  handleChange(event: any) {
    const newState: any = this.state;
    const eleName = event.target.name;
    newState[eleName] = event.target.value
    this.setState(newState);
  }

  addStudent(student: any) {
    const newState: any = this.state;
    console.log(newState.studentList, 'addStudent==>', student);
    newState.studentList.push(student);
    this.setState(newState);
  }
  render() {
    return (<div >
      <HeaderComponent></HeaderComponent>
      <Router>
        <SimpleTabs></SimpleTabs>
        <div className={styles.lady_emporium_content}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/sarees" />
            </Route>
            <Route exact path="/sarees" component={Products} />
            <Route exact path="/orders" component={Orders} />
            <Route exact path="/reports" component={ReportsComponent} />
            <Route exact path="/track_order" component={TrackOrders} />
            <Route exact path="/sarees/:productId" component={ProductDetailsComponent} />
            <Route exact path="/kids" component={KidsComponent} />
          </Switch>
        </div>
      </Router>

    </div>);
  }
};

export default App;

