import { EventEmitter } from 'events';
import { Shoukaku, Player as ShoukakuPlayer, Track, ShoukakuOptions, Connector } from 'shoukaku';
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

export class Ferralink extends EventEmitter {
    public shoukaku: Shoukaku;
    public player: Map<createPlayerOptions['guildId'], playerMapOptions>;
    public defaultSearchEngine: FerralinkOptions['defaultSearchEngine'];

    constructor(options: FerralinkOptions, connector: Connector) {
        super();

        if (!options.nodes || options.nodes.length === 0) throw new Error("[Ferralink] => FerralinkOptions must contain a nodes property");
        if (!options.shoukakuoptions) throw new Error('[FerraLink] => FerralinkOptions must contain a shoukakuoptions property');

        this.shoukaku = new Shoukaku(connector, options.nodes, options.shoukakuoptions);
        this.player = new Map();
        this.defaultSearchEngine = options?.defaultSearchEngine || 'ytsearch';
    }

    public async createPlayer(options: createPlayerOptions) {
        const existing = this.player.get(options.guildId);
        if (existing) return existing;

        const ShoukakuPlayer = await this.shoukaku.joinVoiceChannel({
            guildId: options.guildId,
            channelId: options.voiceId,
            shardId: options.shardId,
            deaf: options.deaf || true,
        });

        const FerralinkPlayer = new Player(this, {
            guildId: options.guildId,
            voiceId: options.voiceId,
            volume: options.volume || 100,
            textId: options.textId,
            shoukaku: ShoukakuPlayer
        });

        this.player.set(options.guildId, FerralinkPlayer);
        this.emit('PlayerCreate', FerralinkPlayer);
        return FerralinkPlayer;
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