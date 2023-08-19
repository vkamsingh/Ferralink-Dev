import { Ferralink } from '../Ferralink';
import { Player as ShoukakuPlayer, WebSocketClosedEvent, TrackExceptionEvent, PlayerUpdate, TrackStuckEvent } from 'shoukaku';
import Queue from "./Queue";

//** @type PlayerOptions */
export interface PlayerOptions {
    guildId: string;
    voiceId: string;
    volume: number;
    textId: string;
    ShoukakuPlayer;
}

//** @type Player */
export class Player {
    public manager: Ferralink;
    public guildId: string;
    public voiceId: string;
    public textId: string;
    public volume: number;
    public shoukaku: ShoukakuPlayer;
    public queue: Queue;
    public loop: 'none' | 'track' | 'queue';
    public paused: boolean;
    public playing: boolean;
    public data: Map<any, any>;

    constructor(manager: Ferralink, options: PlayerOptions) {
        this.manager = manager;
        this.guildId = options.guildId;
        this.voiceId = options.voiceId;
        this.textId = options.textId;
        this.volume = options.volume;
        this.shoukaku = options.ShoukakuPlayer;
        this.queue = new Queue();
        this.loop = 'none';
        this.paused = false;
        this.playing = false;
        this.data = new Map();

        this.shoukaku.on('start', () => {
            this.playing = true;
            this.manager.emit('trackStart', this, this.queue.current);
        });
        this.shoukaku.on('end', () => {
            if (this.loop === 'track' && this.queue.current) this.queue.unshift(this.queue.current);
            if (this.loop === 'queue' && this.queue.current) this.queue.push(this.queue.current);

            this.queue.previous = this.queue.current;
            const current = this.queue.current;
            this.queue.current = null;

            if (this.queue.length) {
                this.manager.emit('trackEnd', this, current);
                this.play();
                return;
            } else {
                this.playing = false;
                this.manager.emit('queueEnd', this);
                return;
            }
        });
        this.shoukaku.on('closed', (data: WebSocketClosedEvent) => {
            this.playing = false;
            this.manager.emit('playerClosed', this, data);
        });
        this.shoukaku.on('exception', (data: TrackExceptionEvent) => {
            this.playing = false;
            this.manager.emit('trackException', this, data);
        });
        this.shoukaku.on('update', (data: PlayerUpdate) => this.manager.emit('playerUpdate', this, data));
        this.shoukaku.on('stuck', (data: TrackStuckEvent) => this.manager.emit('trackStuck', this, data));
        this.shoukaku.on('resumed', () => this.manager.emit('playerResumed', this));
    }

    public async search(queue: any, options = { engine: this.manager.defaultSearchEngine }) {
        if (/^https?:\/\//.test(queue)) {
            return await this.shoukaku.node.rest.resolve(queue);
        } else {
            return await this.shoukaku.node.rest.resolve(`${options.engine}:${queue}`);
        }
    }

    public async play() {
        try {
            this.queue.current = this.queue.shift();
            await this.shoukaku.playTrack({ track: this.queue.current?.encoded });
            await this.shoukaku.setGlobalVolume(this.volume);
        } catch (err) {
            this.manager.emit('trackError', this, this.queue.current, err);
        }
    }

    public async setVolume(volume: number) {
        if (Number.isNaN(volume)) throw new RangeError('[FerraLink] => Volume level must be a number.');
        await this.shoukaku.setGlobalVolume(volume);
        this.volume = volume;
    }

    public async pause(pause = true) {
        if (typeof pause !== 'boolean') throw new RangeError('[FerraLink] => Pause function must be pass with boolean value.');
        this.paused = pause;
        this.playing = !pause;
        await this.shoukaku.setPaused(pause);
    }

    public setLoop(method: string) {
        this.loop = (method === 'track' || method === 'queue') ? method : 'none';
    }

    public async skip() {
        await this.shoukaku.stopTrack();
    }

    public async seekTo(position: number) {
        await this.shoukaku.seekTo(position);
    }

    public setTextChannel(textId: string) {
        if (typeof textId !== 'string') throw new RangeError('[FerraLink] => textId must be a string.');
        this.textId = textId;
    }

    public setVoiceChannel(voiceId: string) {
        if (typeof voiceId !== 'string') throw new RangeError('[FerraLink] => voiceId must be a string.');
        this.voiceId = voiceId;
    }

    public async destroy() {
        this.queue.length = 0;
        await this.manager.shoukaku.leaveVoiceChannel(this.guildId);
        this.manager.players.delete(this.guildId);
        this.manager.emit('playerDestroy', this);
    }
}