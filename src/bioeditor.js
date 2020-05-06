import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";

export default class BioEditor extends React.Component {
    constructor() {
        super();
        this.state = {
            textareaIsVisible: false,
            writeBio: "",
        };
        console.log("bioeditor.js, this.state in BioEditor:", this.state);
    }

    handleChange(e) {
        console.log("bioeditor.js handleChange, e.target:", e.target);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () =>
                console.log(
                    "bioeditor.js, this.state in handleChange:",
                    this.state
                )
        );
    }

    toggleTextarea() {
        console.log("bioeditor.js, toggleTextarea running");
        this.setState({
            textareaIsVisible: !this.state.textareaIsVisible,
        });
    }

    uploadBio() {
        console.log("bioeditor.js, uploadBio running");
        var each = this;

        axios
            .post("/bio", formData)
            .then(({ data }) => {
                console.log("bioeditor.js, data in post /bio:", data);
            })
            .catch((err) => {
                console.log("CATCH in bioeditor.js in axios.post /bio:", err);
            });
    }

    render() {
        return (
            <div>
                <h2>heading in bioeditor.js</h2>
                <div onClick={() => this.toggleTextarea()}>toggle</div>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    img_url={this.state.img_url}
                    toggleModal={() =>
                        this.setState({ textareaIsVisible: true })
                    }
                />
            </div>
        );
    }
}
