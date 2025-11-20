import { Component } from '@angular/core';
import { TransactionOverview } from "./transaction-overview/transaction-overview";
import { CategoriesOverview } from "./categories-overview/categories-overview";
import { TransTypeOverview } from "./trans-type-overview/trans-type-overview";
import { TopUsers } from "./top-users/top-users";

@Component({
  selector: 'app-transaction',
  imports: [TransactionOverview, CategoriesOverview, TransTypeOverview, TopUsers],
  templateUrl: './transaction.html',
  styleUrl: './transaction.scss'
})
export class Transaction {

}
