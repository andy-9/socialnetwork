import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic-test";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const { data } = await axios.get("/user");
        this.setState(data);
    }

    render() {
        const { id, first, last, url } = this.state;

        if (!id) {
            return null;
        }

        return (
            <div>
                <div className="profile-container">
                    <ProfilePic first={first} last={last} url={url} />
                </div>
            </div>
        );
    }
}
