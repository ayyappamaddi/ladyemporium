import React from 'react';

class LazyComponentClass extends React.Component<any, any>{
    constructor(props: any) {  
        super(props);
        this.state = {  };
    }
    render() {
        return (<div> This is from Lazy component..</div>);
    }
};
export default LazyComponentClass;