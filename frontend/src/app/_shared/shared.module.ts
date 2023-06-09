import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { WineryEditorComponent } from './winery-editor/winery-editor.component';
import { WineEditorComponent } from './wine-editor/wine-editor.component';
import { WineryComponent } from './winery/winery.component';
import { WineComponent } from './wine/wine.component';

import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { WineTypeComponent } from './wine-type/wine-type.component';
import { ReviewWineryComponent } from './review-winery/review-winery.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReviewWineComponent } from './review-wine/review-wine.component';

import { SeeReviewsComponent } from './see-reviews/see-reviews.component';
import { SeeWineryReviewsComponent } from './see-winery-reviews/see-winery-reviews.component';

import { MatChipsModule } from '@angular/material/chips';
import { WineryCountryComponent } from './winery-country/winery-country.component';


@NgModule({
  declarations: [
    WineryEditorComponent,
    WineEditorComponent,
    WineryComponent,
    WineComponent,
    WineTypeComponent,
    ReviewWineryComponent,
    ReviewWineComponent,
    SeeReviewsComponent,
    SeeWineryReviewsComponent,
    WineryCountryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatSliderModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule
  ],

  exports: [
    WineryEditorComponent,
    WineEditorComponent,
    WineryComponent,
    WineComponent,
    WineTypeComponent,
    WineryCountryComponent

  ],
})
export class SharedModule { }
