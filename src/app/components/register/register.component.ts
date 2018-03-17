import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { userService } from '../../services/user.service';
import { resMsg } from '../../config/config'
import { data_global } from '../../services/global'


@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [userService]
})

export class RegisterComponent {
  public header_p1: string;
  public Model_user: User;
  public a1: string;
  public resMsg: any;
  public respMsg: any;
  public validf: boolean;
  public errorf: boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: userService
  ) {
    this.a1 = "disabled"
    this.header_p1 = 'ingrese los datos';
    //este seria un objeto usuario
    this.Model_user = new User(
      '',
      '',
      '',
      '',
      '',
      '',
      'ROLE_USER',
      '',
      '',
    );
    this.resMsg = resMsg;
    this.validf = false;
    this.errorf = false;
  }



  ngOnInit() {


    if (data_global.tokenDecode.sub != undefined || localStorage.getItem('identity')) {
      return this._router.navigate(['/home']);
    }

    console.log('')
  }

  onSubmit(form) {
    this.validf = false;
    this.errorf = false;
    //console.log(this.Model_user);
    this._userService.register(this.Model_user).subscribe(
      res => {
        //console.log(res);
        this.respMsg = res;
        form.reset();
        this.validf = true;
      },
      err => {
        // console.warn(err.error);
        this.respMsg = err.error;
        this.errorf = true;
      }
    );
  }
}