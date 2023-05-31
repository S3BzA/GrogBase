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

@NgModule({
  declarations: [
    WineryEditorComponent,
    WineEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class SharedModule { }