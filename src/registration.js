import React, { useState } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
// import { IonIcon } from "@ionic/react";
// import Icon from "react-native-ionicons";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            passwordTooShort: false,
            errorConfirmPassword: false,
        };
    }

    // function Register() {
    //     const [fields, setFields] = useState({});
    //     const [error, setError] = useState(false);

    //     function handleChange({target}) {
    //         setFields({
    //             ...fields,
    //             [target.name]: target.value
    //         });
    //     }
    //     function submit() {
    //         axios.post("/register", fields).then(
    //             ({data}) => data.success ? location.replace("/") : setError(true)
    //         );
    //     }
    //     return (
    //         <div>
    //             {error && <div>Something went wrong</div>}
    //             <input onChange={handleChange} name="email" placeholder="Email" />
    //             <input onChange={handleChange} name="pass" placeholder="Password" />
    //         </div>
    //     )
    // }

    handleChange(e) {
        // console.log(
        //     "registration.js handleChange, e.target.value:",
        //     e.target.value
        // );
        // console.log(
        //     "registration.js handleChange, e.target.name:",
        //     e.target.name
        // );
        this.setState(
            {
                [e.target.name]: e.target.value,
            }
            // () =>
            //     console.log(
            //         "registrations.js 'this.state' in handleChange:",
            //         this.state
            //     )
            // console.log in the callback because setState is asynchronous
        );
    }

    submit() {
        console.log("registration.js, this.state in 'submit()':", this.state);
        axios.post("/register", this.state).then(({ data }) => {
            console.log("registration.js, data in axios post:", data);
            if (data.success) {
                console.log("registration.js, success in /register");
                this.setState({
                    error: false,
                });
                location.replace("/");
            } else if (data.passwordTooShort) {
                console.log("registration.js, password too short");
                this.setState({
                    passwordTooShort: true,
                    errorConfirmPassword: false,
                    error: false,
                });
            } else if (data.errorConfirmPassword) {
                console.log(
                    "registration.js, 2 passwords do not match in /register"
                );
                this.setState({
                    errorConfirmPassword: true,
                    passwordTooShort: false,
                    error: false,
                });
            } else {
                console.log(
                    "registration.js, no success in /register, data.error",
                    data.error
                );
                this.setState({
                    error: true,
                    errorConfirmPassword: false,
                    passwordTooShort: false,
                });
            }
        });
    }

    render() {
        return (
            <div className="register-container">
                <h2>Registration</h2>

                <div className="flexbox-register">
                    <div>
                        <p className="input-description">First name</p>
                        <ion-icon
                            className="icon"
                            name="person-circle-sharp"
                        ></ion-icon>
                        <input
                            name="first"
                            type="text"
                            required
                            maxLength="70"
                            placeholder="e.g. Kirsty"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>
                    <div>
                        <p className="input-description">Last name</p>
                        <ion-icon
                            className="icon"
                            name="pencil-sharp"
                        ></ion-icon>
                        <input
                            name="last"
                            type="text"
                            maxLength="70"
                            placeholder="e.g. Jones"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>
                    <div>
                        <p className="input-description">Email</p>
                        <ion-icon
                            className="icon"
                            name="at-circle-sharp"
                        ></ion-icon>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="e.g. kirsty@jones.org"
                            autoComplete="off"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>
                    <div>
                        <p className="input-description">
                            Password (8 characters minimum)
                        </p>
                        <ion-icon
                            className="icon"
                            name="lock-closed-sharp"
                        ></ion-icon>
                        <input
                            name="password"
                            type="password"
                            placeholder="e.g. 3fK)a*dK3J"
                            autoComplete="off"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>

                    {this.state.passwordTooShort && (
                        <h5>
                            Your password is too short. Please use at least 8
                            characters.
                        </h5>
                    )}

                    <div>
                        <p className="input-description">Password Check</p>
                        <ion-icon
                            className="icon"
                            name="checkmark-done-sharp"
                        ></ion-icon>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Retype Password"
                            autoComplete="off"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>

                    {this.state.errorConfirmPassword && (
                        <h5>Your second password does not match your first.</h5>
                    )}
                    {this.state.error && (
                        <h5>
                            Something went wrong. Please fill out all 5 fields.
                        </h5>
                    )}

                    <button onClick={() => this.submit()}>Register</button>
                </div>
                <div className="placeholder"></div>
                <p className="center">
                    Already registered? Just <Link to="/login">Login</Link>
                </p>
            </div>
        );
    }
}
