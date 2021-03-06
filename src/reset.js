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
            passwordTooShort: false,
            errorConfirmPassword: false,
        };
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    submitEmail() {
        axios
            .post("/password/reset/start", this.state)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: 2,
                    });
                } else if (data.falseEmail) {
                    this.setState({
                        falseEmail: true,
                        error: false,
                    });
                } else {
                    this.setState({
                        error: true,
                        falseEmail: false,
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: true,
                    falseEmail: false,
                });
                console.log("CATCH in post /reset in submitEmail():", err);
            });
    }

    submitCodeAndPassword() {
        axios
            .post("/password/reset/verify", this.state)
            .then(({ data }) => {
                if (data.success) {
                    this.setState({
                        step: 3,
                    });
                } else if (data.falseCode) {
                    this.setState({
                        falseCode: true,
                        passwordTooShort: false,
                        errorConfirmPassword: false,
                        error: false,
                    });
                } else if (data.passwordTooShort) {
                    this.setState({
                        passwordTooShort: true,
                        falseCode: false,
                        errorConfirmPassword: false,
                        error: false,
                    });
                } else if (data.errorConfirmPassword) {
                    this.setState({
                        errorConfirmPassword: true,
                        falseCode: false,
                        passwordTooShort: false,
                        error: false,
                    });
                } else {
                    this.setState({
                        error: true,
                        falseCode: false,
                        passwordTooShort: false,
                        errorConfirmPassword: false,
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: true,
                    falseCode: false,
                    errorConfirmPassword: false,
                });
                console.log(
                    "CATCH in post /reset in submitCodeAndPassword():",
                    err
                );
            });
    }

    render() {
        return (
            <div className="reset-container">
                {this.state.step == 1 && (
                    <div className="flexbox-reset">
                        <h2>Reset Password</h2>

                        <p className="center">
                            Please enter the email address with which you
                            registered.
                        </p>
                        {this.state.error && (
                            <h5>
                                Sorry, something went wrong. Please try again.
                            </h5>
                        )}
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
                            <h5>
                                Your email address is not registered. Please
                                enter the email with which you registered or
                                register
                                <Link to="/"> here</Link>.
                            </h5>
                        )}

                        <button onClick={() => this.submitEmail()}>
                            Submit
                        </button>
                        <p className="center">
                            Ah, I just remembered! Back to{" "}
                            <Link to="/login">login</Link>
                        </p>
                    </div>
                )}

                {this.state.step == 2 && (
                    <div className="flexbox-reset">
                        <h3>Reset Password</h3>
                        <p className="center">
                            Please enter the code you received by email. You
                            have a maximum of 10 minutes.
                        </p>
                        <div>
                            <ion-icon
                                className="icon"
                                name="finger-print-sharp"
                            ></ion-icon>
                            <input
                                name="code"
                                type="text"
                                placeholder="Code"
                                autoComplete="off"
                                onChange={(e) => this.handleChange(e)}
                            />
                        </div>
                        {this.state.falseCode && (
                            <h5>
                                The code you entered does not match the one sent
                                to you by email. Please enter this code or go to
                                <Link to="/"> register</Link>.
                            </h5>
                        )}
                        <p>Please enter a new password and confirm it.</p>
                        <div>
                            <ion-icon
                                className="icon"
                                name="lock-closed-sharp"
                            ></ion-icon>
                            <input
                                name="password"
                                type="password"
                                placeholder="New Password (min. 8 characters)"
                                autoComplete="off"
                                onChange={(e) => this.handleChange(e)}
                            />
                        </div>
                        {this.state.passwordTooShort && (
                            <h5>
                                Your password is too short. Please use at least
                                8 characters.
                            </h5>
                        )}
                        <div>
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
                            <h5>
                                Your second password does not match your first.
                            </h5>
                        )}
                        {this.state.error && (
                            <h5>
                                Sorry, something went wrong. Please try again.
                            </h5>
                        )}
                        <button onClick={() => this.submitCodeAndPassword()}>
                            Submit
                        </button>{" "}
                    </div>
                )}

                {this.state.step == 3 && (
                    <div className="flexbox-reset">
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
