# Backend API Specification

To connect the React frontend to your backend, implement the following endpoints. 
Base URL configuration can be changed in `constants.ts`.

## Security
All secured endpoints expect the header:
`Authorization: Bearer <jwt_token>`

## 1. Authentication

### Login
*   **Endpoint:** `POST /api/v1/auth/login`
*   **Body:** `{ "email": "string", "password": "string" }`
*   **Response:**
    ```json
    {
      "token": "jwt_token_string",
      "user": {
        "id": "uuid",
        "name": "string",
        "email": "string",
        "role": "admin|student|faculty"
      }
    }
    ```

## 2. Dashboard

### Get Statistics
*   **Endpoint:** `GET /api/v1/dashboard/stats`

## 3. Students

### Get Student List
*   **Endpoint:** `GET /api/v1/students`
*   **Response:** List of students with `permissions` object.

### Create Student (Admin Only)
*   **Endpoint:** `POST /api/v1/students`
*   **Body:** `{ "name": "string", "email": "string" }`

### Update Permissions (Admin Only)
*   **Endpoint:** `PUT /api/v1/students/:id/permissions`
*   **Body:** `{ "canRead": boolean, "canWrite": boolean }`

## 4. Gallery (New)

### Get Gallery Items
*   **Endpoint:** `GET /api/v1/gallery`

### Interact (Like/Dislike)
*   **Endpoint:** `POST /api/v1/gallery/:id/interact`
*   **Body:** `{ "type": "like" | "dislike" }`

### Add Comment
*   **Endpoint:** `POST /api/v1/gallery/:id/comment`
*   **Body:** `{ "text": "string", "user": "string" }`
