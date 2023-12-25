import { Component, EventEmitter } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-job-day-view-page",
  templateUrl: "./job-day-view-page.component.html",
  styleUrls: ["./job-day-view-page.component.scss"],
})
export class JobDayViewPageComponent{

  protected systemSelValue?: string;
  protected statusSelValue?: string;
  protected serveritySelValue?: string;

  public arrayList1: Array<any> = ['กรุณาเลือก ระบบงานที่ต้องการ'];
  public arrayList2: Array<any> = ['กรุณาเลือก สถานะที่ต้องการค้นหา','OPEN','RESOLVED','CLOSED','CONFIRMED','REVIEWED','TO_REVIEW'];
  public arrayList3: Array<any> = ['กรุณาเลือก severity ที่ต้องการค้นหา','BLOCKER','CRITICAL','INFO','MAJOR','MINOR'];
  protected arrayTable = [
    {
      id: 1,
      program: 'ระบบงาน 1',
      severity: 'BLOCKER',
      improvement: '-',
      category: '-',
      status: 'กำลังพัฒนา',
      effort: '1 วัน',
      message: 'ฝากแก้ไขให้หน่อยนะครับ',
    },
    {
      id: 2,
      program: 'ระบบงาน 2',
      severity: 'CRITICAL',
      improvement: '-',
      category: '-',
      status: 'กำลังพัฒนา',
      effort: '7 วัน',
      message: 'fix bug',
    }
  ]

  public onSystemSelValue(event: string): void {
    this.systemSelValue = event;
    console.log('onSystemSelValue',this.systemSelValue);
  }

  public onStatusSelValue(event: string): void {
    this.statusSelValue = event;
    console.log('onStatusSelValue',this.statusSelValue);
  }

  public onServeritySelValue(event: string): void {
    this.serveritySelValue = event;
    console.log('onServeritySelValue',this.serveritySelValue);
  }
}
