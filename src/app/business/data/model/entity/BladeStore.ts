import {AbstractIdentifiableObject} from "./AbstractIdentifiableObject";

export class BladeStore extends AbstractIdentifiableObject{
  stelag: string;
  cell: string;

  constructor(stelag: string, cell: string) {
    super();
    this.stelag = stelag;
    this.cell = cell;
  }

  // constructor(id: number, stelag: string, cell: string) {
  //   super(id);
  //   this.stelag = stelag;
  //   this.cell = cell;
  // }
}
