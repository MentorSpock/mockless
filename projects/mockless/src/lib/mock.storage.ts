import { HttpRequest } from '@angular/common/http';
import { Record } from './record.entity';

type reloadCallback = () => void;
type MessageType = 'history' | 'mockables' | 'enable';

export class MockStorage {
    private mockables: Record[] = [];
    private history: Record[] = [];
    private readonly channel : BroadcastChannel = new BroadcastChannel('mockless-sync');
    private reloadCallback: reloadCallback = ()=>{};
    private enabled: boolean = localStorage.getItem('mockless.enable') === 'true';

    constructor() {
        this.reloadMockables();
        this.channel.onmessage = this.handleMessage.bind(this);
    }

    private reloadMockables() {
        const storedMockables = localStorage.getItem('mockless.mockables');
        if (!storedMockables) {
            return;
        }
        this.mockables = JSON.parse(storedMockables);
    }

    private handleMessage(event: MessageEvent) {
        console.debug('Received message:', event.data);
        const type: MessageType = event.data.type;
        if (type === 'history') {
            this.history.push(event.data.entry);
        } else if (type === 'mockables' ) {
            this.mockables = event.data.mockables;
        } else if (type === 'enable') {
            this.enabled = event.data.enabled;
        }
        this.reloadCallback();
    }

    public onReload(callback: reloadCallback) {
        this.reloadCallback = callback;
    }

    getMockables(): Record[] {
        if(!this.enabled) {
            return [];
        }
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
        this.publish({
            type: 'history',
            entry: entry
        });
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
        this.publish({
            type: 'mockables',
            mockables: this.mockables
        });
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
        this.publish({
            type: 'enable',
            enabled: enable
        });
    }

    private publish(message: {
        type: MessageType;
        mockables?: Record[];
        entry?: Record;
        enabled?: boolean;
    }) {
        this.channel.postMessage(message);
        this.handleMessage({ data: message } as MessageEvent);
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