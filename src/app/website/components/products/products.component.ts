import { Component, Input, Output, EventEmitter } from '@angular/core';
import { switchMap, zip } from 'rxjs';

import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '../../../models/product.model';

import { StoreService } from '../../../services/store.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  @Input() products: Product[] = [];
  @Input() set productId(id: string | null) {
    if (id) {
      this.onShowDetail(id);
    }
  }
  @Output() loadMore: EventEmitter<void> = new EventEmitter();

  myShoppingCart: Product[] = [];
  total = 0;
  showProductDetail = false;
  productChosen: Product | null = null;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  onShowDetail(id: string) {
    if (!this.showProductDetail) {
      this.showProductDetail = true;
    }
    this.productsService.getOne(id).subscribe({
      next: (data) => {
        this.productChosen = data;
        this.statusDetail = 'success';
      },
      error: (error) => {
        console.log(error);
        this.statusDetail = 'error';
      },
    });
  }

  readAndUpdate(id: string) {
    this.productsService
      .getOne(id)
      .pipe(
        switchMap((product) => {
          return this.productsService.update(product.id, { title: 'change' });
        })
      )
      .subscribe((data) => {
        console.log(data);
      });
    zip(
      this.productsService.getOne(id),
      this.productsService.update(id, { title: 'nuevo' })
    ).subscribe((response) => {
      const [product, update] = response;
    });
  }
  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo Producto',
      description: 'bla bla bla',
      price: 200,
      images: [
        `https://placeimg.com/640/480/any?random=${Math.random()}`,
        `https://placeimg.com/640/480/any?random=${Math.random()}`,
        `https://placeimg.com/640/480/any?random=${Math.random()}`,
      ],
      categoryId: 1,
    };
    this.productsService.create(product).subscribe((data) => {
      this.products.push(data);
    });
  }
  updateProduct() {
    if(this.productChosen) {
      const id = this.productChosen.id;
      const product: UpdateProductDTO = { title: 'new title 2' };
      this.productsService.update(id, product).subscribe((data) => {
        let index = this.products.findIndex((item) => (item.id = data.id));
        this.products[index] = data;
        this.productChosen = this.products[index];
      });
    }
  }
  deleteProduct() {
    if(this.productChosen) {
      const id = this.productChosen.id;
      this.productsService.delete(id).subscribe((date) => {
        this.products = this.products.filter(
          (item) => item.id === this.productChosen?.id
        );
        this.toggleProductDetail();
      });
    }
  }

  onLoadMore() {
    this.loadMore.emit();
  }
}
