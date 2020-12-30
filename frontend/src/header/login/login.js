import React from "react";
import {
    TextField, DialogContent, Dialog, DialogTitle, Button, DialogActions, FormHelperText,
    FormControl, Input, InputLabel
} from '@material-ui/core';
import styles from './login.module.scss';
import { connect } from 'react-redux';
import { doLogin, createUser } from '../../store/actions/userActions';
import { GoogleLogin } from 'react-google-login';
import config from './../../config.json';
const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validMobileRegex = RegExp(/[0-9]{10}/g)
class LoginComponent extends React.Component {
    showUserForm = false;
    constructor(props) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this);
        this.doLoginUser = this.doLoginUser.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = { showLoginPopup: false, actionMethod: 'simle_login', newUser: { name: '', email: '', phoneNumber: '', password: '', confirmPassword: '' }, errors: { valid: true, errorFilds: [] } };
    }
    handleChange(prop, event) {
        if (event.target) {
            this.updateState(prop, event.target.value);
        } else {
            this.updateState(prop, event);
            if (prop === 'showUserForm') {
                this.updateState('newUser', {})
                this.updateState('errors', { valid: true, errorFilds: [] })
            }
        }
    }



    updateState(property, value) {
        const keys = property.split('__');
        let tempState = this.state;
        const newState = this.state;

        for (let i = 0; i < keys.length - 1; i++) {
            tempState = tempState[keys[i]];
        }

        const changeProperty = keys[keys.length - 1];
        tempState[changeProperty] = value;
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
        if (!toggle) {
            this.props.onClose();
        }
    }

    doLoginUser() {
        const details = this.state;
        this.props.doLogin(details);
    }

    handleGoogleResponse = (response) => {
        const tokenBlob = new Blob([JSON.stringify({ access_token: response.accessToken, profileObj: response.profileObj }, null, 2)], { type: 'application/json' });
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
                    this.setState({ isAuthenticated: true, user, token })
                }
            });
        })
    }


    createUser(event) {
        event.preventDefault();
        if (this.state.errors.valid) {
            this.props.createUser(this.state.newUser).then((res) => {
                console.log('user successfully got created', res);
            }).catch((err) => {
                console.log('user already exists', err);
            });
        }
    }

    validateUser(property) {
        let errors = this.state.errors;

        switch (property) {
            case 'name':
                errors.name = this.state.newUser[property] && this.state.newUser[property].length < 5
                    ? 'Full Name must be 5 characters long!'
                    : '';
                break;
            case 'email':
                errors.email = this.state.newUser[property] && validEmailRegex.test(this.state.newUser[property]) ? ''
                    : 'Email is not valid!';
                break;
            case 'phoneNumber':
                errors.phoneNumber = this.state.newUser[property].length === 10 ? ''
                    : 'Mobile is not valid!';
                break;

            case 'password':
                errors.password = this.state.newUser[property] && this.state.newUser[property].length < 8
                    ? 'Password must be 8 characters long!'
                    : '';
                break;
            case 'confirmPassword':
                errors.confirmPassword = this.state.newUser['password'] === this.state.newUser[property]
                    ? ''
                    : 'Password must be 8 characters long!';
                break;
            default:
                break;
        }
        if (errors[property] && !errors.errorFilds.includes(property)) {
            errors.valid = false;
            errors.errorFilds.push(property);
        } else if (!errors[property]) {
            errors.errorFilds = errors.errorFilds.filter(key => key !== property);
        }
        if (errors.errorFilds.length === 0) {
            errors.valid = true;
        }
        this.setState({ errors })

    }

    render() {
        let loginForm = '';
        if (!this.state.showUserForm) {
            loginForm = <div >
                <TextField autoFocus margin="dense" value={this.state.name} onChange={(event) => this.handleChange('userName', event)}
                    id="name" label="User name / phone number" type="email" fullWidth />
                <TextField type="password" margin="dense" value={this.state.password} onChange={(event) => this.handleChange('password', event)}
                    id="password" label="Password" fullWidth />
            </div>
        } else {

            loginForm = <div>
                <h3>Create Account</h3>
                <form onSubmit={this.handleSubmit} noValidate>
                    <FormControl fullWidth error={this.state.errors.name} >
                        <InputLabel >Name</InputLabel>
                        <Input value={this.state.newUser.name} onChange={(event) => { this.handleChange('newUser__name', event); this.validateUser('name'); }}
                            aria-describedby="component-error-text" />
                        <FormHelperText>{this.state.errors.name ? this.state.errors.name : 'User Name'}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth error={this.state.errors.phoneNumber}  >
                        <InputLabel >Mobile Number</InputLabel>
                        <Input value={this.state.newUser.phoneNumber} type="number" onChange={(event) => { this.handleChange('newUser__phoneNumber', event); this.validateUser('phoneNumber'); }}
                            aria-describedby="component-error-text" />
                        <FormHelperText>{this.state.errors.phoneNumber ? this.state.errors.phoneNumber : 'mobile number with out contry code Ex: 9000123456'}></FormHelperText>
                    </FormControl>
                    <FormControl fullWidth error={this.state.errors.email} >
                        <InputLabel >Email Address</InputLabel>
                        <Input value={this.state.newUser.email} onChange={(event) => { this.handleChange('newUser__email', event); this.validateUser('email'); }}
                            aria-describedby="component-error-text" />
                        <FormHelperText>{this.state.errors.email ? this.state.errors.email : 'User Email address'}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth error={this.state.errors.password}>
                        <InputLabel>Password</InputLabel>
                        <Input value={this.state.newUser.password} onChange={(event) => { this.handleChange('newUser__password', event); this.validateUser('password'); }}
                            aria-describedby="component-error-text" type="password" />
                        <FormHelperText>{this.state.errors.password ? this.state.errors.password : 'Password must be eight characters in length.'}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth error={this.state.errors.confirmPassword}>
                        <InputLabel >Confirm Password</InputLabel>
                        <Input value={this.state.newUser.confirmPassword} onChange={(event) => { this.handleChange('newUser__confirmPassword', event); this.validateUser('confirmPassword'); }}
                            aria-describedby="component-error-text" type="password" />
                        <FormHelperText>{this.state.errors.confirmPassword ? this.state.errors.confirmPassword : 'Re enter password'}</FormHelperText>
                    </FormControl>
                </form>
            </div>
        }

        return (

            <Dialog maxWidth="xs" onClose={() => this.handleOpen(false)} aria-labelledby="max-width-dialog-title" open={this.state.showLoginPopup}>
                <DialogTitle disableTypography={true} id="simple-dialog-title">Lady emporium</DialogTitle>
                <DialogContent>
                    {loginForm}
                </DialogContent>
                <DialogActions>
                    {!this.state.showUserForm ?
                        <div>
                            <Button color="primary" onClick={() => this.handleChange('showUserForm', true)}> Creat an account</Button>
                            <Button variant="contained" color="primary" onClick={() => this.doLoginUser()}> Login</Button>
                        </div> :
                        <div>
                            <Button color="primary" onClick={() => this.handleChange('showUserForm', false)}> cancel</Button>
                            <Button variant="contained" color="primary" onClick={(event) => this.createUser.bind(this)(event)}> Create Account</Button>
                        </div>

                    }
                </DialogActions>
                {/* <GoogleLogin
                        clientId={config.GOOGLE_CLIENT_ID}
                        buttonText="Login"
                        onSuccess={this.handleGoogleResponse}
                        onFailure={this.handleOnFailure}
                    /> */}

            </Dialog>


        );
    }
};

const mapStateToProps = (state) => ({ loggedInUser: state.user })
export default connect(mapStateToProps, { doLogin, createUser })(LoginComponent);