import React from "react";
import axios from "./axios";
import Presentational from "./presentational";
import Uploader from "./uploader";
import Profile from "./profile";
import FindPeople from "./findpeople";
import OtherProfile from "./other-profile";
import { BrowserRouter, Route } from "react-router-dom";

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
                    <div className="logo-heading">
                        <div>
                            <Presentational
                                first={this.state.first}
                                last={this.state.last}
                                img_url={this.state.img_url}
                                toggleModal={this.toggleModal}
                            />
                        </div>

                        {this.state.uploaderIsVisible && (
                            <div className="uploader">
                                <Uploader
                                    id={this.state.id}
                                    profileImgUrl={this.profileImgUrl}
                                    toggleModal={this.toggleModal}
                                />
                            </div>
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
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/users" render={() => <FindPeople />} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
