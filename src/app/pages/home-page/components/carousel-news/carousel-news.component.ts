import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Subscription, timer } from 'rxjs';

import { CarouselNewsModel } from './classes/models/carousel-news.model';

@Component({
  selector: 'app-carousel-news',
  templateUrl: './carousel-news.component.html',
  styleUrls: ['./carousel-news.component.scss'],
})
export class CarouselNewsComponent implements OnInit, OnDestroy {
  private defaultTransform: number = 0;
  private timerSubscription?: Subscription;

  protected readonly mockData: Array<CarouselNewsModel> = new Array<CarouselNewsModel>(
    new CarouselNewsModel({
      image: 'https://data.pccth.com/sd/vendor/assets/img/desk.jpg',
      title: 'คู่มือการใช้งาน',
      description: `
        SonarQube ตอนที่ 1 https://code.pccth.com/sonarqube_001/
        SonarQube ตอนที่ 2 https://code.pccth.com/sonarqube-t-nthii-2/
        SonarQube ตอนที่ 3 https://code.pccth.com/sonarqube-t-nthii-2/
        SonarQube ตอนที่ 3 https://code.pccth.com/sonarqube-t-nthii-2/
        SonarQube ตอนที่ 3 https://code.pccth.com/sonarqube-t-nthii-2/
      `,
    }),
    new CarouselNewsModel({
      image: 'https://data.pccth.com/sd/vendor/assets/img/loft.jpg',
      title: 'วิธีการใช้งาน CMS',
      description: `
        สามารถใช้งานได้ดังนี้ ดาวน์โหลดคู่มือด้านล่าง
      `,
    }),
    new CarouselNewsModel({
      image: 'https://data.pccth.com/sd/vendor/assets/img/desk.jpg',
      title: 'หน้าสำรอง 1',
      description: `
        หน้าสำรอง 1 เพิ่มข้อมูลภายหลัง
      `,
    }),
    new CarouselNewsModel({
      image: 'https://data.pccth.com/sd/vendor/assets/img/desk.jpg',
      title: 'ข่าวสารน่ารู้ประจำวัน',
      description: `
        เฟซบุ๊กใช้ HTTP/3 เกิน 75% แล้ว
        เฟซบุ๊กรายงานถึงการย้ายโปรโตคอลไปยัง HTTP/3 หรือ QUIC
        [https://www.blognone.com/node/106406]
      `,
    }),
    new CarouselNewsModel({
      image: 'https://data.pccth.com/sd/vendor/assets/img/loft.jpg',
      title: 'บทความเทคโนโลยีน่ารู้',
      description: `
      ไมโครซอฟท์ออกส่วนขยาย Microsoft Edge Tools, เรียกใช้ Edge DevTools ดีบัก DOM/ตรวจสอบเน็ตเวิร์คได้จาก VS Code ทำให้ความสามารถของส่วนขยายในตอนนี้ไม่ใช่
      `,
    }),
    new CarouselNewsModel({
      image: 'https://data.pccth.com/sd/vendor/assets/img/desk.jpg',
      title: 'ประกาศประจำวัน',
      description: `
        กำหนดวิธีการอบรมระบบงานสารสนเทศหลัก และ ประเมิน ดังนี้
        1. อบรมที่ห้อง PCC3  ตามวันเวลา ที่แจ้ง
        2. ให้ผู้สอนเปิด MS Team เชิญ SA ทุกคนเข้าร่วมใน
      `,
    }),
  );

  @ViewChild('container', { read: ElementRef<HTMLDivElement> })
  protected container?: ElementRef<HTMLDivElement>;

  public ngOnInit(): void {
    if (window.innerWidth >= 1024) {
      this.timerSubscription = timer(30000, 30000).subscribe((): void => {
        this.onNextLeftClick(this.container?.nativeElement);
      });
    }
  }

  public ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  protected onNextLeftClick(element?: HTMLDivElement): void {
    if (element !== undefined) {
      this.defaultTransform = this.defaultTransform - 406;

      if (Math.abs(this.defaultTransform) >= element.scrollWidth / 1.7) {
        this.defaultTransform = 0;
      }

      element.style.transform = `translateX(${this.defaultTransform}px)`;
    }
  }

  protected onNextRightClick(element?: HTMLDivElement): void {
    if (element !== undefined) {
      if (Math.abs(this.defaultTransform) === 0) {
        this.defaultTransform = -element.offsetWidth + -49;
      } else if (element.scrollWidth - Math.abs(this.defaultTransform) < element.offsetWidth) {
        this.defaultTransform = this.defaultTransform + 606;
      } else {
        this.defaultTransform = 0;
      }

      element.style.transform = `translateX(${this.defaultTransform}px)`;
    }
  }
}
