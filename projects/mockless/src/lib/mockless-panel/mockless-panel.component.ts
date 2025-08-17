import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Record } from '../record.entity';

@Component({
  selector: 'lib-mockless-panel',
  templateUrl: './mockless-panel.component.html',
  styleUrls: ['./mockless-panel.component.css']
})
export class MocklessPanelComponent implements OnInit {

  view: 'api-maker' | 'recorder' = 'api-maker';
  apiRecord: Record = {
    method: 'POST',
    url: 'https://fake-json-api.mock.beeceptor.com/users'
  } as Record;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const view = params.get('view');
      if (!view) {
        this.setView('recorder');
        return;
      }
      if (view === 'api-maker' || view === 'recorder') {
        this.view = view;
      }
    });
  }

  setView(view: 'api-maker' | 'recorder', event: any = null) {
    this.route.queryParams.subscribe(params => {
      const queryParams = { ...params, view };
      const newUrl = `${location.pathname}?${new URLSearchParams(queryParams).toString()}`;

      if (event?.metaKey || event?.ctrlKey) {
        // Cmd+click or Ctrl+click - open in new tab without changing current view
        window.open(newUrl, '_blank');
        console.debug('Opened new tab:', newUrl);
      } else {
        // Normal click - change current view and update URL
        this.view = view;
        history.replaceState(null, '', newUrl);
        console.debug('Replaced state:', newUrl);
      }
      event?.preventDefault();
    });
  }

  onCopyToAPIClicked(record: Record){
    console.debug('taken to API', record)
    this.apiRecord = { ...record };
    this.view ='api-maker';
  }
}
