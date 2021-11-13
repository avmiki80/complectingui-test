import {AbstractIdentifiableObject} from "./AbstractIdentifiableObject";

export class BladeData extends AbstractIdentifiableObject{
  mr?: number;
  mx?: number;
  my?: number;
  mz?: number;

  constructor( mr?: number, mx?: number, my?: number, mz?: number) {
    super();
    this.mr = mr;
    this.mx = mx;
    this.my = my;
    this.mz = mz;
  }
}
