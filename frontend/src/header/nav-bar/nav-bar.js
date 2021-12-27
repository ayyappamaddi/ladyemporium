import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import messageService from '../../shared/message-service';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    key: index,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

let defaultTabList = [
  { path: '/sarees', label: 'home' },
  // { path: '/track_order', label: 'Track Order' }
];
const adminTabs = [
  { path: 'orders', label: 'Order Management' },
  { path: 'reports', label: 'Reports' }
];
let tabList = [...defaultTabList];

function SimpleTabs(props) {
  const [value, setTabIndex] = React.useState(0);
  const [isAdminUser, setIsAdminUser] = React.useState(0);
  useEffect(() => {
    tabList = [...defaultTabList, ...adminTabs];
    // if (props.adminUser) {
    //   tabList = [...defaultTabList, ...adminTabs];
    // } else {
    //   tabList = [...defaultTabList];
    // }

    setTimeout(() => {
      setIsAdminUser(props.adminUser);
    }, 1000);
  });


  let history = useHistory();
  messageService.getMessage().subscribe(msg => {
    if (msg.event === 'route_navigate') {
      history.push(msg.data.path);
    }
  });


  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
    history.push(tabList[newValue].path);
  };

  return (

    <div>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          {tabList.map((tab, i) => <Tab label={tab.label} {...a11yProps(i)} />)}
        </Tabs>
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state) => {
  const adminUser = state.user && state.user.role === 'admin' ? true : false;
  return { adminUser };
}

export default connect(mapStateToProps, {})(SimpleTabs)