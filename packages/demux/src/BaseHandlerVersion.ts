import type { Effect, HandlerVersion, Updater } from 'demux';

export class BaseHandlerVersion implements HandlerVersion {
  versionName: string;
  updaters: Updater[];
  effects: Effect[];
  constructor(versionName: string, updaters: Updater[], effects: Effect[]) {
    this.versionName = versionName;
    this.updaters = updaters;
    this.effects = effects;
  }
}
