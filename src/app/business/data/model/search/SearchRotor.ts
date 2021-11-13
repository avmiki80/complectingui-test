import {SearchObject} from "./SearchObject";

export class SearchRotor extends SearchObject{
  shifr: string;

  constructor(name: string, shifr: string) {
    super(name);
    this.shifr = shifr;
  }

}
