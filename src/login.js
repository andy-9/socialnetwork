import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
            falseEmail: false,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submit() {
        axios
            .post("/login", this.state)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        error: false,
                        falsePassword: false,
                        falseEmail: false,
                    });
                    location.replace("/");
                } else if (data.falsePassword) {
                    this.setState({
                        falsePassword: true,
                        falseEmail: false,
                        error: false,
                    });
                } else if (data.falseEmail) {
                    this.setState({
                        falseEmail: true,
                        falsePassword: false,
                        error: false,
                    });
                } else {
                    this.setState({
                        error: true,
                        falseEmail: false,
                        falsePassword: false,
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: true,
                    falseEmail: false,
                    falsePassword: false,
                });
            });
    }

    render() {
        return (
            <div className="login-container">
                <h2>Login</h2>

                {this.state.error && (
                    <h5>
                        Something went wrong. Please use the email-address you
                        registered with and the correct password.
                    </h5>
                )}
                <div className="flexbox-login">
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
                            maxLength="100"
                            autoComplete="off"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>
                    {this.state.falseEmail && (
                        <h5>
                            Your email address is not registered. Please enter
                            the email with which you registered or register
                            <Link to="/"> here</Link>.
                        </h5>
                    )}

                    <div>
                        <p className="input-description">Password</p>
                        <ion-icon
                            className="icon"
                            name="lock-closed-sharp"
                        ></ion-icon>
                        <input
                            name="password"
                            type="password"
                            autoComplete="off"
                            onChange={(e) => this.handleChange(e)}
                        />
                    </div>
                    {this.state.falsePassword && (
                        <h5>
                            Your password does not match your email-address.
                            Please enter the correct password.
                        </h5>
                    )}
                    <button onClick={() => this.submit()}>Login</button>
                </div>
                <div className="placeholder"></div>
                <p className="center">
                    Forgot your password?
                    <Link to="/reset"> Reset password</Link>
                </p>
                <div className="placeholder"></div>
                <p className="center">
                    Not yet registered? Just <Link to="/">register</Link>
                </p>
            </div>
        );
    }
}
