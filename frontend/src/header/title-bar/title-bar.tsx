import React from "react";
import styles from './title-bar.module.scss'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { MenuItem, Menu } from '@material-ui/core';
import LoginComponent from "../login/login";
import { connect } from "react-redux";
import { verifyUserLogin, doUserLogout } from '../../store/actions/userActions';

class TitleBarComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = { showLogin: false, loggedInUser: undefined, userOptionAnchorEl: undefined };
        this.showLogin = this.showLogin.bind(this);
        this.showHideUserMenu = this.showHideUserMenu.bind(this);
        props.verifyUserLogin();
    }
    showLogin(toggle: any) {
        this.setState((state: any) => ({
            showLogin: toggle
        }));
    }
    componentDidUpdate(preProps: any, preState: any) {
        if (preProps.loggedInUser !== this.props.loggedInUser) {
            this.setState({ loggedInUser: this.props.loggedInUser });
        }
    }

    componentWillReceiveProps(nextProps: any, prevState: any) {
        this.setState((state: any) => ({
            showLogin: false,
            loggedInUser: nextProps.loggedInUser
        }));
    }
    showHideUserMenu(value: any) {
        this.setState({ userOptionAnchorEl: value });
    }
    handleLogout() {
        this.props.doUserLogout();
        this.showHideUserMenu(false);
    }

    render() {

        return (
            <div className={styles.page_title}>
                <div className={styles.page_title_content}>

                    <a href="/">
                        <div className={styles.page_title_info}>
                            <div className={styles.page_title_logo}>
                                <img width="45px" src={require('../../assets/logo192.png')} />
                            </div>
                            <div className={styles.page_title_labels}>
                                <div className={styles.page_title_label}> Moksha Sri</div>
                                <div className={styles.page_sub_title_label}> Collections</div>
                            </div>
                        </div>
                    </a>
                    <div className={styles.page_title_actions}>
                        <span>
                            <AccountCircleIcon></AccountCircleIcon>
                        </span>
                        {(this.state.loggedInUser && this.state.loggedInUser.userName) ?
                            <span aria-controls="user-options-menu" onClick={(event) => this.showHideUserMenu(event.currentTarget)} className={styles.page_login_label}>{this.state.loggedInUser.userName}</span> :
                            <span className={styles.page_login_label} onClick={() => this.showLogin(true)}> Login</span>}
                        <span>
                            <ShoppingCartIcon ></ShoppingCartIcon>
                        </span>
                    </div>

                    <Menu id="user-options-menu" anchorEl={this.state.userOptionAnchorEl}
                        open={Boolean(this.state.userOptionAnchorEl)}
                        onClose={() => this.showHideUserMenu(false)}>
                        <MenuItem onClick={this.handleLogout.bind(this)}>Logout</MenuItem>
                        <MenuItem >Reset Password</MenuItem>
                    </Menu>

                    <LoginComponent showLoginPopup={this.state.showLogin} onClose={() => this.showLogin(false)}></LoginComponent>
                </div>
            </div>);
    }
};

const mapStateToProps = (state: any) => ({ loggedInUser: state.user })
export default connect(mapStateToProps, { verifyUserLogin, doUserLogout })(TitleBarComponent);
