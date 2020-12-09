import React from "react";
import styles from './title-bar.module.scss'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LoginComponent from "../login/login";
import { connect } from "react-redux";
import { verifyUserLogin } from '../../store/actions/userActions';

class TitleBarComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = { showLogin: false, loggedInUser: undefined };
        this.showLogin = this.showLogin.bind(this);
        props.verifyUserLogin();
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
                        {this.state.loggedInUser ?
                            <span className={styles.page_login_label}>{this.state.loggedInUser.userName}</span> :
                            <span className={styles.page_login_label} onClick={() => this.showLogin(true)}> Login</span>}
                        <span>
                            <ShoppingCartIcon ></ShoppingCartIcon>
                        </span>
                    </div>
                    <LoginComponent showLoginPopup={this.state.showLogin} onClose={() => this.showLogin(false)}></LoginComponent>
                </div>
            </div>);
    }
};

const mapStateToProps = (state: any) => ({ loggedInUser: state.user })
export default connect(mapStateToProps, { verifyUserLogin })(TitleBarComponent);
