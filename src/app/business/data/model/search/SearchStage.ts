import {SearchObject} from "./SearchObject";

export class SearchStage extends SearchObject{
  shifr: string;

  constructor(name: string, shifr: string) {
    super(name);
    this.shifr = shifr;
  }

}
