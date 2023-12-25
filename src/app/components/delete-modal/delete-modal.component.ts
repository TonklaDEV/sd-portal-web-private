import { Component, HostListener } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent {
  private id: string = '';
  private value?: BehaviorSubject<string>;

  public display: boolean = false;
  public hidden: boolean = true;
  public title: string = '';

  @HostListener('document:keydown.escape')
  private onKeydownHandler(): void {
    this.onClose();
  }

  public onOpen(id: string, title: string): Observable<string> {
    document.body.style.overflow = 'hidden';

    this.display = true;
    this.hidden = false;
    this.id = id;
    this.title = title;

    this.value = new BehaviorSubject<string>('');

    return this.value.asObservable();
  }

  public onDelete(): void {
    this.value?.next(this.id);
    this.onClose();
  }

  public onClose(): void {
    document.body.style.overflow = 'auto';
    this.display = false;

    setTimeout(() => {
      this.hidden = true;
    }, 300);
  }
}
