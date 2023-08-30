"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const tslib_1 = require("tslib");
const Queue_1 = tslib_1.__importDefault(require("./Queue"));
//** @type Player */
class Player {
    manager;
    guildId;
    voiceId;
    textId;
    volume;
    shoukaku;
    queue;
    loop;
    paused;
    playing;
    data;
    constructor(manager, options) {
        this.manager = manager;
        this.guildId = options.guildId;
        this.voiceId = options.voiceId;
        this.textId = options.textId;
        this.volume = options.volume;
        this.shoukaku = options.shoukaku;
        this.queue = new Queue_1.default();
        this.loop = 'none';
        this.paused = false;
        this.playing = false;
        this.data = new Map();
        this.shoukaku.on('start', () => {
            this.playing = true;
            this.manager.emit('trackStart', this, this.queue.current);
        });
        this.shoukaku.on('end', () => {
            if (this.loop === 'track' && this.queue.current)
                this.queue.unshift(this.queue.current);
            if (this.loop === 'queue' && this.queue.current)
                this.queue.push(this.queue.current);
            this.queue.previous = this.queue.current;
            const current = this.queue.current;
            this.queue.current = null;
            if (this.queue.length) {
                this.manager.emit('trackEnd', this, current);
                this.play();
                return;
            }
            else {
                this.playing = false;
                this.manager.emit('queueEnd', this);
                return;
            }
        });
        this.shoukaku.on('closed', (data) => {
            this.playing = false;
            this.manager.emit('playerClosed', this, data);
        });
        this.shoukaku.on('exception', (data) => {
            this.playing = false;
            this.manager.emit('trackException', this, data);
        });
        this.shoukaku.on('update', (data) => this.manager.emit('playerUpdate', this, data));
        this.shoukaku.on('stuck', (data) => this.manager.emit('trackStuck', this, data));
        this.shoukaku.on('resumed', () => this.manager.emit('playerResumed', this));
    }
    async search(queue, options = { engine: this.manager.defaultSearchEngine }) {
        if (/^https?:\/\//.test(queue)) {
            return await this.shoukaku.node.rest.resolve(queue);
        }
        else {
            return await this.shoukaku.node.rest.resolve(`${options.engine}:${queue}`);
        }
    }
    async play() {
        try {
            this.queue.current = this.queue.shift();
            await this.shoukaku.playTrack({ track: this.queue.current?.encoded });
            await this.shoukaku.setGlobalVolume(this.volume);
        }
        catch (err) {
            this.manager.emit('trackError', this, this.queue.current, err);
        }
    }
    async setVolume(volume) {
        if (Number.isNaN(volume))
            throw new RangeError('[FerraLink] => Volume level must be a number.');
        await this.shoukaku.setGlobalVolume(volume);
        this.volume = volume;
    }
    async pause(pause = true) {
        if (typeof pause !== 'boolean')
            throw new RangeError('[FerraLink] => Pause function must be pass with boolean value.');
        this.paused = pause;
        this.playing = !pause;
        await this.shoukaku.setPaused(pause);
    }
    setLoop(method) {
        this.loop = (method === 'track' || method === 'queue') ? method : 'none';
    }
    async skip() {
        await this.shoukaku.stopTrack();
    }
    async seekTo(position) {
        await this.shoukaku.seekTo(position);
    }
    setTextChannel(textId) {
        if (typeof textId !== 'string')
            throw new RangeError('[FerraLink] => textId must be a string.');
        this.textId = textId;
    }
    setVoiceChannel(voiceId) {
        if (typeof voiceId !== 'string')
            throw new RangeError('[FerraLink] => voiceId must be a string.');
        this.voiceId = voiceId;
    }
    async destroy() {
        this.queue.length = 0;
        await this.manager.shoukaku.leaveVoiceChannel(this.guildId);
        this.manager.players.delete(this.guildId);
        this.manager.emit('playerDestroy', this);
    }
}
exports.Player = Player;
