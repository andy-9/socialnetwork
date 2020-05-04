import React from "react";
import axios from "./axios";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            step: 2,
            step, 3
        };
    }

    render() {
        return (
            <div>
                {this.step == 1 && (
                    <div>
                        <input name="email"></input>
                        <button></button>
                    </div>
                )}
                {this.step == 2 && (
                    <div>
                        <input name="code"></input>
                        <input name="pass"></input>
                        <button></button>
                    </div>
                )}
                {this.step == 3 && (
                    <div>
                        <input name="newPassword"></input>
                        <button></button>
                    </div>
                )}
            </div>
        );
    }
}
