import { HttpRequest } from '@angular/common/http';
import { Record } from './record.entity';

type historyAdded = (data: Record) => void;
type mockablesChanged = (data: Record[]) => void;

export class MockStorage {
    private mockables: Record[] = [];
    private history: Record[] = [];
    private readonly channel : BroadcastChannel = new BroadcastChannel('mockless-sync');
    private historySubscribers: historyAdded[] = [];
    private mockablesSubscribers: mockablesChanged[] = [];
    private enabled: boolean = localStorage.getItem('mockless.enable') === 'true';

    constructor() {
        const storedMockables = localStorage.getItem('mockless.mockables');
        if (!storedMockables) {
            return;
        }
        this.mockables = JSON.parse(storedMockables);
        this.channel.onmessage = this.handleMessage.bind(this);
    }

    private handleMessage(event: MessageEvent) {
        console.log('Received message:', event.data, "with history subscribers length:", this.historySubscribers.length, "and mockablesSubscribers length:", this.mockablesSubscribers.length);
        if (event.data.type === 'history') {
            this.history.push(event.data.entry);
            this.historySubscribers.forEach(subscriber => subscriber(event.data.entry));
        } else if (event.data.type === 'mockables') {
            this.mockables = event.data.mockables;
            this.mockablesSubscribers.forEach(subscriber => subscriber(this.mockables));
        } else if (event.data.type === 'enable') {
            this.enabled = event.data.enabled;
            console.debug('Mockless enabled:', this.enabled);
        }
    }

    public onHistoryAdd(callback: historyAdded) {
        this.historySubscribers.push(callback);
    }

    public onMockablesChange(callback: mockablesChanged) {
        this.mockablesSubscribers.push(callback);
    }

    getMockables(): Record[] {
        if(!this.enabled) {
            return [];
        }
        console.debug('Returning mockables', this.mockables);
        return [...this.mockables];
    }

    fetchMockable(req: HttpRequest<any>): Record | null {
        if(!this.enabled) {
            return null;
        }
        return (
            this.mockables.find(
                entry =>
                    entry.method === req.method &&
                    entry.url === req.urlWithParams
            ) || null
        );
    }

    pushToHistory(entry: Record) {
        if(!this.enabled) {
            return;
        }
        this.channel.postMessage({
            type: 'history',
            entry: entry
        });
        this.historySubscribers.forEach(subscriber => subscriber(entry));
        this.history.push(entry);
    }

    removeMockable(entry: Record) {
        const existingIndex = this.mockables.findIndex(
            e => e.method === entry.method && e.url === entry.url
        );
        if (existingIndex !== -1) {
            this.mockables.splice(existingIndex, 1);
        }
        this.storeMockables();
    }

    storeMockable(entry: Record) {
        this.updateMockable(entry);
        this.storeMockables();
    }

    private storeMockables() {
        localStorage.setItem('mockless.mockables', JSON.stringify(this.mockables));
        this.channel.postMessage({
            type: 'mockables',
            mockables: this.mockables
        });
        this.mockablesSubscribers.forEach(subscriber => subscriber(this.mockables));
    }

    private updateMockable(entry: Record){
        const existingIndex = this.mockables.findIndex(
            e => e.method === entry.method && e.url === entry.url
        );
        if (existingIndex !== -1) {
            this.mockables[existingIndex] = entry;
            return;
        }
        this.mockables.push(entry);
    }

    getHistory(): Record[] {
        return [...this.history].reverse();
    }

    clearHistory() {
      this.history = [];
    }

    enableMockless(enable: boolean) {
        localStorage.setItem('mockless.enable', `${enable}`);
        this.channel.postMessage({
            type: 'enable',
            enabled: enable
        });
    }

    isEnabled(): boolean {
        return this.enabled;
    }

}

let mockStore: MockStorage | null = null;

export function getMockStorage(): MockStorage {
    if (!mockStore) {
        mockStore = new MockStorage();
    }
    return mockStore;
}