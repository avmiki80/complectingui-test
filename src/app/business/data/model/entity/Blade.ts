import {AbstractHistoryableObject} from "./AbstractHistoryableObject";
import {BladeData} from "./BladeData";
import {BladeStore} from "./BladeStore";
import {BladeDse} from "./BladeDse";

export class Blade extends AbstractHistoryableObject{
  indNumber: string;
  data: BladeData;
  store: BladeStore;
  bladeDse?: BladeDse;
  excluded?: boolean = false;
  fixPaz?: number = 0;

  constructor(indNumber: string, data: BladeData, store: BladeStore, bladeDse?: BladeDse, excluded?: boolean, fixPaz?: number) {
    super();
    this.indNumber = indNumber;
    this.data = data;
    this.bladeDse = bladeDse;
    this.store = store;
    this.excluded = excluded;
    this.fixPaz = fixPaz;
  }
}
