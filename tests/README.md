# API Unit Tests for AppliStash

This directory contains comprehensive unit tests for all API routes in the AppliStash application.

## Test Structure

```
tests/
├── api/
│   ├── application.test.ts    # Application API comprehensive testing (18 tests)
│   ├── contact.test.ts        # Contact API comprehensive testing (19 tests)
│   └── interview.test.ts      # Interview API comprehensive testing (18 tests)
├── utils/
│   └── test-helpers.ts       # Shared test utilities
├── setup.ts                  # Jest configuration
└── API_TESTING_GUIDE.md      # Detailed testing documentation
```

## Test Coverage Summary

**Total Tests: 55 ✅ (All Passing)**

The test suite focuses on data validation, business logic, and API structure validation rather than complex mocking, providing reliable and fast test execution.

### Application API Tests (`application.test.ts`) - 18 Tests

**Data Structure Validation:**

- ✅ Application field validation and required field checking
- ✅ Status validation (`applied`, `interviewing`, `rejected`, `offered`)
- ✅ Priority levels validation (`low`, `medium`, `high`)

**Business Logic:**

- ✅ Application date format validation (ISO format)
- ✅ Status transition validation (workflow rules)
- ✅ Search query processing and sanitization

**API Endpoints:**

- ✅ GET endpoint response structure validation
- ✅ POST endpoint request validation
- ✅ PUT endpoint request validation
- ✅ DELETE endpoint request validation

**Advanced Features:**

- ✅ Multi-field search functionality
- ✅ Error handling scenarios
- ✅ Edge case validation

### Contact API Tests (`contact.test.ts`) - 19 Tests

**Data Structure Validation:**

- ✅ Contact field validation and required fields
- ✅ Email format validation (regex patterns)
- ✅ Phone number validation
- ✅ Company information validation

**Business Logic:**

- ✅ Email uniqueness constraints
- ✅ Contact relationship management
- ✅ Search functionality across multiple fields

**API Endpoints:**

- ✅ GET endpoint with search parameters
- ✅ POST endpoint with validation
- ✅ PUT endpoint updates
- ✅ DELETE endpoint functionality

**Advanced Features:**

- ✅ Special character handling in searches
- ✅ Case-insensitive search operations
- ✅ Multi-field OR search conditions

### Interview API Tests (`interview.test.ts`) - 18 Tests

**Data Structure Validation:**

- ✅ Interview type validation (`phone`, `video`, `in-person`, `technical`, `behavioral`)
- ✅ Schedule date format validation
- ✅ Application relationship validation
- ✅ Status and outcome validation

**Business Logic:**

- ✅ Interview scheduling constraints
- ✅ Calendar integration logic
- ✅ Timezone handling
- ✅ Application linking validation

**API Endpoints:**

- ✅ GET endpoint with search and filtering
- ✅ POST endpoint with application linking
- ✅ PUT endpoint for updates
- ✅ DELETE endpoint functionality

**Advanced Features:**

- ✅ Feedback structure validation
- ✅ Date/time manipulation
- ✅ Cross-entity search capabilities

## Installation & Setup

### 1. Install Dependencies

```bash
pnpm install
```

The following testing dependencies are included:

- `jest` - Testing framework (v29.7.0)
- `@testing-library/jest-dom` - DOM testing utilities (v6.8.0)
- `@testing-library/react` - React component testing (v14.3.1)
- `@types/jest` - TypeScript support for Jest (v29.5.14)
- `jest-environment-jsdom` - Browser-like testing environment (v29.7.0)

### 2. Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage report
pnpm test:coverage

# Run only API tests
pnpm test:api

# Run specific test file
pnpm test tests/api/application.test.ts
pnpm test tests/api/contact.test.ts
pnpm test tests/api/interview.test.ts
```

### 3. Test Configuration

The tests are configured with:

- **Environment**: `jsdom` for browser-like testing
- **Focus**: Data validation and business logic testing
- **Coverage**: API structure, data validation, and business rules
- **Execution**: Fast and reliable (55 tests in ~0.5 seconds)
- **Approach**: Clean testing without complex API mocking

## Testing Strategy

### Clean Testing Approach

This test suite uses a **clean testing approach** that focuses on data validation and business logic rather than complex API mocking. This provides several benefits:

1. **Fast Execution**: No complex framework mocking means tests run quickly
2. **Reliable Results**: No flaky mocks or timing issues
3. **Clear Focus**: Pure business logic and data validation testing
4. **Easy Maintenance**: Simple test structure and debugging

### Test Scenarios Covered

#### � Data Validation Tests

- **Field Validation**: Required fields, data types, format validation
- **Business Rules**: Status transitions, workflow constraints
- **Input Sanitization**: Special characters, SQL injection prevention
- **Edge Cases**: Boundary conditions, invalid inputs

#### � API Structure Tests

- **Request Validation**: Parameter validation, body structure
- **Response Structure**: Expected data formats and fields
- **Error Handling**: Proper error responses and status codes
- **Search Functionality**: Query processing and result formatting

#### � Business Logic Tests

- **Application Workflows**: Status management, priority handling
- **Contact Management**: Email validation, relationship handling
- **Interview Scheduling**: Date validation, application linking
- **Search Operations**: Multi-field search, case handling

## Key Features

### Comprehensive Validation

- **Data Structure Validation**: Ensures all API data structures are correctly formatted
- **Required Field Checking**: Validates that all mandatory fields are present
- **Type Safety**: TypeScript integration ensures type correctness
- **Format Validation**: Email patterns, date formats, enum values

### Business Rule Testing

- **Status Workflows**: Application status transitions (applied → interviewing → offered/rejected)
- **Constraint Validation**: Scheduling constraints, relationship integrity
- **Search Logic**: Multi-field search with proper query handling
- **Data Relationships**: Contact-to-company, interview-to-application linking

### Error Handling

- **Input Validation**: Comprehensive validation of all input parameters
- **Edge Case Coverage**: Boundary conditions, null/undefined values
- **Error Response Structure**: Consistent error message formatting
- **Graceful Degradation**: Proper handling of missing or invalid data

## Development Workflow

### Running Tests During Development

```bash
# Watch mode for active development
pnpm test:watch

# Quick API validation
pnpm test:api

# Coverage check before commits
pnpm test:coverage
```

### Test-Driven Development

1. Write tests for new API functionality first
2. Implement the API logic to pass the tests
3. Refactor while keeping tests green
4. Validate coverage and edge cases

## Documentation

For detailed testing information, see:

- **[API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)** - Comprehensive testing documentation
- **Test files** - Each test file contains detailed descriptions and examples

## Performance

- **Execution Time**: ~0.5 seconds for all 55 tests
- **Memory Usage**: Minimal memory footprint due to clean testing approach
- **CI/CD Ready**: Fast and reliable for continuous integration
- **Parallel Execution**: Tests can run in parallel without conflicts
