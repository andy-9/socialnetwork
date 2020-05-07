import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {
            // file: null,
        };
    }

    handleChange(e) {
        // console.log(
        //     "uploader.js handleChange, e.target.files[0]:",
        //     e.target.files[0]
        // );
        this.setState(
            {
                file: e.target.files[0],
            },
            () =>
                console.log(
                    "uploader.js 'this.state.file' in handleChange:",
                    this.state.file
                )
        );
    }

    uploadImage() {
        var each = this;
        var formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/imgupload", formData)
            .then(({ data }) => {
                // console.log(
                //     "uploader.js, data.userImg.user_img in post /imgupload:",
                //     data.userImg.img_url
                // );
                // if (response.data[0] === null || response.data === "noNumber") {
                each.props.profileImgUrl(data.userImg.img_url);
                this.closeModal();
            })
            .catch((err) => {
                console.log(
                    "CATCH in uploader.js in axios.post /uploader:",
                    err
                );
            });
    }

    closeModal() {
        // console.log("uploader.js, closeModal");
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
                    <input
                        onChange={(e) => this.handleChange(e)}
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                </div>
                <button onClick={() => this.uploadImage()}>upload</button>
            </div>
        );
    }
}
