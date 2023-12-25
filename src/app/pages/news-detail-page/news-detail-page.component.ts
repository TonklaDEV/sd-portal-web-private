import { Component } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  selector: 'app-news-detail-page',
  templateUrl: './news-detail-page.component.html',
  styleUrls: ['./news-detail-page.component.scss']
})
export class NewsDetailPageComponent {
  constructor(private location: Location) {}

  back(): void {
    this.location.back()
  }

}
