import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () =>
                console.log(
                    "login.js 'this.state' in handleChange:",
                    this.state
                )
        );
    }

    submit(e) {
        console.log("login.js, this.state in 'submit()':", this.state);
        axios.post("/login", this.state).then(({ data }) => {
            console.log("login.js, data in axios post:", data);
            if (data.success) {
                console.log("login.js, success in /login");
                this.setState({
                    error: false,
                });
                location.replace("/");
            } else {
                console.log("login.js, no success in /login");
                this.setState({
                    error: true,
                });
            }
        });
    }

    // {/* <img src="/logo.png" alt="logo" /> */}
    render() {
        return (
            <div className="login-container">
                {this.state.error && (
                    <h4>
                        Something went wrong. Please use the email-address you
                        registered with and the correct password.
                    </h4>
                )}
                {this.state.falsePassword && (
                    <h4>
                        Your password does not match your email-address. Please
                        enter the correct password.
                    </h4>
                )}

                <div className="flexbox-login">
                    <div>
                        <ion-icon
                            className="icon"
                            name="at-circle-sharp"
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
                        <ion-icon
                            className="icon"
                            name="lock-closed-sharp"
                        ></ion-icon>
                        <input
                            name="password"
                            type="password"
                            minLength="8"
                            required
                            maxLength="100"
                            placeholder="Password"
                            autoComplete="off"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>
                    <button onClick={() => this.submit()}>Login</button>
                </div>
                <div className="placeholder"></div>
                <p className="center">
                    Not yet registered? Just <Link to="/">register</Link>
                </p>
            </div>
        );
    }
}
