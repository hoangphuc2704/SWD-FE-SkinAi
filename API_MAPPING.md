# 📋 API Mapping - Skincare System

## ✅ Tổng quan các API đã nối

### 📁 Cấu trúc thư mục `src/apis/`

```
src/apis/
├── index.js                    # Export tất cả API modules
├── authAPi.js                  # ✅ Đã có - Authentication
├── userApi.js                  # ✅ Đã có - User management
├── imageAPi.js                 # ✅ Đã có - Image upload
├── questionApi.js              # ✨ MỚI - Questions
├── userAnswerApi.js            # ✨ MỚI - User Answers
├── symptomApi.js               # ✨ MỚI - Symptoms
├── consentApi.js               # ✨ MỚI - Consent Records
├── routineApi.js               # ✨ MỚI - Routines
├── routineStepApi.js           # ✨ MỚI - Routine Steps
├── routineInstanceApi.js       # ✨ MỚI - Routine Instances
├── routineProgressApi.js       # ✨ MỚI - Routine Progress
├── feedbackApi.js              # ✨ MỚI - Feedbacks
├── chatApi.js                  # ✨ MỚI - Chat Sessions & Messages
├── aiApi.js                    # ✨ MỚI - AI Analysis & Responses
├── ruleApi.js                  # ✨ MỚI - Rules & Rule Conditions
├── medicalDocumentApi.js       # ✨ MỚI - Medical Documents
└── documentChunkApi.js         # ✨ MỚI - Document Chunks
```

---

## 1️⃣ Giai đoạn 1: Khởi tạo & Xác thực (Auth & Initial Setup)

### 🔐 Authentication - `authAPi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Đăng nhập/Đăng ký với Google | `POST /api/auth/providers/google/token` | `loginWithGoogle(data)` |

### 👤 User Management - `userApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Lấy thông tin user hiện tại | `GET /api/users/me` | `getProfile()` |
| Tạo user mới | `POST /api/users` | `createUser(userData)` |
| Cập nhật profile | `PUT /api/users/id` | `updateProfile()` |
| Lấy danh sách users | `GET /api/users` | `getUsers(pageNumber, pageSize)` |

### ❓ Questions - `questionApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Lấy tất cả câu hỏi | `GET /api/Questions` | `getAllQuestions()` |
| Tạo câu hỏi (Admin) | `POST /api/Questions` | `createQuestion(questionData)` |
| Cập nhật câu hỏi (Admin) | `PUT /api/Questions/{id}` | `updateQuestion(id, questionData)` |
| Xóa câu hỏi (Admin) | `DELETE /api/Questions/{id}` | `deleteQuestion(id)` |

### 📝 User Answers - `userAnswerApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Gửi câu trả lời | `POST /api/UserAnswers` | `createUserAnswer(answerData)` |
| Lấy câu trả lời theo user | `GET /api/UserAnswers/user/{userId}` | `getUserAnswersByUserId(userId)` |
| Cập nhật câu trả lời | `PUT /api/UserAnswers/{id}` | `updateUserAnswer(id, answerData)` |
| Xóa câu trả lời | `DELETE /api/UserAnswers/{id}` | `deleteUserAnswer(id)` |

### 🩺 Symptoms - `symptomApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Báo cáo triệu chứng | `POST /api/user-symptoms` | `createUserSymptom(symptomData)` |
| Lấy tất cả triệu chứng | `GET /api/symptoms` | `getAllSymptoms()` |
| Lấy triệu chứng theo user | `GET /api/user-symptoms/user/{userId}` | `getUserSymptomsByUserId(userId)` |
| Tạo triệu chứng (Admin) | `POST /api/symptoms` | `createSymptom(symptomData)` |
| Cập nhật triệu chứng (Admin) | `PUT /api/symptoms/{id}` | `updateSymptom(id, symptomData)` |
| Xóa triệu chứng (Admin) | `DELETE /api/symptoms/{id}` | `deleteSymptom(id)` |

### ✅ Consent Records - `consentApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Ghi nhận đồng ý | `POST /api/ConsentRecords` | `createConsentRecord(consentData)` |
| Lấy consent theo user | `GET /api/ConsentRecords/user/{userId}` | `getConsentRecordsByUserId(userId)` |
| Lấy tất cả consent (Admin) | `GET /api/ConsentRecords` | `getAllConsentRecords()` |

---

## 2️⃣ Giai đoạn 2: Tiếp nhận & Bắt đầu Quy trình (Routine Selection & Instance)

### 📋 Routines - `routineApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Lấy routines theo user | `GET /api/routines/user/{userId}` | `getRoutinesByUserId(userId)` |
| Lấy tất cả routines | `GET /api/routines` | `getAllRoutines()` |
| Lấy routine theo ID | `GET /api/routines/{routineId}` | `getRoutineById(routineId)` |
| Tạo routine (Admin) | `POST /api/routines` | `createRoutine(routineData)` |
| Cập nhật routine (Admin) | `PUT /api/routines/{id}` | `updateRoutine(id, routineData)` |
| Xóa routine (Admin) | `DELETE /api/routines/{id}` | `deleteRoutine(id)` |

### 📝 Routine Steps - `routineStepApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Lấy các bước của routine | `GET /api/routine-steps/routine/{routineId}` | `getRoutineStepsByRoutineId(routineId)` |
| Lấy tất cả steps | `GET /api/routine-steps` | `getAllRoutineSteps()` |
| Lấy step theo ID | `GET /api/routine-steps/{stepId}` | `getRoutineStepById(stepId)` |
| Tạo step (Admin) | `POST /api/routine-steps` | `createRoutineStep(stepData)` |
| Cập nhật step (Admin) | `PUT /api/routine-steps/{id}` | `updateRoutineStep(id, stepData)` |
| Xóa step (Admin) | `DELETE /api/routine-steps/{id}` | `deleteRoutineStep(id)` |

### 🎯 Routine Instances - `routineInstanceApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Bắt đầu routine | `POST /api/routine-instances` | `createRoutineInstance(instanceData)` |
| Lấy instances theo user | `GET /api/routine-instances/user/{userId}` | `getRoutineInstancesByUserId(userId)` |
| Lấy instance theo ID | `GET /api/routine-instances/{instanceId}` | `getRoutineInstanceById(instanceId)` |
| Cập nhật instance | `PUT /api/routine-instances/{id}` | `updateRoutineInstance(id, instanceData)` |
| Xóa instance | `DELETE /api/routine-instances/{id}` | `deleteRoutineInstance(id)` |

---

## 3️⃣ Giai đoạn 3: Theo dõi & Ghi nhận Tiến trình (Routine Progress & Feedback)

### 📊 Routine Progress - `routineProgressApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Ghi nhận tiến trình | `POST /api/routine-progress` | `createRoutineProgress(progressData)` |
| Lấy tiến trình theo instance | `GET /api/routine-progress/instance/{instanceId}` | `getRoutineProgressByInstanceId(instanceId)` |
| Lấy tất cả tiến trình | `GET /api/routine-progress` | `getAllRoutineProgress()` |
| Cập nhật tiến trình | `PUT /api/routine-progress/{id}` | `updateRoutineProgress(id, progressData)` |
| Xóa tiến trình | `DELETE /api/routine-progress/{id}` | `deleteRoutineProgress(id)` |

### 💬 Feedbacks - `feedbackApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Gửi phản hồi | `POST /api/feedbacks` | `createFeedback(feedbackData)` |
| Lấy feedback theo user | `GET /api/feedbacks/user/{userId}` | `getFeedbacksByUserId(userId)` |
| Lấy tất cả feedbacks (Admin) | `GET /api/feedbacks` | `getAllFeedbacks()` |
| Lấy feedback theo ID | `GET /api/feedbacks/{feedbackId}` | `getFeedbackById(feedbackId)` |
| Cập nhật feedback | `PUT /api/feedbacks/{id}` | `updateFeedback(id, feedbackData)` |
| Xóa feedback | `DELETE /api/feedbacks/{id}` | `deleteFeedback(id)` |

---

## 4️⃣ Giai đoạn 4: Tương tác & Phân tích (AI & Chat)

### 💬 Chat - `chatApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Tạo chat session | `POST /api/chat/sessions` | `createChatSession(sessionData)` |
| Lấy sessions theo user | `GET /api/chat/sessions/user/{userId}` | `getChatSessionsByUserId(userId)` |
| Lấy session theo ID | `GET /api/chat/sessions/{sessionId}` | `getChatSessionById(sessionId)` |
| Gửi tin nhắn | `POST /api/chat/sessions/{sessionId}/messages` | `createChatMessage(sessionId, messageData)` |
| Lấy messages theo session | `GET /api/chat/sessions/{sessionId}/messages` | `getMessagesBySessionId(sessionId)` |
| Cập nhật session | `PUT /api/chat/sessions/{sessionId}` | `updateChatSession(sessionId, sessionData)` |
| Xóa session | `DELETE /api/chat/sessions/{sessionId}` | `deleteChatSession(sessionId)` |

### 🤖 AI Analysis - `aiApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Phân tích AI | `POST /api/ai/analysis` | `createAIAnalysis(analysisData)` |
| Lấy analysis theo ID | `GET /api/ai/analysis/{analysisId}` | `getAIAnalysisById(analysisId)` |
| Lấy analyses theo user | `GET /api/ai/analysis/user/{userId}` | `getAIAnalysesByUserId(userId)` |
| Tạo AI response | `POST /api/ai/responses` | `createAIResponse(responseData)` |
| Lấy response theo ID | `GET /api/ai/responses/{responseId}` | `getAIResponseById(responseId)` |
| Lấy responses theo analysis | `GET /api/ai/responses/analysis/{analysisId}` | `getAIResponsesByAnalysisId(analysisId)` |
| Xóa analysis | `DELETE /api/ai/analysis/{analysisId}` | `deleteAIAnalysis(analysisId)` |
| Xóa response | `DELETE /api/ai/responses/{responseId}` | `deleteAIResponse(responseId)` |

---

## 5️⃣ Quản lý Dữ liệu Lõi và Hệ thống (Admin & System APIs)

### ⚙️ Rules - `ruleApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Lấy tất cả rules | `GET /api/rules` | `getAllRules()` |
| Lấy rule theo ID | `GET /api/rules/{ruleId}` | `getRuleById(ruleId)` |
| Tạo rule (Admin) | `POST /api/rules` | `createRule(ruleData)` |
| Cập nhật rule (Admin) | `PUT /api/rules/{id}` | `updateRule(id, ruleData)` |
| Xóa rule (Admin) | `DELETE /api/rules/{id}` | `deleteRule(id)` |
| Lấy tất cả conditions | `GET /api/rule-conditions` | `getAllRuleConditions()` |
| Lấy conditions theo rule | `GET /api/rule-conditions/rule/{ruleId}` | `getRuleConditionsByRuleId(ruleId)` |
| Tạo condition (Admin) | `POST /api/rule-conditions` | `createRuleCondition(conditionData)` |
| Cập nhật condition (Admin) | `PUT /api/rule-conditions/{id}` | `updateRuleCondition(id, conditionData)` |
| Xóa condition (Admin) | `DELETE /api/rule-conditions/{id}` | `deleteRuleCondition(id)` |

### 📚 Medical Documents - `medicalDocumentApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Lấy tất cả documents | `GET /api/MedicalDocuments` | `getAllMedicalDocuments()` |
| Lấy document theo ID | `GET /api/MedicalDocuments/{documentId}` | `getMedicalDocumentById(documentId)` |
| Tạo document (Admin) | `POST /api/MedicalDocuments` | `createMedicalDocument(documentData)` |
| Cập nhật document (Admin) | `PUT /api/MedicalDocuments/{id}` | `updateMedicalDocument(id, documentData)` |
| Xóa document (Admin) | `DELETE /api/MedicalDocuments/{id}` | `deleteMedicalDocument(id)` |

### 📄 Document Chunks - `documentChunkApi.js`
| Mục đích | API Endpoint | Function |
|----------|-------------|----------|
| Lấy tất cả chunks | `GET /api/DocumentChunks` | `getAllDocumentChunks()` |
| Lấy chunks theo document | `GET /api/DocumentChunks/document/{documentId}` | `getDocumentChunksByDocumentId(documentId)` |
| Lấy chunk theo ID | `GET /api/DocumentChunks/{chunkId}` | `getDocumentChunkById(chunkId)` |
| Tạo chunk (Admin) | `POST /api/DocumentChunks` | `createDocumentChunk(chunkData)` |
| Cập nhật chunk (Admin) | `PUT /api/DocumentChunks/{id}` | `updateDocumentChunk(id, chunkData)` |
| Xóa chunk (Admin) | `DELETE /api/DocumentChunks/{id}` | `deleteDocumentChunk(id)` |

---

## 📖 Cách sử dụng

### Import từng module riêng lẻ:
```javascript
import { getAllQuestions, createQuestion } from '../apis/questionApi';
import { createChatSession, createChatMessage } from '../apis/chatApi';
import { createAIAnalysis } from '../apis/aiApi';
```

### Hoặc import tất cả từ index:
```javascript
import { questionApi, chatApi, aiApi } from '../apis';

// Sử dụng
questionApi.getAllQuestions();
chatApi.createChatSession(data);
aiApi.createAIAnalysis(data);
```

---

## ✅ Checklist hoàn thành

- [x] **Giai đoạn 1**: Auth, Users, Questions, UserAnswers, Symptoms, Consent
- [x] **Giai đoạn 2**: Routines, RoutineSteps, RoutineInstances
- [x] **Giai đoạn 3**: RoutineProgress, Feedbacks
- [x] **Giai đoạn 4**: Chat, AI Analysis
- [x] **Admin & System**: Rules, MedicalDocuments, DocumentChunks
- [x] **File index.js** để export tất cả modules

---

**Tổng cộng: 17 file API** (3 file cũ + 14 file mới)

