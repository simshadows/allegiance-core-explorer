/*
 * index.ts
 * author: simshadows <contact@simshadows.com>
 * license: GPL-3.0-only <https://www.gnu.org/licenses/gpl-3.0.en.html>
 */

import {
    type CoreData,
    type CivilizationData,
    type StationTypeData,
    type DevelopmentData,
} from "../readCoreData";

import {setDifference} from "../utils";

/*** ***/

export function getTechResearched(
    coreData:       CoreData,
    baseTech:           Set<number>, // Bitmask Positions
    stationTypesActive: Set<number> | Map<number, StationTypeData>,
    develsResearched:   Set<number> | Map<number, DevelopmentData>,
    allowSupremacy: boolean = true,
    allowTactical:  boolean = true,
    allowExpansion: boolean = true,
    allowShipyard:  boolean = true,
): Set<number> {
    const tech: Set<number> = new Set(baseTech);
    if (allowSupremacy) tech.add(3);
    if (allowTactical)  tech.add(4);
    if (allowExpansion) tech.add(5);
    if (allowShipyard)  tech.add(6);

    for (const stationTypeID of stationTypesActive.keys()) {
        const stationTypeData = coreData.stationTypes.get(stationTypeID);
        if (!stationTypeData) throw new Error("Unexpected undefined value.");
        for (const techBitIndex of stationTypeData.techEffects) {
            tech.add(techBitIndex);
        }
        for (const techBitIndex of stationTypeData.localTech) {
            tech.add(techBitIndex);
        }
    }
    for (const devID of develsResearched.keys()) {
        const devData = coreData.developments.get(devID);
        if (!devData) throw new Error("Unexpected undefined value.");
        for (const techBitIndex of devData.techEffects) {
            tech.add(techBitIndex);
        }
    }
    return tech;
}

/*** ***/

export function getReachableDevels(
    coreData:       CoreData,
    techResearched: Set<number>,
): Array<DevelopmentData> {
    const arr: Array<DevelopmentData> = Array
        .from(coreData.developments.values())
        .filter(x => setDifference(x.techRequired, techResearched).size === 0);
    return arr;
}

export function getReachableStationTypes(
    coreData:       CoreData,
    techResearched: Set<number>,
): Array<StationTypeData> {
    const arr: Array<StationTypeData> = Array
        .from(coreData.stationTypes.values())
        .filter(x => setDifference(x.techRequired, techResearched).size === 0);
    return arr;
}

/*** ***/

export interface ReachableBuyables {
    civilization: CivilizationData;

    stationTypes: Map<number, StationTypeData>;
    developments: Map<number, DevelopmentData>;
}

export function getReachableBuyables(
    coreData: CoreData,
    civData:  CivilizationData,
): ReachableBuyables {
    const initialStationData = coreData.stationTypes.get(civData.initialStationTypeID);
    if (!initialStationData) throw new Error("Unexpected undefined value.");

    const ret: ReachableBuyables = {
        civilization: civData,

        stationTypes: new Map([[civData.initialStationTypeID, initialStationData]]),
        developments: new Map(),
    };

    let noChanges = false;
    while (!noChanges) {
        noChanges = true;
        const techResearched: Set<number> = getTechResearched(
            coreData,
            new Set(civData.baseTechs),
            ret.stationTypes,
            ret.developments,
        );

        for (const devData of getReachableDevels(coreData, techResearched)) {
            if (ret.developments.has(devData.devID)) continue;
            ret.developments.set(devData.devID, devData);
            noChanges = false;
        }
        for (const stationTypeData of getReachableStationTypes(coreData, techResearched)) {
            if (ret.stationTypes.has(stationTypeData.stationTypeID)) continue;
            ret.stationTypes.set(stationTypeData.stationTypeID, stationTypeData);
            noChanges = false;
        }
    }
    return ret;
}

/*** ***/

export interface Providers {
    stationTypes: Map<number, StationTypeData>; // Station type ID --> Data obj
    developments: Map<number, DevelopmentData>; // Development ID --> Data obj
}

export function getProviders(
    stationTypes: Map<number, StationTypeData>,
    devels:       Map<number, DevelopmentData>,
): Map<number, Providers> { // Bitmask index --> things that provide this index
    const ret: Map<number, Providers> = new Map();

    const getIndex = (x: number) => {
        const p = ret.get(x);
        if (p) return p;
        const pp = {
            stationTypes: new Map(),
            developments: new Map(),
        };
        ret.set(x, pp);
        return pp;
    };

    for (const stationTypeData of stationTypes.values()) {
        for (const i of stationTypeData.techEffects) {
            const p: Providers = getIndex(i);
            p.stationTypes.set(stationTypeData.stationTypeID, stationTypeData);
        }
    }
    for (const devData of devels.values()) {
        for (const i of devData.techEffects) {
            const p: Providers = getIndex(i);
            p.developments.set(devData.devID, devData);
        }
    }
    return ret;
}

/*** ***/

//// Civilization ID to its reachables
//export type AllReachableBuyables = Map<number, ReachableBuyables>;
//
//export function getAllReachableBuyables(coreData: CoreData): AllReachableBuyables {
//    const m: AllReachableBuyables = new Map();
//    for (const civData of coreData.civilizations.values()) {
//        m.set(civData.civID, getReachableBuyables(coreData, civData));
//    }
//    return m;
//}

/*** ***/

export interface TechTreeDependenciesAnalysis {

}

export function analyzeTechTreeDependencies(reachables: ReachableBuyables): TechTreeDependenciesAnalysis {
    console.log(reachables);
    return {};
}

