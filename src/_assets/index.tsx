import React from "react";
import {createRoot} from "react-dom/client";

import {readCoreData} from "./readCoreData";

import "./index.css";

const element = React.createElement;

interface State {
    loaded: boolean;
}

class PlaceholderComponent extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            loaded: false,
        };
    }

    override async componentDidMount() {
        await readCoreData();
        this.setState({loaded: true});
    }

    render() {
        if (!this.state.loaded) {
            return "loading...";
        }

        return <div id="hello">
            <em>See the browser console for results.</em>
        </div>;
    }
}

const root = createRoot(document.getElementById("app-mount"));
root.render(
    <React.StrictMode>
        <PlaceholderComponent />
    </React.StrictMode>
);

