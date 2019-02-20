class Auth {
    // authenticate user
    // store token and email into local storage
    static authenticateUser(tapNewsToken, tapNewsEmail) {
        localStorage.setItem('tapNewsToken', tapNewsToken);
        localStorage.setItem('tapNewsEmail', tapNewsEmail);
    }
    
    static isUserAuthenticated() {
        return (localStorage.getItem('tapNewsToken') !== null);
    }

    static deauthenticateUser() {
        localStorage.removeItem('tapNewsToken');
        localStorage.removeItem('tapNewsEmail');
    }

    static getToken() {
        return localStorage.getItem('tapNewsToken');
    }

    static getEmail() {
        return localStorage.getItem('tapNewsEmail');
    }

}

export default Auth;