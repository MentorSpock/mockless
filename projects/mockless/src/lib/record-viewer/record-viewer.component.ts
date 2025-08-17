import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Record } from '../record.entity'; // adjust path if needed
import { MockStorage } from '../mock.storage'; // adjust if using a service
import { Action } from '../action.entity';

type historyRecord = Record & {
  isMocked: boolean;
};

@Component({
  selector: 'lib-record-viewer',
  templateUrl: './record-viewer.component.html',
  styleUrls: ['./record-viewer.component.css']
})
export class RecordViewerComponent implements OnInit {
  @ViewChild('mockables_view') mockables_view!: ElementRef;
  mockables: Record[] = [];
  history: historyRecord[] = []; // Initialize with an empty record
  activeTab: string = "history";
  showCreateDialog: boolean = false;
  newMockableRecord: Record;

  constructor(private storage: MockStorage) {
    this.newMockableRecord = this.createEmptyRecord();
  }

  setView(tab: string) {
    this.activeTab = tab;
  }

  createNewMockable(){
    this.newMockableRecord = this.createEmptyRecord();
    this.showCreateDialog = true;
  }

  createEmptyRecord(): Record {
    return {
      method: 'GET',
      url: 'https://api.example.com/endpoint',
      headers: {
        'Content-Type': 'application/json'
      },
      body: null,
      response: {
        message: 'Mock response data'
      },
      status: 200,
      statusText: 'OK',
      timestamp: Date.now(),
      isError: false
    };
  }

  onCreateMockableSave(event: {record: Record, updatedValue: string}) {
    try {
      console.debug('Creating new mockable with data:', event);
      const updateEntity = JSON.parse(event.updatedValue);
      const newMockable = {...event.record, ...updateEntity, timestamp: Date.now()};
      this.storage.storeMockable(newMockable);
      this.showCreateDialog = false;
    } catch (e) {
      console.error('Failed to create mockable:', e);
      alert('Failed to create mockable: ' + e);
    }
  }

  closeCreateDialog() {
    this.showCreateDialog = false;
  }  isEnabled(){
    return this.storage.isEnabled();
  }

  ngOnInit(): void {
    this.storage.onReload(() => {
      this.reload();
    });
    this.reload();
  }

  reload(){
      console.debug('Reloading records...');
      this.mockables = this.storage.getMockables();
      this.updateHistory(this.storage.getHistory());
      console.debug('Mockables:', this.mockables);
      console.debug('History:', this.history);
  }

  updateHistory(history: Record[]){
    this.history = history.map(record => ({ ...record, isMocked: this.isMocked(record) }));
  }

  isMocked(record: Record): boolean {
    return this.mockables.some(entry => entry.url === record.url && entry.method === record.method);
  }

  remove(entry: Record) {
    this.storage.removeMockable(entry);
    // No need to reload explicitly since we’re using a getter
  }
  doHistoryAction(entry: historyRecord) {
    if(!entry.isMocked) {
      this.storage.storeMockable(entry);
    }
    this.setView('mockables');
    setTimeout(() => {
      this.focusOnMockable(entry);
    }, 10);
  }

  focusOnMockable(entry: Record) {
    const index = this.mockables.findIndex(item => item.url === entry.url && item.method === entry.method);
    console.debug('Focusing on mockable index:', index);
    if (index === -1) {
      return;
    }
    const element = this.mockables_view.nativeElement.querySelector(`#mockable-${index}`);
    console.debug('Focusing on mockable element:', element);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
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

  getMockableActions(): Action[] {
    return [
      {
        text: '🗑️ Remove Mockable',
        callback: (record: Record) => {
          this.remove(record);
        }
      }
    ];
  }

  getHistoryActions(record: historyRecord): Action[] {
    return [
      {
        text: record.isMocked ? '👁️ View Mockable' : '💾 Add to Mockables',
        callback: (callbackRecord) =>{
          this.doHistoryAction({
            ...callbackRecord,
            isMocked: record.isMocked
        });
        }
      }
    ];
  }
}
