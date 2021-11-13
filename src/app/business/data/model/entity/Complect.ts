import {AbstractHistoryableObject} from "./AbstractHistoryableObject";
import {Blade} from "./Blade";
import {Stage} from "./Stage";

export class Complect extends AbstractHistoryableObject{
  name: string;
  blades: Blade[];
  stage: Stage;

  constructor(name: string, blades: Blade[], stage: Stage) {
    super();
    this.name = name;
    this.blades = blades;
    this.stage = stage;
  }
}
