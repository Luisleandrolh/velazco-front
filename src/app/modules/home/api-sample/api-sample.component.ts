import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { lastValueFrom, Observable } from 'rxjs';
import { ApiNasaService } from 'src/app/core/services/api-nasa.service';
import { ItemImageState } from 'src/app/ngrx/item.states';
import * as action from 'src/app/ngrx/item.actions';
import { Item } from '../../../core/models/NasaImagesAPIResponse';

@Component({
  selector: 'app-api-sample',
  templateUrl: './api-sample.component.html',
  styleUrls: ['./api-sample.component.css'],
})
export class ApiSampleComponent implements OnInit {
  inputText: string = '';
  resultItems: Item[] = [];
  itemsImage$: Observable<ItemImageState> = new Observable<ItemImageState>();

  constructor(
    private apiNasaService: ApiNasaService,
    private store: Store<{ items: ItemImageState }>
  ) {}

  ngOnInit(): void {
    // USING NGRX
    this.itemsImage$ = this.store.pipe(select('items'));
    this.itemsImage$.subscribe((item) => {
      this.resultItems = item.items;
      this.inputText = item.text;
      console.log('ITEMS SAVED: ', this.resultItems.length);
    });
  }

  async getImages() {
    try {
      const response = await lastValueFrom(
        this.apiNasaService.getImagesNasa(this.inputText)
      );
      if (response != null) {
        this.resultItems = response.collection.items;
        // USING NGRX
        console.log('ITEMS RECEIVED: ', this.resultItems.length);
        this.store.dispatch(
          action.SetItemImage({
            text: this.inputText,
            items: this.resultItems,
          } as ItemImageState)
        );
      } else {
        this.resultItems = [];
      }
    } catch (error) {}
  }

  getImageLinkUri(item: Item) {
    return item.links?.length
      ? item.links[0].href
      : 'assets/images/noimage.png';
  }

  getDataDescription(item: Item) {
    return item.data?.length ? item.data[0].description : '';
  }

  getDataTitle(item: Item) {
    return item.data?.length ? item.data[0].title : '';
  }
}
