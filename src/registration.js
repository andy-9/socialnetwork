import React from "react";
import axios from "axios";
// import { IonIcon } from "@ionic/react";
// import Icon from "react-native-ionicons";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

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
            },
            () =>
                console.log(
                    "registrations.js 'this.state' in handleChange:",
                    this.state
                )
            // console.log in the callback because setState is asynchronous
        );
    }

    submit(e) {
        console.log("registration.js, this.state in 'submit()':", this.state);
        // e.preventDefault();
        axios.post("/register", this.state).then(({ data }) => {
            console.log("registration.js, data in axios post:", data);
            if (data.success) {
                console.log("registration.js, success in /register");
                this.setState({
                    error: false,
                });
                location.replace("/");
            } else {
                console.log("registration.js, no success in /register");
                this.setState({
                    error: true,
                });
            }
        });
    }

    render() {
        return (
            <div className="register-container">
                <h3>Registration</h3>
                {this.state.error && (
                    <h4>Something went wrong. Please fill out all 4 fields.</h4>
                )}

                <div className="flexbox">
                    <div>
                        <ion-icon
                            className="icon"
                            name="information-circle-outline"
                        ></ion-icon>
                        <input
                            name="first"
                            type="text"
                            required
                            maxLength="70"
                            placeholder="First name"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>

                    <div>
                        <ion-icon
                            className="icon"
                            name="create-outline"
                        ></ion-icon>
                        <input
                            name="last"
                            type="text"
                            maxLength="70"
                            placeholder="Last name"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>

                    <div>
                        <ion-icon
                            className="icon"
                            name="mail-outline"
                        ></ion-icon>
                        <input
                            name="email"
                            type="email"
                            required
                            maxLength="100"
                            placeholder="Email"
                            autoComplete="off"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>

                    <div>
                        <input
                            name="password"
                            type="password"
                            minLength="8"
                            maxLength="100"
                            required
                            placeholder="Password"
                            autoComplete="off"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>
                    <button onClick={() => this.submit()}>Register</button>
                </div>
            </div>
        );
    }
}
