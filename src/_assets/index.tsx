import React from "react";
import {createRoot} from "react-dom/client";
import "normalize.css";

import {DebuggingView} from "./components/DebuggingView";
import {ResearchSimulatorView} from "./components/ResearchSimulatorView";
import {TechTreeView} from "./components/TechTreeView";

import {
    readCoreData,
    type CoreData,
} from "./readCoreData";

import "./index.css";


type AppView = "debugging" | "research-simulator" | "tech-tree";

interface State {
    coreData: null | CoreData;
    view: AppView;
}

class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            coreData: null,
            view: "tech-tree",
        };
    }

    override async componentDidMount() {
        const res = await fetch("/ac_07.igc");
        if (!res.ok) return;
        this.setState({
            coreData: await readCoreData(await res.arrayBuffer()),
        });
        console.log("Successfully loaded '/ac_07.igc' from the server.");
    }

    override render() {
        return <>
            <h1>Prototype Allegiance Core Explorer</h1>
            <p><input type="file" onChange={(e) => this._onUpload(e)} /></p>
            <p>
                <select value={this.state.view} onChange={(e) => this._onViewChange(e)}>
                    <option value="research-simulator">Research Simulator View</option>
                    <option value="tech-tree">Tech Tree View</option>
                    <option value="debugging">Debugging View</option>
                </select>
            </p>
            <hr />
            {(()=>{
                if (!this.state.coreData) return "Nothing loaded";
                switch (this.state.view) {
                    case "debugging":
                        return <DebuggingView coreData={this.state.coreData} />;
                    case "research-simulator":
                        return <ResearchSimulatorView coreData={this.state.coreData} />;
                    case "tech-tree":
                        return <TechTreeView coreData={this.state.coreData} />;
                    default:
                        throw new Error("Unexpected view name.");
                }
            })()}
            <hr />
            <p>
                <a href="https://github.com/simshadows/allegiance-core-explorer" target="_blank">Source Code</a>
            </p>
        </>;
    }

    private async _loadCoreFile(buf: ArrayBuffer): Promise<void> {
        this.setState({
            coreData: readCoreData(buf),
        });
    }

    private async _onUpload(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        console.log(e);
        const target: HTMLInputElement = e.target;

        if (target.files?.length === 0) {
            return;
        } else if (target.files?.length !== 1) {
            throw new Error("File upload should never take multiple files.");
        }

        const buf = await target.files[0]?.arrayBuffer();
        if (!buf) throw new Error("Unexpected undefined value.");
        await this._loadCoreFile(buf);
    }

    private async _onViewChange(e: React.ChangeEvent<HTMLSelectElement>): Promise<void> {
        const newVal: string = e.target.value;
        if (newVal !== "debugging" && newVal !== "research-simulator" && newVal !== "tech-tree") {
            throw new Error("Unexpected view name.");
        }

        this.setState({
            view: newVal,
        });
    }
}

const mountPoint = document.getElementById("app-mount");
if (!mountPoint) throw new Error("Unexpected null value.");

const root = createRoot(mountPoint);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

