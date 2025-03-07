# Project Documentation

## Project Overview

This project is a "template" designed to provide a starting point for new software development projects. It includes a basic structure and common configurations that can be customized to fit the specific needs of your project. The template aims to streamline the initial setup process, allowing developers to focus on implementing core functionality rather than spending time on boilerplate code. Specifically, this template provides a model for creating a new app with a modern self-hosted software suite, including both frontend and backend components with a database.

## Features

- **Full-Stack Template**: Provides a model for both frontend and backend development, including database integration.

## Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express, TypeScript, WebSocket
- **Database**: Prisma, PostgreSQL (or any other supported database)
- **Deployment**: Docker (Dockerfile and Docker Compose)

## Additional Resources

This project uses the following resources created by individuals:

* [Full Calendar for Shadcn UI](https://github.com/dninomiya/full-calendar-for-shadcn-ui) - Used as a base for the calendar, with modifications. 
  - I have implemented a complete translation system, a full event creation, editing, and deletion system, all in direct communication with the backend via WebSocket.

## Getting Started

1. **Clone the Repository**: Start by cloning the template repository to your local machine.
2. **Install Dependencies**: Run the appropriate command to install project dependencies (e.g., `npm install` for Node.js projects).
3. **Customize Configuration**: Update configuration files to match your project's requirements.
4. **Start Development**: Begin adding your own code and features to the project.

## TODO

- **Mobile Development**: Work on the mobile part of the project to ensure compatibility and functionality across mobile devices.
- **Event Creation on Mobile**: Implement functionality to create an event by long-pressing on a time slot.

## Contributing

If you would like to contribute to this template, please follow the standard GitHub workflow:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with clear and concise messages.
4. Push your changes to your forked repository.
5. Submit a pull request to the main repository.

## License

This project is licensed under the MIT License. Note that the license may change at any time. See the `LICENSE` file for more details.
