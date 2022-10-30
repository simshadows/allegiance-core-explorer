/*
 * index.ts
 * author: simshadows <contact@simshadows.com>
 * license: GPL-3.0-only <https://www.gnu.org/licenses/gpl-3.0.en.html>
 *
 * Copyright (C) 2008 FAZ Dev Team. All Rights Reserved.
 *
 * further attribution:
 *      This is a derivative work of Allegiance IGC Core editor
 *      <https://github.com/kgersen/allegice> by KGJV <kirthalleg@gmail.com>,
 *      which in turn is a derivative work of Microsoft Allegiance.
 */

import {SequentialReader} from "./sequentialReader";

import {
    type GroupID,
    groupIdIntToEnum,
} from "../types";

import c from "./constants";

interface GlobalAttributeSet {
    maxSpeed:                  number;
    thrust:                    number;
    turnRate:                  number;
    turnTorque:                number;
    maxArmorStation:           number;
    armorRegenerationStation:  number;
    maxShieldStation:          number;
    shieldRegenerationStation: number;
    maxArmorShip:              number;
    maxShieldShip:             number;
    shieldRegenerationShip:    number;
    scanRange:                 number;
    signature:                 number;
    maxEnergy:                 number;
    speedAmmo:                 number;
    lifespanEnergy:            number;
    turnRateMissile:           number;
    miningRate:                number;
    miningYield:               number;
    miningCapacity:            number;
    ripcordTime:               number;
    damageGuns:                number;
    damageMissiles:            number;
    developmentCost:           number;
    developmentTime:           number;
}

function readGlobalAttributeSet(reader: SequentialReader) {
    return {
        maxSpeed:                  reader.readFloat(),
        thrust:                    reader.readFloat(),
        turnRate:                  reader.readFloat(),
        turnTorque:                reader.readFloat(),
        maxArmorStation:           reader.readFloat(),
        armorRegenerationStation:  reader.readFloat(),
        maxShieldStation:          reader.readFloat(),
        shieldRegenerationStation: reader.readFloat(),
        maxArmorShip:              reader.readFloat(),
        maxShieldShip:             reader.readFloat(),
        shieldRegenerationShip:    reader.readFloat(),
        scanRange:                 reader.readFloat(),
        signature:                 reader.readFloat(),
        maxEnergy:                 reader.readFloat(),
        speedAmmo:                 reader.readFloat(),
        lifespanEnergy:            reader.readFloat(),
        turnRateMissile:           reader.readFloat(),
        miningRate:                reader.readFloat(),
        miningYield:               reader.readFloat(),
        miningCapacity:            reader.readFloat(),
        ripcordTime:               reader.readFloat(),
        damageGuns:                reader.readFloat(),
        damageMissiles:            reader.readFloat(),
        developmentCost:           reader.readFloat(),
        developmentTime:           reader.readFloat(),
    };
}

/*** ***/

type TechTreeBitMask = Set<number>;

// Could be more efficient, but I'll prefer the readability for now.
function readTechTreeBitMask(reader: SequentialReader) {
    const view = new DataView(reader.readBitArray(c.c_ttbMax));

    const bits: Array<boolean> = [];
    for (let i = 0; i < view.byteLength; ++i) {
        const num = view.getUint8(i);
        for (let j = 0; j < 8; ++j) {
            bits.push(!!(num & (1 << j)));
        }
    }

    const indices: Set<number> = new Set();
    for (const [i, isSet] of bits.entries()) {
        if (isSet) indices.add(i);
    }
    return indices;
}

/*** ***/

export interface Buyable {
    price:       number;
    timeToBuild: number;

    modelName:   string;
    iconName:    string;
    name:        string;
    description: string;

    groupID: GroupID;

    techRequired: TechTreeBitMask;
    techEffects:  TechTreeBitMask;
}

function readBuyableData(reader: SequentialReader): Buyable {
    return {
        price: reader.readInt(),
        timeToBuild: reader.readDWORD(),

        modelName: reader.readString(c.c_cbFileName + 1),
        iconName: reader.readString(c.c_cbFileName),
        name: reader.readString(c.c_cbName),
        description: reader.readString(c.c_cbDescription),

        groupID: groupIdIntToEnum(reader.readChar()),

        techRequired: readTechTreeBitMask(reader),
        techEffects: readTechTreeBitMask(reader),
    };
}

/*** ***/

export interface CivilizationData {
    incomeMoney: number;
    bonusMoney:  number;
    name:        string;
    iconName:    string;
    hudName:     string;

    baseTechs:  TechTreeBitMask;
    noDevTechs: TechTreeBitMask;

    tmpExtraBytes: ArrayBuffer; // This is just here while I fugre out how this works.
    baseAttributes: GlobalAttributeSet;

    lifepod:              number;
    civID:                number;
    initialStationTypeID: number;
}

function readCivilizationData(buf: ArrayBuffer): CivilizationData {
    const r = new SequentialReader(buf);
    const data = {
        incomeMoney: r.readFloat(),
        bonusMoney: r.readFloat(),
        name: r.readString(c.c_cbName),
        iconName: r.readString(c.c_cbFileName),
        hudName: r.readString(c.c_cbFileName),

        baseTechs: readTechTreeBitMask(r),
        noDevTechs: readTechTreeBitMask(r),

        tmpExtraBytes: r.extractBytes(1),
        baseAttributes: readGlobalAttributeSet(r),

        lifepod: r.readShort(),
        civID: r.readShort(),
        initialStationTypeID: r.readShort(),
    };
    r.skipBytes(2); // TODO: What are these bytes for?
    if (!r.isFinished()) throw new Error("Unexpected object size.");
    return data;
}

/*** ***/

export interface StationTypeData extends Buyable {
    signature:          number;
    maxArmorHitPoints:  number;
    maxShieldHitPoints: number;
    armorRegeneration:  number;
    shieldRegeneration: number;
    scannerRange:       number;
    income:             number;
    radius:             number;

    localTech: TechTreeBitMask;

    stationTypeID:          number;
    successorStationTypeID: number;

    defenseTypeArmor:  number;
    defenseTypeShield: number;

    capabilities: {
        unload:              boolean;
        start:               boolean;
        restart:             boolean;
        ripcord:             boolean;
        capture:             boolean;
        land:                boolean;
        repair:              boolean;
        remoteLeadIndicator: boolean;
        reload:              boolean;
        flag:                boolean;
        pedestal:            boolean;
        teleportUnload:      boolean;
        capLand:             boolean;
        rescue:              boolean;
        rescueAny:           boolean;
    };
    asteroidAbility: {
        mineHe3:     boolean;
        mineLotsHe3: boolean;
        mineGold:    boolean;

        buildable:   boolean;
        special:     boolean;
    };

    stationClassID:          number;
    constructionDroneTypeID: number;

    soundIDs: {
        constructorNeedRockSound:    number;
        constructorUnderAttackSound: number;
        constructorDestroyedSound:   number;
        completionSound:             number;

        interiorSound:      number;
        exteriorSound:      number;
        interiorAlertSound: number;

        underAttackSound: number;
        criticalSound:    number;
        destroyedSound:   number;
        capturedSound:    number;

        enemyCapturedSound:  number;
        enemyDestroyedSound: number;
    };

    textureName: string;
    builderName: string;
}

function readStationCapabilities(n: number) {
    return {
        unload:              !!(n & (1 <<  0)),
        start:               !!(n & (1 <<  1)),
        restart:             !!(n & (1 <<  2)),
        ripcord:             !!(n & (1 <<  3)),
        capture:             !!(n & (1 <<  4)),
        land:                !!(n & (1 <<  5)),
        repair:              !!(n & (1 <<  6)),
        remoteLeadIndicator: !!(n & (1 <<  7)),
        reload:              !!(n & (1 <<  8)),
        flag:                !!(n & (1 <<  9)),
        pedestal:            !!(n & (1 << 10)),
        teleportUnload:      !!(n & (1 << 11)),
        capLand:             !!(n & (1 << 12)),
        rescue:              !!(n & (1 << 13)),
        rescueAny:           !!(n & (1 << 14)),
    };
}

function readAsteroidAbility(n: number) {
    return {
        mineHe3:     !!(n & (1 << 0)),
        mineLotsHe3: !!(n & (1 << 1)),
        mineGold:    !!(n & (1 << 2)),

        buildable:   !!(n & (1 << 3)),
        special:     !!(n & (1 << 4)),
    };
}

function readStationTypeData(buf: ArrayBuffer): StationTypeData {
    const r = new SequentialReader(buf);
    const obj: StationTypeData = {
        ...readBuyableData(r),

        signature: r.skipBytes(2).readFloat(),
        maxArmorHitPoints: r.readFloat(),
        maxShieldHitPoints: r.readFloat(),
        armorRegeneration: r.readFloat(),
        shieldRegeneration: r.readFloat(),
        scannerRange: r.readFloat(),
        income: r.readInt(),
        radius: r.readFloat(),

        localTech: readTechTreeBitMask(r),

        stationTypeID: r.readShort(),
        successorStationTypeID: r.readShort(),

        defenseTypeArmor:  r.readUnsignedChar(),
        defenseTypeShield: r.readUnsignedChar(),
        
        capabilities: readStationCapabilities(r.readUnsignedShort()),
        asteroidAbility: readAsteroidAbility(r.readUnsignedShort()),

        stationClassID: r.readUnsignedChar(),
        constructionDroneTypeID: r.skipBytes(1).readShort(),

        soundIDs: {
            constructorNeedRockSound: r.readShort(),
            constructorUnderAttackSound: r.readShort(),
            constructorDestroyedSound: r.readShort(),
            completionSound: r.readShort(),

            interiorSound: r.readShort(),
            exteriorSound: r.readShort(),
            interiorAlertSound: r.readShort(),

            underAttackSound: r.readShort(),
            criticalSound: r.readShort(),
            destroyedSound: r.readShort(),
            capturedSound: r.readShort(),

            enemyCapturedSound: r.readShort(),
            enemyDestroyedSound: r.readShort(),
        },

        textureName: r.readString(c.c_cbFileName),
        builderName: r.readString(c.c_cbName),
    };
    return obj;
}

/*** ***/

export interface DevelopmentData extends Buyable {
    tmpExtraBytes: ArrayBuffer; // This is just here while I fugre out how this works.
    globalAttributeSet: GlobalAttributeSet;

    devID: number;
    completionSoundID: number;
}

function readDevelopmentData(buf: ArrayBuffer): DevelopmentData {
    const r = new SequentialReader(buf);
    const obj: DevelopmentData = {
        ...readBuyableData(r),

        tmpExtraBytes: r.extractBytes(2),
        globalAttributeSet: readGlobalAttributeSet(r),

        devID: r.readShort(),
        completionSoundID: r.readShort(),
    };
    return obj;
}

/*** ***/

export interface CoreData {
    iCoreHeader: number;
    cfmapSize: number;

    civilizations: Map<number, CivilizationData>;
    stationTypes:  Map<number, StationTypeData>;
    developments:  Map<number, DevelopmentData>;
}

//async function fetchCoreData(): Promise<ArrayBuffer> {
//    const res = await fetch("/ac_07.igc");
//    if (!res.ok) throw "Didn't find 'ac_07.igc'. Please place this file in the 'public' folder.";
//    return await res.arrayBuffer();
//}

export function readCoreData(buf: ArrayBuffer): CoreData {
    const view = new DataView(buf);

    const data: CoreData = {
        iCoreHeader: view.getInt32(0, true),
        cfmapSize:   view.getInt32(4, true),

        civilizations: new Map(),
        stationTypes:  new Map(),
        developments:  new Map(),
    }

    if (data.cfmapSize !== view.byteLength - 8) {
        throw "Expected to match data size."; // Might not be necessary
    }

    let curr = 8;
    while (curr < view.byteLength) {

        const objType = view.getInt16(curr, true);
        const objSize = view.getInt32(curr + 2, true);
        curr += 6;

        switch (objType) {

            case c.OT_civilization:
                const civData = readCivilizationData(buf.slice(curr, curr + objSize));
                if (data.civilizations.has(civData.civID)) {
                    throw new Error(`Duplicate civilization ID: ${civData.civID}`);
                }
                data.civilizations.set(civData.civID, civData);
                break;

            case c.OT_stationType:
                const stationTypeData = readStationTypeData(buf.slice(curr, curr + objSize));
                if (data.stationTypes.has(stationTypeData.stationTypeID)) {
                    throw new Error(`Duplicate station type ID: ${stationTypeData.stationTypeID}`);
                }
                data.stationTypes.set(stationTypeData.stationTypeID, stationTypeData);
                break;

            case c.OT_development:
                const devData = readDevelopmentData(buf.slice(curr, curr + objSize))
                if (data.developments.has(devData.devID)) {
                    throw new Error(`Duplicate development ID: ${devData.devID}`);
                }
                data.developments.set(devData.devID, devData);
                break;

            case c.OT_constants:
                // TODO: Parse later
                const expectedSize = (4 * c.c_fcidMax) + (4 * c.c_dmgidMax * c.c_defidMax);
                if (objSize !== expectedSize) throw "Mismatched size";
                break;

            default:
                // Do nothing
        }

        curr += objSize;
    }

    console.log(data);
    return data;
}

