import React from "react";
import axios from "./axios";
import Presentational from "./presentational";
import Uploader from "./uploader";
import Profile from "./profile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import OtherProfile from "./other-profile";
import Chat from "./chat";
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
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    profileImgUrl(arg) {
        this.setState({
            img_url: arg,
        });
    }

    updateBio(upbio) {
        this.setState({
            bio: upbio,
        });
    }

    render() {
        if (!this.state.id) {
            return null;
        }

        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Presentational
                            first={this.state.first}
                            last={this.state.last}
                            img_url={this.state.img_url}
                        />

                        {this.state.uploaderIsVisible && (
                            <div id="uploader">
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
                            exact
                            path="/users"
                            render={() => <FindPeople />}
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

                        <Route
                            exact
                            path="/friends"
                            render={() => <Friends />}
                        />

                        <Route path="/chat" component={Chat} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
