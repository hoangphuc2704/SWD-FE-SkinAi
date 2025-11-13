# Routine API DTO Schema (Draft)

This document consolidates the input DTOs for Routine, Routine Step, Routine Instance, and Routine Progress based on current FE API wrappers and your provided specs. Where Swagger isn’t available in-repo, constraints are inferred and noted as assumptions.

- Base URL: `${VITE_API_URL}` or `http://localhost:8080`
- Content-Type: `application/json`
- Auth: Bearer token (if provided in localStorage: `accessToken`).

## 1. Routine

### 1.1 Create Routine (RoutineCreateDto)

- Endpoint: POST `/api/routines`
- Body fields:
  - userId: string (UUID), required — ID người dùng
  - analysisId: string (UUID) | null, optional — ID phân tích AI
  - description: string, optional — Mô tả routine
  - parentRoutineId: string (UUID) | null, optional — Routine cha
  - status: string, optional — enum: `active`, `inactive` (assumed)
- Example:

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "analysisId": "550e8400-e29b-41d4-a716-446655440001",
  "description": "Quy trình chăm sóc da hàng ngày",
  "parentRoutineId": null,
  "status": "active"
}
```

- Validation notes:
  - userId must be a valid UUID v4.
  - status recommended enum: `active` | `inactive`.
  - parentRoutineId nullable; if provided, must reference existing routine.

### 1.2 Update Routine (RoutineUpdateDto)

- Endpoint: PUT `/api/routines/{id}`
- Body fields (all optional):
  - description: string — Mô tả mới
  - status: string — enum: `active`, `paused`, `completed` (assumed)
- Example:

```json
{
  "description": "Quy trình chăm sóc da buổi tối",
  "status": "paused"
}
```

- Validation notes:
  - status must be one of `active` | `paused` | `completed`.

### 1.3 Read/Delete

- GET `/api/routines` — List all (admin)
- GET `/api/routines/user/{userId}` — List by user
- GET `/api/routines/{id}` — Get by id
- DELETE `/api/routines/{id}` — Delete

## 2. Routine Step

### 2.1 Create Step (RoutineStepCreateDto)

- Endpoint: POST `/api/routine-steps`
- Body fields:
  - routineId: string (UUID), required
  - stepOrder: integer, required — Thứ tự (>= 1)
  - instruction: string, optional — Hướng dẫn
  - timeOfDay: string, optional — enum: `morning`, `evening` (assumed)
  - frequency: string, optional — enum: `daily`, `weekly`, ... (assumed)
- Example:

```json
{
  "routineId": "550e8400-e29b-41d4-a716-446655440000",
  "stepOrder": 1,
  "instruction": "Rửa mặt bằng nước dịu nhẹ",
  "timeOfDay": "morning",
  "frequency": "daily"
}
```

- Validation notes:
  - stepOrder is positive integer and unique within a routine (assumed).

### 2.2 Update Step (RoutineStepUpdateDto)

- Endpoint: PUT `/api/routine-steps/{id}`
- Body fields (all optional):
  - stepOrder: integer
  - instruction: string
  - timeOfDay: string
  - frequency: string
- Example:

```json
{
  "stepOrder": 2,
  "instruction": "Thoa toner trên toàn mặt",
  "timeOfDay": "morning",
  "frequency": "daily"
}
```

### 2.3 Read/Delete

- GET `/api/routine-steps/routine/{routineId}` — List steps by routine
- GET `/api/routine-steps/{id}` — Get step by id
- GET `/api/routine-steps` — List all (admin)
- DELETE `/api/routine-steps/{id}` — Delete

## 3. Routine Instance

### 3.1 Create Instance (RoutineInstanceCreateDto)

- Endpoint: POST `/api/routine-instances`
- Body fields:
  - routineId: string (UUID), required
  - userId: string (UUID), required
  - startDate: string (date, `YYYY-MM-DD`), required
  - endDate: string (date, `YYYY-MM-DD`) | null, optional
  - status: string, optional — enum: `in_progress`, `completed`, `paused` (assumed)
- Example:

```json
{
  "routineId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440002",
  "startDate": "2025-10-30",
  "endDate": "2025-12-30",
  "status": "in_progress"
}
```

- Validation notes:
  - startDate ≤ endDate if endDate provided.
  - status lifecycle: `in_progress` → `completed` | `paused` (assumed).

### 3.2 Update Instance (RoutineInstanceUpdateDto)

- Endpoint: PUT `/api/routine-instances/{id}`
- Body fields (all optional):
  - endDate: string (date, `YYYY-MM-DD`) | null
  - status: string — enum: `in_progress`, `completed`, `paused`
- Example:

```json
{
  "endDate": "2025-11-30",
  "status": "completed"
}
```

### 3.3 Read/Delete

- GET `/api/routine-instances/user/{userId}` — List instances by user
- GET `/api/routine-instances/routine/{routineId}` — List instances by routine (if available)
- GET `/api/routine-instances/{id}` — Get by id
- DELETE `/api/routine-instances/{id}` — Delete

## 4. Routine Progress

### 4.1 Create Progress (RoutineProgressCreateDto)

- Endpoint: POST `/api/routine-progress`
- Body fields:
  - instanceId: string (UUID), required
  - stepId: string (UUID), required
  - completedAt: string (ISO 8601 datetime), required
  - photoUrl: string (url), optional
  - note: string, optional
  - status: string, optional — enum: `completed`, `skipped` (assumed)
- Example:

```json
{
  "instanceId": "550e8400-e29b-41d4-a716-446655440003",
  "stepId": "550e8400-e29b-41d4-a716-446655440004",
  "completedAt": "2025-10-30T08:30:00Z",
  "photoUrl": "https://example.com/photo.jpg",
  "note": "Da mặt cảm thấy mềm mại",
  "status": "completed"
}
```

- Validation notes:
  - completedAt must be a valid ISO 8601 timestamp.
  - stepId must belong to the routine associated with instanceId (assumed).

### 4.2 Update Progress (RoutineProgressUpdateDto)

- Endpoint: PUT `/api/routine-progress/{id}`
- Body fields (all optional):
  - completedAt: string (ISO 8601)
  - photoUrl: string (url)
  - note: string
  - status: string — enum: `completed`, `skipped`
- Example:

```json
{
  "completedAt": "2025-10-30T09:00:00Z",
  "photoUrl": "https://example.com/updated_photo.jpg",
  "note": "Da sạch và tươi sáng",
  "status": "completed"
}
```

### 4.3 Read/Delete

- GET `/api/routine-progress/instance/{instanceId}` — List by instance
- GET `/api/routine-progress/{id}` — Get by id
- GET `/api/routine-progress` — List all (admin)
- DELETE `/api/routine-progress/{id}` — Delete

## 5. Feedback (liên quan routine/step)

- POST `/api/feedbacks` — create
- GET `/api/feedbacks/routine/{routineId}` — list by routine
- GET `/api/feedbacks/step/{stepId}` — list by step
- Other CRUD per `feedbackApi.js`

## 6. Relationships

- Routine —< RoutineStep —< RoutineInstance —< RoutineProgress
  - Một Routine gồm nhiều Step.
  - User bắt đầu Routine → tạo Routine Instance.
  - Mỗi Instance có nhiều Progress (theo ngày/tuần…).
  - Feedback có thể gắn với Routine hoặc Step.

## 7. Key validation rules (summary)

- Create Routine: only `userId` required.
- Create Routine Instance: `routineId`, `userId`, `startDate` required.
- Create Routine Progress: `instanceId`, `stepId`, `completedAt` required.

> Note: Enum values and some constraints are inferred from FE usage and your description. If Swagger is available elsewhere, we can cross-verify and update this draft to the exact contract.
