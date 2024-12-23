# expressts-webpack-template

An ExpressJS + TypeScript + Webpack template

## Ideas

This template provides a starting point for building a web server with
ExpressJS. The main focus is to provide a structure that supports JavaScript
and CSS bundling with Webpack, which is essential for modern web development but
often overlooked in ExpressJS applications. While ExpressJS is a powerful web
engine in the NodeJS world, Webpack is a powerful module bundler for front-end
assets. This templates aims to combine the two technologies to create a full-
stack web application that is ready for production.

## Features

- [x] ExpressJS: Core engine for serving web applications
- [x] TypeScript: Strongly typed language for JavaScript development
- [x] Webpack: Module bundler for front-end assets
- [x] Nodemon: Monitor for any changes and hot-reload the server during development
- [x] Dotenv: Environment variable loader for the application
- [x] Handlebars: Templating engine for ExpressJS
- [x] Bootstrap: Front-end framework for responsive design
- [x] jQuery: JavaScript library for DOM manipulation
- [x] Favicons and meta tags: SEO optimization for the application
- [x] Responsive design: Mobile-first design for the application
- [ ] Winston + Morgan: Logging for the application and HTTP monitoring
- [ ] ESLint: Linter for TypeScript
- [ ] Prettier: Code formatter for TypeScript
- [ ] Husky: Git hooks for linting and formatting before commits
- [ ] Jest: Testing framework for TypeScript
- [ ] Supertest: HTTP assertions for testing ExpressJS routes
- [ ] Docker: Containerization for the application
- [ ] GitHub Actions: CI/CD pipeline for the application

## Getting Started

1. Clone the repository

    ```bash
    git clone https://github.com/richardnguyen99/expressts-webpack-template
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Start the development servePro
r

    ```bash
    npm run dev
    ```

4. Build the application

    ```bash
    npm run build
    ```

    The build will be in the `dist` directory.

5. Start the production server

    ```bash
    npm start
    ```

The application will be running on `http://localhost:3000`.

## More examples

- [ ] [expressts-typeorm-template](#): An extension of this template with TypeORM for database integration
- [ ] [expressts-sequelize-template](#): An extension of this template with Sequelize for database integration
- [ ] [expressts-mongoose-template](#): An extension of this template with Mongoose for database integration
- [ ] [expressts-prisma-template](#): An extension of this template with Prisma for database integration
- [ ] [expressts-passport-template](#): An extension of this template with Passport for authentication integration
- [ ] [expressts-oauth2-template](#): An extension of this template with OAuth2 for authentication integration
- [ ] [expressts-file-uploading-template](#): An extension of this template with file uploading pattern
- [ ] [expressts-s3-template](#): An extension of this template with S3 for file storage integration
- [ ] [expressts-hls-template](#): An extension of this template with HLS for video streaming

## Credits

- [Bootstrap Examples](https://getbootstrap.com/docs/5.3/examples/): For the layout, design and  components

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
