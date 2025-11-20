import { Component } from '@angular/core';
import { ContentChild, ElementRef,  Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [CommonModule,RouterModule],
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class Card {

  @Input() cardTitle!: string;
  @Input() buttondata:any
  @Input() cardClass!: string;
  @Input() showContent = true;
  @Input() blockClass!: string;
  @Input() headerClass!: string;
  @Input() showHeader = true;
  @Input() padding = 20;
  @ContentChild('headerOptionsTemplate') headerOptionsTemplate!: TemplateRef<ElementRef>;
  @ContentChild('headerTitleTemplate') headerTitleTemplate!: TemplateRef<ElementRef>;
  classApplied: boolean  = false;

  constructor(private router : Router,){

  }

  toggleClass() {

    if (this.buttondata.routingPath) {
      console.log("this.buttondata",this.buttondata);
      this.router.navigate([this.buttondata.routingPath])
    }else{
      this.classApplied = !this.classApplied;
      console.log("this.classApplied",this.classApplied);
      // this.getpopup.emit(this.classApplied)
    }

  }
}
