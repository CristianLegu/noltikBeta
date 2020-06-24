import { Component, Inject } from '@angular/core';
import { DialogMembreteData } from '../interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogmembrete',
  templateUrl: './dialogmembrete.component.html',
  styleUrls: ['./dialogmembrete.component.scss']
})
export class DialogmembreteComponent{

  constructor(
    public dialogRef: MatDialogRef<DialogmembreteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMembreteData) { }

    onNoClick(): void {
      this.dialogRef.close();
    }
    
    dataSource: DialogMembreteData[] = [];

}
