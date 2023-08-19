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
    };
    pluginInfo: unknown;
}
export default class Queue extends Array {
    current: QueueTrack;
    previous: QueueTrack;
    constructor();
    get size(): number;
    get totalSize(): number;
    get isEmpty(): boolean;
    get durationLength(): any;
    add(track: QueueTrack, options: {
        requester: string;
    }): number;
    remove(index: number): any;
    clear(): any[];
    shuffle(): void;
}
