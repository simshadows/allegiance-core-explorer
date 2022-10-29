/*
 * utils.tsx
 * author: simshadows <contact@simshadows.com>
 * license: GPL-3.0-only <https://www.gnu.org/licenses/gpl-3.0.en.html>
 */

// Left minus Right
export function setDifference<T>(a: Set<T>, b: Set<T>): Set<T> {
    return new Set([...a].filter(x => !b.has(x)));
}

//export function toHumanReadableArrayBuffer(buffer: ArrayBuffer) {
//    const view = new DataView(buffer);
//    const arr: Array<string> = [];
//    for (let i = 0; i < view.byteLength; ++i) {
//        arr.push(String(view.getUint8(i)));
//    }
//    return arr.join(", ");
//}

//export function toHumanReadableArrayBuffer(buffer: ArrayBuffer) {
//    const view = new DataView(buffer);
//
//    const bits: Array<boolean> = [];
//    for (let i = 0; i < view.byteLength; ++i) {
//        const num = view.getUint8(i);
//        for (let j = 0; j < 8; ++j) {
//            const isSet: boolean = !!(num & (1 << j));
//            bits.push(isSet);
//        }
//    }
//
//    const indices: Array<string> = [];
//    for (const [i, isSet] of bits.entries()) {
//        if (isSet) indices.push(String(i));
//    }
//    return indices.join(", ");
//}

