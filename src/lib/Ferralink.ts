import { EventEmitter } from 'events';
import { Shoukaku, Player as PlayerShoukaku, Track, ShoukakuOptions, Connector } from 'shoukaku';
import { Player } from './module/Player';


//** @type FerralinkOptions */
export interface FerralinkOptions {
    nodes: [];
    shoukakuoptions: ShoukakuOptions;
    defaultSearchEngine: 'spsearch' | 'scsearch' | 'dzsearch' | 'ytmsearch' | 'ytsearch' | 'ymsearch' | 'ftts' | 'amsearch';
}

//** @type createPlayerOptions */
export interface createPlayerOptions {
    guildId: string;
    voiceId: string;
    textId: string;
    volume: number;
    shardId: number;
    deaf: boolean;
}

//** @type playerMapOptions */
export interface playerMapOptions {
    guildId: string;
    voiceId: string;
    textId: string;
    volume: number;
    shoukaku: PlayerShoukaku;
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

export class Ferralink extends EventEmitter {
    public shoukaku: Shoukaku;
    public players: Map<string, playerMapOptions>;
    public defaultSearchEngine: FerralinkOptions['defaultSearchEngine'];

    constructor(options: FerralinkOptions, connector: Connector) {
        super();

        if (!options.nodes || options.nodes.length === 0) throw new Error("[Ferralink] => FerralinkOptions must contain a nodes property");
        if (!options.shoukakuoptions) throw new Error('[FerraLink] => FerralinkOptions must contain a shoukakuoptions property');

        this.shoukaku = new Shoukaku(connector, options.nodes, options.shoukakuoptions);
        this.players = new Map();
        this.defaultSearchEngine = options?.defaultSearchEngine || 'ytsearch';
    }

    public async createPlayer(options: createPlayerOptions) {
        let existing = this.players.get(options.guildId);
        if (!existing) {
            const ShoukakuPlayer = await this.shoukaku.joinVoiceChannel({
                guildId: options.guildId,
                channelId: options.voiceId,
                shardId: options.shardId,
                deaf: options?.deaf || true,
            });

            existing = new Player(this, {
                guildId: options.guildId,
                voiceId: options.voiceId,
                textId: options.textId,
                volume: options?.volume || 100,
                shoukaku: ShoukakuPlayer
            });

            this.players.set(options.guildId, existing);
            this.emit('PlayerCreate', existing);
            return existing;
        } else {
            return existing;
        }
    }

    public async search(queue: any, options = { engine: this.defaultSearchEngine }) {
        const node = this.shoukaku.getIdealNode();
        if (/^https?:\/\//.test(queue)) {
            return await node.rest.resolve(queue);
        } else {
            return await node.rest.resolve(`${options.engine}:${queue}`);
        }
    }
}