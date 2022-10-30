import React from "react";

import {
    type CoreData,
    //type CivilizationData,
    type StationTypeData,
    type DevelopmentData,
} from "../../readCoreData";

import {
    getTechResearched,
    getReachableDevels,
    getReachableStationTypes,
} from "../../analyzer";

//import {
//    type GroupID,
//} from "../../types";

import {CivilizationSelector} from "../common/CivilizationSelector";

import "./index.css";

function numSetToHumanReadable(obj: Set<number>) {
    return Array.from(obj).join(", ");
}

/*** ***/

interface ConstructionMenuProps {
    stationTypes: Array<StationTypeData>;
    stationTypesActive: Set<number>; // Station Type IDs

    onStationTypeToggle: (n: number) => void;
}

function ConstructionMenu(props: ConstructionMenuProps) {
    return <div className="research-simulator-view--research-menu">
        <b>Construction</b>
        {
            props.stationTypes.map((d) =>
                <div
                    className={getResearchMenuItemClass(props.stationTypesActive.has(d.stationTypeID))}
                    key={d.stationTypeID}
                    onClick={() => props.onStationTypeToggle(d.stationTypeID)}
                >
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

    onToggleDevel: (n: number) => void;
}

function getResearchMenuItemClass(active: boolean) {
    let c = "research-simulator-view--research-menu--item";
    if (active) c += " active";
    return c;
}

function ResearchMenu(props: ResearchMenuProps) {
    const devels = props.devels;//.sort((a, b) => a.name.localeCompare(b.name));

    return <div className="research-simulator-view--research-menu">
        <b>{props.name}</b>
        {
            devels.map((d) =>
                <div
                    className={getResearchMenuItemClass(props.develsResearched.has(d.devID))}
                    key={d.devID}
                    onClick={() => props.onToggleDevel(d.devID)}
                >
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

        const civData = Array.from(this.props.coreData.civilizations.values())[0];
        if (!civData) throw new Error("Unexpected undefined value.");
        this.state = this._createFreshState(civData.civID);
    }

    private _createFreshState(civID: number): State {
        const civData = this.props.coreData.civilizations.get(civID);
        if (!civData) throw new Error("Unexpected undefined value.");
        return {
            develsResearched: new Set(),
            stationTypesActive: new Set([civData.initialStationTypeID]),
            civID,
        };
    }

    override render() {
        console.log(this.state);

        const devels: Array<DevelopmentData> = this._getReachableDevels();
        const stationTypes: Array<StationTypeData> = this._getReachableStationTypes();

        return <>
            <p>
                <CivilizationSelector
                    currentCivID={this.state.civID}
                    civilizationsMap={this.props.coreData.civilizations}
                    onChange={(e) => this._onFactionChange(e)}
                />
            </p>
            <div className="research-simulator-view--research-menus">
                <ConstructionMenu
                    stationTypes={stationTypes}
                    stationTypesActive={this.state.stationTypesActive}

                    onStationTypeToggle={n => this._onToggleStationType(n)}
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

                    onToggleDevel={n => this._onToggleDevel(n)}
                />
                <ResearchMenu
                    name="Supremacy"
                    devels={devels.filter(x => x.groupID === "supremacy")}
                    develsResearched={this.state.develsResearched}

                    onToggleDevel={n => this._onToggleDevel(n)}
                />
                <ResearchMenu
                    name="Tactical"
                    devels={devels.filter(x => x.groupID === "tactical")}
                    develsResearched={this.state.develsResearched}

                    onToggleDevel={n => this._onToggleDevel(n)}
                />
                <ResearchMenu
                    name="Expansion"
                    devels={devels.filter(x => x.groupID === "expansion")}
                    develsResearched={this.state.develsResearched}

                    onToggleDevel={n => this._onToggleDevel(n)}
                />
                <ResearchMenu
                    name="Shipyard"
                    devels={devels.filter(x => x.groupID === "shipyard")}
                    develsResearched={this.state.develsResearched}

                    onToggleDevel={n => this._onToggleDevel(n)}
                />
            </div>
            <hr />
            <h2>Current Tech Bitvalues</h2>
            <p>{numSetToHumanReadable(this._getTechResearched())}</p>
        </>;
    }

    private _getTechResearched(): Set<number> {
        const civData = this.props.coreData.civilizations.get(this.state.civID);
        if (!civData) throw new Error("Unexpected undefined value.");
        return getTechResearched(
            this.props.coreData,
            new Set(civData.baseTechs),
            this.state.stationTypesActive,
            this.state.develsResearched,
        );
    }

    private _getReachableDevels(): Array<DevelopmentData> {
        return getReachableDevels(this.props.coreData, this._getTechResearched());
    }

    private _getReachableStationTypes(): Array<StationTypeData> {
        return getReachableStationTypes(this.props.coreData, this._getTechResearched());
    }

    private _onFactionChange(newCivID: number): void {
        this.setState(this._createFreshState(newCivID));
    }

    private _onToggleStationType(stationTypeID: number): void {
        this.setState(state => {
            const newSet = new Set(state.stationTypesActive);
            if (newSet.has(stationTypeID)) {
                newSet.delete(stationTypeID);
            } else {
                newSet.add(stationTypeID);
            }
            return {stationTypesActive: newSet};
        });
    }
    //private _onActivateStationType(stationTypeID: number): void {
    //    this.setState(state => {
    //        const newSet = new Set(state.stationTypesActive);
    //        newSet.add(stationTypeID);
    //        return {stationTypesActive: newSet};
    //    });
    //}
    
    private _onToggleDevel(devID: number): void {
        this.setState(state => {
            const newSet = new Set(state.develsResearched);
            if (newSet.has(devID)) {
                newSet.delete(devID);
            } else {
                newSet.add(devID);
            }
            return {develsResearched: newSet};
        });
    }
}

