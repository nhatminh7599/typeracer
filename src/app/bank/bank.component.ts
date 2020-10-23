import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {
  // This property is bound using its original name.
  @Input() bankName: string;
  // this property value is bound to a different property name
  // when this component is instantiated in a template.
  @Input() id: string;
  constructor() { }

  ngOnInit(): void {
  }

}
