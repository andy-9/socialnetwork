import React from "react";
import axios from "./axios";
import Logo from "./logo";
import Navbar from "./navbar";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./other-profile";

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            uploaderIsVisible: false,
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.profileImgUrl = this.profileImgUrl.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                // console.log("app.js, response from axios get /user:", data);
                this.setState({
                    id: data.id,
                    first: data.first,
                    last: data.last,
                    img_url: data.img_url,
                    bio: data.bio,
                });
            })
            .catch((err) => {
                console.log("CATCH in app.js in get /user:", err);
            });
    }

    toggleModal() {
        // console.log("app.js toggleModal function is running");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    profileImgUrl(arg) {
        // console.log("app.js profileImgUrl, argument from uploader.js:", arg);
        this.setState({
            img_url: arg,
        });
    }

    updateBio(upbio) {
        // console.log("app.js updateBio running, argument upbio:", upbio);
        this.setState({
            bio: upbio,
        });
    }

    render() {
        // console.log("app.js, this.state in render() :", this.state);
        if (!this.state.id) {
            return null;
        }

        return (
            <div>
                <BrowserRouter>
                    <div>
                        <div className="logo-heading">
                            <div>
                                <Logo />
                            </div>

                            <h1>Kite Inc.</h1>

                            <div>
                                <Navbar />
                            </div>
                            <div className="profile-pic-frame">
                                <div
                                    onClick={() => this.toggleModal()}
                                    className="profile-pic"
                                >
                                    <ProfilePic
                                        first={this.state.first}
                                        last={this.state.last}
                                        img_url={this.state.img_url}
                                        toggleModal={this.toggleModal}
                                    />
                                </div>
                            </div>

                            {this.state.uploaderIsVisible && (
                                <Uploader
                                    id={this.state.id}
                                    profileImgUrl={this.profileImgUrl}
                                    toggleModal={this.toggleModal}
                                />
                            )}

                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        id={this.state.id}
                                        first={this.state.first}
                                        last={this.state.last}
                                        img_url={this.state.img_url}
                                        bio={this.state.bio}
                                        updateBio={this.updateBio}
                                        toggleModal={this.toggleModal}
                                    />
                                )}
                            />

                            <Route
                                exact
                                path="/user/:id"
                                render={(props) => (
                                    <OtherProfile
                                        key={props.match.url}
                                        match={props.match}
                                        history={props.history}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
