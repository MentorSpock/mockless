import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lib-mockless-panel',
  templateUrl: './mockless-panel.component.html',
  styleUrls: ['./mockless-panel.component.css']
})
export class MocklessPanelComponent implements OnInit {
    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
      this.route.queryParamMap.subscribe(params => {
        const view = params.get('view');
        if(!view) {
          this.setView('recorder');
          return;
        }
        if (view === 'api-maker' || view === 'recorder') {
          this.view = view;
        }
      });
    }
  view: 'api-maker' | 'recorder' = 'api-maker';

  setView(view: 'api-maker' | 'recorder') {
    this.view = view;
    this.route.queryParams.subscribe(params => {
      const queryParams = { ...params, view };
      history.replaceState(null, '', `${location.pathname}?${new URLSearchParams(queryParams).toString()}`);
    });
  }
}
