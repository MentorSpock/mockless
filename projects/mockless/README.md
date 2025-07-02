# Mockless

An Angular library that provides intelligent HTTP request recording and replay capabilities for seamless API mocking during development and testing.

## Features

- **Automatic HTTP Recording**: Intercepts and records all outgoing HTTP requests and their responses
- **Request Replay**: Automatically replay recorded responses for matching requests
- **Error Handling**: Records and replays both successful responses and error conditions
- **Visual Interface**: Built-in component to view request history and manage mock data
- **Editable Mocks**: Modify recorded responses through an intuitive JSON editor
- **Toggle Mode**: Easy enable/disable functionality via localStorage
- **Zero Configuration**: Works out of the box with minimal setup

## Quick Start

### Installation

```bash
npm install @mentorspok/mockless
```

### Setup

1. **Configure your app module:**

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

2. **Enable recording mode:**

```typescript
// Enable mockless
localStorage.setItem('mockless.enable', 'true');

// Disable mockless (use real APIs)
localStorage.setItem('mockless.enable', 'false');
```

3. **View recorded requests:**
Before using the record viewer component, make sure to import the `MocklessModule` in your app module:

```typescript
import { MocklessModule } from '@mentorspok/mockless';

@NgModule({
    imports: [
        // ...other imports
        MocklessModule
    ]
})
export class AppModule { }
```

To provide access to the record viewer via a route, add it to your routing configuration:

```typescript
import { MocklessPanelComponent } from '@mentorspok/mockless';

const routes: Routes = [
    // ...other routes
    { path: 'mockless', component: MocklessPanelComponent }
];
```

Now you can navigate to `/mockless` in your app to view and manage recorded requests.

## How It Works

1. **Recording Phase**: Make HTTP requests normally - Mockless records all requests and responses
2. **Replay Phase**: Subsequent identical requests return the recorded responses automatically
3. **Management**: Use the record viewer to inspect, edit, or delete recorded mocks

## Development

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.16.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
