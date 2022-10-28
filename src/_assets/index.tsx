import React from "react";
import ReactDOM from "react-dom";

import "./index.css";//

const element = React.createElement;

class TestComponent extends React.Component {
    render() {
        return <div id="hello">
            <em>woo</em>
        </div>;
    }
}

ReactDOM.render(
    <React.StrictMode>
        <TestComponent />
    </React.StrictMode>,
    document.getElementById("app-mount")
);

