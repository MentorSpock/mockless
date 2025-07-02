# Mockless

An Angular library that provides intelligent HTTP request recording and replay capabilities for seamless API mocking during development and testing.


With Mockless, you can develop the frontend without needing the backend up and running.

Mock More with less
1. Code
2. Servers
3. Hassel
4. Followups

# Features

- **Automatic HTTP Recording**: Intercepts and records all outgoing HTTP requests and their responses
- **Request Replay**: Automatically replay recorded responses for matching requests
- **Error Handling**: Records and replays both successful responses and error conditions
- **Visual Interface**: Built-in component to view request history and manage mock data
- **Editable Mocks**: Modify recorded responses through an intuitive JSON editor
- **Toggle Mode**: Easy enable/disable functionality via localStorage
- **Zero Configuration**: Works out of the box with minimal setup

# Installation

```bash
npm install @mentorspok/mockless
```

# Setup

## 1. **Override the Http Handler:**

### For Angular 20

Import the required fields in the ```app.Config.ts```
```typescript
import { HttpBackend, HttpHandler } from '@angular/common/http';
import { MockHttpHandlerFactory } from '@mentorspok/mockless';
```

Add the Mockless Provider for the HttpHandler
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    ... // Existing providers
    ...
    {
      provide: HttpHandler,
      useFactory: MockHttpHandlerFactory,
      deps: [HttpBackend]
    }
  ]
};
```

### For earlier system

```typescript
import { MockHttpHandlerFactory } from '@mentorspok/mockless';

@NgModule({
  providers: [
    {
      provide: HttpBackend,
      useFactory: MockHttpHandlerFactory,
      deps: [HttpBackend]
    }
  ]
})
export class AppModule { }
```

## 2. **Add Mockless panel for control:**
### For Angular 20
Update ```app.routes.ts``` Add the Mockless component to "mockless" or any route you want to use, to add the MocklessPanel
```typescript
import { Routes } from '@angular/router';
import { MocklessPanelComponent } from '@mentorspok/mockless';

export const routes: Routes = [
    ... // existing routes
    { path: 'mockless', component: MocklessPanelComponent }
];
```
### For earlier system

Update ```app.module.ts``` Add the Mockless component to "mockless" or any route you want to use, to add the MocklessPanel
Remember to add MocklessModule to the module imports
```typescript
import { Routes } from '@angular/router';
import { MockHttpHandlerFactory, MocklessModule, MocklessPanelComponent } from 'mockless';

export const routes: Routes = [
    ... // existing routes
    { path: 'mockless', component: MocklessPanelComponent }
];
```


```typescript
@NgModule({
  declarations: [
    ... // existing declarations
  ],
  imports: [
    ... // existing imports
    MocklessModule // <- add this.
  ],
  providers: [
    {
      provide: HttpHandler,
      useFactory: MockHttpHandlerFactory,
      deps: [HttpBackend]
    }
  ],
  bootstrap: [AppComponent]
})
```

Now you can navigate to `/mockless` in your app to view and manage recorded requests.

## How It Works

1. **Recording Phase**: Make HTTP requests normally - Mockless records all requests and responses
2. **Replay Phase**: Subsequent identical requests return the recorded responses automatically
3. **Management**: Use the record viewer inspect, edit, or delete recorded mocks