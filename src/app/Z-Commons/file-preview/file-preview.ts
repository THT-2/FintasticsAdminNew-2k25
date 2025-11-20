import { Component } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-preview',
  imports: [],
  templateUrl: './file-preview.html',
  styleUrl: './file-preview.scss'
})
export class FilePreview {

  @Input() filePath: string = '';
  @Output() getFilePath = new EventEmitter<string>();

  removeImages() {
    this.filePath = '';
    this.getFilePath.emit(this.filePath);
  }

  

  isImage(filePath: string | string[]): boolean {
    console.log("filePath", filePath);

    if (!filePath) return false;

    // Ensure filePath is a string
    const validFilePath = Array.isArray(filePath) ? filePath[0] : filePath;
    // console.log("validFilePath", validFilePath);

    if (typeof validFilePath !== 'string') return false;

    const fileExtension = validFilePath.split('.').pop()?.toLowerCase();
    // console.log("fileExtension", fileExtension);

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return imageExtensions.includes(fileExtension || '');
  }

}
