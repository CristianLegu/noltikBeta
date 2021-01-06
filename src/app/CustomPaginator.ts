import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginator(name: string) {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = name;
  customPaginatorIntl.previousPageLabel = 'Anterior';
  customPaginatorIntl.nextPageLabel = 'Siguiente';
  customPaginatorIntl.firstPageLabel = 'Primera Página';
  customPaginatorIntl.lastPageLabel = 'Última página';
  customPaginatorIntl.getRangeLabel = function (page, pageSize, length) {

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' de ' + length;

  }

  return customPaginatorIntl;
}