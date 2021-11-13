import {AbstractHistoryableObject} from "./AbstractHistoryableObject";
import {BladeDse} from "./BladeDse";

export class Stage extends AbstractHistoryableObject{
  name: string;
  count: number;
  tuComplect: number;
  tuOpposite: number;
  tuNeighb: number;
  bladeDse: BladeDse;
  reverse: boolean;

  constructor(name: string, count: number, tuComplect: number, tuOpposite: number, tuNeighb: number, reverse: boolean, bladeDse: BladeDse) {
    super();
    this.name = name;
    this.count = count;
    this.tuComplect = tuComplect;
    this.tuOpposite = tuOpposite;
    this.tuNeighb = tuNeighb;
    this.reverse = reverse;
    this.bladeDse = bladeDse;
  }

  equals(stage: Stage) : boolean {
    return this.bladeDse.shifr.name === stage.bladeDse.shifr.name;
  }
}
