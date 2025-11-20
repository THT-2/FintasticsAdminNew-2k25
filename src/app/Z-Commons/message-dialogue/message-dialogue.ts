import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-message-dialogue',
    imports: [
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatDialogContent,
      MatDialogActions,
      MatDialogClose,
      MatCardModule
],
  templateUrl: './message-dialogue.html',
  styleUrl: './message-dialogue.scss'
})
export class MessageDialogue {
  [x: string]: any;

  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<MessageDialogue>
) {
  if (this.data) {
    this.message = data.message || this.message;
    if (data.buttonText) {
      this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
      this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
    }
  }
}
onConfirmClick(): void {
  this.dialogRef.close(true);
}
ngOnInit(): void {

}

}
