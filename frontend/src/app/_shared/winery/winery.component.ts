import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WineryService } from 'src/app/_services/winery.service';
import { Winery } from 'src/app/_types';
import { ReviewWineryComponent } from '../review-winery/review-winery.component';

@Component({
  selector: 'app-winery',
  templateUrl: './winery.component.html',
  styleUrls: ['./winery.component.sass']
})
export class WineryComponent {
  @Input() winery!: Winery;

  constructor(
    private dialog: MatDialog,
    private wineryService: WineryService
  ) { }
  reviewMe() {
    this.dialog.open(ReviewWineryComponent, {
      data: this.winery
    }).afterClosed().subscribe(data => {
      if(!data) return;
      this.wineryService.review(data).subscribe();
    });
  }
}
