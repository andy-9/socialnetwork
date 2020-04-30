import React from "react";

export default class Child extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("this.props:", this.props);
        return <h1>Child component</h1>;
    }
}

// export default function Child(props) {
//     // "props": object
//     console.log("props:", props);
//     return <h1>Child component!</h1>;
// }
