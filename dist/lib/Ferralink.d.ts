/// <reference types="node" />
import { EventEmitter } from 'events';
import { Shoukaku, Player as ShoukakuPlayer, Track, ShoukakuOptions, Connector } from 'shoukaku';
import { Player } from './module/Player';
export interface FerralinkOptions {
    nodes: [];
    shoukakuoptions: ShoukakuOptions;
    defaultSearchEngine: 'spsearch' | 'scsearch' | 'dzsearch' | 'ytmsearch' | 'ytsearch' | 'ymsearch' | 'ftts' | 'amsearch';
}
export interface createPlayerOptions {
    guildId: string;
    voiceId: string;
    textId: string;
    volume: number;
    shardId: number;
    deaf: boolean;
}
export interface playerMapOptions {
    guildId: string;
    voiceId: string;
    volume: number;
    shoukaku: ShoukakuPlayer;
}
export declare interface Ferralink {
    on(event: 'trackStart', listener: (player: Player, track: Track) => void): this;
    on(event: 'trackEnd', listener: (player: Player, track: Track) => void): this;
    on(event: 'queueEnd', listener: (player: Player) => void): this;
    on(event: 'playerClosed', listener: (player: Player, data: any) => void): this;
    on(event: 'trackException', listener: (player: Player, reason: any) => void): this;
    on(event: 'playerUpdate', listener: (player: Player, data: any) => void): this;
    on(event: 'trackStuck', listener: (player: Player, data: any) => void): this;
    on(event: 'trackError', listener: (player: Player, error: any) => void): this;
    on(event: 'playerResumed', listener: (player: Player) => void): this;
    on(event: 'playerDestroy', listener: (player: Player) => void): this;
    on(event: 'playerCreate', listener: (player: Player) => void): this;
}
export declare class Ferralink extends EventEmitter {
    shoukaku: Shoukaku;
    player: Map<createPlayerOptions['guildId'], playerMapOptions>;
    defaultSearchEngine: FerralinkOptions['defaultSearchEngine'];
    constructor(options: FerralinkOptions, connector: Connector);
    createPlayer(options: createPlayerOptions): Promise<playerMapOptions>;
    search(queue: any, options?: {
        engine: "spsearch" | "scsearch" | "dzsearch" | "ytmsearch" | "ytsearch" | "ymsearch" | "ftts" | "amsearch";
    }): Promise<import("shoukaku").LavalinkResponse>;
}
