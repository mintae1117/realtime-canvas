# Realtime Playground

다양한 실시간 협업 도구를 경험할 수 있는 웹 애플리케이션입니다.

**Live Demo**: [https://realtime-canvas-gray.vercel.app/](https://realtime-canvas-gray.vercel.app/)

---

## 프로젝트 목록

### 1. Realtime Canvas

실시간 협업 드로잉 캔버스

| 기능          | 설명                                     |
| ------------- | ---------------------------------------- |
| 실시간 협업   | 여러 사용자가 동시에 그림을 그릴 수 있음 |
| 드로잉 도구   | 펜, 지우개, 도형, 텍스트 등              |
| 이미지 업로드 | 캔버스에 이미지 추가 가능                |
| 방 생성/참여  | 고유 URL로 협업 공간 공유                |

**주요 컴포넌트**: `Canvas`, `Toolbar`, `UserList`, `ImageUpload`

---

### 2. Realtime Chat

실시간 채팅 애플리케이션

| 기능          | 설명                                    |
| ------------- | --------------------------------------- |
| 실시간 메시징 | Supabase Realtime 기반 즉시 메시지 전송 |
| 채팅방        | 다중 채팅방 생성 및 참여                |
| 사용자 목록   | 현재 접속 중인 사용자 표시              |

**주요 컴포넌트**: `ChatRoom`, `MessageList`, `MessageInput`, `ChatUserList`

---

### 3. Realtime Facetime

실시간 화상 통화 (WebRTC)

| 기능           | 설명                       |
| -------------- | -------------------------- |
| 화상 통화      | WebRTC 기반 P2P 영상 통화  |
| 음성/영상 제어 | 마이크, 카메라 on/off      |
| 다자간 통화    | 여러 명이 동시에 참여 가능 |

**주요 컴포넌트**: `FacetimeRoom`, `VideoGrid`, `FacetimeControls`

---

### 4. Realtime Monitoring

실시간 암호화폐 모니터링 대시보드

| 기능        | 설명                                    |
| ----------- | --------------------------------------- |
| 실시간 가격 | WebSocket으로 암호화폐 실시간 가격 수신 |
| 차트        | Chart.js 기반 실시간 가격 차트          |
| 통계        | 24시간 변동률, 거래량 등 표시           |

**데이터 소스**: Binance WebSocket API

**주요 컴포넌트**: `MonitoringDashboard`, `CryptoChart`, `CryptoStats`

---

### 5. Realtime Satellite (ISS Tracker)

국제우주정거장(ISS) 실시간 위치 추적

| 기능            | 설명                                      |
| --------------- | ----------------------------------------- |
| 실시간 추적     | ISS의 실시간 위치를 지도에 표시           |
| 실제 API 데이터 | Where The ISS At API 사용 (API 키 불필요) |
| 궤적 표시       | 위성의 이동 경로를 지도에 표시            |
| 상세 정보       | 위도, 경도, 고도, 속도, 가시성 등         |

**데이터 소스**: [Where The ISS At API](https://wheretheiss.at/w/developer)

**주요 컴포넌트**: `LocationDashboard`, `SatelliteMap`, `SatelliteInfo`

---

### 6. Realtime Location

실시간 위치 공유 애플리케이션

| 기능             | 설명                                        |
| ---------------- | ------------------------------------------- |
| 실시간 위치 공유 | 여러 사용자가 자신의 위치를 실시간으로 공유 |
| 위치 추적        | Geolocation API 기반 현재 위치 추적         |
| 방 시스템        | 고유 URL로 위치 공유 방 생성 및 참여        |
| 사용자 표시      | 지도에서 모든 참가자 위치를 실시간 표시     |

**주요 컴포넌트**: `LocationRoom`, `LocationMap`, `LocationControls`, `LocationRoomSetup`

---

## 기술 스택

### Frontend

| 기술         | 용도          |
| ------------ | ------------- |
| React 19     | UI 프레임워크 |
| TypeScript   | 타입 안전성   |
| Vite         | 빌드 도구     |
| Tailwind CSS | 스타일링      |

### 상태 관리 & 실시간

| 기술              | 용도                       |
| ----------------- | -------------------------- |
| Zustand           | 전역 상태 관리             |
| Supabase Realtime | Canvas, Chat 실시간 동기화 |
| WebRTC            | Facetime 화상 통화         |
| WebSocket         | Monitoring 실시간 데이터   |

### 라이브러리

| 기술          | 용도          |
| ------------- | ------------- |
| React Konva   | Canvas 드로잉 |
| React Leaflet | 지도 렌더링   |
| Chart.js      | 차트 시각화   |
| Framer Motion | 애니메이션    |

---

## 프로젝트 구조

```
src/
├── pages/                    # 페이지 컴포넌트
│   ├── HomePage.tsx
│   ├── RealtimeCanvas.tsx
│   ├── RealtimeChat.tsx
│   ├── RealtimeFacetime.tsx
│   ├── RealtimeMonitoring.tsx
│   ├── SatelliteLocation.tsx
│   └── RealtimeLocation.tsx
│
├── components/               # 기능별 컴포넌트
│   ├── layout/              # 공통 레이아웃
│   ├── realtimeCanvas/      # Canvas 관련
│   ├── realtimeChat/        # Chat 관련
│   ├── realtimeFacetime/    # Facetime 관련
│   ├── realtimeMonitoring/  # Monitoring 관련
│   ├── realtimeSatellite/   # Satellite 관련 (ISS 추적)
│   └── realtimeLocation/    # Location 관련 (위치 공유)
│
├── hooks/                    # 커스텀 훅
├── store/                    # Zustand 스토어
└── lib/                      # 유틸리티
```

---
