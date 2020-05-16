import React from "React";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset";
import Info from "./info";
import Logo from "./logo";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div>
            <div className="flex">
                <div className="logo-top-left">
                    <Logo />
                </div>
                <h1>Kite.Inc</h1>
            </div>
            <div>
                <Info />
            </div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
