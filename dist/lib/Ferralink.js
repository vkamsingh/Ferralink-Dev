"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Ferralink = void 0;
var events_1 = require("events");
var shoukaku_1 = require("shoukaku");
var Player_1 = require("./module/Player");
var Ferralink = /** @class */ (function (_super) {
    __extends(Ferralink, _super);
    function Ferralink(options, connector) {
        var _this = _super.call(this) || this;
        if (!options.nodes || options.nodes.length === 0)
            throw new Error("[Ferralink] => FerralinkOptions must contain a nodes property");
        if (!options.shoukakuoptions)
            throw new Error('[FerraLink] => FerralinkOptions must contain a shoukakuoptions property');
        _this.shoukaku = new shoukaku_1.Shoukaku(connector, options.nodes, options.shoukakuoptions);
        _this.player = new Map();
        _this.defaultSearchEngine = (options === null || options === void 0 ? void 0 : options.defaultSearchEngine) || 'ytsearch';
        return _this;
    }
    Ferralink.prototype.createPlayer = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, ShoukakuPlayer, FerralinkPlayer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        existing = this.player.get(options.guildId);
                        if (existing)
                            return [2 /*return*/, existing];
                        return [4 /*yield*/, this.shoukaku.joinVoiceChannel({
                                guildId: options.guildId,
                                channelId: options.voiceId,
                                shardId: options.shardId,
                                deaf: options.deaf || true,
                            })];
                    case 1:
                        ShoukakuPlayer = _a.sent();
                        FerralinkPlayer = new Player_1.Player(this, {
                            guildId: options.guildId,
                            voiceId: options.voiceId,
                            volume: options.volume || 100,
                            textId: options.textId,
                            shoukaku: ShoukakuPlayer
                        });
                        this.player.set(options.guildId, FerralinkPlayer);
                        this.emit('PlayerCreate', FerralinkPlayer);
                        return [2 /*return*/, FerralinkPlayer];
                }
            });
        });
    };
    Ferralink.prototype.search = function (queue, options) {
        if (options === void 0) { options = { engine: this.defaultSearchEngine }; }
        return __awaiter(this, void 0, void 0, function () {
            var node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        node = this.shoukaku.getIdealNode();
                        if (!/^https?:\/\//.test(queue)) return [3 /*break*/, 2];
                        return [4 /*yield*/, node.rest.resolve(queue)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, node.rest.resolve("".concat(options.engine, ":").concat(queue))];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Ferralink;
}(events_1.EventEmitter));
exports.Ferralink = Ferralink;
