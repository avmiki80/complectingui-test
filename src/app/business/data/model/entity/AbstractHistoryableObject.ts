import {AbstractIdentifiableObject} from "./AbstractIdentifiableObject";

export abstract class AbstractHistoryableObject extends AbstractIdentifiableObject{
  username: string;
  date: Date;
}
