import React from "react";
import Modal from '@material-ui/core/Modal';
import styles from './login.module.scss';
import { connect } from 'react-redux';
import { doLogin } from '../../store/actions/userActions';
import { GoogleLogin } from 'react-google-login';
import config from './../../config.json';

class LoginComponent extends React.Component {

    constructor(props) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this);
        this.doLoginUser = this.doLoginUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = { showLoginPopup: false, actionMethod: 'simle_login' };
    }
    handleChange(prop, event) {
        this.updateState(prop, event.target.value);
    }

    updateState(property, value) {
        const newState = this.state;
        newState[property] = value;
        this.setState(newState);
    }

    componentWillReceiveProps(nextProps, prevState) {
        this.setState((state) => ({
            showLoginPopup: nextProps.showLoginPopup
        }));
    }
    handleOpen(toggle) {
        this.setState((state) => ({
            showLoginPopup: toggle
        }));
        if(!toggle){
            this.props.onClose();
        }
    }

    doLoginUser() {
        const details = this.state;
        this.props.doLogin(details);
    }

    handleGoogleResponse = (response) =>{
        const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken, profileObj: response.profileObj}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        };
        fetch('http://localhost:4000/api/v1/auth/google', options).then(r => {
            const token = r.headers.get('x-auth-token');
            r.json().then(user => {
                if (token) {
                    this.setState({isAuthenticated: true, user, token})
                }
            });
        })
    }

    handleOnFailure = (error)=>{
        console.log(error);
    }

    render() {

        return (
            <Modal
                open={this.state.showLoginPopup}
                onClose={() => this.handleOpen(false)}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div className={styles.model_body}>
                    User Name: <input type="text" onChange={(event) => this.handleChange('userName', event)} /><br />
                    password: <input type="password" onChange={(event) => this.handleChange('password', event)} /><br />
                    <a href="#">Creat an account</a> <button onClick={() => this.doLoginUser()}> Login</button>
                    {/* <GoogleLogin
                        clientId={config.GOOGLE_CLIENT_ID}
                        buttonText="Login"
                        onSuccess={this.handleGoogleResponse}
                        onFailure={this.handleOnFailure}
                    /> */}
                </div>
            </Modal>
        );
    }
};

const mapStateToProps = (state) => ({ loggedInUser: state.user })
export default connect(mapStateToProps, { doLogin })(LoginComponent);