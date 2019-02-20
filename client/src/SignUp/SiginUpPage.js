import SignUpForm from './SiginUpForm'
import React from 'react';
import PropTypes from'prop-types';

class SignUpPage extends React.Component {

    constructor(props, context){
        super(props, context);
        this.state = {
            errors: {},
            user: {
                email: '',
                password: '',
                confirm_password: ''
            }
        }
    }

    // onSubmit callback
    processForm(event){
        // prevent default
        event.preventDefault();
        const email = this.state.user['email'];
        const password = this.state.user['password'];
        const confirm_password = this.state.user['confirm_password'];
        console.log(`email: ${email}`);
        console.log(`password: ${password}`);
        console.log(`confirm_password: ${confirm_password}`);

        // error
        if(password !== confirm_password){
            return;
        }
        // POST request to Node.js server
        const url = `http://${window.location.hostname}:3000/auth/signup`;
        console.log("@@@@@@@@@@@");
        const request = new Request(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        console.log("@@@@@@@@@@@");
        
        // fetch request
        fetch(request)
            .then(response => {
                // status === 200. OK
                if(response.status === 200){
                    console.log('Sign up Succeed!');
                    // clear the errors
                    this.setState({errors: {}});
                    // redirect to login page
                    this.context.router.replace('/login');
                }else {
                    response.json()
                        .then(json => {
                           console.log(json);
                           if(json.errors) {
                               const errors = json.errors;
                               errors.summary = json.message;
                               this.setState({errors: errors});
                           }else { 
                               console.log('resoponse.status = ' + response.status);
                               const errors = {};
                               errors.summary = json.message;
                               this.setState({errors: errors});
                           }
                        });
                }
            });

    }

    // input field onChange callback
    changeUser(event){
        // get the current value
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
        //setState
        this.setState({user: user});
        // handle error, password === confirm_password
        if(this.state.user['password'] !== this.state.user['confirm_password']){
            let errors = this.state.errors;
            errors.password = 'Do NOT match. Try Again.'
            this.setState({errors: errors});
        }else{
            let errors = this.state.errors;
            errors.password = '';
            this.setState({errors: errors});
        }
        
    }

    render(){
        return (
            <SignUpForm 
            onSubmit={(e) => this.processForm(e)}
            onChange={(e) => this.changeUser(e)}
            errors={this.state.errors}
            user={this.state.user}
            />
        );
    }

}
// the page routing, we must use router to redirect the URL. 
// to use the router, we break the one-way data flow. Use context
// context can pass the props into any inner childComponent
SignUpPage.contextTypes = {
    router: PropTypes.object.isRequired
}

export default SignUpPage;