import React from "react";

import {
    type CoreData,
    type CivilizationData,
    //type StationTypeData,
    type DevelopmentData,
} from "../../readCoreData";

import "./index.css";

function numSetToHumanReadable(obj: Set<number>) {
    return Array.from(obj).join(", ");
}

/*** ***/

interface ResearchMenuProps {
    devels: Array<DevelopmentData>;
    develsResearched: Set<number>; // Development IDs
}

function ResearchMenu(props: ResearchMenuProps) {
    props;
    return <div className="research-simulator-view--research-menu">
        test
    </div>;
}

/*** ***/

interface Props {
    coreData: CoreData;
}

interface State {
    develsResearched: Set<number>; // Development IDs
    civID: number;
}

export class ResearchSimulatorView extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const civData: CivilizationData = Array.from(this.props.coreData.civilizations.values())[0];

        this.state = {
            develsResearched: new Set(),
            civID: civData.civID,
        };
    }

    render() {
        console.log(this.state);
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
            <ResearchMenu
                devels={[]}
                develsResearched={this.state.develsResearched}
            />
            <hr />
            <h2>Current Tech Bitvalues</h2>
            <p>{numSetToHumanReadable(this._getTechResearched())}</p>
        </>;
    }

    private _getTechResearched(): Set<number> {
        const civData: CivilizationData = this.props.coreData.civilizations.get(this.state.civID);
        const tech: Set<number> = new Set(civData.baseTechs);
        return tech;
    }

    private async _onFactionChange(e: React.ChangeEvent<HTMLSelectElement>): Promise<void> {
        const civData: CivilizationData = this.props.coreData.civilizations.get(parseInt(e.target.value));
        this.setState({
            develsResearched: new Set(),
            civID: civData.civID,
        });
    }
}

