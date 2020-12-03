import React from "react";
import styles from './title-bar.module.scss'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LoginComponent from "../login/login";
import { connect } from "react-redux";

class TitleBarComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = { showLogin: false, loggedInUser: undefined };
        this.showLogin = this.showLogin.bind(this);
    }
    showLogin(toggle: any) {
        this.setState((state: any) => ({
            showLogin: toggle
        }));
    }
    componentWillReceiveProps(nextProps: any, prevState: any) {
        this.setState((state: any) => ({
            showLogin: false,
            loggedInUser: nextProps.loggedInUser
        }));
    }

    render() {

        return (
            <div className={styles.page_title}>
                <div className={styles.page_title_label}>Lady Emporium</div>
                <div className={styles.page_title_actions}>
                    <span>
                        <AccountCircleIcon></AccountCircleIcon>
                    </span>
                    {this.state.loggedInUser ?
                        <span className={styles.page_login_label}>{this.state.loggedInUser.userName}</span> :
                        <span className={styles.page_login_label} onClick={() => this.showLogin(true)}> Login</span>}
                    <span>
                        <ShoppingCartIcon ></ShoppingCartIcon>
                    </span>
                </div>
                <LoginComponent showLoginPopup={this.state.showLogin} onClose={() => this.showLogin(false)}></LoginComponent>
            </div>);
    }
};

const mapStateToProps = (state: any) => ({ loggedInUser: state.user })
export default connect(mapStateToProps, {})(TitleBarComponent);
