import { Component, DoCheck, OnInit, ChangeDetectorRef } from '@angular/core';
import { resMsg } from 'rober19-config';
import * as io from 'socket.io-client';
import { userService } from '../../services/user.service';
import { data_global } from '../../config/global.config';
import { User } from '../../models/user';
import { Ng2IzitoastService } from 'ng2-izitoast';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  public resMsg: any = resMsg;
  public user: any;
  public followings: Array<any>;
  public Chatpack: Array<any>;
  public receiveArr: Array<any>;
  public input: any;

  public text: any;
  private socket = io(data_global.url_socket);
  public userClick: any;
  public userClickChat: any;

  constructor(
    private _userService: userService,
    private cdRef: ChangeDetectorRef,
    private iziToast: Ng2IzitoastService
  ) {
    
    this.user = data_global.UserData;
    this.userClick = {};
    this.socket.on('chaton', data => {
      if (data.receiver == this.user._id) {      
        this.GetMessage();
      }
    });
  }

  ngOnInit() {
    this.followingList()
  }

  public followingList() {

    this._userService.following(this.user._id).subscribe(res1 => {
      let res: any = res1;
      this.followings = res.users
      this.userClick = res.users[0].followed
      this.GetMessage();

    }, err => {
      this.iziToast.error({
        title: 'Error',
        message: `${this.resMsg.serverErr}\n${err}`,
      });
    })

  }

  public LoadChatbyUser(user) {
    this.userClick = user.followed
    this.GetMessage()
  }

  public createMessage() {

    if (this.text == undefined) return null;
      const data = {
        emitter: this.user._id,
        receiver: this.userClick._id,
        text: this.text
      }

      this._userService.createMessage(data).subscribe(res => {
        //console.log(res)
        this.text = null
        this.socket.emit('chaton', data)
        this.GetMessage()
      }, err => {
        this.iziToast.error({
          title: 'Error',
          message: `${this.resMsg.serverErr}\n${err}`,
        });
      })
    



  }

  GetMessage() {
    const data = {
      emitter: this.user._id,
      receiver: this.userClick._id,
    }
    this._userService.GetMessage(data).subscribe(res => {
      this.userClickChat = res
    }, err => {
      this.iziToast.error({
        title: 'Error',
        message: `${this.resMsg.serverErr}\n${err}`,
      });
    }
    )
  }

  mess() {
    var objDiv = document.getElementById("chateo1");
    objDiv.scrollTop = objDiv.scrollHeight;
    //console.log('scroll down')
  }


}