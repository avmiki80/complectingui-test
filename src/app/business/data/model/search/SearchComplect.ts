import {SearchObject} from "./SearchObject";

export class SearchComplect extends SearchObject{
  shifr: string;
  stageName: string;

  constructor(name: string, shifr: string, stageName: string) {
    super(name);
    this.shifr = shifr;
    this.stageName = stageName;
  }
}
