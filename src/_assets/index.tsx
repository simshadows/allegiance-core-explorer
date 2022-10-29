import React from "react";
import {createRoot} from "react-dom/client";

import {
    readCoreData,
    type CoreData,
    type CivilizationData,
    type StationTypeData,
    type DevelopmentData,
} from "./readCoreData";

//import {toHumanReadableArrayBuffer} from "./utils";

import "./index.css";

function numSetToHumanReadable(obj: Set<number>) {
    return Array.from(obj).join(", ");
}

function renderAttribute(name: string, obj: any) {
    return <li><span className="attribute-name">{name}:</span> {String(obj)}</li>;
}

function renderCivilization(data: CivilizationData) {
    return <li key={data.civID}>{data.name} <b>({data.civID})</b>
        <ul>
            {renderAttribute("Base Techs", numSetToHumanReadable(data.baseTechs))}
        </ul>
    </li>;
}

function renderStationType(data: StationTypeData) {
    return <li key={data.stationTypeID}>{data.name} <b>({data.stationTypeID})</b>
        <ul>
            {renderAttribute("Tech Required", numSetToHumanReadable(data.techRequired))}
            {renderAttribute("Tech Effects", numSetToHumanReadable(data.techEffects))}
            {renderAttribute("Tech Locals", numSetToHumanReadable(data.localTech))}
        </ul>
    </li>;
}

function renderDevelopment(data: DevelopmentData) {
    return <li key={data.devID}>{data.name} <b>({data.devID})</b>
        <ul>
            {renderAttribute("Group ID", data.groupID)}
            {renderAttribute("Tech Required", numSetToHumanReadable(data.techRequired))}
            {renderAttribute("Tech Effects", numSetToHumanReadable(data.techEffects))}
        </ul>
    </li>;
}

/*** ***/

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
        this.setState({
            loaded: true,
            coreData: await readCoreData(),
        });
    }

    render() {
        if (!this.state.loaded) {
            return "loading...";
        }

        if (this.state.coreData === null) {
            throw new Error("Core data not loaded.");
        }

        return <>
            <h1>Prototype Allegiance Core Explorer</h1>
            <h2>Factions</h2>
            <ul>
                {
                    Array.from(this.state.coreData.civilizations)
                        .sort(([k1, a], [k2, b]) => a.name.localeCompare(b.name))
                        .map(([k, v]) => renderCivilization(v))
                }
            </ul>
            <h2>Devels</h2>
            <ul>
                {
                    Array.from(this.state.coreData.developments)
                        .sort(([k1, a], [k2, b]) => a.name.localeCompare(b.name))
                        .map(([k, v]) => renderDevelopment(v))
                }
            </ul>
            <h2>Stations</h2>
            <ul>
                {
                    Array.from(this.state.coreData.stationTypes)
                        .sort(([k1, a], [k2, b]) => a.name.localeCompare(b.name))
                        .map(([k, v]) => renderStationType(v))
                }
            </ul>
        </>;
    }
}

const root = createRoot(document.getElementById("app-mount"));
root.render(
    <React.StrictMode>
        <PlaceholderComponent />
    </React.StrictMode>
);

