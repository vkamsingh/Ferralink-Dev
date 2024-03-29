"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ferralink = void 0;
const events_1 = require("events");
const shoukaku_1 = require("shoukaku");
const Player_1 = require("./module/Player");
class Ferralink extends events_1.EventEmitter {
    shoukaku;
    players;
    defaultSearchEngine;
    constructor(options, connector) {
        super();
        if (!options.nodes || options.nodes.length === 0)
            throw new Error("[Ferralink] => FerralinkOptions must contain a nodes property");
        if (!options.shoukakuoptions)
            throw new Error('[FerraLink] => FerralinkOptions must contain a shoukakuoptions property');
        this.shoukaku = new shoukaku_1.Shoukaku(connector, options.nodes, options.shoukakuoptions);
        this.players = new Map();
        this.defaultSearchEngine = options?.defaultSearchEngine || 'ytsearch';
    }
    async createPlayer(options) {
        let existing = this.players.get(options.guildId);
        if (!existing) {
            const ShoukakuPlayer = await this.shoukaku.joinVoiceChannel({
                guildId: options.guildId,
                channelId: options.voiceId,
                shardId: options.shardId,
                deaf: options?.deaf || true,
            });
            existing = new Player_1.Player(this, {
                guildId: options.guildId,
                voiceId: options.voiceId,
                textId: options.textId,
                volume: options?.volume || 100,
                shoukaku: ShoukakuPlayer
            });
            this.players.set(options.guildId, existing);
            this.emit('PlayerCreate', existing);
            return existing;
        }
        else {
            return existing;
        }
    }
    async search(queue, options = { engine: this.defaultSearchEngine }) {
        const node = this.shoukaku.getIdealNode();
        if (/^https?:\/\//.test(queue)) {
            return await node.rest.resolve(queue);
        }
        else {
            return await node.rest.resolve(`${options.engine}:${queue}`);
        }
    }
}
exports.Ferralink = Ferralink;
