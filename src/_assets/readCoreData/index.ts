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

interface CivilizationData {
    incomeMoney: number;
    bonusMoney:  number;
    name:        string;
    iconName:    string;
    hudName:     string;

    baseTechs:  ArrayBuffer; // TODO: What is this? How do I read it?
    noDevTechs: ArrayBuffer; // TODO: What is this? How do I read it?

    globalAttributeSetBase: {
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
    };

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

        baseTechs: r.readBitArray(c.c_ttbMax),
        noDevTechs: r.readBitArray(c.c_ttbMax),

        globalAttributeSetBase: {
            maxSpeed:                  r.skipBytes(1).readFloat(), // TODO: What is this byte for?
            thrust:                    r.readFloat(),
            turnRate:                  r.readFloat(),
            turnTorque:                r.readFloat(),
            maxArmorStation:           r.readFloat(),
            armorRegenerationStation:  r.readFloat(),
            maxShieldStation:          r.readFloat(),
            shieldRegenerationStation: r.readFloat(),
            maxArmorShip:              r.readFloat(),
            maxShieldShip:             r.readFloat(),
            shieldRegenerationShip:    r.readFloat(),
            scanRange:                 r.readFloat(),
            signature:                 r.readFloat(),
            maxEnergy:                 r.readFloat(),
            speedAmmo:                 r.readFloat(),
            lifespanEnergy:            r.readFloat(),
            turnRateMissile:           r.readFloat(),
            miningRate:                r.readFloat(),
            miningYield:               r.readFloat(),
            miningCapacity:            r.readFloat(),
            ripcordTime:               r.readFloat(),
            damageGuns:                r.readFloat(),
            damageMissiles:            r.readFloat(),
            developmentCost:           r.readFloat(),
            developmentTime:           r.readFloat(),
        },

        lifepod: r.readShort(),
        civID: r.readShort(),
        initialStationTypeID: r.readShort(),
    };
    r.skipBytes(2); // TODO: What are these bytes for?
    if (!r.isFinished()) throw new Error("Unexpected object size.");
    return data;
}

/*** ***/

async function fetchCoreData(): Promise<ArrayBuffer> {
    const res = await fetch("/ac_07.igc");
    if (!res.ok) throw "Didn't find 'ac_07.igc'. Please place this file in the 'public' folder.";
    return await res.arrayBuffer();
}

async function readCoreData(): Promise<void> {
    const buf = await fetchCoreData();
    const view = new DataView(buf);

    console.log(buf);

    console.log(view);

    const iCoreHeader = view.getInt32(0, true);
    const cfmapSize = view.getInt32(4, true);
    if (cfmapSize !== view.byteLength - 8) throw "Expected to match data size."; // Might not be necessary

    const civData: Array<CivilizationData> = [];

    let curr = 8;
    while (curr < view.byteLength) {

        const objType = view.getInt16(curr, true);
        const objSize = view.getInt32(curr + 2, true);
        curr += 6;

        switch (objType) {

            case c.OT_civilization:
                civData.push(readCivilizationData(buf.slice(curr, curr + objSize)));
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

    console.log(`iCoreHeader = ${iCoreHeader}`);
    console.log(`cfmapSize = ${cfmapSize}`);
    console.log(civData);
}

export {readCoreData};

