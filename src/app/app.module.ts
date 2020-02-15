import { BrowserModule } from '@angular/platform-browser';
import { NgModule , Injectable } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';

import { TweenService } from './canvas/services/tween.service';
import { SettingsService } from './settings-service/settings-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material';
import { HeaderComponent } from './header/header.component';
import {MatButtonModule} from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';


@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    HeaderComponent,
    MainNavComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,    
    BrowserAnimationsModule,   
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    MatSliderModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule
  ],  

  providers: [ TweenService, SettingsService ],
  bootstrap: [AppComponent]
})

@Injectable()
export class AppModule
{
    constructor(private tweenService : TweenService){}
}
