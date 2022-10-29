import React from "react";

import {
    type CoreData,
    type CivilizationData,
    type StationTypeData,
    type DevelopmentData,
} from "../../readCoreData";

//import {
//    type GroupID,
//} from "../../types";

import {setDifference} from "../../utils";

import "./index.css";

function numSetToHumanReadable(obj: Set<number>) {
    return Array.from(obj).join(", ");
}

/*** ***/

interface ConstructionMenuProps {
    stationTypes: Array<StationTypeData>;
    stationTypesActive: Set<number>; // Station Type IDs
}

function ConstructionMenu(props: ConstructionMenuProps) {
    return <div className="research-simulator-view--research-menu">
        <b>Construction</b>
        {
            props.stationTypes.map((d) =>
                <div className="research-simulator-view--research-menu--item" key={d.stationTypeID}>
                    {d.name}&nbsp;
                    <span className="research-simulator-view--research-menu--id">({d.stationTypeID})</span>
                </div>
            )
        }
    </div>;
}

/*** ***/

interface ResearchMenuProps {
    name: string;

    devels: Array<DevelopmentData>;
    develsResearched: Set<number>; // Development IDs
}

function ResearchMenu(props: ResearchMenuProps) {
    const devels = props.devels;//.sort((a, b) => a.name.localeCompare(b.name));

    return <div className="research-simulator-view--research-menu">
        <b>{props.name}</b>
        {
            devels.map((d) =>
                <div className="research-simulator-view--research-menu--item" key={d.devID}>
                    {d.name}&nbsp;
                    <span className="research-simulator-view--research-menu--id">({d.devID})</span>
                </div>
            )
        }
    </div>;
}

/*** ***/

interface Props {
    coreData: CoreData;
}

interface State {
    develsResearched: Set<number>; // Development IDs
    stationTypesActive: Set<number>; // Station type IDs
    civID: number;
}

export class ResearchSimulatorView extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const civData: CivilizationData = Array.from(this.props.coreData.civilizations.values())[0];
        this.state = this._createFreshState(civData.civID);
    }

    private _createFreshState(civID: number): State {
        const civData: CivilizationData = this.props.coreData.civilizations.get(civID);
        return {
            develsResearched: new Set(),
            stationTypesActive: new Set([civData.initialStationTypeID]),
            civID,
        };
    }

    render() {
        console.log(this.state);

        const devels: Array<DevelopmentData> = this._getReachableDevels();
        const stationTypes: Array<StationTypeData> = this._getReachableStationTypes();

        return <>
            <p>
                <select value={this.state.civID} onChange={(e) => this._onFactionChange(e)}>
                    {
                        Array.from(this.props.coreData.civilizations)
                            .sort(([k1, a], [k2, b]) => a.name.localeCompare(b.name))
                            .map(([k, v]) =>
                                <option key={k} value={k}>{v.name}</option>
                            )
                    }
                </select>
            </p>
            <div className="research-simulator-view--research-menus">
                <ConstructionMenu
                    stationTypes={stationTypes}
                    stationTypesActive={this.state.stationTypesActive}
                />
                {/*<ResearchMenu
                    name="Construction"
                    devels={
                        Array.from(this.props.coreData.developments.values())
                            .filter(x => x.groupID === "construction")
                    }
                    develsResearched={this.state.develsResearched}
                />*/}
                <ResearchMenu
                    name="Garrison"
                    devels={devels.filter(x => x.groupID === "garrison")}
                    develsResearched={this.state.develsResearched}
                />
                <ResearchMenu
                    name="Supremacy"
                    devels={devels.filter(x => x.groupID === "supremacy")}
                    develsResearched={this.state.develsResearched}
                />
                <ResearchMenu
                    name="Tactical"
                    devels={devels.filter(x => x.groupID === "tactical")}
                    develsResearched={this.state.develsResearched}
                />
                <ResearchMenu
                    name="Expansion"
                    devels={devels.filter(x => x.groupID === "expansion")}
                    develsResearched={this.state.develsResearched}
                />
                <ResearchMenu
                    name="Shipyard"
                    devels={devels.filter(x => x.groupID === "shipyard")}
                    develsResearched={this.state.develsResearched}
                />
            </div>
            <hr />
            <h2>Current Tech Bitvalues</h2>
            <p>{numSetToHumanReadable(this._getTechResearched())}</p>
        </>;
    }

    private _getTechResearched(): Set<number> {
        const civData: CivilizationData = this.props.coreData.civilizations.get(this.state.civID);
        const tech: Set<number> = new Set(civData.baseTechs);
        tech.add(3);
        tech.add(4);
        tech.add(5);
        tech.add(6);
        for (const stationTypeID of this.state.stationTypesActive) {
            const stationTypeData = this.props.coreData.stationTypes.get(stationTypeID);
            for (const techBitIndex of stationTypeData.techEffects) {
                tech.add(techBitIndex);
            }
            for (const techBitIndex of stationTypeData.localTech) {
                tech.add(techBitIndex);
            }
        }
        return tech;
    }

    private _getReachableDevels(): Array<DevelopmentData> {
        const tech: Set<number> = this._getTechResearched();
        const arr: Array<DevelopmentData> = Array
            .from(this.props.coreData.developments.values())
            .filter(x => setDifference(x.techRequired, tech).size === 0);
        return arr;
    }

    private _getReachableStationTypes(): Array<StationTypeData> {
        const tech: Set<number> = this._getTechResearched();
        console.log(this.props.coreData.stationTypes);
        const arr: Array<StationTypeData> = Array
            .from(this.props.coreData.stationTypes.values())
            .filter(x => setDifference(x.techRequired, tech).size === 0);
        return arr;
    }

    private async _onFactionChange(e: React.ChangeEvent<HTMLSelectElement>): Promise<void> {
        const civData: CivilizationData = this.props.coreData.civilizations.get(parseInt(e.target.value));
        this.setState(this._createFreshState(civData.civID));
    }
}

