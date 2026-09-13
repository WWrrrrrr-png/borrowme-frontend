# BorrowMe Frontend

BorrowMe 백엔드 API와 연동되는 React 기반 클라이언트입니다. User·Helper·Admin 세 역할의 화면을 하나의 SPA로 제공합니다.

## 배포 주소
- `http://43.201.10.177/`
- Admin 전용: `http://43.201.10.177/admin/login` (다른 화면과 링크로 연결되지 않은 별도 진입점)

## 기술 스택

- React 19
- Vite
- React Router DOM 7
- Axios
- JavaScript(JSX) — TypeScript 미사용

## 프로젝트 구조

src
├─ api/ # auth, request, helper, matching, payment, admin
├─ context/ # AuthContext (로그인 상태 전역 관리)
├─ pages/ # Login, Signup, Main, RequestList/Create/Detail,
│ # HelperLogin/Signup/RequestList, MatchingList/Detail,
│ # PaymentReady/Approve/Detail, AdminLogin/RequestList, MyPage
├─ App.jsx # 라우팅 설정
└─ App.css # 전체 공통 디자인 시스템 


## 주요 기능

- **역할별 인증 화면**: User/Helper/Admin 로그인·회원가입을 분리된 라우트로 제공
- **역할 기반 라우트 보호**: `PrivateRoute`가 로그인 여부뿐 아니라 `role`까지 검사, 불일치 시 해당 역할의 로그인 페이지로 이동
- **도움 요청 CRUD 화면**: 등록/목록/상세(수정·삭제) 화면
- **헬퍼 요청 수락 화면**: 승인된 요청 조회 및 수락
- **매칭 상태 관리 화면**: 매칭 목록/상세, 상태 변경
- **카카오페이 결제 흐름**: 결제 준비 → 카카오 결제 → 승인 처리(자동 이동) → 결제 결과 화면
- **관리자 화면**: 요청 승인/거절, 결제 금액 입력/저장, 상태별 탭 필터, 카드 10개 단위 페이지네이션, 개별 항목 화면 숨김(DB 미반영, localStorage 기반)

## 인증 상태 관리

- 로그인 정보(`token`, `id`, `name`, `role`)는 `sessionStorage`에 저장 — 브라우저(탭)를 완전히 닫으면 자동 로그아웃되도록 의도적으로 선택
- `axiosInstance`의 request interceptor가 모든 요청에 `Authorization: Bearer {token}` 자동 첨부
- response interceptor가 401 응답을 받으면 저장소를 비우고, 현재 경로(`/admin`, `/helper`, 그 외)에 따라 알맞은 로그인 페이지로 이동

## 브라우저 히스토리 처리

- 로그인/회원가입 성공 시 `navigate(path, { replace: true })`로 이전 인증 화면이 히스토리에 남지 않도록 처리
- 로그아웃 시에도 호출한 쪽이 지정한 역할별 로그인 경로로 `replace` 이동
- 결제 완료 후에는 `useNavigationType()`으로 "뒤로가기/앞으로가기(POP)"로 진입했는지 판별해, 결제 준비·결제 결과 화면에 재진입하지 못하도록 처리
- 최초 방문 시 생기는 히스토리 흔적(예: 도메인 루트 방문)은 브라우저 표준상 삭제가 불가능한 영역으로, Admin은 URL을 직접 입력해 접근하는 것을 권장

## 개발 환경 실행

```bash
npm install
npm run dev
```

`.env.development`에 `VITE_API_BASE_URL=http://localhost:8888` 설정 필요 (Git에는 포함되지 않음)

## 배포 빌드

```bash
npm run build
```

`.env.production`(`VITE_API_BASE_URL=http://43.201.10.177`) 기준으로 빌드되며, 결과물(`dist/`)을 Nginx 정적 파일 경로로 전송하는 방식으로 배포합니다.

## 트러블슈팅

### 문제: 결제 완료 후 뒤로가기 시 결제 버튼이 다시 노출됨
**원인**: 카카오페이 결제는 외부 사이트로의 실제 브라우저 이동을 수반하여, 그 과정에서 생긴 히스토리 항목은 `replace`로도 제거할 수 없었음
**해결**: React Router의 `useNavigationType()`으로 POP(뒤로/앞으로가기) 진입을 감지해, 결제 관련 화면 자체를 렌더링하지 않고 메인으로 리다이렉트

### 문제: Admin이 루트(`/`) 진입 시 User용 화면이 보임
**원인**: 공용 메인 화면(`Main.jsx`)에 `ADMIN` role 분기가 없어 기본값(User 메뉴)으로 렌더링됨
**해결**: `Main.jsx` 최상단에서 `user.role === "ADMIN"`이면 `/admin/requests`로 즉시 리다이렉트

