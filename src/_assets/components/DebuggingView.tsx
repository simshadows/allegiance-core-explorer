import React from "react";
import {createRoot} from "react-dom/client";

import {
    type CoreData,
    type CivilizationData,
    type StationTypeData,
    type DevelopmentData,
} from "../readCoreData";


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

interface Props {
    coreData: CoreData;
}

export function DebuggingView(props: Props) {
    return <>
        <h2>Factions</h2>
        <ul>
            {
                Array.from(props.coreData.civilizations)
                    .sort(([k1, a], [k2, b]) => a.name.localeCompare(b.name))
                    .map(([k, v]) => renderCivilization(v))
            }
        </ul>
        <h2>Devels</h2>
        <ul>
            {
                Array.from(props.coreData.developments)
                    .sort(([k1, a], [k2, b]) => a.name.localeCompare(b.name))
                    .map(([k, v]) => renderDevelopment(v))
            }
        </ul>
        <h2>Stations</h2>
        <ul>
            {
                Array.from(props.coreData.stationTypes)
                    .sort(([k1, a], [k2, b]) => a.name.localeCompare(b.name))
                    .map(([k, v]) => renderStationType(v))
            }
        </ul>
    </>;
}

