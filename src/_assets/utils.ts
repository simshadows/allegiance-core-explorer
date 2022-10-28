/*
 * utils.ts
 * author: simshadows <contact@simshadows.com>
 * license: GPL-3.0-only <https://www.gnu.org/licenses/gpl-3.0.en.html>
 */

const decoder = new TextDecoder("utf-8");

function decodeNullTerminatedString(buf: ArrayBuffer) {
    const s: string = decoder.decode(buf);
    const nullPos: number = s.indexOf("\x00");
    if (nullPos === -1) {
        return s;
    } else if (nullPos < -1) {
        throw new Error("Unexpected value.");
    }

    return s.slice(0, nullPos);
}

export {decodeNullTerminatedString};

