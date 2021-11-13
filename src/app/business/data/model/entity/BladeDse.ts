import {AbstractHistoryableObject} from "./AbstractHistoryableObject";
import {Shifr} from "./Shifr";

export class BladeDse extends AbstractHistoryableObject{
  name: string;
  shifr: Shifr;

  constructor(name: string, shifr: Shifr) {
    super();
    this.name = name;
    this.shifr = shifr;
  }
}
