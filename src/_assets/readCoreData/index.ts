/*
 * index.ts
 * author: simshadows <contact@simshadows.com>
 * license: GPL-3.0-only <https://www.gnu.org/licenses/gpl-3.0.en.html>
 * 
 * This work is based on Allegiance IGC Core editor <https://github.com/kgersen/allegice>
 * by KGJV <kirthalleg@gmail.com>.
 */

import {decodeNullTerminatedString} from "../utils";

import c from "./extractedConstants";

interface CivilizationData {
    incomeMoney: number;
    bonusMoney:  number;
    name:        string;
    iconName:    string;
    hudName:     string;
}

async function fetchCoreData(): Promise<ArrayBuffer> {
    const res = await fetch("/ac_07.igc");
    if (!res.ok) throw "Didn't find 'ac_07.igc'. Please place this file in the 'public' folder.";
    //const reader = res.body.getReader();

    //const data: ReadableStreamReadResult<Uint8Array> = await reader.read();
    //if (!(await reader.read()).done) throw "Should be done."; // TODO: Properly handle this edge case
    //return data.value;
    return await res.arrayBuffer();
}

async function readCoreData(): Promise<void> {
    const data = await fetchCoreData();
    const view = new DataView(data);

    console.log(data);

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
                console.log("Found OT_civilization");
                //const expectedSize = ;
                //if (objSize !== expectedSize) throw "Mismatched size";
                let i = curr;

                const incomeMoney = view.getFloat32(i, true);
                i += 4;

                const bonusMoney = view.getFloat32(i, true);
                i += 4

                const name = decodeNullTerminatedString(view.buffer.slice(i, i + c.c_cbName));
                i += c.c_cbName;

                const iconName = decodeNullTerminatedString(view.buffer.slice(i, i + c.c_cbFileName));
                i += c.c_cbFileName;

                const hudName = decodeNullTerminatedString(view.buffer.slice(i, i + c.c_cbFileName));
                i += c.c_cbFileName;

                civData.push({
                    incomeMoney,
                    bonusMoney,
                    name,
                    iconName,
                    hudName,
                });
                break;

            case c.OT_constants:
                console.log("Found OT_constants");
                const expectedSize = (4 * c.c_fcidMax) + (4 * c.c_dmgidMax * c.c_defidMax);
                if (objSize !== expectedSize) throw "Mismatched size";
                break;

            default:
                // Do nothing
        }

        curr += objSize;
    }

    console.log(iCoreHeader);
    console.log(cfmapSize);

    console.log(civData);
}

export {readCoreData};

