import React, { Component } from 'react';

export default function Hoc(HocComponent: any) {
    return class extends Component<any, any>{
        constructor(props: any) {
            super(props);
        }
        render() {
            return (
                <div className="HOC-class"><span>
                    <HocComponent {...this.props} hoc= 'Yes' ></HocComponent>
                </span>
                </div >

            );
        }
    }
}