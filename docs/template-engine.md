# Template Engine

This documentation tempts to describe the template engine used in the project
and the process of rendering the views in the Express application.

## Overview

ExpressJS is a minimmal NodeJS web framework that is agnostic to the template
engine. It means that ExpressJS by default only renders the raw HTML files and
allows developers to specify a template engine to render the views if needed.

A template engine is a tool that allows developers to write HTML templates and
embed dynamic data from the server to render a complete HTML page. The template
engine processes the templates and replaces the dynamic data placeholders with
the actual data from the server before sending the response to the client.

## Handlebars

[`handlebars`](https://handlebarsjs.com/) is the core template engine used in
the project. Handlebars is a simple templating language that allows developers
to write HTML templates with placeholders for dynamic data. Handlebars compiles
the templates into JavaScript functions and executes them to render the views.

## ExpressJS integration

To use Handlebars as the template engine in the Express application, the project
uses the [`express-handlebars`](https://www.npmjs.com/package/express-handlebars)
package. The main usage of the package is to provide a consistent way to
register partials, helpers and layouts that are used in the Handlebars templates.

The template engine is configured in the [`src/server.ts`](https://github.com/richardnguyen99/expressts-webpack-template/blob/main/src/server.ts).

```ts
import * as path from "path";
import Express from "express";
import dotenv from "dotenv";
import { engine as hbsEngine } from "express-handlebars";

const createApp = async () => {
  const app = Express();

  // Set up handlebars as the template engine
  app.engine(
    "hbs",
    hbsEngine({
      partialsDir: [path.join(__dirname, "views", "partials")],
      extname: "hbs",
      defaultLayout: path.join(
        __dirname,
        "views",
        "partials",
        "layouts",
        "main.hbs"
      ),
      layoutsDir: path.join(__dirname, "views", "partials", "layouts"),
      helpers: {
        // custom helpers
      },
    })
  );
  app.set("view engine", "hbs");
  app.set("views", "src/views/pages");

  // app configurations and settings
};

export default createApp;
```

- `partialsDir`: Tell the package to load all the partials from the this directory.
- `defaultLayout`: Tell the package to use the `main.hbs` layout as the default layout.
- `layoutsDir`: Tell the package to load all the layouts from this directory.
- `helpers`: Register custom JavaScript functions that can be used in the Handlebars templates.
- `app.set("views", "src/views/pages")`: Tell the Express app to look for the views in order to render complete HTML pages.

## Partials

Partials are reusable components that can be included in other handlebars files.
Partials are useful for creating atomic components like header, footer, etc.

The partials are stored in the `src/views/partials` directory. The partials are
further divided into two subdirectories:

- `src/views/partials/includes`: Contains atomic components like header, footer, etc.
- `src/views/partials/layouts`: Contains the general layouts to render the pages.

To define a partial, create a `.hbs` file in the `src/views/partials` directory:

```hbs
<!-- src/views/partials/includes/_footer.hbs -->
<footer>
  <ul class="nav justify-content-center border-bottom pb-3 mb-3">
    <li class="nav-item"><a
        href="/"
        class="nav-link px-2 text-body-secondary"
      >Home</a></li>
    <li class="nav-item"><a
        href="/blogs"
        class="nav-link px-2 text-body-secondary"
      >Blogs</a></li>
    <li class="nav-item"><a
        href="/users"
        class="nav-link px-2 text-body-secondary"
      >Users</a></li>
    <li class="nav-item"><a
        href="#"
        class="nav-link px-2 text-body-secondary"
      >FAQs</a></li>
    <li class="nav-item"><a
        href="#"
        class="nav-link px-2 text-body-secondary"
      >About</a></li>
  </ul>
  <p class="text-center text-body-secondary">ExpressTS - Webpack Template</p>
</footer>
```

To include partials in the main views, use the `{{> partialName}}` syntax, such
as `{{> includes/_footer}}`.

```hbs
<!-- src/views/partials/layouts/_base.hbs -->
<html data-bs-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{#> title}}{{/title}} | ExWt</title>

    <link rel="stylesheet" href={{ manifest "main.css" }} />
    {{#> styles}}
    {{/styles}}


  </head>
  <body>
    {{> includes/_bootstrap_icon }}
    {{> includes/_header }}

    <main>
    {{#> body}}
    {{/body}}
    </main>

    {{> includes/_footer }}

    <script text="javascript" src={{manifest "vendors.js" }}></script>
    <script text="javascript" src={{manifest "runtime.js" }}></script>
    <script text="javascript" src={{manifest "main.js" }}></script>
    {{#> scripts}}
    {{/scripts}}

  </body>
</html>
```

Partials can be included in other partials as well. For example, the `_header`
partial can include the `_header_item` partials.

More at [Handlebars Basic Partials](https://handlebarsjs.com/guide/partials.html#basic-partials).

## Partials with parameters

Handlebars allows developers to pass parameters to the partials. The parameters
can be used to customize the partials based on the data passed from the views.

To pass parameters to the partials, use the `{{> partialName parameter}}` syntax.

```hbs
<!-- src/views/partials/includes/_header.hbs -->
<header class="text-bg-dark navbar navbar-expand-lg py-3 border-bottom">
  <div class="container">
    <div id="headerDropdown" class="collapse navbar-collapse">
      <ul
        class="navbar-nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0"
      >
        {{> includes/_header_item url="/" name="Home"}}
        {{> includes/_header_item url="/blogs" name="Blogs"}}
        {{> includes/_header_item url="/users" name="Users"}}
        {{> includes/_header_item url="/faq" name="FAQ"}}
        {{> includes/_header_item url="/about" name="About"}}
      </ul>
    </div>
  </div>
</header>
```

To reference the parameters in the partial `_header_item`, use the
`{{parameter}}`.

```hbs
<!-- src/views/partials/includes/_header_item.hbs -->
<li>
  {{#if (eq url page)}}
    <a href="{{url}}" class="nav-link px-2 active">{{name}}</a>
  {{else}}
    <a href="{{url}}" class="nav-link px-2">{{name}}</a>
  {{/if}}
</li>
```

More at [Handlebars Partial Parameters](https://handlebarsjs.com/guide/partials.html#partial-parameters).

## Helpers

Handlebars allows registering some custom JavaScript functions that can be used
in templates in order to process some logic or data. The most common use case is
to define a helper to compare two entities as we can see in the example above.

To define a helper, use the `helpers` option in the `app.engine` method.

```diff
  app.engine(
    "hbs",
    hbsEngine({
      partialsDir: [path.join(__dirname, "views", "partials")],
      extname: "hbs",
      defaultLayout: path.join(
        __dirname,
        "views",
        "partials",
        "layouts",
        "main.hbs"
      ),
      layoutsDir: path.join(__dirname, "views", "partials", "layouts"),
      helpers: {
+       eq: (a: any, b: any) => a === b,
+       uppercase: (str: string) => str.toUpperCase(),
+       lowercase: (str: string) => str.toLowerCase(),
+       capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
      },
    })
  );
```

To use the helper in the templates, use the `{{helperName a [...params]}}` syntax.

```hbs
<!-- src/views/partials/includes/_header_item.hbs -->
<li>
  {{#if (eq url page)}}
    <a href="{{url}}" class="nav-link px-2 active">{{name}}</a>
  {{else}}
    <a href="{{url}}" class="nav-link px-2">{{name}}</a>
  {{/if}}
</li>
```

More at [Handlebars Custom Helpers](https://handlebarsjs.com/guide/#custom-helpers).

## Loops

Sometimes, ExpressJS will return an array of elements into the view. Handlebars
provides a way to loop through the array and render the elements with the
`{{#each}}` block helper.

```ts
// src/routes/index.ts
  appRouter.get("/", async (req, res, next) => {
      const category = req.query.category as string;

      try {
        const topThreeViewedPosts = await getTopViewedPosts(3);
        const topFiveRecentPosts = await getRecentPosts(5);
        const topCategories = await getTopCategories(9);
        topCategories.unshift("latest");

        if (topCategories.length > 0 && !topCategories.includes(category)) {
          res.status(404);
          res.send("Category not found");

          return;
        }

        res.render("home", {
          page: "/",
          title: "Home",
          topThreeViewedPosts,
          topFiveRecentPosts,
          topCategories,
          categoryQuery: category,
        });
      } catch (error) {
        next(error);
      }
    }
  );
```

Here, we want to display `topCategories` as a navigation bar in our views
`home`. To loop through the `topCategories` array, we can use the `{{#each}}`

```hbs
<!-- src/views/pages/home.hbs -->
<div class="nav-scroller py-1 mb-3 border-bottom">
  <nav class="nav nav-underline justify-content-between">
    {{#each topCategories as |categoryItem|}}
      {{#if (eq categoryItem @root.categoryQuery)}}
        <a class="nav-link link-body-emphasis text-capitalize active" href="/?category={{categoryItem}}">{{categoryItem}}</a>
      {{else}}
        <a class="nav-link link-body-emphasis text-capitalize" href="/?category={{categoryItem}}">{{categoryItem}}</a>
      {{/if}}
    {{/each}}
  </nav>
</div>
```

The `{{#each topCategories as |categoryItem|}}` block helper will loop through
the `topCategories` array and assign each element to the `categoryItem` variable
in the block. The `{{categoryItem}}` will render the current element in the loop.

When we are looping throuugh the array, we cannot access the variable
`categoryQuery` directly because it is not in the scope of the loop. To access
the variable, we can use the `@root` keyword to gain access to the global scope.

More at [Handlebars #each](https://handlebarsjs.com/guide/builtin-helpers.html#each).

## Layouts

Layouts are the general structure of the HTML pages that are used to render the
HTML pages with different contents but some common structures like header,
footer, CSS links and JavaScript codes.

The layouts are stored in the `src/views/partials/layouts` directory.

### Basic layout

The basic layout is the main layout that is used to render all the pages in the
project.

```hbs
<!-- src/views/partials/layouts/_base.hbs -->
<html data-bs-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{#> title}}{{/title}} | ExWt</title>

    <link rel="stylesheet" href={{ manifest "main.css" }} />
    {{#> styles}}
    {{/styles}}


  </head>
  <body>
    {{> includes/_bootstrap_icon }}
    {{> includes/_header }}

    <main>
    {{#> body}}
    {{/body}}
    </main>

    {{> includes/_footer }}

    <script text="javascript" src={{manifest "vendors.js" }}></script>
    <script text="javascript" src={{manifest "runtime.js" }}></script>
    <script text="javascript" src={{manifest "main.js" }}></script>
    {{#> scripts}}
    {{/scripts}}

  </body>
</html>
```

To understand the syntax `{{> something}}`, please refer to the [Partials](#partials) section.

### Blocks

The layout can have some blocks that can be overridden by the views to render
the final HTML pages.

For example, the `body` block in the layout can be overridden by the views to
render the HTML page based on the content of the views. To extend the layout
in the views, the view must include the layout as a partial and override the
blocks with `inline` syntax.

```hbs
<!-- src/views/pages/home.hbs -->
{{#> layouts/_base}}

{{#*inline "title"}}
  Some title
  {{! or {{tile}} }}
{{/inline}}

{{#*inline "styles"}}
<!-- Extra CSS styles exclusive for the home page -->
<!-- <link rel="stylesheet" href="/css/home.css"> -->
{{/inline}}

{{#*inline "body"}}
Some content
{{/inline}}

{{#*inline "scripts"}}
<!-- Extra JavaScript import exclusive for the home page -->
<!-- <script src="/js/home.js"></script> -->
{{/inline}}

{{/layouts/_base}}
```

More at [Handlebars Inline Partials](https://handlebarsjs.com/guide/partials.html#inline-partials).

### Layout inheritance

Other layouts can also inherit the basic layout and extends the blocks to be
another layout with more specified structure, specifically for some pages.

For example, the `_blog.hbs` layout can inherit the `_base.hbs` layout, which is
used to render the blog pages.

```hbs
{{#> layouts/_base}}

{{#> title}}
{{title}}
{{/title}}

{{#*inline "styles"}}
<link rel="stylesheet" href="/css/blog.css" />
{{/inline}}

{{#> body}}
{{/body}}

{{#*inline "scripts"}}
{{/inline}}

{{/layouts/_base}}
```

Same as views, the `_blog` layout uses the inline syntax to override the blocks
that it wants to customize. For blocks that are not overridden now but will be
in the views, the layout will reference to its parent layout, like the
`{{#> body}}`.

### Main layout

The `main.hbs` layout is not specific to handlebars but more to the package
`express-handlebars`. The `main.hbs` layout is used as the default layout for
the package to dump all the rendered HTML content into it. However, the package
uses different rendering methods to render the views with the layouts. Therefore,
the `main.hbs` layout does not have any content in it besides `{{{body}}}` for
the package to render.

## Views

Views are used as the main temmplates for Express and Handlebars to render the
final HTML pages. The views are stored in the `src/views/pages` directory.

Combining with the folder structure and the app configurations, the views are
used with `express.Response.render()` method to render the complete HTML pages.

```ts
blogRouter.get("/", cachableMiddleware, (_req: Request, res: Response) => {
  // referring to the views/pages/blogs.hbs
  res.render("blogs", { title: "Blogs", page: "/blogs" });
});

blogRouter.get("/new", noCacheMiddleware, (req: Request, res: Response) => {
  // referring to the views/pages/blogs/new.hbs
  res.render("blogs/new", { title: "New blog" });
});
```

Thanks to the `express-handlebars` package, the `res.render()` method will
automatically use the handlebars engine to render the views with the layouts
and the data passed to the views.
