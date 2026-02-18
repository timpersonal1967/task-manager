# TaskManager

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.3.

# Task Manager Application: Architecture, Behaviour, and Debugging Notes

This document explains how the Angular task‑manager application works, how routing and components interact, how json‑server provides the backend, and how the main issues encountered during development were resolved. It is intended as a complete overview of the project’s structure and runtime behaviour.

## 1. Application Overview

The application is a standalone Angular project that uses Angular’s modern standalone component architecture. It provides a simple CRUD interface for managing tasks. Tasks are stored in a json‑server backend, which exposes a REST API based on the contents of a local db.json file. The Angular frontend communicates with this API through HttpClient.

The app consists of three main parts: the root App component, the routing configuration, and two feature components (TaskListComponent and TaskFormComponent). The TaskService acts as the communication layer between the frontend and the backend.

## 2. Root Component and Bootstrapping

The root component is defined in app.ts. It is a standalone component, which is essential because the application is bootstrapped using Angular’s standalone API. The component imports RouterModule so that the router-outlet in its template can function correctly. It also imports HttpClientModule so that HttpClient is available throughout the application.

The template for the root component contains only a router-outlet. This means that the root component does not render any UI directly; instead, it delegates all rendering to the Angular router.

The application is bootstrapped in main.ts using bootstrapApplication. The router is provided using provideRouter(routes). Without this, routing would not activate and the application would render a blank page.

## 3. Routing Configuration

The routing configuration is defined in app.routes.ts. It maps three routes to components. The empty path ('') loads the TaskListComponent, which acts as the home page. The path 'add-task' loads the TaskFormComponent in creation mode. The path 'edit-task/:id' loads the same form component but in editing mode, with the id parameter used to fetch the existing task.

Because the root component contains a router-outlet and imports RouterModule, the router can correctly load the appropriate component based on the URL.

## 4. TaskListComponent

The TaskListComponent is responsible for displaying all tasks. It is a standalone component that imports CommonModule for structural directives, Angular Material modules for UI elements, and RouterModule for navigation.

The component defines a tasks array, which is populated in ngOnInit by calling loadTasks. This method calls TaskService.getTasks(), subscribes to the observable, and assigns the returned array to the tasks property.

The template uses *ngFor to iterate over the tasks array and display each task inside a Material list item. Each item includes an edit button that navigates to the edit-task route and a delete button that calls deleteTask. When a task is deleted, the component reloads the list from the server.

If the tasks array is empty, the list renders nothing, which is expected behaviour.

## 5. TaskFormComponent

The TaskFormComponent handles both creating and editing tasks. It is also a standalone component and imports all necessary Angular Material modules, CommonModule, RouterModule, and ReactiveFormsModule.

The component defines a reactive form with fields for title, description, and completed. In ngOnInit, it checks whether an id parameter exists in the route. If it does, the component enters editing mode and fetches the existing task from the server, patching the form with its values.

When the user saves the form, the component constructs a Task object. If editing is true, the id is included and updateTask is called. If editing is false, the id is omitted and addTask is called. After saving, the component navigates back to the home page.

A key bug was caused by always including id in the object sent to the server. When id was undefined, json‑server interpreted this as id: 0, which resulted in all tasks being created with id 0. Removing the id field when creating new tasks resolved this issue.

## 6. TaskService

The TaskService provides methods for interacting with the backend. It uses HttpClient to perform GET, POST, PUT, and DELETE requests against the json‑server API.

The base URL is http://localhost:3000/tasks. The getTasks method retrieves all tasks. The getTask method retrieves a single task by id. The addTask method posts a new task. The updateTask method updates an existing task. The deleteTask method deletes a task by id.

Because json‑server automatically persists changes to db.json, all operations are immediately reflected in the backend file.

## 7. json‑server Backend

The backend is provided by running npx json-server --watch db.json --port 3000. json‑server reads the db.json file and automatically generates REST endpoints based on the keys in the JSON object. In this case, the key "tasks" produces the endpoint /tasks.

json‑server stores data directly in db.json. It does not use a database engine. It does not enforce schemas. It does not validate data. It simply reads and writes JSON.

json‑server automatically generates incremental numeric IDs when creating new items, but only if the client does not send an id field. If the client sends id: 0 or id: undefined, json‑server will use that value. This is why the earlier bug resulted in all tasks having id 0.

Broken tasks can be removed by manually editing db.json and deleting the unwanted entries. After saving the file, json‑server will immediately reflect the changes.

## 8. Common Issues and Their Resolutions

Several issues arose during development, each with a clear cause and solution.

The first issue involved Angular warnings about missing structural directive imports. Standalone components do not inherit CommonModule, so any component using *ngIf or *ngFor must explicitly import CommonModule.

The second issue involved TypeScript errors when passing task.id to deleteTask. Because id was optional, TypeScript required either a non-null assertion or a stricter interface. This was resolved by using task.id! in the template.

The third and most significant issue involved tasks always being created with id 0. This was caused by sending id: undefined during creation. Removing the id field when creating new tasks allowed json‑server to generate proper incremental IDs.

The fourth issue involved the application rendering a blank page. This was caused by the root component missing standalone: true. Without this, Angular could not bootstrap the component correctly, and routing never activated. Adding standalone: true resolved the issue immediately.

## 9. Summary

The task‑manager application is a clean example of a modern Angular standalone project backed by a json‑server mock API. The frontend uses Angular Material for UI, Reactive Forms for data entry, and HttpClient for communication. The backend is a simple JSON file that json‑server exposes as a REST API.

The main architectural flow is straightforward. The root component hosts a router-outlet. The router loads either the task list or the task form. The list component fetches tasks and displays them. The form component creates or edits tasks. The service handles all communication with the backend. json‑server persists all changes to db.json.

Once the missing standalone flag was added and the id handling was corrected, the entire application behaved as expected.

---

If you want, I can also produce a second document that explains the architecture in a more tutorial‑style format, or one that focuses on best practices for scaling this into a real backend.


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
