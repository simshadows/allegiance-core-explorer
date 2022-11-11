import {
    type CoreData,
    type CivilizationData,
    //type StationTypeData,
    //type DevelopmentData,
} from "../../readCoreData";

import {
    getReachableBuyables,
    //analyzeTechTreeDependencies,
} from "../../analyzer";


interface GraphNode {
    id: string;
    name: string;
}

interface GraphPrerender {
    nodes: GraphNode[];
}

export function compileGraphPrerender(coreData: CoreData, civData: CivilizationData): GraphPrerender {
    const reachables = getReachableBuyables(coreData, civData);

    const nodes: GraphNode[] = [];
    for (const d of reachables.stationTypes.values()) {
        nodes.push({
            id: `s${d.stationTypeID}`,
            name: d.name,
        });
    }
    for (const d of reachables.developments.values()) {
        nodes.push({
            id: `d${d.devID}`,
            name: d.name,
        });
    }

    return {
        nodes,
    }
}

