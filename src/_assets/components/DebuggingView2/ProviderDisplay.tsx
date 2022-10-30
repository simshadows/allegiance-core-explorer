import React from "react";

import {
    //type CoreData,
    type CivilizationData,
    //type StationTypeData,
    //type DevelopmentData,
} from "../../readCoreData";

import {
    type Providers,
} from "../../analyzer";

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
    providers: Map<number, Providers>;
    civData: CivilizationData;
}

export function ProviderDisplay(props: Props) {
    return <>
        <table className="debugging-view-2">
            <thead>
                <tr>
                    <th>Index</th>
                    <th>Providers</th>
                </tr>
            </thead>
            <tbody>
                {
                    Array.from(props.providers).sort(([a, _], [b, __]) => Math.sign(a - b))
                        .map(([k, v]) => renderProvider(k, v))
                }
            </tbody>
        </table>
    </>;
}

