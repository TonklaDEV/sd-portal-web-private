import { Component } from '@angular/core';

@Component({
  selector: 'app-management-role-page',
  templateUrl: './management-role-page.component.html',
  styleUrls: ['./management-role-page.component.scss'],
})
export class ManagementRolePageComponent {

  protected arrayList = [
    {
      id: 1,
      name: 'anan dilokratsuchart',
      positionJob: 'Progammer Analyst',
      email: 'anand@pccth.com',
      phone: '087622706',
      authority: 'ผู้ดูแลระบบ',
    },
    {
      id: 2,
      name: 'chalermchart saithong',
      positionJob: 'Progammer I',
      email: 'chalermchart@pccth.com',
      phone: '093852771',
      authority: 'สมาชิก',
    },
    {
      id: 3,
      name: 'chanat sirakulphongsa',
      positionJob: 'Progammer I',
      email: 'Chanats@pccth.com',
      phone: '0824255595',
      authority: 'สมาชิก',
    },
    {
      id: 4,
      name: 'chitiphon muedin',
      positionJob: 'Progammer III',
      email: 'chitiphonm@pccth.com',
      phone: '0830844274',
      authority: 'สมาชิก',
    },
    {
      id: 5,
      name: 'kangwan tanuyudthakul',
      positionJob: 'Sr. System Analyst I',
      email: 'kangwant@pccth.com',
      phone: '0926645553',
      authority: 'ผู้ดูแลระบบ',
    }
  ];
}
