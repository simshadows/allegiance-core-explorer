import React from "react";
import {createRoot} from "react-dom/client";

import {DebuggingView} from "./components/DebuggingView";

import {
    readCoreData,
    type CoreData,
} from "./readCoreData";

import "./index.css";


interface State {
    loaded: boolean;
    coreData: null | CoreData;
}

class PlaceholderComponent extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            loaded: false,
            coreData: null,
        };
    }

    override async componentDidMount() {
        const res = await fetch("/ac_07.igc");
        if (!res.ok) return;
        this.setState({
            loaded: true,
            coreData: await readCoreData(await res.arrayBuffer()),
        });
        console.log("Successfully loaded '/ac_07.igc' from the server.");
    }

    render() {
        return <>
            <h1>Prototype Allegiance Core Explorer</h1>
            <input type="file" onChange={(e) => this._onUpload(e)} />
            {
                (this.state.coreData)
                ? <DebuggingView coreData={this.state.coreData} />
                : "Not loaded"
            }
        </>;
    }

    private async _loadCoreFile(buf: ArrayBuffer): Promise<void> {
        this.setState({
            loaded: true,
            coreData: readCoreData(buf),
        });
    }

    private async _onUpload(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        console.log(e);
        const target: HTMLInputElement = e.target;

        if (target.files.length === 0) {
            return;
        } else if (target.files.length !== 1) {
            throw new Error("File upload should never take multiple files.");
        }

        const buf: ArrayBuffer = await target.files[0].arrayBuffer();
        await this._loadCoreFile(buf);
    }
}

const root = createRoot(document.getElementById("app-mount"));
root.render(
    <React.StrictMode>
        <PlaceholderComponent />
    </React.StrictMode>
);

