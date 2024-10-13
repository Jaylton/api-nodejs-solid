# GymPass Style App

This project is a GymPass-style application built with Node.js, following SOLID principles. It uses Fastify as the web framework and Prisma as the ORM, with PostgreSQL for data persistence.

## Features

### Functional Requirements (RFs)
- **User Registration**: Users can register in the app.
- **Authentication**: Users can authenticate using email and password.
- **Profile Management**: Users can retrieve their profile information.
- **Check-in Count**: Users can see how many check-ins they have performed.
- **Check-in History**: Users can view their entire check-in history.
- **Nearby Gyms**: Users can search for gyms near their location.
- **Gym Search**: Users can search for gyms by name.
- **Gym Check-in**: Users can check-in at a gym.
- **Check-in Validation**: Admins can validate user check-ins.
- **Gym Registration**: Admins can register gyms.

### Business Rules (RNs)
- **Unique Email**: Users cannot register with a duplicate email.
- **Single Daily Check-in**: Users cannot check-in more than once per day at the same gym.
- **Proximity Check-in**: Users can only check-in at a gym if they are within 100 meters of the gym.
- **Check-in Validation Time**: A check-in can only be validated within 20 minutes of its creation.
- **Admin Validation**: Only administrators can validate check-ins.
- **Admin Gym Registration**: Only administrators can register new gyms.

### Non-Functional Requirements (NFRs)
- **Password Encryption**: User passwords are securely encrypted.
- **PostgreSQL Database**: Application data is stored in a PostgreSQL database.
- **Pagination**: All data lists are paginated, with 20 items per page.
- **JWT Authentication**: Users are authenticated via JSON Web Tokens (JWT).

## Technology Stack

- **Node.js**: JavaScript runtime.
- **Fastify**: Web framework for building APIs.
- **Prisma**: ORM used for database management.
- **PostgreSQL**: Relational database.
- **JWT**: Token-based authentication.
- **SOLID Principles**: Ensures the maintainability and scalability of the codebase.
  
## Setup

### Prerequisites
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Jaylton/api-nodejs-solid.git
    cd api-nodejs-solid
    ```

2. Install dependencies:
    ```bash
    npm install
    ```
    
3. Set up docker container:
    ```bash
    docker-composer up --build -d
    ```

4. Set up the environment variables:
    Create a `.env` file at the root of the project and define the following variables:
    ```bash
    DATABASE_URL=postgresql://docker:docker@localhost:5432/apisolid?schema=public
    JWT_SECRET=your_jwt_secret
    ```

5. Run database migrations:
    ```bash
    npx prisma migrate dev
    ```

6. Start the application:
    ```bash
    npm run start:dev
    ```

### Running Tests

- Run unit tests:
    ```bash
    npm run test
    ```

- Run end-to-end (E2E) tests:
    ```bash
    npm run test:e2e
    ```

## API Endpoints

### User Endpoints
- `POST /users`: Register a new user.
- `POST /sessions`: Authenticate a user and return a JWT.
- `GET /me`: Retrieve the profile of the logged-in user.
- `GET /gyms/metrics`: Get the count of check-ins performed by the logged-in user.
- `GET /gyms/history`: Get the check-in history of the logged-in user.

### Gym Endpoints
- `GET /gyms/nearby`: Search for nearby gyms based on the user’s location.
- `GET /gyms/search`: Search for gyms by name.
- `POST /gyms`: Register a new gym (admin only).

### Check-in Endpoints
- `POST /gyms/:gymId/check-in`: Check-in at a gym.
- `PATCH /check-ins/:checkInId/validate`: Validate a user's check-in (admin only).

## License

This project is licensed under the MIT License.
