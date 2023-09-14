# Trainix

Trainix is a fitness tracking app built with Typescript based technologies to help its users to be consistent with their training and help them perceive a sensation of progress.

## Packages

The app is composed by 2 different packages, the `api` package and the `web` package (in the future, the idea is to be composed by 3, being this third package a mobile app).

## API

### Description

This package store the backend of the application. As it's name suggest, the backend is built following the API REST structural pattern.

The core technologies used to develop this package are 4.

- Typescript
- Express
- Prisma
- Effect

Typescript has been the selected technology to develop this application, using Express framework in convination to provide external access through HTTP. Also, Prisma is the ORM used to perform database interactions. The interesting point with this API, is that it uses a functional programming library called [Effect](https://effect.website/).

The idea behind Effect is to bring a way to isolate side effects, so in that way you can work in a safer and cleaner way. The beneficts os using this library, is that side effects are more controllable and well defined, so the code is much more trustable.

### Architecture

The backend root folder is divided in 4 folders.

    .
    ├── containers       # Docker files containing database images
    ├── prisma           # Schema files, seeds and primsa migrations
    ├── src              # Source code
    ├── test             # Tests files
