import {SearchObject} from "./SearchObject";

export class SearchBlade extends SearchObject{
  indNumber: string;
  shifr: string;
  complectName: string;
  isComplect?: number;

  constructor(name: string, indNumber: string, shifr: string, complectName: string, isComplect?: number) {
    super(name);
    this.indNumber = indNumber;
    this.shifr = shifr;
    this.complectName = complectName;
    this.isComplect = isComplect;
  }
}
