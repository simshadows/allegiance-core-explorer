import {
    type CoreData,
    type CivilizationData,
    type StationTypeData,
    //type DevelopmentData,
} from "../../readCoreData";

import {
    getReachableBuyables,
    getProviders,
    type AllDependencies,
    getAllDependencies,
    //analyzeTechTreeDependencies,
} from "../../analyzer";

import {setDifference} from "../../utils";


/*** ***/


export interface GraphNode {
    id: string;
    name: string;
    children: GraphNode[];
}


interface GetTreeResult {
    tree: GraphNode;
    depth: number;
}


function getTree(
    allDependencies: AllDependencies,
    startingTech: Set<number>,
    startingStationData: StationTypeData,
): GetTreeResult {
    const allDepsCopy: AllDependencies = {
        stationTypes: new Map(allDependencies.stationTypes),
        developments: new Map(allDependencies.developments),
    };
    allDepsCopy.stationTypes.delete(startingStationData.stationTypeID);

    const root: GraphNode = {
        id: "root",
        name: "[root]",
        children: [],
    };

    let sanityCheckIsRoot = true;

    let prevTech: Set<number> = new Set(startingTech);
    let currTech: Set<number> = new Set(startingTech);
    let prevNodes: Map<string, GraphNode> = new Map([[root.id, root]]);
    let currNodes: Map<string, GraphNode> = new Map();
    let depth = 0;
    while (allDepsCopy.stationTypes.size + allDepsCopy.developments.size > 0) {
        const stationTypesToDelete: number[] = [];
        const develsToDelete: number[] = [];

        /*
         * TODO: This is terribly duplicated. We should clean it up...
         */

        for (const d of allDepsCopy.stationTypes.values()) {
            if (setDifference(d.obj.techRequired, prevTech).size !== 0) continue;

            const node: GraphNode = {
                id: `s${d.obj.stationTypeID}`,
                name: d.obj.name,
                children: [],
            }

            currNodes.set(node.id, node);
            for (const x of [...d.obj.techEffects, ...d.obj.localTech]) currTech.add(x);
            stationTypesToDelete.push(d.obj.stationTypeID);

            if (prevNodes.has("root")) {
                if (!sanityCheckIsRoot) throw new Error("Fail sanity check.");
                root.children.push(node);
            } else {
                if (sanityCheckIsRoot) throw new Error("Fail sanity check.");
                // We arbitrarily pick the first node we see.
                // TODO: Improve this later.
                let addedToParent = false;
                for (const s of d.deps.stationTypes.values()) {
                    const nodeToAppendTo = prevNodes.get(`s${s.stationTypeID}`);
                    if (!nodeToAppendTo) continue;
                    nodeToAppendTo.children.push(node);
                    addedToParent = true;
                    break;
                }
                if (addedToParent) continue;
                for (const s of d.deps.developments.values()) {
                    const nodeToAppendTo = prevNodes.get(`d${s.devID}`);
                    if (!nodeToAppendTo) continue;
                    nodeToAppendTo.children.push(node);
                    addedToParent = true;
                    break;
                }
                if (addedToParent) continue;
                throw new Error("Expected to append to something.");
            }
        }

        for (const d of allDepsCopy.developments.values()) {
            if (setDifference(d.obj.techRequired, prevTech).size !== 0) continue;

            const node: GraphNode = {
                id: `d${d.obj.devID}`,
                name: d.obj.name,
                children: [],
            }

            currNodes.set(node.id, node);
            for (const x of d.obj.techEffects) currTech.add(x);
            develsToDelete.push(d.obj.devID);

            if (prevNodes.has("root")) {
                if (!sanityCheckIsRoot) throw new Error("Fail sanity check.");
                root.children.push(node);
            } else {
                if (sanityCheckIsRoot) throw new Error("Fail sanity check.");
                // We arbitrarily pick the first node we see.
                // TODO: Improve this later.
                let addedToParent = false;
                for (const s of d.deps.stationTypes.values()) {
                    const nodeToAppendTo = prevNodes.get(`s${s.stationTypeID}`);
                    if (!nodeToAppendTo) continue;
                    nodeToAppendTo.children.push(node);
                    addedToParent = true;
                    break;
                }
                if (addedToParent) continue;
                for (const s of d.deps.developments.values()) {
                    const nodeToAppendTo = prevNodes.get(`d${s.devID}`);
                    if (!nodeToAppendTo) continue;
                    nodeToAppendTo.children.push(node);
                    addedToParent = true;
                    break;
                }
                if (addedToParent) continue;
                throw new Error("Expected to append to something.");
            }
        }

        if (stationTypesToDelete.length + develsToDelete.length === 0) {
            throw new Error("Expected to delete at least one thing.");
        }

        for (const id of stationTypesToDelete) {
            allDepsCopy.stationTypes.delete(id);
        }
        for (const id of develsToDelete) {
            allDepsCopy.developments.delete(id);
        }

        prevTech = new Set(currTech);
        prevNodes = currNodes;
        currNodes = new Map();

        sanityCheckIsRoot = false;

        ++depth;
    }

    return {
        tree: root,
        depth,
    };
}


/*** ***/


interface GraphLink {
    source: string; // ID
    target: string; // ID
}

interface GraphPrerender {
    nodes: GraphNode[];
    links: GraphLink[];

    tree: GraphNode;

    hints: {
        treeDepth: number;
    };
}


export function compileGraphPrerender(coreData: CoreData, civData: CivilizationData): GraphPrerender {
    const startingStationData = coreData.stationTypes.get(civData.initialStationTypeID);
    if (!startingStationData) throw new Error("Unexpected undefined value.");
    const startingTech: Set<number> = new Set([
        3,4,5,6,
        ...civData.baseTechs,
        ...startingStationData.techEffects,
        ...startingStationData.localTech,
    ]);

    const reachables = getReachableBuyables(coreData, civData);
    const providers = getProviders(reachables.stationTypes, reachables.developments);
    const dependencies = getAllDependencies(
        reachables.stationTypes,
        reachables.developments,
        startingTech,
        providers,
    );

    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const tree: GetTreeResult = getTree(dependencies, startingTech, startingStationData);

    nodes.push({
        id: "root",
        name: "(root)",
        children: [],
    });
    for (const d of reachables.stationTypes.values()) {
        nodes.push({
            id: `s${d.stationTypeID}`,
            name: d.name,
            children: [],
        });
    }
    for (const d of reachables.developments.values()) {
        nodes.push({
            id: `d${d.devID}`,
            name: d.name,
            children: [],
        });
    }

    for (const d of dependencies.stationTypes.values()) {
        for (const d2 of d.deps.stationTypes.values()) {
            links.push({
                source: `s${d2.stationTypeID}`,
                target: `s${d.obj.stationTypeID}`,
            });
        }
        for (const d2 of d.deps.developments.values()) {
            links.push({
                source: `d${d2.devID}`,
                target: `s${d.obj.stationTypeID}`,
            });
        }
    }
    for (const d of dependencies.developments.values()) {
        for (const d2 of d.deps.stationTypes.values()) {
            links.push({
                source: `s${d2.stationTypeID}`,
                target: `d${d.obj.devID}`,
            });
        }
        for (const d2 of d.deps.developments.values()) {
            links.push({
                source: `d${d2.devID}`,
                target: `d${d.obj.devID}`,
            });
        }
    }
    for (const node of tree.tree.children) {
        links.push({
            source: "root",
            target: node.id,
        });
    }

    return {
        nodes,
        links,
        tree: tree.tree,

        hints: {
            treeDepth: tree.depth,
        },
    }
}

