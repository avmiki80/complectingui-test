import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_COLUMN,
  DEFAULT_SORT_DIRECTION
} from "../../../../app.constant";

export class SearchObject {
  name: string;
  sortColumn: string = DEFAULT_SORT_COLUMN; // поле, для сортировки (значение по умолчанию)
  sortDirection: string = DEFAULT_SORT_DIRECTION; // метод сортировки а-я (значение по умолчанию)
  pageNumber: number = DEFAULT_PAGE_NUMBER; // 1-я страница (значение по умолчанию)
  pageSize: number = DEFAULT_PAGE_SIZE; // кол-во элементов на странице (значение по умолчанию)

  constructor(name: string) {
    this.name = name;
  }
}
