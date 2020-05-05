import React from "react";
import axios from "./axios";
import Logo from "./logo";
import Navbar from "./navbar";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            userInfo: {},
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        // console.log("App mounted");
        axios.get("/user").then(({ data }) => {
            console.log("app.js, response from axios get /user:", data);
            this.setState({
                userInfo: data,
            });
        });
    }

    toggleModal() {
        console.log("toggleModal function is running");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    methodInApp(arg) {
        console.log(
            "I'm running in App and my argument is from uploader.js methodInUploader:",
            arg
        );
    }

    render() {
        return (
            <div>
                <div className="logo-heading">
                    <Logo />
                    <Navbar />
                    <h1>Hello from App, Kite Inc.</h1>
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        imageUrl={this.state.imageUrl}
                    />
                    <h2 onClick={() => this.toggleModal()}>
                        Changing uploaderIsVisible state with a method
                    </h2>
                    {this.state.uploaderIsVisible && (
                        <Uploader methodInApp={this.methodInApp} />
                    )}
                </div>
            </div>
        );
    }
}
