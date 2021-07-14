import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { GithubService } from 'src/app/services/github.service';

import { UserComponent } from 'src/app/components/user/user.component';
import { UserRoutingModule } from 'src/app/components/user/user.routing.module';

import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    UserRoutingModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
  ],
  providers: [GithubService],
})
export class UserModule {}
