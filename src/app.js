import React from "react";
import axios from "./axios";
import Logo from "./logo";
import Navbar from "./navbar";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor() {
        super();
        this.toggleModal = this.toggleModal.bind(this);
        this.profileImgUrl = this.profileImgUrl.bind(this); // ggf. streichen
        this.state = {
            userInfo: {},
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("app.js, response from axios get /user:", data);
                this.setState({
                    userInfo: data,
                    first: data.first,
                    last: data.last,
                    imgUrl: data.imgUrl,
                });
            })
            .catch((err) => {
                console.log("CATCH in app.js in get /user:", err);
            });
    }

    toggleModal() {
        console.log("toggleModal function is running");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    profileImgUrl(arg) {
        console.log(
            "I'm running in App and my argument is from uploader.js methodInUploader:",
            arg
        );
        this.setState({
            urlForImg: arg,
            uploaderIsVisible: false,
        });
    }

    closeModal() {
        console.log("app.js, closeModal is running");
        // this.selectedImage = null;
        location.hash = "";
    }

    render() {
        console.log("this.state in render() app.js:", this.state);
        let { first, last, imgUrl } = this.state.userInfo;
        return (
            <div>
                <div className="logo-heading">
                    <div>
                        <Logo />
                    </div>
                    <h1>Kite Inc.</h1>
                    <div>
                        <Navbar />
                    </div>
                    <div onClick={() => this.toggleModal()}>
                        <ProfilePic first={first} last={last} imgUrl={imgUrl} />
                    </div>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            profileImgUrl={this.profileImgUrl}
                            toggleModal={this.toggleModal}
                        />
                    )}
                </div>
            </div>
        );
    }
}
