import React from 'react';
import styles from './page-loader.module.scss'
import { CircularProgress } from '@material-ui/core';


export class PageLoader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.showLoader !== nextProps.showLoader) {
            this.setState({ showLoader: nextProps.showLoader });
        }
    }
    componentDidUpdate(preProps, preState) {
        if (this.state.showLoader !== preProps.showLoader) {
            this.setState({ showLoader: preProps.showLoader });
        }
    }

    render() {
        return <div>
            {this.state.showLoader ?
                <div className={styles.page_loader}>
                    <CircularProgress size="10rem" />
                </div> : <span></span>
            }
        </div>
    }
}



