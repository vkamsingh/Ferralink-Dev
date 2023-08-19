"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue extends Array {
    current;
    previous;
    constructor() {
        super();
        this.current = null;
        this.previous = null;
    }
    get size() {
        return this.length;
    }
    get totalSize() {
        return this.length + (this.current ? 1 : 0);
    }
    get isEmpty() {
        return this.length === 0;
    }
    get durationLength() {
        return this.reduce((acc, cur) => acc + (cur.length || 0), 0);
    }
    add(track, options) {
        track.info.requester = options?.requester || null;
        return this.push(track);
    }
    remove(index) {
        return this.splice(index, 1)[0];
    }
    clear() {
        return this.splice(0);
    }
    shuffle() {
        for (let i = this.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }
}
exports.default = Queue;
