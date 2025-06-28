import { HttpRequest } from '@angular/common/http';
import { Record } from './record.entity';

export class MockStorage {
    private mockables: Record[] = [];
    private history: Record[] = [];

    constructor() {
        const storedMockables = localStorage.getItem('mockless.mockables');
        if (storedMockables) {
            this.mockables = JSON.parse(storedMockables);
        }
    }

    fetchMockable(req: HttpRequest<any>): Record | null {
        if(localStorage.getItem('mockless.enable') !== 'true') {
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
        if(localStorage.getItem('mockless.enable') !== 'true') {
            return;
        }
        this.history.push(entry);
    }

    removeMockable(entry: Record) {
        const existingIndex = this.mockables.findIndex(
            e => e.method === entry.method && e.url === entry.url
        );
        if (existingIndex !== -1) {
            this.mockables.splice(existingIndex, 1);
        }
    }

    storeMockable(entry: Record) {
        this.updateMockable(entry);
        this.storeMockables();
    }

    private storeMockables() {
        localStorage.setItem('mockless.mockables', JSON.stringify(this.mockables));
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
}

let mockStore: MockStorage | null = null;

export function getMockStorage(): MockStorage {
    if (!mockStore) {
        mockStore = new MockStorage();
    }
    return mockStore;
}