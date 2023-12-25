import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent implements OnInit {

  @Output()
  public valueSelect: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  public arrayList!: Array<string>;

  protected chkSelect: boolean = false;

  protected value!:string;

  constructor(private readonly elementRef: ElementRef) {}

  public ngOnInit(): void {
    this.value = this.arrayList[0];
    this.valueSelect.emit(this.arrayList[0]);
  }

  @HostListener('document:click', ['$event'])
  protected onClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.chkSelect = false;
    }
  }

  protected onTogglerValueChick(): void {
    this.chkSelect = !this.chkSelect;
  }

  protected onSelectValue(value: string): void {
    this.value = value;
    this.valueSelect.emit(value);
    this.chkSelect = !this.chkSelect;
  }
}
