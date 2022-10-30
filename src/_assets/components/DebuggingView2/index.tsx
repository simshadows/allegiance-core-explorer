import React from "react";

import {
    type CoreData,
    //type CivilizationData,
    //type StationTypeData,
    //type DevelopmentData,
} from "../../readCoreData";

import {
    getReachableBuyables,
    type Providers,
    getProviders,
    analyzeTechTreeDependencies,
} from "../../analyzer";

import {CivilizationSelector} from "../common/CivilizationSelector";

import "./index.css";

/*** ***/

//function numSetToHumanReadable(obj: Set<number>) {
//    return Array.from(obj).join(", ");
//}

//function renderAttribute(name: string, obj: any) {
//    return <li><span className="attribute-name">{name}:</span> {String(obj)}</li>;
//}

function renderProvider(bitIndex: number, providers: Providers) {
    return <tr key={bitIndex}>
        <td>{bitIndex}</td>
        <td>
            {
                Array.from(providers.stationTypes.values()).map(x =>
                    <span key={`st${x.stationTypeID}`}><span className="debugging-view-2--type">Station: </span>
                        {x.name}
                    </span>
                )
            }
            {
                Array.from(providers.developments.values()).map(x =>
                    <span key={`st${x.devID}`}><span className="debugging-view-2--type">Devel: </span>
                        {x.name}
                    </span>
                )
            }
        </td>
    </tr>;
}

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
        const reachables = getReachableBuyables(this.props.coreData, civData);
        const providers = getProviders(reachables.stationTypes, reachables.developments);
        console.log(analyzeTechTreeDependencies(reachables));

        console.log(providers);

        return <>
            <p>
                <CivilizationSelector
                    currentCivID={this.state.civID}
                    civilizationsMap={this.props.coreData.civilizations}
                    onChange={(e) => this._onFactionChange(e)}
                />
            </p>
            <h2>Providers</h2>
            <table className="debugging-view-2">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Providers</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Array.from(providers).sort(([a, _], [b, __]) => Math.sign(a - b))
                            .map(([k, v]) => renderProvider(k, v))
                    }
                </tbody>
            </table>
        </>;
    }

    private _onFactionChange(newCivID: number): void {
        this.setState({
            civID: newCivID,
        });
    }
}

