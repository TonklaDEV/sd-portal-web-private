import { Component, EventEmitter, HostListener, Output } from "@angular/core";

@Component({
  selector: 'app-modal-item-card-detail',
  templateUrl: './modal-item-card-detail.component.html',
  styleUrls: ['./modal-item-card-detail.component.scss'],
})
export class ModalItemCardDetailComponent {
  public display: boolean = false;
  public hidden: boolean = true;

  @Output()
  public onChangeDisplay: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('document:keydown.escape')
  protected onKeydownHandler(): void {
    this.close();
  }

  public onOpen(itemId: string): void {
    document.body.style.overflow = 'hidden';

    this.display = true;
    this.hidden = false;
  }

  public close(): void {
    document.body.style.overflow = 'auto';
    this.display = false;

    setTimeout<Array<number>>((): void => {
      this.hidden = true;
    }, 300);
  }
}
