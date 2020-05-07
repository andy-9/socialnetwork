import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class BioEditor extends React.Component {
    constructor() {
        super();

        this.state = {
            textareaIsVisible: false,
            draftBio: null,
        };
        this.toggleTextarea = this.toggleTextarea.bind(this);
        // console.log("bioeditor.js, this.state in BioEditor:", this.state);
    }

    componentDidMount() {
        this.setState({
            dbBio: this.props.bio,
        });
    }

    handleChange(e) {
        // console.log("bioeditor.js handleChange, e.target:", e.target);
        this.setState(
            {
                draftBio: e.target.value,
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
        // console.log("bioeditor.js, uploadBio running");
        var each = this;
        let updateBioInfo = { id: this.props.id, bio: this.state.draftBio };
        this.props.updateBio(this.state.draftBio);

        // this.setState = {
        //     textareaIsVisible: false,
        // };

        axios
            .post("/bio", updateBioInfo)
            .then(({ data }) => {
                console.log(
                    "bioeditor.js in post /bio after upload, data:",
                    data
                );
                this.toggleTextarea();
                each.props.updateBio(data.userBio.bio);
            })
            .catch((err) => {
                console.log("CATCH in bioeditor.js in axios.post /bio:", err);
            });
    }

    render() {
        if (this.state.textareaIsVisible) {
            return (
                <div className="bioeditor-container">
                    <textarea
                        defaultValue={this.props.bio}
                        onChange={(e) => this.handleChange(e)}
                        name="textarea"
                        cols="50"
                        rows="10"
                    ></textarea>
                    <button
                        onClick={(e) => {
                            this.uploadBio(e);
                        }}
                    >
                        save
                    </button>
                    <button
                        onClick={() => {
                            this.toggleTextarea();
                        }}
                    >
                        cancel
                    </button>
                </div>
            );
        } else if (this.props.bio) {
            return (
                <div className="bioeditor-container">
                    <p className="bio-text">{this.props.bio}</p>
                    <a
                        onClick={() => {
                            this.toggleTextarea();
                        }}
                    >
                        Edit your info
                    </a>
                </div>
            );
        } else {
            return (
                <div className="bioeditor-container">
                    <a
                        onClick={() => {
                            this.toggleTextarea();
                        }}
                    >
                        Tell us a little bit about yourself
                    </a>
                </div>
            );
        }
    }
}