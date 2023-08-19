"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var Queue_1 = require("./Queue");
//** @type Player */
var Player = /** @class */ (function () {
    function Player(manager, options) {
        var _this = this;
        this.manager = manager;
        this.guildId = options.guildId;
        this.voiceId = options.voiceId;
        this.textId = options.textId;
        this.volume = options.volume || 100;
        this.shoukaku = options.shoukaku;
        this.queue = new Queue_1.default();
        this.loop = 'none';
        this.paused = false;
        this.playing = false;
        this.data = new Map();
        this.shoukaku.on('start', function () {
            _this.playing = true;
            _this.manager.emit('trackStart', _this, _this.queue.current);
        });
        this.shoukaku.on('end', function () {
            if (_this.loop === 'track' && _this.queue.current)
                _this.queue.unshift(_this.queue.current);
            if (_this.loop === 'queue' && _this.queue.current)
                _this.queue.push(_this.queue.current);
            _this.queue.previous = _this.queue.current;
            var current = _this.queue.current;
            _this.queue.current = null;
            if (_this.queue.length) {
                _this.manager.emit('trackEnd', _this, current);
                _this.play();
                return;
            }
            else {
                _this.playing = false;
                _this.manager.emit('queueEnd', _this);
                return;
            }
        });
        this.shoukaku.on('closed', function (data) {
            _this.playing = false;
            _this.manager.emit('playerClosed', _this, data);
        });
        this.shoukaku.on('exception', function (data) {
            _this.playing = false;
            _this.manager.emit('trackException', _this, data);
        });
        this.shoukaku.on('update', function (data) { return _this.manager.emit('playerUpdate', _this, data); });
        this.shoukaku.on('stuck', function (data) { return _this.manager.emit('trackStuck', _this, data); });
        this.shoukaku.on('resumed', function () { return _this.manager.emit('playerResumed', _this); });
    }
    Player.prototype.search = function (queue, options) {
        if (options === void 0) { options = { engine: this.manager.defaultSearchEngine }; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!/^https?:\/\//.test(queue)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.shoukaku.node.rest.resolve(queue)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.shoukaku.node.rest.resolve("".concat(options.engine, ":").concat(queue))];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Player.prototype.play = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        this.queue.current = this.queue.shift();
                        return [4 /*yield*/, this.shoukaku.playTrack({ track: (_a = this.queue.current) === null || _a === void 0 ? void 0 : _a.encoded })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.shoukaku.setGlobalVolume(this.volume)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        this.manager.emit('trackError', this, this.queue.current, err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Player.prototype.setVolume = function (volume) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (Number.isNaN(volume))
                            throw new RangeError('[FerraLink] => Volume level must be a number.');
                        return [4 /*yield*/, this.shoukaku.setGlobalVolume(volume)];
                    case 1:
                        _a.sent();
                        this.volume = volume;
                        return [2 /*return*/];
                }
            });
        });
    };
    Player.prototype.pause = function (pause) {
        if (pause === void 0) { pause = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof pause !== 'boolean')
                            throw new RangeError('[FerraLink] => Pause function must be pass with boolean value.');
                        this.paused = pause;
                        this.playing = !pause;
                        return [4 /*yield*/, this.shoukaku.setPaused(pause)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Player.prototype.setLoop = function (method) {
        this.loop = (method === 'track' || method === 'queue') ? method : 'none';
    };
    Player.prototype.skip = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.shoukaku.stopTrack()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Player.prototype.seekTo = function (position) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.shoukaku.seekTo(position)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Player.prototype.setTextChannel = function (textId) {
        if (typeof textId !== 'string')
            throw new RangeError('[FerraLink] => textId must be a string.');
        this.textId = textId;
    };
    Player.prototype.setVoiceChannel = function (voiceId) {
        if (typeof voiceId !== 'string')
            throw new RangeError('[FerraLink] => voiceId must be a string.');
        this.voiceId = voiceId;
    };
    Player.prototype.destroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.queue.length = 0;
                        return [4 /*yield*/, this.manager.shoukaku.leaveVoiceChannel(this.guildId)];
                    case 1:
                        _a.sent();
                        this.manager.player.delete(this.guildId);
                        this.manager.emit('playerDestroy', this);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Player;
}());
exports.Player = Player;
