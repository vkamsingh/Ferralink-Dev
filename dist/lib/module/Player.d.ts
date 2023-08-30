import { Ferralink } from '../Ferralink';
import { Player as PlayerShoukaku } from 'shoukaku';
import Queue from "./Queue";
export interface PlayerOptions {
    guildId: string;
    voiceId: string;
    volume: number;
    textId: string;
    shoukaku: PlayerShoukaku;
}
export declare class Player {
    manager: Ferralink;
    guildId: string;
    voiceId: string;
    textId: string;
    volume: number;
    shoukaku: PlayerShoukaku;
    queue: Queue;
    loop: 'none' | 'track' | 'queue';
    paused: boolean;
    playing: boolean;
    data: Map<any, any>;
    constructor(manager: Ferralink, options: PlayerOptions);
    search(queue: any, options?: {
        engine: "spsearch" | "scsearch" | "dzsearch" | "ytmsearch" | "ytsearch" | "ymsearch" | "ftts" | "amsearch";
    }): Promise<import("shoukaku").LavalinkResponse>;
    play(): Promise<void>;
    setVolume(volume: number): Promise<void>;
    pause(pause?: boolean): Promise<void>;
    setLoop(method: string): void;
    skip(): Promise<void>;
    seekTo(position: number): Promise<void>;
    setTextChannel(textId: string): void;
    setVoiceChannel(voiceId: string): void;
    destroy(): Promise<void>;
}
