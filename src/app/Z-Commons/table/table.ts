import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  status: string;
}

@Component({
  selector: 'app-table',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatSlideToggleModule ],
  standalone: true,
  templateUrl: './table.html',
  styleUrl: './table.scss'
})


export class Table implements OnChanges {

  @Input() categories: Category[] = [];
  @Input() tableData:any[] = [];
  @Input() loader = false;
  @Input() columnHeader:any;
  @Input() buttondata:any;
  @Output() toggleChange = new EventEmitter<any>();
  @Output() getActionTable = new EventEmitter();
  @Output() statusChange = new EventEmitter<{ featureId: string; subscriptionId: string; status: string }>();

  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  statusForm!: FormGroup;
  constructor(private sanitizer: DomSanitizer,private cd: ChangeDetectorRef){

}
  state = {
    page: 1,
    pageSize: 10,
    query: '',
  };

  subs_status: any[] = ["Available", "LimitedAccess","Premium"];

   ngOnChanges(changes: SimpleChanges): void {
    console.log("columnHeader",this.columnHeader);

    if (changes['tableData'] && changes['tableData'].currentValue) {

      this.tableData = [...changes['tableData'].currentValue];
      this.currentPage = 1;
    }
    this.cd.detectChanges();

    if (changes['buttondata'] && changes['buttondata'].currentValue) {
      this.buttondata = { ...changes['buttondata'].currentValue };
    }
    this.cd.detectChanges();
  }

get Math(): Math {
  return Math;
}

ngOnInit(): void {
  this.tableData  = this.tableData;
}
emitToggle(item: any, field: string, value: boolean) {
  this.toggleChange.emit({
    _id: item._id,
    field,
    value
  });
}

sanitizeVideoLink(videoLink: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(videoLink);
}

isImage(url: string): boolean {
  return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
}

isVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov|avi|flv|wmv|mkv)$/i.test(url);
}
get filteredData() {
  if (!this.tableData) return [];
  return this.tableData.filter((item: any) =>
    JSON.stringify(item).toLowerCase().includes(this.searchText.toLowerCase())
  );
}
get totalPages() {
  return Math.ceil(this.filteredData.length / this.itemsPerPage);
}

onStatusChange(item: any, subId: string, status: string){
    this.statusChange.emit({
      featureId: item._id,
      subscriptionId: subId,
      status:status
    });
}

getActions( actions: string, data: any,event?: Event) {
  if(event) event.stopPropagation();
    let tableData = {
      data: data,
      actions: actions
    }
    console.log("tableData", tableData);
    this.getActionTable.emit(tableData);
}



}


