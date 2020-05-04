import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            error: false,
            falseEmail: false,
            falseCode: false,
        };
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        console.log("reset.js, e.target.value:", e.target.value);
    }

    submitEmail() {
        console.log("reset.js, this.state in submitEmail():", this.state);
        axios
            .post("/password/reset/start", this.state)
            .then(({ data }) => {
                console.log(
                    "reset.js, data in axios post submitEmail():",
                    data
                );
                if (data.success) {
                    console.log("reset.js, success in /password/reset/start");
                    this.setState({
                        step: 2,
                    });
                } else if (data.error) {
                    this.setState({
                        error: true,
                    });
                } else {
                    this.setState({
                        falseEmail: true,
                    });
                }
            })
            .catch((err) => {
                console.log("CATCH in post /reset in submitEmail():", err);
                this.setState({
                    error: true,
                });
            });
    }

    submitCodeAndPassword() {
        console.log(
            "reset.js, this.state in 'submitCodeAndPassword()':",
            this.state
        );
        axios
            .post("/password/reset/verify", this.state)
            .then(({ data }) => {
                console.log(
                    "reset.js, data in axios post submitCodeAndPassword():",
                    data
                );
                if (data.success) {
                    console.log("reset.js, success in /password/reset/verify");
                    this.setState({
                        step: 3,
                    });
                } else {
                    this.setState({
                        falseCode: true,
                    });
                }
            })
            .catch((err) => {
                console.log(
                    "CATCH in post /reset in submitCodeAndPassword():",
                    err
                );
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div>
                {this.state.step == 1 && (
                    <div>
                        <h3>Reset Password</h3>
                        <p>
                            Please enter the email address with which you were
                            registered
                        </p>
                        <div>
                            <ion-icon
                                className="icon"
                                name="at-circle-sharp"
                            ></ion-icon>
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                autoComplete="off"
                                onChange={(e) => this.handleChange(e)}
                            />
                        </div>
                        {this.state.falseEmail && (
                            <h4>
                                Your email address is not registered. Please
                                enter the email with which you registered or
                                register
                                <Link to="/"> here</Link>.
                            </h4>
                        )}
                        {this.state.error && (
                            <h4>
                                Sorry, something went wrong. Please try again.
                            </h4>
                        )}
                        <button onClick={() => this.submitEmail()}>
                            Submit
                        </button>
                    </div>
                )}

                {this.state.step == 2 && (
                    <div>
                        <h3>Reset Password</h3>
                        <p>Please enter the code you received by email.</p>
                        <input
                            name="code"
                            type="text"
                            placeholder="Code"
                            autoComplete="off"
                            onChange={(e) => this.handleChange(e)}
                        />
                        {this.state.falseCode && (
                            <h4>
                                The code you entered does not match the one sent
                                to you by email. Please enter this code or go to
                                <Link to="/"> register</Link>.
                            </h4>
                        )}
                        <p>Please enter a new password</p>
                        <div>
                            <ion-icon
                                className="icon"
                                name="lock-closed-sharp"
                            ></ion-icon>
                            <input
                                name="password"
                                type="password"
                                placeholder="New Password"
                                autoComplete="off"
                                onChange={(e) => this.handleChange(e)}
                            />
                        </div>
                        {this.state.error && (
                            <h4>
                                Sorry, something went wrong. Please try again.
                            </h4>
                        )}
                        <button onClick={() => this.submitCodeAndPassword()}>
                            Submit
                        </button>{" "}
                    </div>
                )}

                {this.state.step == 3 && (
                    <div>
                        <h3>Your password is reset.</h3>
                        <p>
                            You can now <Link to="/login">login</Link> with your
                            new password.
                        </p>
                    </div>
                )}
            </div>
        );
    }
}
