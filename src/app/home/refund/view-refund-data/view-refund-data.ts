import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-refund-data',
  imports:[CommonModule,FormsModule],
  templateUrl: './view-refund-data.html',
  styleUrls: ['./view-refund-data.scss']
})
export class ViewRefundData {

  editMode = false;

  message: string = 'Hi, your order #INV-3421 is ready for pickup. Please bring your ID.';

  toggleEdit() {
    this.editMode = !this.editMode;
  }
}