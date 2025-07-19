import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Record } from '../../record.entity';

@Component({
  selector: 'lib-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css']
})
export class APIComponent implements OnInit {
  @Input() record!: Record;
  @Input() showActions: boolean = true;
  @Input() actionButtonText: string = '💾';
  @Input() actionButtonTitle: string = 'Action';
  @Input() showEditor: boolean = false;
  @Input() editorRows: number = 10;

  @Output() actionClick = new EventEmitter<Record>();
  @Output() updateRecord = new EventEmitter<{record: Record, updatedValue: string}>();

  // Editable fields
  editableRecord: any = {};
  isEditing: boolean = false;
  expandedSections: {[key: string]: boolean} = {
    headers: false,
    body: false,
    response: false
  };

  ngOnInit() {
    this.initializeEditableRecord();
  }

  initializeEditableRecord() {
    this.editableRecord = {
      method: this.record.method,
      url: this.record.url,
      status: this.record.status,
      isError: this.record.isError || false,
      errorMessage: this.record.errorMessage || '',
      headers: this.record.headers ? {...this.record.headers} : {},
      body: this.formatEditableContent(this.record.body),
      response: this.formatEditableContent(this.record.response),
      timestamp: this.record.timestamp
    };
  }

  formatEditableContent(content: any): string {
    if (content === null || content === undefined) {
      return '';
    }
    if (typeof content === 'string') {
      return content;
    }
    if (typeof content === 'object') {
      try {
        return JSON.stringify(content, null, 2);
      } catch (error) {
        return String(content);
      }
    }
    return String(content);
  }

  onActionClick() {
    this.actionClick.emit(this.record);
  }

  startEditing() {
    console.debug('Editing started for record:', this.record);
    this.isEditing = true;
    this.initializeEditableRecord();
  }

  cancelEditing() {
    this.isEditing = false;
    this.initializeEditableRecord();
  }

  saveChanges() {
    try {
      // Parse string fields back to objects if they are valid JSON
      const processedRecord = {
        ...this.editableRecord,
        body: this.parseEditableContent(this.editableRecord.body),
        response: this.parseEditableContent(this.editableRecord.response)
      };
      
      // Convert the processed record back to JSON string format for the update
      const updatedRecord = JSON.stringify(processedRecord, null, 2);
      this.updateRecord.emit({
        record: this.record,
        updatedValue: updatedRecord
      });
      this.isEditing = false;
    } catch (error) {
      alert('Error saving changes: ' + error);
    }
  }

  parseEditableContent(content: string): any {
    if (!content || content.trim() === '') {
      return null;
    }
    
    // Try to parse as JSON first
    try {
      return JSON.parse(content);
    } catch {
      // If not valid JSON, return as string
      return content;
    }
  }

  toggleSection(section: string) {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  addHeader() {
    if (!this.editableRecord.headers) {
      this.editableRecord.headers = {};
    }
    const newKey = `header-${Date.now()}`;
    this.editableRecord.headers[newKey] = '';
  }

  removeHeader(key: string) {
    if (this.editableRecord.headers) {
      delete this.editableRecord.headers[key];
    }
  }

  formatJson(obj: any): string {
    if (typeof obj === 'string') {
      try {
        return JSON.stringify(JSON.parse(obj), null, 2);
      } catch {
        return obj;
      }
    }
    return JSON.stringify(obj, null, 2);
  }

  parseJsonString(value: string): any {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  getStatusColor(): string {
    if (this.record.isError) return '#ff4444';
    if (this.record.status >= 200 && this.record.status < 300) return '#44aa44';
    if (this.record.status >= 300 && this.record.status < 400) return '#ffaa44';
    return '#ff8844';
  }

  getStatusIcon(): string {
    if (this.record.isError) return '❌';
    if (this.record.status >= 200 && this.record.status < 300) return '✅';
    if (this.record.status >= 300 && this.record.status < 400) return '🔄';
    return '⚠️';
  }

  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
