/*
 * sequentialReader.ts
 * author: simshadows <contact@simshadows.com>
 * license: GPL-3.0-only <https://www.gnu.org/licenses/gpl-3.0.en.html>
 */

const IS_LITTLE_ENDIAN = true;

const decoder = new TextDecoder("utf-8");

class SequentialReader {
    private _view: DataView;
    private _curr: number;

    constructor(buf: ArrayBuffer) {
        this._view = new DataView(buf);
        this._curr = 0;
    }

    //getCurr(): number {
    //    return this._curr;
    //}

    isFinished(): boolean {
        return this._curr === this._view.byteLength;
    }

    skipBytes(len: number): SequentialReader {
        this._inc(len);
        return this;
    }

    readShort(): number {
        const n = this._view.getInt16(this._curr, IS_LITTLE_ENDIAN);
        this._inc(2);
        return n;
    }

    readFloat(): number {
        const n = this._view.getFloat32(this._curr, IS_LITTLE_ENDIAN);
        this._inc(4);
        return n;
    }

    readString(len: number): string {
        const s: string = decoder.decode(this._view.buffer.slice(this._curr, this._curr + len));
        this._inc(len);

        const nullPos: number = s.indexOf("\x00");
        if (nullPos === -1) {
            return s;
        } else if ((nullPos < -1) || (nullPos >= s.length)) {
            throw new Error("Unexpected value.");
        }
        return s.slice(0, nullPos);
    }

    readBitArray(numBits: number): ArrayBuffer {
        const byteLen = numBits / 8;
        if (byteLen % 1 !== 0) throw new Error("Expected whole number of bytes.");

        const newBuf = this._view.buffer.slice(this._curr, this._curr + byteLen);
        this._inc(byteLen);
        return newBuf;
    }

    private _inc(len: number): void {
        this._curr += len;
        if (this._curr > this._view.byteLength) throw new Error("Buffer over-read.");
    }
}


export {SequentialReader};

