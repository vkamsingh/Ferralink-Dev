
//** @type QueueTrack */
export interface QueueTrack {
    encoded: string;
    info: {
        identifier: string;
        isSeekable: boolean;
        author: string;
        length: number;
        isStream: boolean;
        position: number;
        title: string;
        uri?: string;
        artworkUrl?: string;
        isrc?: string;
        sourceName: string;
        requester: any;
    }
    pluginInfo: unknown;
}

export default class Queue extends Array {
    public current: QueueTrack;
    public previous: QueueTrack;
    
    constructor() {
        super();

        this.current = null;
        this.previous = null;
    }

    public get size() {
        return this.length;
    }

    public get totalSize() {
        return this.length + (this.current ? 1 : 0);
    }

    public get isEmpty() {
        return this.length === 0;
    }

    public get durationLength() {
        return this.reduce((acc, cur) => acc + (cur.length || 0), 0);
    }

    public add(track: QueueTrack, options: { requester: string; }) {
        track.info.requester = options?.requester || null;
        return this.push(track);
    }

    public remove(index: number) {
        return this.splice(index, 1)[0];
    }

    public clear() {
        return this.splice(0);
    }

    public shuffle() {
        for (let i = this.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }
}
