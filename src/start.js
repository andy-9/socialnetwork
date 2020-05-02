// Any js file that start.js imports from (as well as the files that those files import from) will be included in the bundle. The js files you create and import should be placed in the src directory.
import React from "react";
import ReactDOM from "react-dom"; // only in start.js
import Welcome from "./welcome";
import Logo from "./logo";

let elem;
const userIsLoggedIn = location.pathname != "/welcome";

if (userIsLoggedIn) {
    elem = (
        <div>
            <div className="logo-heading">
                <Logo />
                <h1>Kiters Against Sexism</h1>
            </div>
        </div>
    );
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
