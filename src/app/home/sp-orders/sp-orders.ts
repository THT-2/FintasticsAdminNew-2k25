import { Component } from '@angular/core';
import { SpOrdercards } from "./sp-ordercards/sp-ordercards";
import { SpOrdertable } from "./sp-ordertable/sp-ordertable";

@Component({
  selector: 'app-sp-orders',
  imports: [SpOrdercards, SpOrdertable],
  templateUrl: './sp-orders.html',
  styleUrl: './sp-orders.scss'
})
export class SpOrders {

}
