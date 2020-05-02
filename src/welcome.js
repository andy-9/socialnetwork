import React from "React";
import Registration from "./registration";
import Shortinfo from "./shortinfo";
import LogoNoText from "./logonotext";

export default function Welcome() {
    return (
        <div>
            <h1>Kiters Against Sexism</h1>
            <LogoNoText />
            <Registration />
            {/* <Shortinfo /> */}
        </div>
    );
}
