알겠습니다. `server/routes_backup_docs.md` 파일에 제가 직접 변경 사항을 적용하는 데 어려움이 있으니, 요청하신 내용을 한국어 버전과 영어 버전으로 정리하여 여기에 바로 제공해 드리겠습니다.

---

### **한국어 버전 (Korean Version)**

# 서버 디렉토리 구조 및 개발 가이드라인

이 문서는 `server` 디렉토리의 현재 구조와 주요 구성 요소를 설명하고, 백엔드 개발 시 개발자가 따라야 할 가이드라인을 제공합니다.

## 1. 디렉토리 개요

`server` 디렉토리는 각각 특정 기능을 담당하는 몇 가지 주요 하위 디렉토리로 구성됩니다:

-   `api/`: FastAPI 애플리케이션의 API 라우트와 Pydantic 스키마를 포함합니다.
    -   `routes/`: API 엔드포인트(예: `/users`, `/assets`, `/search`)를 정의합니다.
    -   `schemas/`: API 요청 및 응답을 위한 데이터 유효성 검사 및 직렬화 스키마를 정의합니다.
-   `config/`: 애플리케이션의 구성 설정을 저장합니다.
-   `core/`: 데이터베이스 연결, Firebase 통합 및 유틸리티 함수와 같은 핵심 기능을 포함합니다.
    -   `database.py`: 데이터베이스 세션 및 연결을 관리합니다.
    -   `firebase.py`: Firebase Admin SDK를 초기화하고 관리합니다.
    -   `firebase_auth.py`: Firebase 인증 로직(예: 토큰 검증)을 포함합니다.
    -   `search_engine.py`: 검색 로직을 구현합니다.
    -   `services/`: 비즈니스 로직 서비스(예: 추천 로직)를 포함합니다.
    -   `utils/`: 일반 유틸리티 함수를 포함합니다.
-   `models/`: 데이터베이스 테이블을 나타내는 SQLAlchemy ORM 모델을 정의합니다.
-   `recommender/`: 모델 추론 및 슬레이트 생성과 같은 추천 시스템 관련 구성 요소를 포함합니다.
-   `tests/`: 백엔드를 위한 단위 및 통합 테스트를 포함합니다.

## 2. 주요 구성 요소 및 역할

### 2.1. API 라우트 (`server/api/routes/`)

이 파일들은 프론트엔드에서 접근할 수 있는 다양한 API 엔드포인트를 정의합니다. 각 파일은 일반적으로 주요 리소스 또는 기능에 해당합니다.

-   `asset.py`: 콘텐츠 자산(예: 자산 상세 정보, 배우, 감독, 태그, 점수 검색) 관련 작업을 처리합니다.
-   `recommendation_test.py`: 추천을 위한 테스트 엔드포인트를 제공합니다.
-   `recommendations.py`: 주요 추천 엔드포인트(예: `/top`, `/emotion`, `/recent`)를 정의합니다.
-   `search.py`: 콘텐츠 검색 기능을 구현합니다.
-   `user.py`: 사용자 관련 작업(등록 및 인증 포함)을 관리합니다 (`/users`, `/users/auth/register`, `/users/auth/me`).

**더 이상 사용되지 않는 라우트에 대한 참고:** 다음 파일들은 이전에 존재했지만 제거되었습니다:
-   `log.py`: 로깅 기능은 다른 라우터에 직접 통합되거나, 필요한 경우 별도의 로깅 서비스에서 처리될 수 있습니다.
-   `mas_recommendation.py`: 이 파일은 실험적인 버전이었으며 제거되었습니다.

### 2.2. 데이터베이스 모델 (`server/models/`)

SQLAlchemy ORM 모델은 데이터베이스 테이블의 구조를 정의하고 데이터베이스와 상호 작용하는 객체 지향적인 방법을 제공합니다.

-   `asset.py`: `Asset` 모델 및 관련 모델(예: `ActorAsset`, `DirectorAsset`, `TagAsset`, `Score`)을 정의합니다.
-   `user.py`: `User` 모델을 정의합니다.
-   `log.py`: (이전에) 로깅 관련 모델을 정의했습니다. 로깅이 필요한 경우, 모델은 여기에 정의되어야 합니다.
-   `base.py`: SQLAlchemy 모델을 위한 선언적 베이스를 포함합니다.

### 2.3. 핵심 기능 (`server/core/`)

이 디렉토리에는 필수적이고 재사용 가능한 구성 요소가 포함되어 있습니다.

-   `database.py`:
    -   `get_db()`: FastAPI 라우트에 데이터베이스 세션을 제공하기 위한 의존성 주입 함수입니다.
    -   `init_db()`: 데이터베이스 연결을 초기화하고 테이블을 생성합니다(존재하지 않는 경우).
-   `firebase.py`:
    -   `init_firebase()`: Firebase Admin SDK를 초기화합니다.
-   `firebase_auth.py`:
    -   `verify_firebase_token()`: 수신 요청에서 Firebase ID 토큰의 유효성을 검사하기 위해 API 라우트에서 사용되는 의존성 함수입니다.
-   `search_engine.py`: (구현된 경우) 검색 엔진의 핵심 로직을 포함합니다.
-   `services/recommendation.py`: (구현된 경우) API 라우팅과 별도로 고급 추천 알고리즘을 위한 비즈니스 로직을 포함합니다.

## 3. 개발 가이드라인

`server` 디렉토리에 새로운 기능을 추가하거나 기존 기능을 수정할 때 다음 가이드라인을 따르십시오:

1.  **API 라우트:**
    *   새로운 API 엔드포인트는 도메인에 따라 `server/api/routes/` 내의 전용 파일에 정의되어야 합니다(예: `new_feature.py`).
    *   모든 요청 본문 및 응답 모델에 대해 `server/api/schemas/`에 적절한 Pydantic 스키마가 정의되어 데이터 유효성 검사를 보장해야 합니다.
    *   데이터베이스 상호 작용을 위해 라우트 함수 내에서 `Depends(get_db)`를 사용하여 데이터베이스 세션을 얻으십시오.
    *   인증이 필요한 라우트의 경우, `Depends(verify_firebase_token)`를 사용하여 사용자가 인증되었는지 및 권한이 있는지 확인하십시오.

2.  **데이터베이스 상호 작용:**
    *   모든 데이터베이스 테이블 정의는 `server/models/`에 있어야 합니다.
    *   모든 데이터베이스 작업에 SQLAlchemy ORM을 사용하십시오. 절대적으로 필요하고 정당화되는 경우가 아니면 원시 SQL 쿼리를 피하십시오.
    *   데이터베이스와 상호 작용하는 코드에서 적절한 오류 처리(예외 발생 시 `db.rollback()`을 사용한 `try-except-finally`)를 보장하십시오.

3.  **비즈니스 로직:**
    *   복잡한 비즈니스 로직(예: 추천 알고리즘, 데이터 처리)은 API 라우트 함수에 직접 넣지 말고, `server/core/services/` 또는 `server/recommender/` 내의 서비스 모듈에 캡슐화해야 합니다. 이는 재사용성과 테스트 용이성을 향상시킵니다.

4.  **구성:**
    *   모든 민감한 정보 및 환경별 설정은 `server/config/settings.py` 또는 환경 변수를 사용하여 관리해야 합니다.

5.  **Firebase 통합:**
    *   Firebase 초기화는 `server/core/firebase.py`에서 처리됩니다. 다른 곳에서 Firebase를 다시 초기화하는 것을 피하십시오.
    *   백엔드 Firebase 인증의 경우 `verify_firebase_token` 의존성을 사용하십시오.

6.  **테스트:**
    *   새로운 기능 및 버그 수정에 대한 단위 및 통합 테스트를 `server/tests/` 디렉토리에 작성하여 코드 품질을 보장하고 회귀를 방지하십시오.

이러한 구조와 가이드라인을 준수함으로써 깨끗하고 확장 가능하며 이해하기 쉬운 백엔드 코드베이스를 유지할 수 있습니다.

---

### **영어 버전 (English Version)**

# Server Directory Structure and Development Guidelines

This document outlines the current structure of the `server` directory, its key components, and provides guidelines for developers working on the backend.

## 1. Directory Overview

The `server` directory is organized into several key subdirectories, each responsible for specific functionalities:

-   `api/`: Contains the FastAPI application's API routes and Pydantic schemas.
    -   `routes/`: Defines the API endpoints (e.g., `/users`, `/assets`, `/search`).
    -   `schemas/`: Defines data validation and serialization schemas for API requests and responses.
-   `config/`: Stores configuration settings for the application.
-   `core/`: Houses core functionalities like database connection, Firebase integration, and utility functions.
    -   `database.py`: Manages the database session and connection.
    -   `firebase.py`: Initializes and manages Firebase services.
    -   `firebase_auth.py`: Contains Firebase authentication logic (e.g., token verification).
    -   `search_engine.py`: Implements search logic.
    -   `services/`: Contains business logic services (e.g., recommendation logic).
    -   `utils/`: General utility functions.
-   `models/`: Defines SQLAlchemy ORM models, representing the database tables.
-   `recommender/`: Contains components related to the recommendation system, such as model inference and slate generation.
-   `tests/`: Holds unit and integration tests for the backend.

## 2. Key Components and Their Roles

### 2.1. API Routes (`server/api/routes/`)

These files define the various API endpoints accessible by the frontend. Each file typically corresponds to a major resource or feature.

-   `asset.py`: Handles operations related to content assets (e.g., retrieving asset details, actors, directors, tags, scores).
-   `recommendation_test.py`: Provides test endpoints for recommendations.
-   `recommendations.py`: Defines the main recommendation endpoints (e.g., `/top`, `/emotion`, `/recent`).
-   `search.py`: Implements search functionality for content.
-   `user.py`: Manages user-related operations, including registration and authentication (`/users`, `/users/auth/register`, `/users/auth/me`).

**Note on deprecated routes:** The following files were previously present but have been removed:
-   `image.py`: Functionality for images is now handled within `asset.py` or directly by static file serving if applicable.
-   `log.py`: Logging functionality might be integrated directly into other routers or handled by a separate logging service if needed.
-   `mas_recommendation.py`: This was an experimental version and has been removed.

### 2.2. Database Models (`server/models/`)

SQLAlchemy ORM models define the structure of your database tables and provide an object-oriented way to interact with the database.

-   `asset.py`: Defines the `Asset` model and related models (e.g., `ActorAsset`, `DirectorAsset`, `TagAsset`, `Score`).
-   `user.py`: Defines the `User` model.
-   `log.py`: (Previously) Defined logging-related models. If logging is needed, its models should be defined here.
-   `base.py`: Contains the declarative base for SQLAlchemy models.

### 2.3. Core Functionalities (`server/core/`)

This directory contains essential, reusable components.

-   `database.py`:
    -   `get_db()`: Dependency injection function to provide a database session to FastAPI routes.
    -   `init_db()`: Initializes the database connection and creates tables (if not exists).
-   `firebase.py`:
    -   `init_firebase()`: Initializes the Firebase Admin SDK.
-   `firebase_auth.py`:
    -   `verify_firebase_token()`: A dependency function used by API routes to validate Firebase ID tokens from incoming requests.
-   `search_engine.py`: (If implemented) Contains the core logic for the search engine.
-   `services/recommendation.py`: (If implemented) Contains the business logic for advanced recommendation algorithms, separate from the API routing.

## 3. Guidelines for Development

When adding new features or modifying existing ones in the `server` directory, please follow these guidelines:

1.  **API Routes:**
    *   New API endpoints should be defined in a dedicated file within `server/api/routes/` based on their domain (e.g., `new_feature.py`).
    *   Ensure proper Pydantic schemas are defined in `server/api/schemas/` for all request bodies and response models to ensure data validation.
    *   Use `Depends(get_db)` to obtain a database session within your route functions for database interactions.
    *   For authenticated routes, use `Depends(verify_firebase_token)` to ensure the user is authenticated and authorized.

2.  **Database Interactions:**
    *   All database table definitions should reside in `server/models/`.
    *   Use SQLAlchemy ORM for all database operations. Avoid raw SQL queries unless absolutely necessary and justified.
    *   Ensure proper error handling (`try-except-finally` with `db.rollback()` on exceptions) in database-interacting code.

3.  **Business Logic:**
    *   Complex business logic (e.g., recommendation algorithms, data processing) should be encapsulated in service modules within `server/core/services/` or `server/recommender/`, rather than directly in API route functions. This promotes reusability and testability.

4.  **Configuration:**
    *   All sensitive information and environment-specific settings should be managed in `server/config/settings.py` or using environment variables.

5.  **Firebase Integration:**
    *   Firebase initialization is handled in `server/core/firebase.py`. Avoid re-initializing Firebase elsewhere.
    *   For backend Firebase authentication, use the `verify_firebase_token` dependency.

6.  **Testing:**
    *   Write unit and integration tests for new features and bug fixes in the `server/tests/` directory to ensure code quality and prevent regressions.

By adhering to this structure and guidelines, we can maintain a clean, scalable, and understandable backend codebase.