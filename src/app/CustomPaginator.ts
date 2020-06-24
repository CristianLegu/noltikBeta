import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginator(name: string) {
  const customPaginatorIntl = new MatPaginatorIntl();
  
  customPaginatorIntl.itemsPerPageLabel = name;
  customPaginatorIntl.previousPageLabel = 'Anterior';
  customPaginatorIntl.nextPageLabel = 'Siguiente';
  customPaginatorIntl.firstPageLabel = 'Primera Página';
  customPaginatorIntl.lastPageLabel = 'Última página';

  return customPaginatorIntl;
}