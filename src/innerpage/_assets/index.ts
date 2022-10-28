import React from "react";
import ReactDOM from "react-dom";

import {HelloMessage} from "../../_common/HelloMessage";
import {NavComponent} from "../../_common/NavComponent";
import "./index.css";

const element = React.createElement;

class TestComponent extends React.Component {
    render() {
        return element("div", { id: "hello" },
            element(HelloMessage, {num: 11}, null),
            element("br", null, null),
            element(NavComponent, {url: "../"}, null),
        );
    }
}

ReactDOM.render(
    element(TestComponent, null),
    document.getElementById("app-mount")
);

