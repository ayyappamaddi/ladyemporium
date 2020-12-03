import React from "react";
import Modal from '@material-ui/core/Modal';
import styles from './login.module.scss';
import { connect } from 'react-redux';
import { doLogin } from '../../store/actions/userActions';

class LoginComponent extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this);
        this.doLoginUser = this.doLoginUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = { showLoginPopup: false, actionMethod: 'simle_login' };
    }
    handleChange(prop: string, event: any) {
        this.updateState(prop, event.target.value);
    }

    updateState(property: string, value: any) {
        const newState: any = this.state;
        newState[property] = value;
        this.setState(newState);
    }

    componentWillReceiveProps(nextProps: any, prevState: any) {
        this.setState((state: any) => ({
            showLoginPopup: nextProps.showLoginPopup
        }));
    }
    handleOpen(toggle: any) {
        this.setState((state: any) => ({
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
                </div>
            </Modal>
        );
    }
};

const mapStateToProps = (state: any) => ({ loggedInUser: state.user })
export default connect(mapStateToProps, { doLogin })(LoginComponent);