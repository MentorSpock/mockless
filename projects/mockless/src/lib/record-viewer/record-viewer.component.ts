import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Record } from '../record.entity'; // adjust path if needed
import { getMockStorage } from '../mock.storage'; // adjust if using a service

@Component({
  selector: 'lib-record-viewer',
  templateUrl: './record-viewer.component.html',
  styleUrls: ['./record-viewer.component.css']
})
export class RecordViewerComponent implements OnInit {
  storage = getMockStorage();
  mockables: Record[] = [];
  history: Record[] = []; // Initialize with an empty record

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.storage.onHistoryAdd((record: Record) => {
      console.log('History record added:', record);
      this.history.push(record);
      this.cdr.detectChanges(); // Trigger change detection to update the view
    });
    this.storage.onMockablesChange(() => {
      this.mockables = this.storage.getMockables();
      console.log('Mockables updated:', this.mockables);
      this.cdr.detectChanges(); // Trigger change detection to update the view
    });
    this.mockables = this.storage.getMockables();
  }

  remove(entry: Record) {
    this.storage.removeMockable(entry);
    // No need to reload explicitly since we’re using a getter
  }
  addMockable(entry: Record) {
    this.storage.storeMockable(entry);
  }

  updateMockable(entry: Record, update: string) {
    try{
    const updateEntity = JSON.parse(update);
    const updatable = {...entry, ...updateEntity};
    this.storage.storeMockable(updatable);
    }catch (e) {
      console.error('Failed to update mockable:', e);
      alert('Failed to update mockable: ' + e);
    }
  }

  toggleEnabled(event: any) {
    const enabled = event.target.checked;
    this.storage.enableMockless(enabled);
    this.cdr.detectChanges(); // Trigger change detection to update the view
  }
}
