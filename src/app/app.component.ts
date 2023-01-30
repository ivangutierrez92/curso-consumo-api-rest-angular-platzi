import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { TokenService } from './services/token.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  imgParent = '';
  showImg = true;
  user: User | undefined;
  imgRta = '';

  constructor(
    private userService: UsersService,
    private filesService: FilesService,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.authService.getProfile().subscribe();
    }
  }

  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    this.userService
      .create({
        name: 'Iván',
        email: 'ivan.gutierrezc92@gmail.com',
        password: 'hola1234',
        role: 'customer',
        avatar: '',
      })
      .subscribe({
        next: (rta) => {
          console.log(rta);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  downloadPdf() {
    this.filesService
      .getFile(
        'my.pdf',
        'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf',
        'application/pdf'
      )
      .subscribe();
  }

  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if (file) {
      this.filesService.uploadFile(file).subscribe((rta) => {
        this.imgRta = rta.location;
      });
    }
  }
}
