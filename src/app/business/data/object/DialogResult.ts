export class DialogResult {
  action: DialogAction;
  obj: any

  constructor(action: DialogAction, obj?: any) {
    this.action = action;
    this.obj = obj;
  }
}

export enum DialogAction {
  SETTING_CHANGE ,
  SAVE,
  OK,
  CANCEL,
  DELETE,
  SELECT,
  SET
}

export enum StateMessage {
  START_MESSAGE ,
  CHOOSE_FILE,
  REJECT,
  VALID
}
