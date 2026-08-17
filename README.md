# Nuvia — Frontend

Nuvia is a social network in the spirit of X (formerly Twitter), where users can share posts with images, comment on posts, like them, and interact with other people's profiles. Built as a university project to practice building a full-featured, real-world social platform from scratch.

**Live demo:** [https://nuvia-coral.vercel.app/](https://nuvia-coral.vercel.app/)

This repository contains the **frontend** of Nuvia. It is a single-page application built with Angular that consumes a REST API built with NestJS (see the [backend repository](#) for details).

## Features

- User registration and login
- Create and view posts (with image support)
- Like posts
- Comment on posts
- Main feed
- User profiles

There are currently no additional features planned for this project.

## Tech Stack

- **Angular 21** — application framework
- **Bootstrap** — UI styling and layout
- **RxJS** — reactive state and async data handling
- **JWT** — authentication tokens, handled through:
  - **Route Guards** — protect authenticated routes
  - **HTTP Interceptors** — automatically attach the JWT to outgoing requests

## Architecture Notes

Authentication is handled entirely on the client via JWT. Guards prevent unauthorized navigation to protected routes, and interceptors take care of injecting the token into every outgoing HTTP request to the backend API, keeping components free of authentication boilerplate.

## Getting Started

### Prerequisites

- Node.js and npm installed
- The [Nuvia backend](#) running (or reachable) for the app to function correctly

### Installation

```bash
npm install
```

### Run the development server

```bash
ng serve
```

The app will be available at `http://localhost:4200/` by default.

> No `.env` file is required for the frontend.

## License

This project is free to use without restrictions.

## Author

**Federico Frediani Baldi**
