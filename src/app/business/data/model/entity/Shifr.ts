import {AbstractHistoryableObject} from "./AbstractHistoryableObject";

export class Shifr extends AbstractHistoryableObject{
  name: string;
  status: boolean = false;
  constructor(name: string) {
    super();
    this.name = name;
  }
}
