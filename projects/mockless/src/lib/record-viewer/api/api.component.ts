import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Record } from '../../record.entity';

@Component({
  selector: 'lib-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css']
})
export class APIComponent {
  @Input() record!: Record;
  @Input() showActions: boolean = true;
  @Input() actionButtonText: string = '💾';
  @Input() actionButtonTitle: string = 'Action';
  @Input() showEditor: boolean = false;
  @Input() editorRows: number = 10;

  @Output() actionClick = new EventEmitter<Record>();
  @Output() updateRecord = new EventEmitter<{record: Record, updatedValue: string}>();

  onActionClick() {
    this.actionClick.emit(this.record);
  }

  onUpdateRecord(textArea: HTMLTextAreaElement) {
    this.updateRecord.emit({
      record: this.record,
      updatedValue: textArea.value
    });
  }
}
