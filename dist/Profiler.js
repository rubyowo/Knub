"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profiler = void 0;
class Profiler {
    constructor() {
        this.data = {};
    }
    addDataPoint(key, time) {
        this.data[key] = this.data[key] || {
            totalTime: 0,
            averageTime: 0,
            count: 0,
        };
        this.data[key].totalTime += time;
        this.data[key].averageTime =
            (this.data[key].averageTime * this.data[key].count + time) / (this.data[key].count + 1);
        this.data[key].count += 1;
    }
    getData() {
        return this.data;
    }
}
exports.Profiler = Profiler;
