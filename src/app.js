import React from "react";
import axios from "./axios";
import Logo from "./logo";
import Navbar from "./navbar";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";

export default class App extends React.Component {
    constructor() {
        super();

        this.toggleModal = this.toggleModal.bind(this);
        this.profileImgUrl = this.profileImgUrl.bind(this);
        this.updateBio = this.updateBio.bind(this);

        this.state = {
            uploaderIsVisible: false,
        };
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("app.js, response from axios get /user:", data);
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
        console.log("app.js toggleModal function is running");
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    profileImgUrl(arg) {
        console.log("app.js profileImgUrl, argument from uploader.js:", arg);
        this.setState({
            img_url: arg,
        });
    }

    updateBio(upbio) {
        console.log("app.js updateBio running, argument upbio:", upbio);
        this.setState({
            bio: upbio,
        });
    }

    render() {
        console.log("app.js, this.state in render() :", this.state);
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
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            img_url={this.state.img_url}
                            toggleModal={this.toggleModal}
                        />
                    </div>

                    {this.state.uploaderIsVisible && (
                        <Uploader
                            id={this.state.id}
                            profileImgUrl={this.profileImgUrl}
                            toggleModal={this.toggleModal}
                        />
                    )}

                    <div>
                        <Profile
                            id={this.state.id}
                            first={this.state.first}
                            last={this.state.last}
                            img_url={this.state.img_url}
                            bio={this.state.bio}
                            updateBio={this.updateBio}
                            toggleModal={this.toggleModal}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

{
    /* <Profile
    profilePic={
        <ProfilePic
            first={this.state.first}
            last={this.state.last}
            img_url={this.state.img_url}
            clickHandler={() =>
                this.setState({
                    uploaderIsVisible: true,
                })
            }
        />
    }
    bio={this.state.bio}
/>; */
}
