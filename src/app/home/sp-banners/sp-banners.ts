import { Component } from '@angular/core';
import { SpBannercards } from "./sp-bannercards/sp-bannercards";
import { SpBannerslist } from "./sp-bannerslist/sp-bannerslist";

@Component({
  selector: 'app-sp-banners',
  imports: [SpBannercards, SpBannerslist],
  templateUrl: './sp-banners.html',
  styleUrl: './sp-banners.scss'
})
export class SpBanners {

}
