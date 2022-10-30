import React from "react";

import {
    type Buyable,
    //type CoreData,
    type CivilizationData,
    //type StationTypeData,
    //type DevelopmentData,
} from "../../readCoreData";

import {
    type Dependencies,
} from "../../analyzer";

/*** ***/

//function numSetToHumanReadable(obj: Set<number>) {
//    return Array.from(obj).join(", ");
//}

//function renderAttribute(name: string, obj: any) {
//    return <li><span className="attribute-name">{name}:</span> {String(obj)}</li>;
//}

function renderDependencies({obj, deps}: {obj: Buyable; deps: Dependencies;}) {
    return <tr key={obj.name}>{/* TODO: Get a proper ID? */}
        <td>{obj.name}</td>
        <td>
            {
                Array.from(deps.stationTypes.values()).map(x =>
                    <span key={`st${x.stationTypeID}`}><span className="debugging-view-2--type">Station: </span>
                        {x.name}
                    </span>
                )
            }
            {
                Array.from(deps.developments.values()).map(x =>
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
    dependencies: Map<number, {obj: Buyable; deps: Dependencies;}>

    civData: CivilizationData;
}

export function DependenciesDisplay(props: Props) {
    console.log(props.dependencies);
    return <>
        <table className="debugging-view-2">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Depends on</th>
                </tr>
            </thead>
            <tbody>
                {
                    Array.from(props.dependencies)
                        .sort(([_, a], [__, b]) => a.obj.name.localeCompare(b.obj.name))
                        .map(([_, v]) => renderDependencies(v))
                }
            </tbody>
        </table>
    </>;
}

