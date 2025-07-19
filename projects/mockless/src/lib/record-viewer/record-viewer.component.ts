import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Record } from '../record.entity'; // adjust path if needed
import { MockStorage } from '../mock.storage'; // adjust if using a service

@Component({
  selector: 'lib-record-viewer',
  templateUrl: './record-viewer.component.html',
  styleUrls: ['./record-viewer.component.css']
})
export class RecordViewerComponent implements OnInit {
  mockables: Record[] = [];
  history: Record[] = []; // Initialize with an empty record

  constructor(private storage: MockStorage) {

  }

  isEnabled(){
    return this.storage.isEnabled();
  }

  ngOnInit(): void {
    this.storage.onReload(() => {
      console.debug('Reloading records...');
      this.mockables = this.storage.getMockables();
      this.history = this.storage.getHistory();
      console.debug('Mockables:', this.mockables);
      console.debug('History:', this.history);
    });
    this.history = this.storage.getHistory();
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
    this.storage.enableMockless(event.target.checked);
  }
}
