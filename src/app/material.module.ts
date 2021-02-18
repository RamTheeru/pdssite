import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import * as Material from "@angular/material";
import { MatDialogConfig } from "@angular/material/dialog";
//import { MatDialogConfigModule } from "@angular/material/dialogconfig";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSidenavModule } from "@angular/material/sidenav";

@NgModule({
  imports: [
    CommonModule,
    Material.MatToolbarModule,
    Material.MatGridListModule,
    Material.MatFormFieldModule,
    Material.MatInputModule,
    Material.MatRadioModule,
    Material.MatSelectModule,
    Material.MatDatepickerModule,
    Material.MatCheckboxModule,
    Material.MatNativeDateModule,
    Material.MatButtonModule,
    Material.MatSnackBarModule,
    Material.MatTableModule,
    Material.MatIconModule,
    Material.MatDialogModule,
    Material.MatDividerModule,
    Material.MatDialogModule,
    // MatDialogConfig,
    MatTableModule,
    MatPaginatorModule,
    // Material.MatDrawerContainer,
    MatSidenavModule,
    Material.MatListModule
    //Material.MatDrawerContent
  ],
  exports: [
    Material.MatToolbarModule,
    Material.MatGridListModule,
    Material.MatFormFieldModule,
    Material.MatInputModule,
    Material.MatRadioModule,
    Material.MatSelectModule,
    Material.MatDatepickerModule,
    Material.MatCheckboxModule,
    Material.MatNativeDateModule,
    Material.MatButtonModule,
    Material.MatSnackBarModule,
    Material.MatTableModule,
    Material.MatIconModule,
    Material.MatDialogModule,
    Material.MatDividerModule,
    Material.MatDialogModule,
    //   MatDialogConfig,
    MatTableModule,
    MatPaginatorModule,
    // Material.MatDrawerContainer,
    MatSidenavModule,
    Material.MatListModule
    //Material.MatDrawerContent
  ],
  declarations: []
})
export class MaterialModule {}
