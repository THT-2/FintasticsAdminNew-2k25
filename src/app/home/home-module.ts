import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing-module';
import { RouterLink, RouterModule } from '@angular/router';
import { Filter } from './dashboard/filter/filter';

@NgModule({
  declarations: [],
  imports: [Filter,
    CommonModule,
    HomeRoutingModule,
    // RouterModule,
    // RouterLink
    // Layout
  ],
  exports:[Filter]
})
export class HomeModule { }
