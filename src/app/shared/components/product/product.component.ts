import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  @Input() product: Product | null = null;
  @Output() addedProduct = new EventEmitter<Product>();
  @Output() showProduct = new EventEmitter<string>();
  constructor() {}

  onAddToCart() {
    if (this.product) {
      this.addedProduct.emit(this.product);
    }
  }

  onShowDetail() {
    if (this.product) {
      this.showProduct.emit(this.product.id);
    }
  }
}
