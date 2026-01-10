import {  NgModule  }  from '@angular/core';
import  {  BrowserModule }  from  '@angular/platform-browser';
import {  BrowserAnimationsModule  }  from '@angular/platform-browser/animations';
import  {  HttpClientModule, HTTP_INTERCEPTORS  }  from  '@angular/common/http';
import  {  AppRoutingModule  } from  './app-routing.module';
import  { AppComponent  }  from  './app.component';
import { CoreModule } from './core/core.module';

//  Angular  Material
import  {  MatToolbarModule  } from  '@angular/material/toolbar';
import  { MatSidenavModule  }  from  '@angular/material/sidenav';
import  {  MatListModule  } from  '@angular/material/list';
import  { MatIconModule  }  from  '@angular/material/icon';
import  {  MatButtonModule  } from  '@angular/material/button';
import { LayoutComponent } from './layout/layout.component';
import {  AuthInterceptor  }  from './core/interceptors/auth.interceptor';

@NgModule({
   declarations:  [],
   imports:  [
       BrowserModule,
      BrowserAnimationsModule,
       HttpClientModule,
       AppRoutingModule,
       CoreModule,
       MatToolbarModule,
      MatSidenavModule,
       MatListModule,
       MatIconModule,
       MatButtonModule,
       AppComponent,
       LayoutComponent
   ],
   providers:  [
       { provide:  HTTP_INTERCEPTORS,  useClass:  AuthInterceptor, multi:  true  }
   ]
})
export class  AppModule  {}
