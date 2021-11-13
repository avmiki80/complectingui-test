import {AbstractHistoryableObject} from "./AbstractHistoryableObject";
import {Shifr} from "./Shifr";
import {Stage} from "./Stage";

export class Rotor extends AbstractHistoryableObject{
  name: string;
  shifr: Shifr;
  stages?: Stage[];

  constructor(name: string, shifr: Shifr, stages?: Stage[]) {
    super();
    this.name = name;
    this.shifr = shifr;
    this.stages = stages;
  }
}
