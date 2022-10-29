/*
 * utils.tsx
 * author: simshadows <contact@simshadows.com>
 * license: GPL-3.0-only <https://www.gnu.org/licenses/gpl-3.0.en.html>
 */

export function toHumanReadableArrayBuffer(buffer: ArrayBuffer) {
    const view = new DataView(buffer);
    const arr: Array<string> = [];
    for (let i = 0; i < view.byteLength; ++i) {
        arr.push(String(view.getUint8(i)));
    }
    return arr.join(", ");
}

