
## Data Models

### User
- id: string (unique identifier)
- email: string
- password: string (hashed)
- name: string
- preferences: object

### Household
- id: string
- name: string
- ownerId: string (references User)
- members: array of User ids

### Manual
- id: string
- title: string
- description: string
- categories: array of strings
- tags: array of strings
- uploadDate: date
- fileUrl: string
- fileType: string
- extractedText: string (from OCR)
- householdId: string

### MaintenanceTask
- id: string
- title: string
- description: string
- relatedManualIds: array of Manual ids
- schedule: object (frequency, next date)
- notificationSettings: object
- completionHistory: array of dates
- assignedTo: array of User ids
- householdId: string

### CustomDocument
- id: string
- title: string
- content: string (rich text)
- categories: array of strings
- tags: array of strings
- lastModified: date
- createdBy: User id
- householdId: string
