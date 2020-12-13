import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useHistory, useParams } from "react-router-dom";
import messageService from '../../shared/message-service';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const routes = [{ path: '/sarees' }, { path: '/orders' }, { path: '/track_order' }]
// { path: '/kids' }, { path: '/jewellery' }, { path: '/contactus' }, { path: '/track-order' }

export default function SimpleTabs() {
  const [value, setTabIndex] = React.useState(0);
  let history = useHistory();


  messageService.getMessage().subscribe(event=>{
      history.push(event.data.path);
  });


  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
    history.push(routes[newValue].path);

  };

  return (
    <div>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Sarees" {...a11yProps(0)} />
          {/* <Tab label="kids" {...a11yProps(1)} />
          <Tab label="Jewellery" {...a11yProps(2)} />
          <Tab label="Contact US" {...a11yProps(3)} /> */}
          <Tab label="Order Mis" {...a11yProps(4)} />
          <Tab label="Track Order" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
    </div>
  );
}
