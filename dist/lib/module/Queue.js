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
Object.defineProperty(exports, "__esModule", { value: true });
var Queue = /** @class */ (function (_super) {
    __extends(Queue, _super);
    function Queue() {
        var _this = _super.call(this) || this;
        _this.current = null;
        _this.previous = null;
        return _this;
    }
    Object.defineProperty(Queue.prototype, "size", {
        get: function () {
            return this.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "totalSize", {
        get: function () {
            return this.length + (this.current ? 1 : 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "isEmpty", {
        get: function () {
            return this.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "durationLength", {
        get: function () {
            return this.reduce(function (acc, cur) { return acc + (cur.length || 0); }, 0);
        },
        enumerable: false,
        configurable: true
    });
    Queue.prototype.add = function (track, options) {
        track.info.requester = (options === null || options === void 0 ? void 0 : options.requester) || null;
        return this.push(track);
    };
    Queue.prototype.remove = function (index) {
        return this.splice(index, 1)[0];
    };
    Queue.prototype.clear = function () {
        return this.splice(0);
    };
    Queue.prototype.shuffle = function () {
        var _a;
        for (var i = this.length - 1; i > 0; i -= 1) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [this[j], this[i]], this[i] = _a[0], this[j] = _a[1];
        }
    };
    return Queue;
}(Array));
exports.default = Queue;
