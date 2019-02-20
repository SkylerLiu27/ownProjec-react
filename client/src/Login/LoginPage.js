// handle login logic
import React from 'react';
import LoginForm from './LoginForm';
import PropTypes from'prop-types';
import Auth from '../Auth/Auth'

class LoginPage extends React.Component{

    constructor(props, context){
        super(props, context);
        this.state = {
          errors: {},
          user: {
              email: '',
              password: ''
          }
        };
    }

    // get login data and post to server
    processForm(event){
        event.preventDefault();
        const email = this.state.user['email'];
        const password = this.state.user['password'];
        console.log(`email: ${email}`);
        console.log(`password: ${password}`);

        // TODO: post login data

        // POST the login data to the Node.js Server
        const url = `http://${window.location.hostname}:3000/auth/login`;
        const request = new Request(
            url,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        // fetch HTTP request to Node.js server
        fetch(request)
            .then(response => {
                // OK
                if(response.status === 200){
                    this.setState({errors: {}});
                    // parse the json string to json
                    response.json()
                    .then(json => {
                        console.log(json);
                        // Authenticate user, save the token to local Storage
                        Auth.authenticateUser(json.token, email);
                        // use router in context to redirct to '/'
                        this.context.router.replace('/');
                    });
                } else { // some error happens
                    console.log('Login failed');
                    response.json()
                        .then(json => {
                            console.log(json);
                            // handle some error. Response.errors
                            if(json.errors){
                                const errors = json.errors;
                                errors.summary = json.message;
                                this.setState({errors: errors});
                            } else {
                                const errors = {};
                                errors.summary = json.message;
                                this.setState({errors: errors});
                            }
                        });
                }
            })

    }

    changeUser(event){
        // user email / password change
        // get field name. email || password
        const field = event.target.name;
        // user
        const user = this.state.user;
        // save the changed value into state
        user[field] = event.target.value;
        // use setState to change UI
        this.setState({user: user});
    }

    render(){
        return(
            <LoginForm 
                onSubmit={event => this.processForm(event)}
                onChange={event => this.changeUser(event)}
                errors={this.state.errors}
                user={this.state.user}
                />
        );
    }
}

LoginPage.contextTypes = {
    router: PropTypes.object.isRequired
}

export default LoginPage;