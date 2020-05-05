// Any js file that start.js imports from (as well as the files that those files import from) will be included in the bundle. The js files you create and import should be placed in the src directory.
import React from "react";
import ReactDOM from "react-dom"; // only in start.js
import Welcome from "./welcome";
import App from "./app";

let elem;
const userIsLoggedIn = location.pathname != "/welcome";

if (userIsLoggedIn) {
    elem = <App />;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
