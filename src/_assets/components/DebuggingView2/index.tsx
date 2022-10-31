import React from "react";

import {
    type CoreData,
    //type CivilizationData,
    //type StationTypeData,
    //type DevelopmentData,
} from "../../readCoreData";

import {
    getReachableBuyables,
    getProviders,
    getAllDependencies,
    analyzeTechTreeDependencies,
} from "../../analyzer";

import {CivilizationSelector} from "../common/CivilizationSelector";

import {ProviderDisplay} from "./ProviderDisplay";
import {DependenciesDisplay} from "./DependenciesDisplay";

import "./index.css";

/*** ***/

interface Props {
    coreData: CoreData;
}

interface State {
    civID: number;
}

export class DebuggingView2 extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const civData = Array.from(this.props.coreData.civilizations.values())[0];
        if (!civData) throw new Error("Unexpected undefined value.");
        this.state = {
            civID: civData.civID,
        };
    }

    override render() {
        const civData = this.props.coreData.civilizations.get(this.state.civID);
        if (!civData) throw new Error("Unexpected undefined value.");
        const startingStationData = this.props.coreData.stationTypes.get(civData.initialStationTypeID);
        if (!startingStationData) throw new Error("Unexpected undefined value.");
        const reachables = getReachableBuyables(this.props.coreData, civData);
        const providers = getProviders(reachables.stationTypes, reachables.developments);
        const dependencies = getAllDependencies(
            reachables.stationTypes,
            reachables.developments,
            new Set([...civData.baseTechs, ...startingStationData.techEffects, ...startingStationData.localTech]),
            providers,
        );
        console.log(analyzeTechTreeDependencies(reachables));
        console.log(dependencies);

        return <>
            <p>
                <CivilizationSelector
                    currentCivID={this.state.civID}
                    civilizationsMap={this.props.coreData.civilizations}
                    onChange={(e) => this._onFactionChange(e)}
                />
            </p>
            <p>
                <em>Note: We are assuming all types of tech bases are allowed, and we will ignore the starting base.</em>
            </p>
            <h2>Providers</h2>
            <ProviderDisplay
                providers={providers}
                civData={civData}
            />
            <h2>Dependencies: Station Types</h2>
            <DependenciesDisplay
                dependencies={dependencies.stationTypes}
                civData={civData}
            />
            <h2>Dependencies: Devels</h2>
            <DependenciesDisplay
                dependencies={dependencies.developments}
                civData={civData}
            />
        </>;
    }

    private _onFactionChange(newCivID: number): void {
        this.setState({
            civID: newCivID,
        });
    }
}

