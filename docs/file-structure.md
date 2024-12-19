# File Structure

The file structure of the project.

## Overview

This documentation tempts to describe the file structure of the project to
provide a better maintainability and accessibility of the project.

## Structure

### Overview tree

```plaintext
.
├── docs
├── node_modules
├── dist
└── src
    ├── public
    ├── middlewares
    ├── routes
    ├── static
    │   ├── js
    │   └── scss
    ├── utils
    └── views
        ├── pages
        │   └── blogs
        └── partials
            ├── includes
            └── layouts
```

### Description

- `docs`: Contains the documentation written in markdown format, like this one.
- `node_modules`: Contains the dependencies of the project.
- `dist`: Contains the production-ready code that is generated after the `build` process.
- `src`: Contains the source code of the project.
- `src/public`: Contains the generated assets like CSS, JS, and images during development.
- `src/middlewares`: Contains the ExpressJS middlewares.
- `src/routes`: Modularizes ExpressJS routers and route handlers.
- `src/static`: Contains the raw static assets like CSS and JS.
- `src/utils`: Contains the utility functions for reusability.
- `src/views`: Contains the pages and components in `handlebars` template engine.
  - `src/views/pages`: Contains the main views which are used to render the Express pages.
  - `src/views/pages/*`: Contains the sub-pages based on the route prefix.
  - `src/views/partials`: Contains the modularized and reusable components
    - `src/views/partials/includes`: Contains atomic components like header, footer, etc.
    - `src/views/partials/layouts`: Contains the general layouts to render the pages.
