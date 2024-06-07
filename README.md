# OneFrame Project

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Screens and Pages](#screens-and-pages)
  - [Landing Page](#landing-page)
  - [Authentication Page](#authentication-page)
  - [Logged-in Pages](#logged-in-pages)
    - [Home Page](#home-page)
    - [User Page](#user-page)
    - [Album Page](#album-page)
    - [Photo Page](#photo-page)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

OneFrame is a web application designed to manage and display user albums and photos. The application allows users to log in using popular authentication providers and view, edit, and manage their albums and photos.

## Features

- **Landing Page:** Provides a brief explanation of the application's purpose.
- **User Authentication:** Supports Google authentication providers.
- **User Management:** Lists all users and their albums.
- **Album Management:** Displays and manages albums and photos.
- **Photo Management:** Allows users to view and edit photo details.

## Screens and Pages

### Landing Page

Accessible to all visitors, the landing page offers a brief explanation of what OneFrame does and how it can be beneficial for managing user albums and photos.

### Authentication Page

The authentication page allows users to log in using Google, Facebook, or GitHub. Authentication sessions are maintained within the application. You can choose to combine this page with the landing page.

### Logged-in Pages

#### Home Page

- Lists all users.
- Displays the number of albums each user has.
- Runs GET requests to fetch users and albums data.

#### User Page

- Shows detailed information about a selected user.
- Lists the albums of the selected user.
- Runs GET requests to fetch the selected user's data and their albums.

#### Album Page

- Displays information about a selected album.
- Lists photos in the selected album.
- Runs GET requests to fetch the selected album and its photos.

#### Photo Page

- Displays a single photo.
- Allows users to edit the title of the photo.
  - Sends a PATCH/PUT request to update the photo's title.
- Runs a GET request to fetch the photo details.

## Installation

To get started with OneFrame, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/MarsMwau/ONEFRAME
   cd oneframe
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables for your authentication providers.

4. Start the development server:
   ```bash
   npm start
   ```

## Usage

After installing and starting the development server, you can access the application in your web browser at `http://localhost:3000`.

- Visit the landing page to learn about the application.
- Log in using your preferred authentication provider.
- Explore the users, albums, and photos by navigating through the different pages.

## Technologies Used

- **Frontend:** React, Material-UI
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** Google
- **Other:** bcrypt, JWT

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push them to your fork.
4. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License.

## Contact

For any questions or inquiries, please contact [marthamumbua16@gmail.com](mailto:marthamumbua16@gmail.com).

---

Thank you for using OneFrame! We hope it helps you manage your albums and photos effectively.