import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {
            file: null, // necessary?
        };
    }

    // handleChange necessary?
    handleChange(e) {
        console.log("uploader.js handleChange, e.target:", e.target);
        console.log(
            "uploader.js handleChange, e.target.files:",
            e.target.files
        );
        console.log(
            "uploader.js handleChange, e.target.files[0]:",
            e.target.files[0]
        );
        this.setState(
            {
                file: e.target.files[0],
            },
            () =>
                console.log(
                    "uploader.js 'this.state' in handleChange:",
                    this.state
                )
        );
        console.log("uploader.js handleChange, image to upload: ", this.file);
    }

    uploadImage() {
        var each = this;
        var formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/imgupload", formData)
            .then(({ data }) => {
                // if (response.data[0] === null || response.data === "noNumber") {
                each.props.profileImgUrl(data.urlForImg);
                // close modal:
                each.props.toggleModal();
                // automatically switch to the new image
            })
            .catch((err) => {
                console.log(
                    "CATCH in uploader.js in axios.post /uploader:",
                    err
                );
            });
    }

    closeModal() {
        console.log("uploader.js, closeModal");
        this.props.toggleModal();
    }

    render() {
        return (
            <div className="img-modal">
                <div className="x" onClick={() => this.closeModal()}>
                    X
                </div>
                <h3 className="uploader-text">Upload your image here</h3>
                <div>
                    <ion-icon
                        class="icon"
                        name="cloud-upload-outline"
                    ></ion-icon>
                    <input type="file" name="file" accept="image/*" />
                </div>
                <button onClick={() => this.uploadImage()}>upload</button>
            </div>
        );
    }
}
