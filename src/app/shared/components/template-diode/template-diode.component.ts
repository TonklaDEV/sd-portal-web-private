import { Component } from '@angular/core';

@Component({
  selector: 'app-template-diode',
  templateUrl: './template-diode.component.html',
  styleUrls: ['./template-diode.component.scss']
})
export class TemplateDiodeComponent {

  protected toggleModal: boolean = false;

  protected onToggleModal(): void {
    this.toggleModal = !this.toggleModal;
  }

}
