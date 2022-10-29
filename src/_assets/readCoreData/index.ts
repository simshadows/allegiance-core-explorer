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

type TechTreeBitMask = ArrayBuffer; // TODO: What is this? How do I read it?

function readTechTreeBitMask(reader: SequentialReader) {
    return reader.readBitArray(c.c_ttbMax);
}

/*** ***/

interface CivilizationData {
    incomeMoney: number;
    bonusMoney:  number;
    name:        string;
    iconName:    string;
    hudName:     string;

    baseTechs:  TechTreeBitMask;
    noDevTechs: TechTreeBitMask;

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

        baseAttributes: readGlobalAttributeSet(r.skipBytes(1)),

        lifepod: r.readShort(),
        civID: r.readShort(),
        initialStationTypeID: r.readShort(),
    };
    r.skipBytes(2); // TODO: What are these bytes for?
    if (!r.isFinished()) throw new Error("Unexpected object size.");
    return data;
}

/*** ***/

interface DevelopmentData {
    price:       number;
    timeToBuild: number;

    modelName:   string;
    iconName:    string;
    name:        string;
    description: string;

    groupID: number;

    techRequired: TechTreeBitMask;
    techEffects:  TechTreeBitMask;

    globalAttributeSet: GlobalAttributeSet;

    devID: number;
    completionSoundID: number;
}

function readDevelopmentData(buf: ArrayBuffer): DevelopmentData {
    const r = new SequentialReader(buf);
    const obj: DevelopmentData = {
        price: r.readInt(),
        timeToBuild: r.readDWORD(),

        modelName: r.readString(c.c_cbFileName + 1),
        iconName: r.readString(c.c_cbFileName),
        name: r.readString(c.c_cbName),
        description: r.readString(c.c_cbDescription),

        groupID: r.readChar(),

        techRequired: readTechTreeBitMask(r),
        techEffects: readTechTreeBitMask(r),

        globalAttributeSet: readGlobalAttributeSet(r.skipBytes(2)),

        devID: r.readShort(),
        completionSoundID: r.readShort(),
    };
    console.log(obj);
    return obj;
}

/*** ***/

interface CoreData {
    iCoreHeader: number;

    civilization: Array<CivilizationData>;
    development: Array<DevelopmentData>;
}

async function fetchCoreData(): Promise<ArrayBuffer> {
    const res = await fetch("/ac_07.igc");
    if (!res.ok) throw "Didn't find 'ac_07.igc'. Please place this file in the 'public' folder.";
    return await res.arrayBuffer();
}

async function readCoreData(): Promise<void> {
    const buf = await fetchCoreData();
    const view = new DataView(buf);

    const data: CoreData = {
        iCoreHeader: view.getInt32(0, true),

        civilization: [],
        development: [],
    }

    const cfmapSize = view.getInt32(4, true);
    if (cfmapSize !== view.byteLength - 8) throw "Expected to match data size."; // Might not be necessary

    let curr = 8;
    while (curr < view.byteLength) {

        const objType = view.getInt16(curr, true);
        const objSize = view.getInt32(curr + 2, true);
        curr += 6;

        switch (objType) {

            case c.OT_civilization:
                data.civilization.push(
                    readCivilizationData(buf.slice(curr, curr + objSize))
                );
                break;
            case c.OT_development:
                data.development.push(
                    readDevelopmentData(buf.slice(curr, curr + objSize))
                );
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

    console.log(`cfmapSize = ${cfmapSize}`);
    console.log(data);
}

export {readCoreData};

