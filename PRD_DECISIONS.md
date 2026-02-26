# PRD Decisions

> Canonical file: `PRD_DECISIONS.md`
> Scope: Sections 26~30 (Open Questions/ADR/Prompt/Checklist/Changelog)
> Current frozen baseline: **v1.96-doc** (2026-02-25)
> Implementation status: **not started** (문서 기준선 확정 단계)

## 26. Open Questions (지속 확장용)

> 목적: 아직 확정되지 않은 항목을 한 곳에 모아, 구현 중 혼선을 줄인다.

상태 정의:
- `open`: 논의 시작 전
- `in_review`: 옵션 비교 중
- `decided`: 결정 완료
- `deferred`: 다음 버전으로 이관
- `blocked`: 외부 의존으로 보류

운영 규칙:
- 새 아이디어는 반드시 `Open Questions`에 먼저 등록한다.
- `decided`가 되면 27장(ADR Lite)에 결정 기록을 남긴다.
- 결정된 항목은 구현 스펙(14~41장)에 반영하고, 본 항목 상태를 `decided`로 변경한다.
- `deferred` 항목은 `PRD_POST_MVP_BACKLOG.md`로 이관해 실행 단위로 관리한다.

질문 백로그 템플릿:

| id | status | topic | question | options | default(candidate) | owner | dueDate | impactArea | adrId | sourceSections |
|---|---|---|---|---|---|---|---|---|---|---|
| Q-001 | decided | hint | 힌트 일일 제한/광고 충전 정책 | 무제한 / 일일 N / 일일 N+광고 충전 | 일일 3 + 광고 충전(일일 5) | PM | 2026-03-01 | BM, UX | ADR-063 | 15.7, 38.1.6 |
| Q-002 | decided | sync | 세션 보관 개수를 200으로 고정할 것인가? | 100 / 200 / 500 | 200 | BE | 2026-03-01 | Sync, Cost | ADR-044 | 19.10 |
| Q-003 | decided | ads | 완료 직후 인터스티셜 최소 쿨다운 | 3판 / 5판 / 10분 | 5판 | Monetization | 2026-03-01 | Ads, Retention | ADR-033 | 13.10.5, 8.1 |
| Q-004 | decided | generator | clue 제거에서 대칭 제거를 기본 ON으로 고정할 것인가? | ON 고정 / ON 기본+설정 변경 / OFF 기본 | ON 기본+설정 변경 | Game | 2026-03-03 | Puzzle Quality, UX | ADR-030 | 4.1.1, 18.3, 22.4 |
| Q-005 | decided | input | Digit-First에서 가능 셀 약한 강조를 기본 활성화할 것인가? | ON / OFF / 난이도별 차등 | ON | UX | 2026-03-03 | Input Speed, Clarity | ADR-031 | 4.4, 13.8.9 |
| Q-006 | decided | gameplay | 남은 숫자 1개 자동완성을 기본 활성화할 것인가? | ON / OFF | OFF | PM | 2026-03-03 | Difficulty, Fairness | ADR-034 | 4.5 |
| Q-007 | decided | monetization | 프리미엄에 고급 통계 확장을 포함할 것인가? | 광고 제거만 / 고급 통계 포함 / 별도 SKU | 광고 제거만 | Monetization | 2026-03-05 | BM, Retention | ADR-021 | 5.3, 8.2, 22.2 |
| Q-008 | decided | gameplay | 충돌 처리 기본값을 표시만 할지, 입력 차단까지 할지 결정 | 표시만 / 차단 / 모드별 | 표시만 | Game | 2026-03-03 | UX, Difficulty | ADR-045 | 13.8.7, 20.2.2, 21.8 |
| Q-009 | decided | ui | 남은 개수 배지를 기본 노출할 것인가? | ON / OFF | ON | UX | 2026-03-03 | Readability, Speed | ADR-035 | 13.9.3 |
| Q-010 | decided | ui | Erase 롱프레스(후보 하나씩 제거)를 MVP에 포함할 것인가? | 포함 / 제외 | 제외 | FE | 2026-03-06 | Complexity, UX | ADR-036 | 13.9.7 |
| Q-011 | decided | input | Redo를 MVP UI에서 노출할 것인가? | 숨김 / 노출 / 설정에서 활성화 | 숨김 | PM | 2026-03-02 | Scope, UX | ADR-002 | 3.3, 13.9.8, 21.2 |
| Q-012 | decided | mode | 실패 모드(실수 제한)를 MVP에 포함할 것인가? | 제외 / 설정 옵션 / 챌린지 전용 | 설정 옵션 | PM | 2026-03-05 | Retention, Difficulty | ADR-037 | 13.10.3, 13.10.6, 21.1 |
| Q-013 | decided | social | Completed 화면 Share 버튼을 MVP에 포함할 것인가? | 포함 / 제외(1.1) | 제외(1.1) | PM | 2026-03-06 | Growth, Scope | ADR-038 | 13.10.5, 22.2 |
| Q-014 | deferred | learn | LearnHub 검색을 MVP에 포함할 것인가? | 포함 / 제외 / 로컬 필터만 | 제외 | Learn | 2026-03-07 | Learn UX, Scope | ADR-024 | 42.2.1 (B-001), 22.2 |
| Q-015 | deferred | tutor | `candidate_keep` 하이라이트 타입을 MVP에서 지원할 것인가? | 지원 / 미지원 | 미지원 | Engine | 2026-03-07 | Tutor Clarity, Dev Cost | ADR-024 | 42.2.2 (B-002), 17.1, 22.2 |
| Q-016 | decided | generator | 생성 타임아웃 시 난이도 1단계 완화 fallback을 허용할 것인가? | 허용 / 비허용 | 허용 | Engine | 2026-03-05 | Generation Success, Difficulty Trust | ADR-046 | 18.5.3, 24.1 |
| Q-017 | decided | daily | Daily 리더보드를 MVP에 포함할 것인가? | 제외 / 읽기 전용 / 전체 포함 | 제외 | PM | 2026-03-08 | Backend Cost, Retention | ADR-047 | 3.3, 19.6 |
| Q-018 | decided | validation | `VALIDATE_BOARD()` 이벤트를 MVP 엔진에 포함할 것인가? | 포함 / 제외 / debug-only | 제외 | Game | 2026-03-06 | Engine Complexity | ADR-048 | 21.2, 21.8 |
| Q-019 | decided | performance | 저사양 기기 후보 렌더링 간소화를 자동 모드로 켤 것인가? | 수동 설정만 / 자동만 / 자동+수동 | 자동+수동 | FE | 2026-03-08 | FPS, Accessibility | ADR-049 | 25.7 |
| Q-020 | decided | auth | MVP 로그인 정책을 로그인 필수로 고정할 것인가? | Apple+Google(로그인 필수) / Apple only(iOS) + Google(Android)(로그인 필수) / Guest 병행(폐기) | Apple+Google(로그인 필수) | BE | 2026-03-05 | Auth, Compliance | ADR-026 | 19.2, 22.1.F |
| Q-021 | decided | accessibility | 색약 모드의 보조 신호 조합을 무엇으로 고정할 것인가? | 보더+아이콘 / 보더+패턴 / 아이콘+패턴 | 보더+아이콘 | UX | 2026-03-10 | Accessibility, Visual Clarity | ADR-012 | 31.2 |
| Q-022 | decided | accessibility | Dynamic Type 상한을 1.4로 고정할 것인가? | 1.4 / 1.6 / 디바이스 기본 전체 허용 | 1.4 | FE | 2026-03-10 | Accessibility, Layout Stability | ADR-013 | 31.4 |
| Q-023 | decided | accessibility | 스크린리더에서 빈 칸 후보 안내 수준을 어떻게 할 것인가? | 후보 개수만 / 후보 전체 읽기 / 설정 토글 제공 | 설정 토글 제공 | UX | 2026-03-10 | Accessibility, Cognitive Load | ADR-014 | 31.5 |
| Q-024 | decided | sync | sync pending 상태를 어디까지 노출할 것인가? | 배지 전용 / 배너 전용 / 배지+Settings 상세 | 배지+Settings 상세 | BE | 2026-03-11 | Sync UX, Noise Control | ADR-003 | 32.2 |
| Q-025 | decided | recovery | 손상 복구용 autosave 스냅샷 개수를 몇 개로 유지할 것인가? | 3 / 5 / 10 | 3 | BE | 2026-03-11 | Storage, Recovery Reliability | ADR-015 | 32.5 |
| Q-026 | decided | performance | 리렌더 임계값 위반 시 개발 프로세스 대응을 어떻게 할 것인가? | warning only / PR 차단 / release 차단 | release 차단 | FE | 2026-03-09 | Perf Governance | ADR-004 | 33.2, 33.4 |
| Q-027 | decided | performance | 저사양 기준 기기 목록을 어떤 방식으로 고정할 것인가? | 글로벌 고정 1세트 / 플랫폼별 2기기 / 지역별 다중 세트 | 플랫폼별 2기기 | QA | 2026-03-12 | Perf Test Consistency | ADR-018 | 33.3 |
| Q-028 | decided | qa | 난이도별 사전 표본 수를 100으로 유지할 것인가? | 100 / 150 / 난이도 가중(예: Evil 200) | 100 | QA | 2026-03-12 | Puzzle Quality, Schedule | ADR-019 | 34.1 |
| Q-029 | decided | qa | 베타 게이트 임계값을 현재 수치로 고정할 것인가? | 현행 유지 / 10% 완화 / 단계적 강화 | 현행 유지 | PM | 2026-03-13 | Release Risk | ADR-020 | 34.3 |
| Q-030 | decided | architecture | 모듈 경계 위반을 자동 검증할 것인가? | 수동 리뷰 / lint 규칙 / lint+CI 차단 | lint+CI 차단 | FE | 2026-03-11 | Architecture Integrity | ADR-016 | 35.2, 35.4 |
| Q-031 | decided | observability | prod 트레이스 샘플링 비율을 얼마로 둘 것인가? | 5% / 10% / 20% | 10% | BE | 2026-03-11 | Cost, Debuggability | ADR-005 | 36.1 |
| Q-032 | decided | observability | hotfix 트리거 임계값(24h 동일 errorCode)을 얼마로 둘 것인가? | 30건 / 50건 / 100건 | 50건 | PM | 2026-03-11 | Incident Response | ADR-017 | 36.4 |
| Q-033 | decided | onboarding | 첫 게임 기본 난이도를 Medium으로 고정할 것인가? | Easy / Medium / 사용자 성향 기반 | Medium | UX | 2026-03-12 | First Session Completion | ADR-006 | 37.1 |
| Q-034 | decided | onboarding | 미니 가이드(30초)를 건너뛴 사용자에게 재노출할 것인가? | 재노출 안 함 / 다음 실행 1회 재노출 / 3세션 후 재노출 | 다음 실행 1회 재노출 | PM | 2026-03-12 | Onboarding Completion | ADR-022 | 37.1, 37.4 |
| Q-035 | decided | onboarding | 온보딩 Skip 시 기본 프리셋을 무엇으로 둘 것인가? | Classic / Speed / 첫 20탭 행동 기반 추론 | Classic | UX | 2026-03-12 | Default Experience | ADR-023 | 37.2, 37.4 |
| Q-036 | decided | data | Firestore events 보존 기간을 몇 일로 고정할 것인가? | 30일 / 90일 / 180일 | 90일 | BE | 2026-03-14 | Storage Cost, Analytics Depth | ADR-007 | 39.1.5, 39.4 |
| Q-037 | decided | ux-copy | 카피 키의 영어 기본값(en)도 MVP에서 같이 관리할 것인가? | ko only / ko+en / 외부 번역툴 연동 | ko+en | UX | 2026-03-14 | Localization, QA | ADR-008 | 40.2, 40.4 |
| Q-038 | decided | navigation | iOS 스와이프 백을 게임 중 전면 비활성으로 고정할 것인가? | 전면 비활성 / paused에서만 허용 / 전면 허용 | 전면 비활성 | FE | 2026-03-14 | UX Safety, Platform Convention | ADR-009 | 41.3 |
| Q-039 | decided | ux | loading/empty 문구를 브랜드 톤으로 1차 확정할 것인가? | 기본 문구 유지 / 브랜드 톤 개편 | 기본 문구 유지 | PM | 2026-03-15 | UX Consistency | ADR-010 | 41.4, 40.2 |
| Q-040 | decided | accessibility | 스크린리더 변수 읽기 순서를 locale별로 분기할 것인가? | 고정 순서 / locale 분기 | locale 분기 | Accessibility | 2026-03-15 | Accessibility, Localization | ADR-011 | 31.5, 40.4 |
| Q-041 | decided | sync | Cloud Sync 백엔드를 Firebase(Auth+Firestore)로 고정할 것인가? | Firebase / Supabase / provider-agnostic 추상화 유지 | Firebase | BE | 2026-03-16 | Sync, Delivery, Cost | ADR-025 | 7.1, 19.1, 19.3.2, 39.1 |
| Q-042 | decided | sync | Cloud Sync 사용자 토글(ON/OFF)을 MVP에서 제공할 것인가? | 제공(ON/OFF) / 미제공(항상 ON) | 미제공(항상 ON) | PM | 2026-03-16 | Sync UX, Data Integrity | ADR-027 | 7.1, 20.2.8 |
| Q-043 | decided | stack | Expo/RN 버전 정책을 `latest` 추종으로 둘 것인가? | latest 추종 / 킥오프 시점 안정 버전 고정 / pre-release 선반영 | 킥오프 시점 안정 버전 고정 | FE | 2026-03-16 | Build Stability, Delivery | ADR-028 | 12.1, 38.2.1 |
| Q-044 | decided | monetization | 초기 수익화 KPI를 보수적 최소 기준으로 고정할 것인가? | ARPDAU+IAP $0.01 / IAP 0.3% / Rewarded 10% | 고정 | PM | 2026-03-17 | KPI, BM | ADR-029 | 1.2 |
| Q-045 | decided | gameplay | 자동 후보 삭제 기본값을 ON으로 고정할 것인가? | ON / OFF | ON | Game | 2026-03-17 | Input UX, Learning Curve | ADR-032 | 4.3, 20.2.1 |
| Q-046 | decided | ui | Completed 결과 화면 컨테이너를 무엇으로 고정할 것인가? | 전체 화면 모달 / BottomSheet | 전체 화면 모달 | UX | 2026-03-18 | UX Consistency | ADR-039 | 13.10.5, 21.9 |
| Q-047 | decided | architecture | MVP 상태관리를 무엇으로 고정할 것인가? | Zustand / Redux Toolkit | Zustand | FE | 2026-03-18 | Dev Velocity, Complexity | ADR-040 | 12.1, 35.1 |
| Q-048 | decided | gameplay | Undo 히스토리 상한을 몇 step으로 고정할 것인가? | 100 / 200 / 무제한 | 200 | FE | 2026-03-18 | Memory, UX | ADR-041 | 13.9.8, 21.4.3 |
| Q-049 | decided | monetization | MVP 시작 가격/패키지를 어떻게 고정할 것인가? | 단일 영구형 $3.99 / 단일 영구형 $4.99 / 구독형 도입 | 단일 영구형 $3.99 | PM | 2026-03-18 | BM, Conversion | ADR-042 | 8.2, 38.1.2 |
| Q-050 | decided | daily | v1.1 Daily 리더보드 서버 검증 강도를 어떻게 고정할 것인가? | 엄격 검증(session 연계+rate limit) / 최소 검증(client 신뢰) / debug-only | 엄격 검증(session 연계+rate limit) | BE | 2026-03-20 | Fairness, Abuse Prevention | ADR-050 | 39.5, 42.6, 42.7 |
| Q-051 | decided | ads | 광고 동의/ATT 런타임 플로우를 어떻게 고정할 것인가? | 광고 요청 전 동의 게이트+ATT 선행 / 광고 초기화 우선 / Settings 수동 진입만 | 광고 요청 전 동의 게이트+ATT 선행 | PM | 2026-03-20 | Compliance, Ad Fill, UX | ADR-051 | 38.1.5, 20.2.9, 23.2 |
| Q-052 | decided | sync-data | `dailyStreak/calendar stamps`의 Firestore 문서 구조를 무엇으로 고정할 것인가? | `/users/{uid}/streak/meta` 단일 문서(map) / `/users/{uid}/daily/{date}` 서브컬렉션 / aggregate+stamps 하이브리드 | aggregate+stamps 하이브리드 | BE | 2026-02-24 | Sync, Data Integrity | ADR-052 | 19.3.2, 19.6, 39.1 |
| Q-053 | decided | stats | `avgTimeByDifficulty` 계산 규칙을 재계산과 가중 평균 중 무엇으로 고정할 것인가? | sessions 변경 시 전체 재계산 / 누적 가중 평균 / 하이브리드(재계산+캐시) | 하이브리드(재계산+캐시) | BE | 2026-02-24 | Stats Consistency, Perf | ADR-053 | 19.8.3, 39.1.3 |
| Q-054 | decided | sync-ux | 동기화 수동 재시도 경로를 어떤 UI 액션으로 고정할 것인가? | 자동 재시도만 / Settings > Data `retrySyncNow` 버튼 / 배너 CTA만 | `retrySyncNow` + 배너 CTA | FE | 2026-02-24 | UX, CS, Sync Recovery | ADR-054 | 20.2.8, 24.3, 32.2 |
| Q-055 | decided | daily | 오프라인 `도장/스트릭 임시 기록`의 pending 보존 기간과 만료 처리를 어떻게 고정할 것인가? | 무기한 재시도 / 7일 만료 / 30일 만료 | 7일 만료 | PM | 2026-02-24 | Retention, Fairness, CS | ADR-055 | 19.9, 24.3, 32.4 |
| Q-056 | decided | support | `contactSupport` 진단정보 전달 방식을 무엇으로 고정할 것인가? | 자동 첨부만 / Copy diagnostics만 / 자동 첨부 + Copy fallback | 자동 첨부 + Copy fallback | PM | 2026-02-24 | CS Ops, Privacy, UX | ADR-056 | 20.2.8, 38.1.3, 40.3 |
| Q-057 | decided | ui-icons | MVP 아이콘 세트를 무엇으로 고정할 것인가? | MaterialCommunityIcons(@expo/vector-icons) / Ionicons / 혼합 사용 | MaterialCommunityIcons(@expo/vector-icons) | FE | 2026-02-22 | UX Consistency, Delivery | ADR-057 | 12.1, 31.2 |
| Q-058 | decided | ui-icons | 상태/액션 아이콘 glyph 매핑을 semantic key 기준으로 고정할 것인가? | 화면별 임의 선택 / semantic key 고정 매핑 / 디자인 단계별 재정의 | semantic key 고정 매핑 | FE | 2026-02-22 | UX Consistency, Accessibility | ADR-058 | 31.2, 41.7 |
| Q-059 | decided | test-strategy | RN 앱 테스트 전략을 무엇으로 고정할 것인가? | Native only / Web only / RN 기본+Web 보조 하이브리드 | RN 기본+Web 보조 하이브리드 | QA | 2026-02-22 | Delivery, Reliability | ADR-059 | 10, 22.3, 38.2.6 |
| Q-060 | decided | test-ci | CI 실행 명령어를 무엇으로 표준화할 것인가? | 도구 직접 호출 / npm script 고정 / 팀별 재량 | npm script 고정 | QA | 2026-02-22 | CI Stability, Reproducibility | ADR-060 | 10, 38.2.6.1 |
| Q-061 | decided | test-setup | Sprint 0 완료 조건에 `package.json` 테스트 스크립트 키셋 생성을 포함할 것인가? | 포함 / 제외(각 스프린트 개별 작성) / 최소 키만 포함 | 포함 | QA | 2026-02-22 | Delivery Readiness, CI Onboarding | ADR-061 | 22.4, 38.2.6.1 |
| Q-062 | decided | brand | MVP 앱 표시명을 무엇으로 고정할 것인가? | `sudo9` / `Sudoku App` / 추후 재결정 | `sudo9` | PM | 2026-02-22 | Brand Consistency, Store Metadata | ADR-062 | MASTER 0, SPEC 38.1.1, 40.2 |
| Q-063 | decided | economy | 재화 시스템(단일 코인) 및 지갑 저장 위치를 무엇으로 고정할 것인가? | 코인 1종 / 코인+젬 2종 | 코인 1종 + 지갑(서버) | PM/BE | 2026-02-24 | BM, Anti-abuse, Sync | ADR-064 | 38.1.6, 19.3.2, 39.1 |
| Q-064 | decided | ads | 보상형(Rewarded) 사용처/일일 한도(재화벌이/힌트충전) | revive / 재화 / 힌트 / 혼합 | 재화+힌트(일일 한도 고정) | Monetization | 2026-02-24 | Ads, UX, Abuse | ADR-065 | 38.1.5.1, 38.1.6, 23.2 |
| Q-065 | decided | iap | 코인 구매(IAP) SKU 구성(MVP) | 없음 / 1개 / 3개 | 1개 | Monetization | 2026-02-24 | BM, Ops, Support | ADR-066 | 38.1.2, 39.6 |
| Q-066 | decided | journey | Journey(Stage/Chapter) 모드를 MVP에 포함하고 stage 구조/seed 규칙을 고정할 것인가? | 제외 / 포함(목록 기반) / 포함(seed 기반) | 포함(seed 기반) | PM/FE/BE | 2026-02-25 | Retention, UX, Sync | ADR-067 | 18.1, 19.3.2, 21.11, 39.1.15 |
| Q-067 | decided | journey | Journey 3-star 평가(시간/힌트) + 코인 보상(총 지급/추가 지급 delta)을 MVP에 포함할 것인가? | 별만(보상 없음) / 별+코인(총 지급) / 별+코인(난이도별 차등) | 별+코인(총 지급+delta) | PM/BE | 2026-02-25 | Economy, Fairness, Retention | ADR-068 | 21.11, 38.1.6.5, 39.4.3 |
| Q-068 | deferred | cosmetics | 챕터 테마 해금 + 테마 상점(코인/유료) 정책을 어떻게 고정할 것인가? | 클리어 해금 only / 상점 구매 only / 둘 다(클리어 해금 + 선구매) | Post-MVP(v1.3+)로 이관 | PM/FE/BE | 2026-03-31 | Retention, BM, Scope | ADR-069 | 42.3(B-019), 20.2.6, 39.1.2, 39.1.13 |

자동 이관 메모(2026-02-21):
- 추출 기준: 14~41장 중심으로 `옵션`, `(선택)` 키워드가 포함된 항목을 수집
- 중복 문구는 기능 단위 질문으로 병합하고 `sourceSections`에 원문 위치를 연결
- 앞으로 신규 옵션 항목 추가 시 동일 규칙으로 `Q-xxx`를 추가한다.
- 2차 이관: 31~37장 신설 섹션에서 운영 임계값/기본값 결정 포인트를 `Q-021~Q-035`로 추가
- 3차 이관: 39~41장 신설 섹션에서 데이터/카피/네비게이션 결정 포인트를 `Q-036~Q-040`으로 추가
- 4차 확정: `Q-036~Q-040`을 `decided`로 전환하고 ADR-007~ADR-011에 기록
- 5차 확정: `Q-021~Q-023`을 `decided`로 전환하고 ADR-012~ADR-014에 기록
- 6차 확정: `Q-026/Q-031/Q-033`을 `decided`로 전환하고 ADR-004/005/006을 `accepted`로 전환
- 7차 확정: `Q-025/Q-030/Q-032`를 `decided`로 전환하고 ADR-015~ADR-017에 기록
- 8차 확정: `Q-027/Q-028/Q-029`를 `decided`로 전환하고 ADR-018~ADR-020에 기록
- 9차 확정: `Q-007`을 `decided`로 전환하고 ADR-021로 프리미엄 스코프를 단순화
- 10차 확정: `Q-034/Q-035`를 `decided`로 전환하고 ADR-022/ADR-023에 기록
- 11차 정리: 고급 힌트/학습(L2/L3/LearnHub) 항목을 MVP에서 제외하고 관련 질문(Q-014/Q-015)을 `deferred`로 전환
- 12차 확정: `Q-041`을 `decided`로 전환하고 ADR-025로 Cloud Sync 백엔드를 Firebase로 고정
- 13차 확정: `Q-020`을 `decided`로 전환하고 ADR-026으로 로그인 정책을 Apple/Google 필수(게스트 미지원)로 고정
- 14차 확정: `Q-042`를 `decided`로 전환하고 ADR-027로 Cloud Sync 토글 미제공(항상 ON) 정책을 고정
- 15차 확정: `Q-043`을 `decided`로 전환하고 ADR-028로 Expo/RN 버전 고정 정책을 확정
- 16차 확정: `Q-044`를 `decided`로 전환하고 ADR-029로 초기 수익화 KPI Floor를 고정
- 17차 확정: `Q-004/Q-005`를 `decided`로 전환하고 ADR-030/ADR-031로 기본값(대칭 제거 ON, 가능 셀 강조 ON)을 고정
- 18차 확정: `Q-045`를 `decided`로 전환하고 ADR-032로 자동 후보 삭제 기본값(ON)을 고정
- 19차 확정: `Q-003/Q-006/Q-009/Q-010/Q-012/Q-013`을 `decided`로 전환하고 ADR-033~ADR-038로 코어 UX 기본값을 고정
- 20차 확정: `Q-046~Q-049`를 `decided`로 전환하고 ADR-039~ADR-042로 UI/아키텍처/BM 시작안을 고정
- 21차 확정: `Q-001/Q-002/Q-008/Q-016/Q-017/Q-018/Q-019`를 `decided`로 전환하고 ADR-043~ADR-049로 남은 MVP 핵심 정책을 고정
- 22차 정리: `Q-014/Q-015`를 `PRD_POST_MVP_BACKLOG.md`(42.2.1/B-001, 42.2.2/B-002)로 이관해 deferred 실행 단위로 분리
- 23차 확정: `Q-050/Q-051`를 `decided`로 전환하고 ADR-050/ADR-051로 v1.1 상용 운영 리스크(리더보드 검증/광고 동의 런타임)를 고정
- 24차 등록: 모호 표현 자동 스캔 결과 `Q-052~Q-056` open 후보를 추가
- 25차 확정: `Q-052~Q-056`를 `decided`로 전환하고 ADR-052~ADR-056으로 sync/stats/support 미확정 계약을 고정
- 26차 확정: `Q-057`을 `decided`로 전환하고 ADR-057로 MVP 아이콘 세트를 고정
- 27차 확정: `Q-058`을 `decided`로 전환하고 ADR-058로 semantic icon mapping 표를 고정
- 28차 확정: `Q-059`를 `decided`로 전환하고 ADR-059로 RN 테스트 전략(RN 기본+Web 보조)을 고정
- 29차 확정: `Q-060`을 `decided`로 전환하고 ADR-060으로 CI 실행 명령어 계약을 고정
- 30차 확정: `Q-061`을 `decided`로 전환하고 ADR-061로 Sprint 0 테스트 스크립트 체크리스트를 고정
- 31차 확정: `Q-062`를 `decided`로 전환하고 ADR-062로 MVP 앱 표시명(`sudo9`)을 고정

---

## 27. ADR Lite (의사결정 로그)

> 목적: 왜 그렇게 정했는지를 남겨, 이후 변경 시 회귀를 줄인다.

작성 규칙:
- 결정 1건당 ADR 1건 작성
- 최대 10줄 내외로 간결하게 작성
- `결정`과 `되돌림 조건`을 반드시 명시

템플릿:

```md
### ADR-XXX 제목
- date: YYYY-MM-DD
- status: proposed | accepted | superseded
- owners: PM, FE, BE
- context:
  - 현재 문제/충돌 요약
- options:
  - A:
  - B:
  - C:
- decision:
  - 최종 선택 + 기본값
- consequences:
  - 장점:
  - 단점/리스크:
- rollback trigger:
  - 어떤 지표/상황이면 재논의할지
- related:
  - PRD section:
  - Open Question:
```

초기 엔트리:

### ADR-001 Hint Apply Undo 정책
- date: 2026-02-21
- status: accepted
- decision:
  - MVP에서는 Hint Apply를 Undo 스택에 포함하지 않는다.
- rollback trigger:
  - 힌트 이탈률/불만 지표가 임계치를 넘으면 재검토
- related:
  - PRD section: 17.6, 21.6

### ADR-002 Redo MVP 노출 정책
- date: 2026-02-21
- status: accepted
- owners: PM, FE
- context:
  - MVP 범위와 UI 복잡도 사이에서 Redo 노출 여부를 확정해야 함
- options:
  - A: 숨김(기능 내부 준비만 유지)
  - B: 기본 노출
  - C: 설정에서만 노출
- decision:
  - A안(숨김)으로 확정한다.
- rollback trigger:
  - 베타에서 Undo 연속 사용 후 재실행 요청 비율이 높으면 재검토
- related:
  - PRD section: 3.3, 13.9.8, 21.2
  - Open Question: Q-011

### ADR-003 Sync Pending 노출 정책
- date: 2026-02-21
- status: accepted
- owners: BE, PM
- context:
  - sync 지연을 사용자에게 과도하지 않게 알릴 기준이 필요함
- options:
  - A: 배지 전용
  - B: 배너 전용
  - C: 배지 + Settings 상세
- decision:
  - C안(배지 + Settings 상세)으로 확정한다.
- rollback trigger:
  - 배지/배너 노출로 이탈 또는 불만 이벤트가 증가하면 재검토
- related:
  - PRD section: 32.2, 19.7
  - Open Question: Q-024

### ADR-004 성능 예산 위반 대응 정책
- date: 2026-02-21
- status: accepted
- owners: FE, QA
- context:
  - 리렌더 임계값 위반 시 배포/개발 프로세스 강제력이 필요함
- options:
  - A: warning only
  - B: PR 차단
  - C: release 차단
- decision:
  - C안(release 차단)으로 확정한다.
- rollback trigger:
  - false positive 비율이 높아 개발 병목이 심해지면 B안으로 조정
- related:
  - PRD section: 33.2, 33.4
  - Open Question: Q-026

### ADR-005 Prod Trace 샘플링 비율
- date: 2026-02-21
- status: accepted
- owners: BE
- context:
  - 비용과 디버깅 정확도 사이에서 prod trace 샘플링 비율 확정 필요
- options:
  - A: 5%
  - B: 10%
  - C: 20%
- decision:
  - B안(10%)으로 확정한다.
- rollback trigger:
  - 월간 관측 비용 급증 또는 진단 커버리지 부족 시 재검토
- related:
  - PRD section: 36.1
  - Open Question: Q-031

### ADR-006 첫 게임 기본 난이도 정책
- date: 2026-02-21
- status: accepted
- owners: UX, PM
- context:
  - 온보딩 이탈률과 완료율에 영향이 큰 첫 게임 난이도 기본값 확정 필요
- options:
  - A: Easy
  - B: Medium
  - C: 사용자 성향 기반 분기
- decision:
  - B안(Medium)으로 확정한다.
- rollback trigger:
  - 첫 세션 완료율이 목표 미달이면 A 또는 C안으로 재검토
- related:
  - PRD section: 37.1
  - Open Question: Q-033

### ADR-007 Event 보존 기간(90일) 정책
- date: 2026-02-21
- status: accepted
- owners: BE, PM
- context:
  - events 저장 기간이 미고정이면 storage 비용과 분석 깊이가 흔들림
- options:
  - A: 30일
  - B: 90일
  - C: 180일
- decision:
  - B안(90일)으로 확정한다.
- rollback trigger:
  - 월간 storage 비용이 목표 초과이거나 분석 데이터 부족 시 30일/180일 재검토
- related:
  - PRD section: 39.1.5, 39.4
  - Open Question: Q-036

### ADR-008 카피 기본 언어 ko+en 동시 관리
- date: 2026-02-21
- status: accepted
- owners: UX, FE
- context:
  - ko-only 운영은 i18n 확장 시 누락과 QA 비용을 증가시킴
- options:
  - A: ko only
  - B: ko+en
  - C: 외부 번역툴 연동
- decision:
  - B안(ko+en)으로 확정한다.
- rollback trigger:
  - 운영 초기 번역 비용/속도 문제가 크면 C안 연동을 재검토
- related:
  - PRD section: 40.2, 40.4
  - Open Question: Q-037

### ADR-009 iOS 스와이프 백 전면 비활성 정책
- date: 2026-02-21
- status: accepted
- owners: FE, UX
- context:
  - 게임 중 gesture back 허용 시 의도치 않은 이탈과 상태 혼선이 발생함
- options:
  - A: 전면 비활성
  - B: paused에서만 허용
  - C: 전면 허용
- decision:
  - A안(전면 비활성)으로 확정한다.
- rollback trigger:
  - iOS 사용성 불만 지표가 증가하면 B안으로 재검토
- related:
  - PRD section: 41.3
  - Open Question: Q-038

### ADR-010 Loading/Empty 문구 톤 1차 정책
- date: 2026-02-21
- status: accepted
- owners: PM, UX
- context:
  - MVP 단계에서 브랜드 톤 과도 확장은 일관성보다 변경 비용이 큼
- options:
  - A: 기본 문구 유지
  - B: 브랜드 톤 개편
- decision:
  - A안(기본 문구 유지)으로 확정한다.
- rollback trigger:
  - 사용자 이해도/전환 지표 저하 시 B안 개편을 재검토
- related:
  - PRD section: 41.4, 40.2
  - Open Question: Q-039

### ADR-011 스크린리더 읽기 순서 locale 분기
- date: 2026-02-21
- status: accepted
- owners: Accessibility, FE
- context:
  - 고정 순서는 언어별 문장 자연성을 떨어뜨려 이해도를 저하시킬 수 있음
- options:
  - A: 고정 순서
  - B: locale 분기
- decision:
  - B안(locale 분기)으로 확정한다.
- rollback trigger:
  - QA에서 번역/낭독 불일치가 증가하면 최소 공통 포맷으로 단순화 재검토
- related:
  - PRD section: 31.5, 40.4
  - Open Question: Q-040

### ADR-012 색약 모드 신호 조합(보더+아이콘) 정책
- date: 2026-02-21
- status: accepted
- owners: UX, FE
- context:
  - 색상 의존도를 줄이면서도 셀 가독성을 유지할 기본 조합이 필요함
- options:
  - A: 보더+아이콘
  - B: 보더+패턴
  - C: 아이콘+패턴
- decision:
  - A안(보더+아이콘)으로 확정한다.
- rollback trigger:
  - 실제 사용성 테스트에서 아이콘 인지가 낮으면 B안 재검토
- related:
  - PRD section: 31.2
  - Open Question: Q-021

### ADR-013 Dynamic Type 상한 1.4 정책
- date: 2026-02-21
- status: accepted
- owners: FE, UX
- context:
  - 보드 레이아웃 안정성과 접근성 확장성 사이 균형점이 필요함
- options:
  - A: 1.4
  - B: 1.6
  - C: 디바이스 기본 전체 허용
- decision:
  - A안(1.4)으로 확정한다.
- rollback trigger:
  - 접근성 불만이 증가하거나 태블릿 레이아웃 개선 후 여유가 생기면 상향 재검토
- related:
  - PRD section: 31.4
  - Open Question: Q-022

### ADR-014 스크린리더 후보 안내 토글 정책
- date: 2026-02-21
- status: accepted
- owners: UX, Accessibility
- context:
  - 빈 칸 후보를 항상 전부 읽으면 인지 부하가 커지고, 항상 축약하면 정보가 부족할 수 있음
- options:
  - A: 후보 개수만
  - B: 후보 전체 읽기
  - C: 설정 토글 제공
- decision:
  - C안(설정 토글 제공)으로 확정한다.
- rollback trigger:
  - 토글 사용률이 매우 낮거나 혼선이 크면 A안으로 단순화 재검토
- related:
  - PRD section: 31.5
  - Open Question: Q-023

### ADR-015 Autosave 스냅샷 개수 정책
- date: 2026-02-21
- status: accepted
- owners: BE
- context:
  - 손상 복구 성공률과 로컬 저장공간 사용량 사이 균형점이 필요함
- options:
  - A: 3
  - B: 5
  - C: 10
- decision:
  - A안(3개)으로 확정한다.
- rollback trigger:
  - 손상 복구 실패율이 목표 초과 시 B안(5개) 상향을 재검토
- related:
  - PRD section: 32.5
  - Open Question: Q-025

### ADR-016 아키텍처 경계 자동 검증 정책
- date: 2026-02-21
- status: accepted
- owners: FE
- context:
  - 수동 리뷰만으로는 모듈 경계 위반 누락 가능성이 높음
- options:
  - A: 수동 리뷰
  - B: lint 규칙
  - C: lint + CI 차단
- decision:
  - C안(lint + CI 차단)으로 확정한다.
- rollback trigger:
  - 오탐으로 개발 병목이 심화되면 규칙 정제 후 단계적 완화를 재검토
- related:
  - PRD section: 35.2, 35.4
  - Open Question: Q-030

### ADR-017 Hotfix 트리거 임계값 정책
- date: 2026-02-21
- status: accepted
- owners: PM, BE
- context:
  - 대응 민감도와 운영 노이즈 사이에서 동일 오류의 hotfix 기준점 확정 필요
- options:
  - A: 30건/24h
  - B: 50건/24h
  - C: 100건/24h
- decision:
  - B안(50건/24h)으로 확정한다.
- rollback trigger:
  - false alarm 과다 또는 치명 이슈 누락 시 30/100 기준 재검토
- related:
  - PRD section: 36.4
  - Open Question: Q-032

### ADR-018 저사양 기준 기기 세트 정책
- date: 2026-02-21
- status: accepted
- owners: QA, FE
- context:
  - 저사양 성능 회귀를 안정적으로 비교하려면 테스트 기준 기기를 고정해야 함
- options:
  - A: 글로벌 고정 1세트
  - B: 플랫폼별 2기기
  - C: 지역별 다중 세트
- decision:
  - B안(플랫폼별 2기기)으로 확정한다.
- rollback trigger:
  - 특정 지역 기기군 이슈가 반복되면 C안으로 확장 검토
- related:
  - PRD section: 33.3
  - Open Question: Q-027

### ADR-019 난이도 사전 검수 표본 수 정책
- date: 2026-02-21
- status: accepted
- owners: QA
- context:
  - 릴리즈 속도와 난이도 신뢰도 균형을 맞출 표본 수 기준이 필요함
- options:
  - A: 난이도별 100
  - B: 난이도별 150
  - C: 난이도 가중(Evil 200)
- decision:
  - A안(난이도별 100)으로 확정한다.
- rollback trigger:
  - 베타 불일치율 증가 시 B 또는 C안으로 상향 검토
- related:
  - PRD section: 34.1
  - Open Question: Q-028

### ADR-020 베타 게이트 임계값 유지 정책
- date: 2026-02-21
- status: accepted
- owners: PM, QA
- context:
  - 임계값 잦은 변경은 릴리즈 판단 기준을 흔들 수 있음
- options:
  - A: 현행 유지
  - B: 10% 완화
  - C: 단계적 강화
- decision:
  - A안(현행 유지)으로 확정한다.
- rollback trigger:
  - 일정 압박/품질 저하 지표가 누적되면 B 또는 C안 재검토
- related:
  - PRD section: 34.3
  - Open Question: Q-029

### ADR-021 프리미엄 스코프 단순화 정책
- date: 2026-02-21
- status: accepted
- owners: PM, Monetization
- context:
  - MVP에서 고급 통계/플레이 스타일 분석 포함 시 구현 복잡도와 일정 리스크가 커짐
- options:
  - A: 광고 제거만
  - B: 고급 통계 포함
  - C: 별도 SKU
- decision:
  - A안(광고 제거만)으로 확정한다.
  - 고급 통계 확장은 Post-MVP 백로그로 이관한다.
- rollback trigger:
  - 런칭 후 30일 기준 IAP 전환율/ARPPU가 목표 미달이면 B 또는 C안 재검토
- related:
  - PRD section: 5.3, 8.2, 22.2
  - Open Question: Q-007

### ADR-022 온보딩 Skip 재노출 정책
- date: 2026-02-21
- status: accepted
- owners: PM, UX
- context:
  - Skip 직후 완전 미노출은 핵심 기능 이해 누락 위험이 있고, 과도한 재노출은 피로도를 높임
- options:
  - A: 재노출 안 함
  - B: 다음 실행 1회 재노출
  - C: 3세션 후 재노출
- decision:
  - B안(다음 실행 1회 재노출)으로 확정한다.
- rollback trigger:
  - 재노출 후 즉시 이탈률이 유의미하게 증가하면 A안으로 재검토
- related:
  - PRD section: 37.1, 37.4
  - Open Question: Q-034

### ADR-023 온보딩 Skip 기본 프리셋 정책
- date: 2026-02-21
- status: accepted
- owners: UX, PM
- context:
  - Skip 사용자는 입력 성향 데이터가 없어 기본 프리셋이 UX 일관성을 좌우함
- options:
  - A: Classic
  - B: Speed
  - C: 첫 20탭 행동 기반 추론
- decision:
  - A안(Classic)으로 확정한다.
- rollback trigger:
  - Skip 사용자 첫 세션 완료율이 목표 미달이면 B 또는 C안 재검토
- related:
  - PRD section: 37.2, 37.4
  - Open Question: Q-035

### ADR-024 고급 힌트/학습 MVP 제외 정책
- date: 2026-02-21
- status: accepted
- owners: PM, FE, UX
- context:
  - L2/L3 튜터 힌트와 LearnHub는 MVP 일정/복잡도 리스크가 높고, 현재 제품 목표(기본 상용 품질)와 우선순위가 맞지 않음
- options:
  - A: MVP에 L2/L3 Stub 포함
  - B: MVP에서 L2/L3/LearnHub 완전 제외
  - C: L2만 포함, L3 제외
- decision:
  - B안(MVP 완전 제외)으로 확정한다.
  - MVP 힌트는 L0/L1만 유지한다.
- rollback trigger:
  - 런칭 후 힌트 관련 이탈/불만 지표가 목표를 초과하면 Post-MVP 스프린트에서 C안 우선 재검토
- related:
  - PRD section: 3.1, 4.2, 15, 16, 17, 22.1, 22.2
  - Open Question: Q-014, Q-015

### ADR-025 Cloud Sync 백엔드 Firebase 고정 정책
- date: 2026-02-21
- status: accepted
- owners: PM, BE, FE
- context:
  - 문서 간에 Cloud Sync 공급자 후보(Firebase/Supabase)가 혼재되어 구현 기준이 흔들릴 위험이 있음
- options:
  - A: Firebase Auth + Firestore 고정
  - B: Supabase Auth + DB 고정
  - C: provider-agnostic 추상화 유지
- decision:
  - A안(Firebase Auth + Firestore)으로 확정한다.
  - MVP 동기화/데이터 계약은 Firestore 스키마를 기준으로 고정한다.
- rollback trigger:
  - 운영 비용/성능/규제 이슈로 Firebase 유지가 어려워지면 B 또는 C안으로 재논의
- related:
  - PRD section: 7.1, 19.1, 19.3.2, 39.1
  - Open Question: Q-041

### ADR-026 로그인 제공 범위 Apple/Google 고정 정책
- date: 2026-02-21
- status: accepted
- owners: PM, BE
- context:
  - 로그인 정책(필수/선택)과 제공 범위가 미확정이면 Auth 구현/QA 시나리오와 컴플라이언스 검증 기준이 흔들릴 수 있음
- options:
  - A: Apple+Google(로그인 필수)
  - B: Apple only(iOS) + Google(Android)(로그인 필수)
  - C: Guest 병행(폐기)
- decision:
  - A안(Apple+Google, 로그인 필수)으로 확정한다.
  - 게스트 모드는 MVP에서 지원하지 않는다.
  - 로그인 스킵 UI는 제공하지 않는다.
- rollback trigger:
  - 특정 제공자 심사/운영 이슈로 출시 일정 리스크가 커지면 B안으로 재논의
- related:
  - PRD section: 19.2, 22.1.F, 7.1
  - Open Question: Q-020

### ADR-027 Cloud Sync 토글 미제공(항상 ON) 정책
- date: 2026-02-21
- status: accepted
- owners: PM, BE, UX
- context:
  - 로그인 필수 정책에서 Cloud Sync 토글을 노출하면 데이터 누락/지원 문의/상태 불일치 리스크가 증가할 수 있음
- options:
  - A: 토글 제공(ON/OFF)
  - B: 토글 미제공(항상 ON)
- decision:
  - B안(토글 미제공, 항상 ON)으로 확정한다.
  - Settings > Data에는 수동 재시도/초기화 액션만 제공한다.
- rollback trigger:
  - 오프라인/비용 이슈로 사용자 제어 요구가 증가하면 A안 재논의
- related:
  - PRD section: 7.1, 20.2.8, 24.3
  - Open Question: Q-042

### ADR-028 Expo/RN 버전 고정 정책
- date: 2026-02-21
- status: accepted
- owners: FE, PM
- context:
  - MVP 기간에 `latest`를 계속 추종하면 빌드 깨짐/SDK 호환 이슈로 일정 리스크가 커질 수 있음
- options:
  - A: `latest` 추종
  - B: 킥오프 시점 안정 버전 고정
  - C: pre-release 선반영
- decision:
  - B안(킥오프 시점 안정 버전 고정)으로 확정한다.
  - major/minor 업데이트는 v1.1+ 마일스톤에서 ADR 기반으로만 진행한다.
- rollback trigger:
  - 치명 보안/크래시 이슈가 발생해 즉시 업그레이드가 필요하면 예외 ADR을 생성한다.
- related:
  - PRD section: 12.1, 38.2.1, 38.2.2
  - Open Question: Q-043

### ADR-029 초기 수익화 KPI Floor 고정 정책
- date: 2026-02-21
- status: accepted
- owners: PM, Monetization
- context:
  - 수익화 전략을 본격 최적화하기 전 단계에서 KPI 기준이 공란이면 실험/회고 기준이 흔들릴 수 있음
- options:
  - A: 공란 유지(추후 설정)
  - B: 보수적 최소 기준(Floor) 우선 고정
  - C: 공격적 목표 선반영
- decision:
  - B안(보수적 최소 기준)으로 확정한다.
  - 안정화 60~90일 KPI: ARPDAU(Ads)+IAP `>= $0.01`(USD), IAP 전환율 `>= 0.3%`, Rewarded Opt-in `>= 10%`.
- rollback trigger:
  - 30일 운영 데이터 확보 후 평균이 Floor를 안정적으로 상회하면 상향 재설정 ADR을 생성한다.
- related:
  - PRD section: 1.2
  - Open Question: Q-044

### ADR-030 퍼즐 생성 대칭 제거 기본값 정책
- date: 2026-02-21
- status: accepted
- owners: Game, PM
- context:
  - 생성 시 대칭 제거 기본값이 미고정이면 퍼즐 외형 일관성과 체감 품질이 흔들릴 수 있음
- options:
  - A: ON 고정
  - B: ON 기본 + 설정에서 OFF 허용
  - C: OFF 기본
- decision:
  - B안(ON 기본 + 설정에서 OFF 허용)으로 확정한다.
- rollback trigger:
  - 사용자 피드백에서 비대칭 선호가 높거나 생성 품질 편차가 커지면 C안/B안 재검토
- related:
  - PRD section: 4.1.1, 18.3
  - Open Question: Q-004

### ADR-031 Digit-First 가능 셀 강조 기본값 정책
- date: 2026-02-21
- status: accepted
- owners: UX, FE
- context:
  - 가능 셀 강조 기본값이 미고정이면 초반 입력 학습곡선과 체감 속도에 편차가 발생할 수 있음
- options:
  - A: ON
  - B: OFF
  - C: 난이도별 차등
- decision:
  - A안(ON)으로 확정한다.
  - Settings에서 OFF 토글은 허용한다.
- rollback trigger:
  - 고난도 사용자군에서 시각적 노이즈 불만이 높으면 C안(난이도별 차등) 재검토
- related:
  - PRD section: 4.4, 13.8.9, 20.2.3
  - Open Question: Q-005

### ADR-032 자동 후보 삭제 기본값 정책
- date: 2026-02-21
- status: accepted
- owners: Game, UX
- context:
  - 자동 후보 삭제 기본값이 미고정이면 첫 게임 경험과 입력 실수 체감에 편차가 발생할 수 있음
- options:
  - A: ON
  - B: OFF
- decision:
  - A안(ON)으로 확정한다.
  - Settings에서 OFF 토글은 허용한다.
- rollback trigger:
  - 고난도 사용자 피드백에서 수동 메모 통제 요구가 높으면 기본값 OFF를 재검토
- related:
  - PRD section: 4.3, 20.2.1
  - Open Question: Q-045

### ADR-033 Completed 인터스티셜 쿨다운 정책
- date: 2026-02-21
- status: accepted
- owners: Monetization, PM
- context:
  - 완료 직후 광고 빈도가 높으면 이탈 리스크가 커지고, 너무 낮으면 초기 수익화 검증이 어렵다.
- options:
  - A: 3판
  - B: 5판
  - C: 10분
- decision:
  - B안(최소 5판 쿨다운)으로 확정한다.
- rollback trigger:
  - D1/D7 리텐션 또는 광고 ARPDAU가 목표 미달이면 A/C안 재검토
- related:
  - PRD section: 13.10.5, 8.1
  - Open Question: Q-003

### ADR-034 마지막 숫자 자동완성 기본값 정책
- date: 2026-02-21
- status: accepted
- owners: PM, UX
- context:
  - 자동완성 기본값은 풀이 난이도 체감과 초반 UX에 직접적인 영향을 준다.
- options:
  - A: ON
  - B: OFF
- decision:
  - B안(OFF)으로 확정한다.
  - Settings에서 ON 토글은 허용한다.
- rollback trigger:
  - 초보 사용자 완주율이 낮고 ON 전환율이 높으면 기본 ON 재검토
- related:
  - PRD section: 4.5, 20.2.1
  - Open Question: Q-006

### ADR-035 남은 개수 뱃지 기본 노출 정책
- date: 2026-02-21
- status: accepted
- owners: UX
- context:
  - 키패드 남은 개수는 입력 속도와 오류 감소에 도움을 주지만 과도하면 시각적 복잡도를 높일 수 있음
- options:
  - A: ON
  - B: OFF
- decision:
  - A안(ON)으로 확정한다.
  - Settings에서 OFF 토글은 허용한다.
- rollback trigger:
  - 베타에서 시각적 노이즈 불만 비율이 높으면 기본 OFF 재검토
- related:
  - PRD section: 13.9.3, 20.2.3
  - Open Question: Q-009

### ADR-036 Erase 롱프레스 MVP 제외 정책
- date: 2026-02-21
- status: accepted
- owners: FE, PM
- context:
  - 롱프레스 동작 추가는 입력 학습 비용과 테스트 케이스를 크게 늘릴 수 있음
- options:
  - A: MVP 포함
  - B: MVP 제외
- decision:
  - B안(MVP 제외)으로 확정한다.
  - MVP는 후보 전체 삭제만 제공한다.
- rollback trigger:
  - 베타에서 후보 삭제 불편 이슈가 임계치 이상이면 v1.1 우선 반영
- related:
  - PRD section: 13.9.7, 22.2
  - Open Question: Q-010

### ADR-037 실패 모드(Mistake Limit) 설정 옵션 정책
- date: 2026-02-21
- status: accepted
- owners: PM, UX
- context:
  - 실패 모드는 몰입/긴장감을 주지만 기본 ON일 경우 이탈 가능성이 높음
- options:
  - A: 제외
  - B: 설정 옵션
  - C: 챌린지 전용
- decision:
  - B안(설정 옵션, 기본 OFF)으로 확정한다.
- rollback trigger:
  - 사용률이 매우 낮으면 A안, 챌린지 집중 사용이면 C안으로 재검토
- related:
  - PRD section: 13.10.6, 20.2.1, 21.1
  - Open Question: Q-012

### ADR-038 Completed Share 버튼 MVP 제외 정책
- date: 2026-02-21
- status: accepted
- owners: PM
- context:
  - Share 기능은 성장 채널 가치가 있지만 MVP 일정 대비 구현/QA 범위를 확장시킴
- options:
  - A: 포함
  - B: 제외(1.1)
- decision:
  - B안(제외, v1.1 재검토)으로 확정한다.
- rollback trigger:
  - 런칭 후 자연 유입 지표가 목표 미달이면 Share 우선순위 상향
- related:
  - PRD section: 13.10.5, 22.2
  - Open Question: Q-013

### ADR-039 Completed 화면 컨테이너 고정 정책
- date: 2026-02-21
- status: accepted
- owners: UX, FE
- context:
  - 완료 화면 컨테이너(모달/시트)가 혼재되면 네비게이션/전환 동작이 불안정해질 수 있음
- options:
  - A: 전체 화면 모달
  - B: BottomSheet
- decision:
  - A안(전체 화면 모달, `CompletedModal`)으로 확정한다.
- rollback trigger:
  - 사용자 피드백에서 과도한 차단감 이슈가 반복되면 B안 검토
- related:
  - PRD section: 13.10.5, 21.9
  - Open Question: Q-046

### ADR-040 MVP 상태관리 Zustand 고정 정책
- date: 2026-02-21
- status: accepted
- owners: FE
- context:
  - 상태관리 선택이 미고정이면 아키텍처와 테스트 전략이 분산될 수 있음
- options:
  - A: Zustand
  - B: Redux Toolkit
- decision:
  - A안(Zustand)으로 확정한다.
- rollback trigger:
  - 팀 규모/복잡도 증가로 미들웨어 표준화 요구가 커지면 B안 재검토
- related:
  - PRD section: 12.1, 35.1
  - Open Question: Q-047

### ADR-041 Undo 히스토리 200 step 고정 정책
- date: 2026-02-21
- status: accepted
- owners: FE
- context:
  - 히스토리 상한이 미고정이면 메모리 사용량 예측과 테스트 기준이 흔들릴 수 있음
- options:
  - A: 100
  - B: 200
  - C: 무제한
- decision:
  - B안(200 step)으로 확정한다.
- rollback trigger:
  - 장기 플레이 사용자에서 Undo 부족 불만이 높으면 상향 재검토
- related:
  - PRD section: 13.9.8, 21.4.3
  - Open Question: Q-048

### ADR-042 MVP 시작 가격/패키지 고정 정책
- date: 2026-02-21
- status: accepted
- owners: PM, Monetization
- context:
  - 초기 가격/패키지 공란은 스토어 세팅과 분석 기준을 지연시킬 수 있음
- options:
  - A: 단일 영구형 $3.99
  - B: 단일 영구형 $4.99
  - C: 구독형 도입
- decision:
  - A안(단일 영구형 $3.99)으로 확정한다.
- rollback trigger:
  - 30일 데이터에서 전환율/ARPPU가 목표 미달이면 B 또는 C안 재검토
- related:
  - PRD section: 8.2, 38.1.2
  - Open Question: Q-049

### ADR-043 L1 힌트 일일 제한 미적용 정책
- date: 2026-02-21
- status: superseded
- supersededBy: ADR-063 (2026-02-24)
- owners: PM, UX
- context:
  - 힌트 일일 제한을 두면 막힘 구간에서 이탈률이 증가하고 광고 의존 UX로 오해될 수 있음
- options:
  - A: 제한 없음
  - B: 일일 5회
  - C: 광고 시 추가
- decision:
  - [MUST] MVP 힌트 정책의 단일 기준은 ADR-063이다.
  - [MUST] 본 ADR-043은 superseded(역사 기록)이며, 힌트 제한/충전 정책을 정의하지 않는다.
- rollback trigger:
  - 힌트 남용으로 난이도 체감/완료율 지표가 악화되면 B 또는 C안 재검토
- related:
  - PRD section: 15.7
  - Open Question: Q-001

### ADR-044 세션 보관 200개 고정 정책
- date: 2026-02-21
- status: accepted
- owners: BE
- context:
  - 세션 보관 개수가 미고정이면 스토리지 비용과 동기화 성능 예측이 불안정해질 수 있음
- options:
  - A: 100
  - B: 200
  - C: 500
- decision:
  - B안(최근 200개 고정)으로 확정한다.
- rollback trigger:
  - 통계 재계산 정확도 저하 또는 스토리지 압박이 발생하면 A/C안 재검토
- related:
  - PRD section: 19.10
  - Open Question: Q-002

### ADR-045 충돌 처리 기본값(표시만) 정책
- date: 2026-02-21
- status: accepted
- owners: Game, UX
- context:
  - 입력 차단을 기본 ON으로 두면 학습/탐색 풀이 흐름이 끊기고 초반 거부감이 커질 수 있음
- options:
  - A: 표시만(입력 차단 OFF)
  - B: 입력 차단 ON
  - C: 모드별 차등
- decision:
  - A안(표시만)을 기본값으로 확정한다.
  - `blockInvalidInput` 기본값은 `false`로 유지한다.
- rollback trigger:
  - 초보군 오류 반복률이 임계치 이상이면 B 또는 C안 재검토
- related:
  - PRD section: 13.8.7, 20.2.2, 21.8
  - Open Question: Q-008

### ADR-046 생성 타임아웃 난이도 완화 fallback 허용 정책
- date: 2026-02-21
- status: accepted
- owners: Engine
- context:
  - 생성 타임아웃 시 fallback이 없으면 새 게임 시작 실패율이 상승하고 체감 품질이 저하될 수 있음
- options:
  - A: 허용
  - B: 비허용
- decision:
  - A안(허용)으로 확정한다.
  - 타임아웃 발생 시 난이도 1단계 완화 fallback을 허용한다.
- rollback trigger:
  - 난이도 신뢰도 불일치 리포트가 증가하면 fallback 빈도 제한/비허용 재검토
- related:
  - PRD section: 18.5.3, 24.1
  - Open Question: Q-016

### ADR-047 Daily 리더보드 MVP 제외 정책
- date: 2026-02-21
- status: accepted
- owners: PM, BE
- context:
  - Daily 리더보드를 MVP에 포함하면 서버 검증/치팅 방지/운영 비용이 급증함
- options:
  - A: 제외
  - B: 읽기 전용
  - C: 전체 포함
- decision:
  - A안(MVP 제외)으로 확정한다.
  - MVP는 Daily 플레이/완료만 포함하고 leaderboard write는 비활성 유지한다.
- rollback trigger:
  - 런칭 후 경쟁 기능 요구가 높고 핵심 품질 지표가 안정적이면 B 또는 C안 검토
- related:
  - PRD section: 3.3, 19.6
  - Open Question: Q-017

### ADR-048 `VALIDATE_BOARD()` MVP 엔진 제외 정책
- date: 2026-02-21
- status: accepted
- owners: Game, FE
- context:
  - `VALIDATE_BOARD()` 이벤트는 엔진 분기와 테스트 케이스를 늘려 MVP 구현 복잡도를 높임
- options:
  - A: 포함
  - B: 제외
  - C: debug-only
- decision:
  - B안(제외)으로 확정한다.
  - MVP 엔진 이벤트/설정에서 `VALIDATE_BOARD()`를 제거한다.
- rollback trigger:
  - QA 단계에서 무결성 점검 도구 필요성이 높아지면 C안(debug-only) 재검토
- related:
  - PRD section: 21.2, 21.8
  - Open Question: Q-018

### ADR-049 저사양 후보 렌더링 간소화 자동+수동 정책
- date: 2026-02-21
- status: accepted
- owners: FE
- context:
  - 저사양 대응을 수동만 두면 기본 보호가 약하고, 자동만 두면 사용자 제어권이 부족함
- options:
  - A: 수동 설정만
  - B: 자동만
  - C: 자동+수동
- decision:
  - C안(자동+수동)으로 확정한다.
  - 저사양 감지 시 자동 간소화를 적용하고, Settings 수동 토글을 함께 제공한다.
- rollback trigger:
  - 오탐/과잉 단순화 피드백이 증가하면 자동 민감도 조정 또는 A/B안 재검토
- related:
  - PRD section: 25.7
  - Open Question: Q-019

### ADR-050 v1.1 Daily 리더보드 엄격 서버 검증 정책
- date: 2026-02-21
- status: accepted
- owners: BE, PM
- context:
  - Daily 리더보드는 클라이언트 신뢰 모델일 경우 조작/치팅으로 공정성이 빠르게 무너질 수 있음
- options:
  - A: 엄격 검증(session 연계 + rate limit + 서버 재검증)
  - B: 최소 검증(client 신뢰)
  - C: debug-only
- decision:
  - A안(엄격 검증)으로 확정한다.
  - 리더보드 write는 서버 경유 경로만 허용하고, 무결성/범위/중복 제출을 강제 검증한다.
- rollback trigger:
  - 서버 비용/지연이 목표를 지속 초과하면 검증 단계 최적화 후 범위를 재조정한다(완화 전 ADR 재승인 필수).
- related:
  - PRD section: 39.5, 42.6, 42.7
  - Open Question: Q-050

### ADR-051 광고 동의/ATT 런타임 게이트 정책
- date: 2026-02-21
- status: accepted
- owners: PM, FE, BE
- context:
  - 광고 SDK 초기화/요청 순서가 불명확하면 규정 준수 리스크와 fill 저하, UX 불일치가 동시 발생할 수 있음
- options:
  - A: 광고 요청 전 동의 게이트 + ATT 선행
  - B: 광고 초기화 우선
  - C: Settings 수동 진입만
- decision:
  - A안(광고 요청 전 동의 게이트 + ATT 선행)으로 확정한다.
  - 동의 상태 미확정/거부 시 개인화 광고 요청을 차단하고 non-personalized fallback만 허용한다.
- rollback trigger:
  - 플랫폼 정책 변경 또는 fill 급락이 발생하면 정책 변경 ADR을 별도로 생성해 재논의한다.
- related:
  - PRD section: 38.1.5, 20.2.9, 23.2
  - Open Question: Q-051

### ADR-052 Daily Streak/Stamp 스키마 하이브리드 정책
- date: 2026-02-22
- status: accepted
- owners: BE, PM
- context:
  - `dailyStreak/calendar stamps` 저장 구조 미정이면 동기화/충돌/리셋 범위가 팀마다 달라질 수 있음
- options:
  - A: `/users/{uid}/streak/meta` 단일 문서(map)
  - B: `/users/{uid}/daily/{date}` 서브컬렉션
  - C: aggregate+stamps 하이브리드
- decision:
  - C안(aggregate+stamps 하이브리드)으로 확정한다.
  - 집계는 `/users/{uid}/streak/meta`, 날짜별 원본은 `/users/{uid}/stamps/{dateUTC}`로 분리한다.
- rollback trigger:
  - 문서/쿼리 비용이 목표를 초과하거나 충돌 복잡도가 급증하면 A/B안 재검토
- related:
  - PRD section: 19.3.2, 19.6, 39.1
  - Open Question: Q-052

### ADR-053 평균 시간 계산 하이브리드(재계산+캐시) 정책
- date: 2026-02-22
- status: accepted
- owners: BE, FE
- context:
  - 평균 시간 계산을 재계산/가중 평균 중 하나로 단정하지 않으면 통계 일관성이 깨짐
- options:
  - A: sessions 변경 시 전체 재계산
  - B: 누적 가중 평균
  - C: 하이브리드(재계산+캐시)
- decision:
  - C안(하이브리드)으로 확정한다.
  - 정답 값(canonical)은 최근 200개 completed sessions 재계산으로 만들고, 결과는 `statsAggregate/localStats`에 캐시한다.
- rollback trigger:
  - 재계산 비용이 성능 예산을 지속 초과하면 B안(가중 평균) 보조 도입을 재검토
- related:
  - PRD section: 19.8.3, 39.1.3
  - Open Question: Q-053

### ADR-054 수동 동기화 재시도 경로 정책
- date: 2026-02-22
- status: accepted
- owners: FE, PM
- context:
  - sync 실패 시 수동 재시도 경로가 분산되면 사용자/CS 안내가 불일치할 수 있음
- options:
  - A: 자동 재시도만
  - B: Settings > Data `retrySyncNow` 버튼
  - C: 배너 CTA만
- decision:
  - `retrySyncNow` + 배너 CTA 조합으로 확정한다.
  - 두 경로는 동일 액션 핸들러를 호출해 pending queue flush를 수행한다.
- rollback trigger:
  - 중복 재시도로 오류율/서버 부하가 증가하면 쿨다운 정책을 추가해 재조정
- related:
  - PRD section: 20.2.8, 24.3, 32.2
  - Open Question: Q-054

### ADR-055 오프라인 Daily pending 보존 7일 정책
- date: 2026-02-22
- status: accepted
- owners: PM, BE
- context:
  - 오프라인 임시 기록의 보존 기간 미정이면 streak 반영/CS 처리 기준이 흔들림
- options:
  - A: 무기한 재시도
  - B: 7일 만료
  - C: 30일 만료
- decision:
  - B안(7일 만료)으로 확정한다.
  - 7일 내 서버 검증 실패 시 pending을 만료 처리하고 streak 반영에서 제외한다.
- rollback trigger:
  - 만료 관련 불만/재문의가 임계치를 초과하면 30일 확장 또는 정책 분리 재검토
- related:
  - PRD section: 19.9, 24.3, 32.4
  - Open Question: Q-055

### ADR-056 문의 진단정보 전달(자동 첨부 + Copy fallback) 정책
- date: 2026-02-22
- status: accepted
- owners: PM, FE
- context:
  - 문의 품질을 높이려면 진단정보 전달이 필요하지만, 채널 제약으로 자동 첨부 실패 가능성이 존재함
- options:
  - A: 자동 첨부만
  - B: Copy diagnostics만
  - C: 자동 첨부 + Copy fallback
- decision:
  - C안(자동 첨부 + Copy fallback)으로 확정한다.
  - 자동 첨부가 불가/실패하면 동일 payload를 즉시 복사할 수 있어야 한다.
- rollback trigger:
  - 개인정보/보안 정책 변경으로 첨부 범위 축소가 필요하면 payload 키셋 재승인 후 조정
- related:
  - PRD section: 20.2.8, 38.1.3, 40.3
  - Open Question: Q-056

### ADR-057 MVP 아이콘 세트 고정 정책
- date: 2026-02-22
- status: accepted
- owners: FE, UX
- context:
  - 접근성 신호(보더+아이콘)를 쓰는 MVP에서 아이콘 라이브러리가 미고정이면 화면별 스타일 편차가 커진다.
- options:
  - A: MaterialCommunityIcons(@expo/vector-icons) 단일 사용
  - B: Ionicons 단일 사용
  - C: 화면별 혼합 사용
- decision:
  - A안(MaterialCommunityIcons 단일 사용)으로 확정한다.
  - Apple/Google 브랜드 아이콘은 로그인 버튼 가이드 준수를 위해서만 FontAwesome brands 예외를 허용한다.
- rollback trigger:
  - 글리프 누락/브랜드 가이드 미충족으로 심사 이슈가 발생하면 예외 세트를 ADR로 추가한다.
- related:
  - PRD section: 12.1, 31.2
  - Open Question: Q-057

### ADR-058 Semantic Icon Mapping 고정 정책
- date: 2026-02-22
- status: accepted
- owners: FE, UX
- context:
  - 아이콘 라이브러리만 고정하면 화면별 glyph 선택이 갈려서 의미 일관성이 깨질 수 있다.
- options:
  - A: 화면별 임의 선택
  - B: semantic key 기반 고정 매핑
  - C: 스프린트마다 재정의
- decision:
  - B안(semantic key 기반 고정 매핑)으로 확정한다.
  - `semanticKey -> glyphName` 표를 41.7에 고정하고 동일 key의 glyph 변경을 금지한다.
- rollback trigger:
  - 접근성 테스트에서 특정 glyph 인지율이 임계치 이하로 떨어지면 해당 key만 ADR 갱신으로 교체한다.
- related:
  - PRD section: 31.2, 41.7
  - Open Question: Q-058

### ADR-059 RN 테스트 전략(RN 기본 + Web 보조) 고정 정책
- date: 2026-02-22
- status: accepted
- owners: QA, FE
- context:
  - RN 앱은 네이티브 SDK/OS 동작 검증이 필요하지만, 모든 검증을 네이티브 E2E만으로 수행하면 속도가 느려진다.
- options:
  - A: Native only(전 테스트를 네이티브에서 수행)
  - B: Web only(웹 테스트만 수행)
  - C: RN 기본 + Web 보조 하이브리드
- decision:
  - C안(RN 기본 + Web 보조)으로 확정한다.
  - PR 게이트는 `lint + Jest(unit/component)`로 고정하고, 릴리즈 게이트는 iOS/Android Native E2E + RevenueCat 샌드박스 시나리오 통과로 고정한다.
  - 웹 테스트는 Expo Web/React Native Web entry가 있을 때 보조 스모크로만 사용하고, 네이티브 게이트를 대체하지 않는다.
- rollback trigger:
  - 네이티브 E2E flaky 비율이 임계치 이상으로 상승하거나, 웹 entry 제거로 보조 스모크 유지 이점이 사라지면 게이트 구성을 재조정한다.
- related:
  - PRD section: 10, 22.3, 38.2.6
  - Open Question: Q-059

### ADR-060 CI 실행 명령어 계약 고정 정책
- date: 2026-02-22
- status: accepted
- owners: QA, FE
- context:
  - 동일 테스트라도 팀원/CI가 서로 다른 CLI 경로로 실행하면 재현성과 실패 기준이 흔들린다.
- options:
  - A: 도구 직접 호출(eslint/jest/maestro)
  - B: npm script 키 고정
  - C: 팀별 재량
- decision:
  - B안(npm script 키 고정)으로 확정한다.
  - PR 게이트는 `pnpm run lint` -> `pnpm run test:unit`, 릴리즈 게이트는 `lint -> unit -> e2e:ios -> e2e:android -> purchase:sandbox` 순서로 고정한다.
  - 웹 엔트리가 있는 경우에만 `pnpm run test:web:smoke`를 보조 게이트로 추가한다.
- rollback trigger:
  - 패키지 매니저 변경 또는 monorepo 분할로 스크립트 키셋 재구성이 필요해지면 ADR 갱신 후 전환한다.
- related:
  - PRD section: 10, 38.2.6.1
  - Open Question: Q-060

### ADR-061 Sprint 0 테스트 스크립트 체크리스트 고정 정책
- date: 2026-02-22
- status: accepted
- owners: QA, FE
- context:
  - Sprint 0에서 테스트 스크립트가 비어 있으면 이후 스프린트마다 명령어 계약이 흔들리고 CI 온보딩이 지연된다.
- options:
  - A: Sprint 0에 스크립트 키셋 포함
  - B: 스프린트별 필요 시 개별 작성
  - C: 최소 키(`lint`, `test:unit`)만 포함
- decision:
  - A안(Sprint 0에 스크립트 키셋 포함)으로 확정한다.
  - Sprint 0 완료 조건에 38.2.6.1 키셋 생성과 PR/RC 게이트 순서 기반 CI 템플릿 초안 작성을 포함한다.
- rollback trigger:
  - 스택/패키지 매니저 전환으로 스크립트 키 네이밍을 전면 개편해야 하면 ADR 갱신 후 재잠금한다.
- related:
  - PRD section: 22.4, 38.2.6.1
  - Open Question: Q-061

### ADR-062 MVP 앱 표시명(`sudo9`) 고정 정책
- date: 2026-02-22
- status: accepted
- owners: PM
- context:
  - 앱 표시명이 미확정이면 스토어 메타/카피/운영 산출물에서 명칭 불일치가 발생한다.
- options:
  - A: `sudo9`
  - B: `Sudoku App`
  - C: 추후 재결정
- decision:
  - A안(`sudo9`)으로 확정한다.
  - 본 결정은 앱 표시명(display name)에 한정하며, `productId`/도메인/지원 이메일 같은 운영 식별자는 MVP 고정값을 유지한다.
- rollback trigger:
  - 스토어 상표/심사 이슈 또는 마케팅 리브랜딩 확정 시 ADR 갱신 후 표시명 변경을 허용한다.
- related:
  - PRD section: MASTER 0, SPEC 38.1.1, 40.2
  - Open Question: Q-062

### ADR-063 힌트 일일 제한 + 광고 충전 + Premium 무제한 정책
- date: 2026-02-24
- status: accepted
- owners: PM, Monetization, FE
- context:
  - MVP에 재화/광고 보상 루프가 들어오면서 힌트를 무제한으로 유지하면 광고 동기(재화/힌트)와 UX가 충돌하고, 반대로 유료 유저가 “광고 없이도 진행 가능한가”가 불명확해진다.
- options:
  - A: 힌트 무제한(광고/재화와 분리 유지)
  - B: 힌트 일일 제한만 도입(광고 충전 없음)
  - C: 힌트 일일 제한 + 광고 1회 = 힌트 1개 충전, Premium은 무제한
- decision:
  - C안으로 확정한다.
  - Free 기본 제공: `freeHintsPerDay=3` (UTC 00:00 리셋)
  - 광고 충전: `hintRefillPerAd=+1`, `hintRefillAdsPerDayMax=5` (UTC 00:00 리셋)
  - 제한 조건: 힌트 충전 광고 CTA는 `hintsRemaining=0`일 때만 노출한다.
  - Premium: 힌트는 무제한이며, 힌트 충전 광고 CTA를 노출하지 않는다(광고 제거 정책 유지).
- rollback trigger:
  - 힌트 제한 도입으로 D1/D7 이탈률이 임계치 이상 상승하거나, 광고 기반 UX 불만이 임계치를 넘으면 freeHintsPerDay/adsPerDayMax를 조정하거나 정책을 재결정한다.
- related:
  - PRD section: SPEC 15.7, 38.1.6, 23.2, 40.2
  - Open Question: Q-001

### ADR-064 단일 재화(Coins) + 일일 보상형 광고 수급 정책
- date: 2026-02-24
- status: accepted
- owners: Monetization, BE
- context:
  - 펫/코스튬(차후) 및 간단한 커스터마이징 경제를 위해 단일 재화를 도입한다. 재화는 광고/결제 수급이 가능해야 하며, 다기기 동기화가 필요하다.
- options:
  - A: 재화 없음(MVP 제외)
  - B: 코인 1종(광고 수급 + IAP 구매)
  - C: 코인+젬 2종(복잡도 증가)
- decision:
  - B안(코인 1종)으로 확정한다.
  - 재화명: `coins` (단일)
  - 보상형 광고 1회 시청 보상: `+20 coins`
  - 재화벌이 일일 광고 한도: `10회/일` (UTC 00:00 리셋)
  - 저장: 코인 잔액은 계정 단위로 동기화되어야 하며, 서버가 일일 한도를 강제한다.
- rollback trigger:
  - 경제 인플레이션(잔액 과다 누적) 또는 광고 피로도가 임계치를 넘으면 1회 보상/일일 한도를 조정한다.
- related:
  - PRD section: SPEC 38.1.6, 19.3.2, 39.1, 23.2
  - Open Question: Q-063

### ADR-065 보상형(Rewarded) 광고 목적 고정(재화/힌트) + revive 제거
- date: 2026-02-24
- status: accepted
- owners: Monetization, FE
- context:
  - 보상형 광고가 여러 곳에 분산되면 UX/이벤트/한도 정책이 깨지기 쉽다. MVP에서는 목적을 고정해 구현 편차를 줄인다.
- options:
  - A: revive(부활) 목적 유지
  - B: 재화 수급 + 힌트 충전 2목적 고정
  - C: 재화/힌트/기타(무제한 확장)
- decision:
  - B안으로 확정한다.
  - MVP에서 보상형 광고 목적은 `currency_earn`, `hint_refill` 2개로만 고정한다.
  - `revive(부활)` 목적의 Rewarded 노출/요청은 MVP에서 제거한다.
  - 이벤트/집계는 “목적(purpose)” 기준으로 분해 가능해야 한다.
- rollback trigger:
  - revive 도입 필요성이 확인되면 Post-MVP에서 별도 ADR로 목적 추가(이벤트/한도/UX 동시 잠금) 후 도입한다.
- related:
  - PRD section: SPEC 38.1.5.1, 38.1.6, 23.2
  - Open Question: Q-064

### ADR-066 코인 IAP(소모성) 1-SKU + 서버 크레딧 정책
- date: 2026-02-24
- status: accepted
- owners: Monetization, BE
- context:
  - Premium(광고 제거)과 별도로 코인을 구매할 수 있어야 한다. 코인 구매는 소모성이며, 코인 잔액은 계정 단위로 동기화되어야 한다.
- options:
  - A: 코인 IAP 없음
  - B: 코인 IAP 1개(SKU 최소)
  - C: 코인 IAP 3개(가격 실험)
- decision:
  - B안(1개)으로 확정한다.
  - productId: `sudoku.coins.pack1`
  - 제공량: `+500 coins`
  - 기준 가격(USD): `1.99`
  - 크레딧: RevenueCat webhook 서버 경로에서만 코인 크레딧을 수행한다(클라이언트 직접 증감 금지).
- rollback trigger:
  - 전환율이 목표 미달이거나 가격 민감도가 높으면 3-SKU로 확장한다(별도 ADR로 SKU 추가).
- related:
  - PRD section: SPEC 38.1.2, 38.1.6, 39.6, 39.1
  - Open Question: Q-065

### ADR-067 Journey(Stage/Chapter) 도입 + 결정론적 stage seed 규칙
- date: 2026-02-25
- status: accepted
- owners: PM, FE, BE
- context:
  - Daily만으로는 장기 진행/목표 동기가 약할 수 있어, stage 기반 진행 모드를 MVP에 포함한다.
  - 서버 콘텐츠 목록/퍼즐 리스트 없이도 “같은 stage=같은 퍼즐”이 재현 가능해야 한다.
- options:
  - A: Journey 제외(MVP에는 Classic/Daily만)
  - B: 목록 기반 stage(서버/콘텐츠 테이블 필요)
  - C: 결정론적 seed 기반 stage(클라이언트 로컬 생성)
- decision:
  - C안으로 확정한다.
  - `journeyVersion=1`, `chapterId(=difficulty)=easy|medium|hard|expert|evil`, `stagesPerChapter=10`으로 고정한다.
  - `stageId=j{journeyVersion}_{chapterId}_{stageIndex2}`(예: `j1_easy_01`)로 고정한다.
  - seed/puzzleId 계산은 SPEC 18.1/18.2를 단일 기준으로 한다.
  - 진행도는 Cloud Sync(`/users/{uid}/journeyStages/{stageId}.bestStars`)에 저장한다(server-write).
  - Journey에는 gameover/failed가 없으며, 실수 제한(`mistakeLimitMode`)은 Journey에서 강제 `off`로 취급한다.
- rollback trigger:
  - Journey가 일정/QA 비용을 과도하게 증가시키면 stage 수 축소 또는 Post-MVP로 이관한다(별도 ADR).
- related:
  - PRD section: SPEC 18.1, 19.6, 21.11, 39.1.15, 39.4.3
  - Open Question: Q-066

### ADR-068 Journey 3-star 평가 + 코인 보상(총 지급/추가 지급 delta) 정책
- date: 2026-02-25
- status: accepted
- owners: PM, BE
- context:
  - Journey 진행의 동기 부여(별)와 코인 economy 진입점(보상)을 제공한다.
  - 반복 파밍/치팅을 줄이기 위해 "스테이지별 1회성 총 지급 + 별 개선 시 delta 지급"으로 제한한다.
  - 별 산출의 시간 기준(durationMs) 해석 불일치를 방지하기 위해 타이머/시간 정의를 잠근다.
- options:
  - A: 별만 제공(보상 없음)
  - B: 별+코인(클리어마다 반복 지급)
  - C: 별+코인(스테이지별 1회성 총 지급 + 별 개선 시 delta 지급)
- decision:
  - C안으로 확정한다.
  - 별 산출:
    - ⭐1: 클리어
    - ⭐2: `hintsUsed==0` AND `durationMs<=softLimitMs`
    - ⭐3: `hintsUsed==0` AND `durationMs<=hardLimitMs`
  - 시간 기준(durationMs) 정의:
    - `durationMs`는 `GameStatus=playing`에서만 누적되는 active play time(ms)이며, `paused`(background autoPause 포함) 시간은 포함하지 않는다(SPEC 21.10).
    - UI에 표시되는 Timer 값은 `durationMs`와 동일 기준(playing-only)이어야 한다(표시/판정 기준 불일치 금지).
  - 힌트 기준:
    - `hintsUsed`는 "힌트가 실제로 적용(Apply)된 횟수"로 정의한다.
    - 힌트 화면 열기/요청만으로 `hintsUsed`를 증가시키지 않는다.
    - ⭐2/⭐3 모두 `hintsUsed==0`을 유지한다(완화하지 않음).
  - 실수 기준:
    - `mistakes`는 별 산출 조건에 포함하지 않는다(통계/피드백 용도).
  - soft/hard 제한 시간 상수는 SPEC 21.11을 단일 기준으로 고정한다.
  - 코인 “총 지급 기준”은 `star1Total=+5`, `star2Total=+10`, `star3Total=+20`으로 고정한다.
  - 코인 지급은 서버 검증 함수 `verifyJourneyStage(stageId, sessionId)`로만 수행한다.
  - 중복 지급 방지를 위해 wallet의 `journeyRewardedStarsByStage[stageId]`를 server-write로 유지한다(Reset Progress 이후에도 유지).
- rollback trigger:
  - 인플레이션/악용이 임계치를 넘으면 지급량 조정 또는 stage reward 제거를 ADR로 재논의한다.
- related:
  - PRD section: SPEC 21.10, 21.11, 38.1.6.5, 39.4.3, 39.1.13, 39.1.15
  - Open Question: Q-067

### ADR-069 UI 테마(스킨) 상점 + Chapter 테마 해금 정책 (Post-MVP)
- date: 2026-02-26
- status: proposed
- owners: PM, FE, BE
- context:
  - UI 테마(스킨)를 코인 사용처 및 Journey 진행 보상(챕터 클리어 해금)으로 확장한다.
  - "해금"과 "구매"가 동시에 존재할 경우(예: 챕터 테마를 해금 전 선구매 가능) 중복 처리/복구/Reset Progress 규칙이 없으면 구현이 갈라진다.
- options:
  - A: 챕터 클리어 해금 only (상점 판매 없음)
  - B: 상점 구매 only (진행 해금 없음)
  - C: Hybrid (챕터 클리어 해금 + 상점 선구매 허용)
- decision:
  - MVP에서는 UI 테마 확장/해금/상점을 구현하지 않는다(테마 값은 `system|light|dark`만).
  - Post-MVP(v1.3+)에서 B-019로 구현하며, 구현 착수 전에 아래 항목을 확정한다(Q-068):
    - Chapter 클리어 정의: 예) 해당 chapter의 stage 10개 중 `bestStars>=1` 10개 달성 등
    - Reset Progress 시 테마 해금/구매 상태 유지 여부
    - 잠김 테마 선구매 허용 시 중복 처리(구매/해금 충돌) 및 UI 표시 규칙
    - 테마 소유/선택값 Cloud Sync 범위(권장: 계정 단위 sync)
    - 가격 정책(코인 가격/유료(IAP) 판매 여부/할인/프리미엄 혜택 여부) 및 경제 인플레이션 방지 가드
- rollback trigger:
  - 전환율/리뷰 악화 또는 경제 인플레이션이 임계치를 초과하면 테마 수 축소/가격 조정 또는 unlock-only로 단순화한다.
- related:
  - Open Question: Q-068
  - Backlog: B-019
  - PRD section: SPEC 20.2.6(Theme), 39.1.2(settings/meta), 39.1.13(wallet), 39.1.15(journeyStages)

---

## 28. Prompt Pack (바이브코딩 작업 템플릿)

> 목적: 구현 요청 프롬프트를 표준화해 출력 품질 편차를 줄인다.

공통 규칙:
- 입력: 대상 섹션 번호 + 파일 경로 + 변경 범위
- 출력: 변경 파일 목록, 핵심 결정 3개, 테스트 결과
- 금지: 범위 밖 리팩터링, 정책 미확정 항목 임의 확정

### 28.1 기능 구현 템플릿

```md
[Task]
Implement feature from PRD section: {section}

[Scope]
- In: {in_scope}
- Out: {out_scope}

[Constraints]
- Follow PRD defaults in section 3.3.
- Keep JS-only (.js/.jsx).
- Keep events/schema names unchanged.

[Deliverables]
1) code changes
2) tests
3) short changelog entry
```

### 28.2 버그 수정 템플릿

```md
[Bug]
{symptom}

[Repro]
1. ...
2. ...

[Expected]
{expected}

[PRD Reference]
{section}

[Fix Request]
- Add failing test first
- Implement minimal fix
- Report regression risk
```

### 28.3 스펙-코드 정합 점검 템플릿

```md
Compare implementation against PRD sections: {sections}
Output:
1) mismatches
2) missing tests
3) required doc updates
```

### 28.4 문서 최종 감사 템플릿 (Docs-only)

```md
You are a senior product+engineering spec auditor.
Review these files as a single source-of-truth set:

- PRD_INDEX.md
- PRD_MASTER.md
- PRD_SPEC_LOCK.md
- PRD_DECISIONS.md
- PRD_POST_MVP_BACKLOG.md

Important context:
- Baseline is v1.96-doc frozen (2026-02-25).
- Authority order on conflict: PRD_SPEC_LOCK.md > PRD_DECISIONS.md(ADR/Q decided) > PRD_MASTER.md > PRD_INDEX.md.
- Q-001~Q-xxx are authoritative if marked decided/deferred.
- ADR-001~ADR-xxx are authoritative if marked accepted.
- Do NOT reopen decided items unless you can prove a direct contradiction with exact file:line evidence.
- Focus on MVP commercialization quality (submission/privacy/ads+IAP/sync+recovery/support/ops), not feature creep.

Audit goals (strict):
1) Product completeness
2) Technical implementability
3) UX consistency
4) Performance risk
5) Scalability

What to find:
- Missing parts
- Contradictions between files
- Ambiguous statements that can cause implementation variance
- High-risk operational gaps (release/submission/support/sync/recovery)

Output language:
- Korean

Output format (strict):
0. Coverage snapshot (files scanned, baseline, confidence)
1. P0 (Critical) — max 5
2. P1 (Important) — max 5
3. P2 (Nice-to-have) — max 3
4. Missing MVP features — max 3
5. “Already resolved in v1.96-doc” (items that should NOT be raised again)
6. Final readiness verdict (GO / CONDITIONAL GO / NO-GO)
7. Placeholder scan

For each issue, use this template:
- Issue ID: [P0-1]
- Why it matters: (1-2 lines)
- Evidence:
  - file:line
  - file:line
- Risk if ignored: (specific failure mode)
- Patch-ready fix text:
  - exact MUST/SHOULD wording to insert/replace (docs-only)
- Target section(s): file + section name

Hard constraints:
- No generic advice.
- No code implementation; docs-only fixes.
- No “consider maybe” language in fixes.
- If a category has no valid issue, explicitly write “None”.
- Prefer minimal, high-leverage fixes over broad rewrites.

Special rule:
- Placeholder remaining in PRD_SPEC_LOCK.md 38.1.1.2 is a blocker for RC/Store submission only (not for implementation start). If that is the only blocker, Final readiness verdict should be CONDITIONAL GO with the blocker explicitly listed.
```

---

## 29. Regression Checklist (기능 추가 시 필수)

> 목적: 새 기능 추가 후 기존 핵심 루프가 깨지지 않도록 보장한다.

### 29.1 Core Loop
- [ ] 새 게임 시작 → 입력 → 완료까지 프리즈 없이 동작
- [ ] Undo(필수) 정상 동작, autosave/continue 정상 복원
- [ ] 후보 자동 삭제 옵션 ON/OFF 모두 정상

### 29.2 Hint
- [ ] L0/L1 힌트 요청/적용 정상
- [ ] Hint Apply 후 통계(hintsUsed) 누락 없음
- [ ] 힌트 실패 시 24장 에러 UX 규칙 준수

### 29.3 Sync/Data
- [ ] 오프라인 플레이 후 온라인 복귀 시 충돌 처리 정상
- [ ] settings/currentGame/stats merge 규칙(19.8) 준수
- [ ] 데이터 스키마 변경 시 마이그레이션 경로 문서화

### 29.4 Monetization
- [ ] 무료/프리미엄 분기 정상
- [ ] 광고 쿨다운/노출 규칙 위반 없음
- [ ] 구매 복원/검증 실패 시 안전한 fallback 동작

### 29.5 Performance
- [ ] 셀 입력 반응 50ms 목표 유지
- [ ] 셀 과리렌더(불필요 리렌더) 증가 없음
- [ ] 30분 연속 플레이에서 누수/프리즈 없음

### 29.6 Analytics
- [ ] 핵심 이벤트(23장) 필수 필드 누락 없음
- [ ] 이벤트 중복 전송 방지 확인
- [ ] 앱 버전/생성기 버전 태깅 정상

---

## 30. Changelog (문서 변경 이력)

> 목적: 문서 변경사항을 추적해 팀 내 기준 버전을 명확히 한다.

포맷:

| version | date | summary | changedSections | migrationNeeded | owner |
|---|---|---|---|---|---|
| v1.1-doc | 2026-02-21 | 구조 통합 + 충돌 규칙 고정 + 운영 섹션(26~30) 추가 | 3.3, 13.4, 13.10, 13.11, 17.6, 26~30 | no | Codex |
| v1.2-doc | 2026-02-21 | 상용 품질 보강 섹션 추가(접근성/예외/성능/QA/아키텍처/로그/온보딩) | 31~37 | no | Codex |
| v1.3-doc | 2026-02-21 | in_review 5건 선정 및 ADR-002~ADR-006 추가 | 26, 27 | no | Codex |
| v1.4-doc | 2026-02-21 | ADR-002/003 accepted 확정 및 Q-011/Q-024 decided 반영 | 26, 27, 32.2 | no | Codex |
| v1.5-doc | 2026-02-21 | 상용화 갭(제품/기술/UX/성능/확장성) 보강 및 SSoT 범위 정합 수정 | 3.3, 38 | no | Codex |
| v1.6-doc | 2026-02-21 | UX 상세 고도화(데이터 계약/카피 키/백버튼 매트릭스) 및 범위 확장 | 39~41, index/scope | no | Codex |
| v1.7-doc | 2026-02-21 | Q-036~Q-040 decided 전환, ADR-007~ADR-011 추가, 카피 en 컬럼 확장 | 26, 27, 31.5, 39.1.5, 39.4, 40.2, 40.3, 40.4, 41.3 | no | Codex |
| v1.8-doc | 2026-02-21 | Q-021~Q-023 decided 전환, ADR-012~ADR-014 추가, 접근성 스펙 고정 | 26, 27, 31.2, 31.4, 31.5 | no | Codex |
| v1.9-doc | 2026-02-21 | Q-026/Q-031/Q-033 decided 전환 및 ADR-004/005/006 accepted 확정 | 26, 27, 33.4, 36.1, 37.1 | no | Codex |
| v1.10-doc | 2026-02-21 | Q-025/Q-030/Q-032 decided 전환, ADR-015~ADR-017 추가, 규칙 강도 태깅 보강 | 26, 27, 32.5, 35.2, 35.4, 36.4 | no | Codex |
| v1.11-doc | 2026-02-21 | Q-027/Q-028/Q-029 decided 전환, ADR-018~ADR-020 추가, 성능/QA 기준 고정 | 26, 27, 33.3, 34.1, 34.3 | no | Codex |
| v1.12-doc | 2026-02-21 | 통계 복잡도 축소 방향 반영: Q-007 decided, ADR-021 추가, 프리미엄 스코프 단순화 | 5.3, 8.2, 22.2, 26, 27 | no | Codex |
| v1.13-doc | 2026-02-21 | 온보딩 마무리 잠금: Q-034/Q-035 decided, ADR-022/023 추가 | 26, 27, 37.1, 37.2, 37.4 | no | Codex |
| v1.14-doc | 2026-02-21 | 고급 힌트 제거 정리: Q-014/Q-015 deferred, ADR-024 추가, L2/L3/LearnHub MVP 제외 고정 | 3.1, 4.2, 15, 16, 17, 22.1, 22.2, 26, 27 | no | Codex |
| v1.15-doc | 2026-02-21 | Cloud Sync 백엔드 확정: Q-041 decided, ADR-025 추가, 7.1 후보 문구 제거 | 7.1, 19.1, 19.3.2, 39.1, 26, 27 | no | Codex |
| v1.16-doc | 2026-02-21 | 로그인 범위 1차 확정: Q-020 decided, ADR-026 추가 | 7.1, 19.2, 22.1.F, 26, 27 | no | Codex |
| v1.17-doc | 2026-02-21 | 게스트 모드 제거: Q-020/ADR-026을 로그인 필수(Apple/Google) 정책으로 갱신 | 7.1, 19.1, 19.2, 19.12, 20.2.8, 22.1.F, 26, 27 | no | Codex |
| v1.18-doc | 2026-02-21 | 로그인 스킵 미지원 명시: 온보딩 Skip 의미를 튜토리얼로 한정, ADR-026 문구 보강 | 37.1, 37.4, 27 | no | Codex |
| v1.19-doc | 2026-02-21 | Cloud Sync 토글 제거 확정: Q-042 decided, ADR-027 추가, Data 설정에서 cloudSync 토글 삭제 | 7.1, 20.2.8, 20.4, 21.9, 24.3, 26, 27 | no | Codex |
| v1.20-doc | 2026-02-21 | RN+Expo 확정 및 버전 정책 고정: Q-043 decided, ADR-028 추가, latest 자동 추종 금지 명시 | 12.1, 38.2.1, 38.2.2, 26, 27 | no | Codex |
| v1.21-doc | 2026-02-21 | 초기 수익화 KPI 보수적 최소값 확정: Q-044 decided, ADR-029 추가, 1.2 목표치 수치화 | 1.2, 26, 27 | no | Codex |
| v1.22-doc | 2026-02-21 | 생성/입력 기본값 확정: Q-004/Q-005 decided, ADR-030/031 추가, 대칭 제거/가능 셀 강조 기본 ON 고정 | 4.1.1, 4.4, 13.8.9, 18.3, 20.2.3, 26, 27 | no | Codex |
| v1.23-doc | 2026-02-21 | 자동 후보 삭제 기본값 확정: Q-045 decided, ADR-032 추가, MASTER 문구를 ON 고정으로 정리 | 4.3, 20.2.1, 26, 27 | no | Codex |
| v1.24-doc | 2026-02-21 | 코어 UX/아키텍처 애매점 일괄 확정: Q-003/Q-006/Q-009/Q-010/Q-012/Q-013/Q-046~Q-049 decided, ADR-033~ADR-042 추가 | 8.1, 8.2, 12.1, 13.9.3, 13.9.7, 13.9.8, 13.10.5, 13.10.6, 20.2.1, 21.4.3, 21.9, 38.1.2, 26, 27 | no | Codex |
| v1.25-doc | 2026-02-21 | 남은 핵심 정책 확정: Q-001/Q-002/Q-008/Q-016/Q-017/Q-018/Q-019 decided, ADR-043~ADR-049 추가 및 스펙 동기화 | 4.2.2, 4.5, 7.1, 13.11.3, 13.11.5, 15.7, 18.5.3, 19.6, 19.10, 20.2.2, 21.2, 21.8, 25.7, 26, 27 | no | Codex |
| v1.26-doc | 2026-02-21 | deferred 분리 정리: Q-014/Q-015를 Post-MVP 실행 백로그(42.2.1/B-001, 42.2.2/B-002)로 이관 | 26, 30, 42(new), index | no | Codex |
| v1.27-doc | 2026-02-21 | Post-MVP 백로그 확장: MASTER 3.2/5.3 및 기타 후보를 B-003~B-015로 구조화 | 42.3, 42.4, 42.5 | no | Codex |
| v1.28-doc | 2026-02-21 | v1.1 실행 큐 고정: B-003/B-005/B-008을 planned로 확정하고 42.6 실행 순서 추가 | 42.3, 42.4, 42.6 | no | Codex |
| v1.29-doc | 2026-02-21 | v1.1 티켓화: B-003/B-005/B-008을 T-1101~T-1303 실행 티켓으로 분해 | 42.7 | no | Codex |
| v1.30-doc | 2026-02-21 | 상용화 정합 보강: 광고-힌트 정책 충돌 해소, 세이브 슬롯/세션 보관 고정, 계정삭제/광고동의/최소OS/성능수치/flag 운영 규칙 추가 | 8.1, 9, 13.11.4.1, 19.3.2, 19.4, 33.1, 33.4, 38.1, 38.2, 38.5, 42.5 | no | Codex |
| v1.31-doc | 2026-02-21 | 상용 운영 정합 추가: Data 설정 액션(복원/동의/삭제), 계정삭제 이벤트/스키마/삭제요청 컬렉션, 카피 키, 이벤트 상한(25) 반영 | 20.2.8, 23.1, 23.2, 39.1.1, 39.1.6, 39.3, 40.2 | no | Codex |
| v1.32-doc | 2026-02-21 | 운영 리스크 정책 고정: Q-050/Q-051 decided에 대한 ADR-050/051 본문 추가 및 추적 이력 반영 | 26, 27, 30 | no | Codex |
| v1.33-doc | 2026-02-21 | 구현 분기 축소를 위한 스펙 잠금 강화: 생성기/스트릭/Undo 핵심 규칙과 Settings 기본값을 MUST로 고정하고 통계 범위(MVP vs Post-MVP)를 정합화 | 14.5, 14.8, 18.1, 18.2, 18.3, 18.4, 18.5, 18.8, 19.8.4, 20.3, 21.2, 21.4, 25.6, 38.4, 30 | no | Codex |
| v1.34-doc | 2026-02-21 | 성능 렌더 규칙 잠금: 25.2~25.4의 권장 표현을 MUST/MUST NOT으로 고정하고 셀 props/파생계산/후보 캐시 계약을 확정 | 25.2, 25.3, 25.4, 30 | no | Codex |
| v1.35-doc | 2026-02-21 | 성능 실행 규칙 잠금: 25.5~25.7 애니메이션/저사양 모드를 MUST로 고정하고 candidateRenderMode 설정 키를 추가 | 20.2.3, 20.3, 25.5, 25.7, 30 | no | Codex |
| v1.36-doc | 2026-02-21 | 성능 검증/차단 규칙 잠금: 25.8~25.9를 MUST/MUST NOT으로 고정하고 릴리즈 전 성능 로그/금지 패턴 위반 차단 기준을 명시 | 25.8, 25.9, 30 | no | Codex |
| v1.37-doc | 2026-02-21 | 결제 계약 잠금: Store IAP only 정책, SKU/entitlement/상태머신, purchases 스키마, 결제 이벤트 6종, 결제 예외 UX/카피를 MVP 고정 | 8.2, 13.11.4.2, 20.2.9, 23.1, 23.2, 23.3, 24.9, 38.1.2, 39.1.7, 39.2, 39.3, 39.4, 40.2, 30 | no | Codex |
| v1.38-doc | 2026-02-21 | RevenueCat 운영 잠금 추가: 콘솔 체크리스트(엔타이틀먼트/오퍼링/샌드박스), webhook 인증/멱등/상태반영 계약, purchases 스키마 필드 확장 | 13.11.4.2, 38.2.2, 38.2.5, 39.1.7, 39.6, 30 | no | Codex |
| v1.39-doc | 2026-02-21 | RevenueCat webhook 구현 체인 잠금: 함수 단위 처리 순서/정규화 스키마/상태전이 함수/트랜잭션 쓰기/도메인 이벤트/에러 코드 매핑 추가 | 39.6.1, 39.6.2, 39.6.3, 39.6.4, 39.6.5, 39.6.6, 30 | no | Codex |
| v1.40-doc | 2026-02-22 | 결제 정합 보강: profile.premium 서버 전용 write 명시, idempotencyEvents 스키마/TTL/보안 추가, TRANSFER source-target 계약 정렬, 학습 이벤트 MVP 미발행 고정, 서버 환경키 분리 강화 | 23.2, 38.2.3, 39.1.1, 39.1.8, 39.2, 39.3, 39.4, 39.6.1, 39.6.2, 39.6.3, 39.6.4, 30 | no | Codex |
| v1.41-doc | 2026-02-22 | 릴리즈 고정값 잠금: Privacy/Terms URL 확정, Hint Apply Undo 고도화 분기 제거(Post-MVP B-014로 이관), MVP 킥오프 버전 락(38.2.1.1)과 검증 체크리스트 추가 | 3.3, 12.1, 20.2.8, 21.6, 38.1.1, 38.2.1, 38.2.2, 40.2, 30 | no | Codex |
| v1.42-doc | 2026-02-22 | 문의 채널 고정: support email/support form URL 확정, Settings > Data `contactSupport` 액션 추가, 카피 키 동기화 | 20.2.8, 38.1.1, 40.2, 30 | no | Codex |
| v1.43-doc | 2026-02-22 | 계정 삭제 요청 보안 잠금: `/deletionRequests/{uid}`를 create-only(클라이언트) + 상태 전이/수정 서버 전용으로 명시하고 필드 write 책임을 고정 | 39.1.6, 39.3, 30 | no | Codex |
| v1.44-doc | 2026-02-22 | 삭제-결제 경합 차단: deletion 상태 uid webhook 반영 금지, idempotency `ignoredReason` 추가, webhook 함수 체인/전이/트랜잭션/에러코드에 deletion guard 규칙 반영 | 38.1.4, 39.1.8, 39.3, 39.6, 30 | no | Codex |
| v1.45-doc | 2026-02-22 | 회원탈퇴 예외 UX 보강: 24.10(요청/처리중/실패/재인증 실패) 추가, 결제/복원 CTA 비활성 규칙 명시, 계정삭제 상태 카피 키 확장 | 24.10, 40.2, 30 | no | Codex |
| v1.46-doc | 2026-02-22 | Master-Spec 정합 보강: Settings > Data 요약 항목에 `문의하기`를 추가해 SPEC(20.2.8/contactSupport)과 일치시킴 | 9, 30 | no | Codex |
| v1.47-doc | 2026-02-22 | 릴리즈 체크리스트 고정: 법적 고지 3종 문안과 스토어 메타(스크린샷/설명/키워드) 기준을 확정하고 법적 고지 카피 키를 추가 | 38.1.1, 40.2, 30 | no | Codex |
| v1.48-doc | 2026-02-22 | 회원탈퇴 재시도 경로 충돌 해소: `deletionRequests` create-only 정책을 유지하면서 재시도는 서버 함수 `retryDeletionRequest(uid)`로만 수행하도록 UX/보안 규칙을 고정 | 24.10, 39.3, 30 | no | Codex |
| v1.49-doc | 2026-02-22 | 회원탈퇴 실패 이벤트 보강: 23.2에 `account_delete_failed` 추가, 삭제 성공/실패 이벤트 분리, 집계 목적 및 삭제 상태 기록 규칙 동기화 | 23.2, 23.3, 24.10, 38.1.4, 30 | no | Codex |
| v1.50-doc | 2026-02-22 | 회원탈퇴 처리 지연 임계값 고정: `processingStartedAt` 기반 24h 경고+문의 CTA, 7일 초과 시 `failed(server_timeout)` 전이 및 이벤트 기록 규칙 추가 | 24.10, 38.1.4, 39.1.6, 39.3, 40.2, 30 | no | Codex |
| v1.51-doc | 2026-02-22 | 상용화 정합 대규모 보강: Daily(UTC/로컬 seed) 단일화, currentGame 스키마 추가, sessions/event 필드명 통일, Hint/Input/Reset 규칙 고정, Paywall/스토어 제출/문의 진단 정보 계약 추가 | MASTER 3.1/4.2.2/4.4/5.2.2/5.4/7.1/8.2/9/12.1/13.11.3.2, SPEC 15.5/17.1/18.1/18.7/19.3/19.6/19.9/20.1/20.2.1/20.2.8/20.3/21.1.2/21.6/21.7/23.2/23.3/24.3/24.9/32.4/38.1.1~38.1.5/39.1/39.3/40.2/40.3/41.4 | no | Codex |
| v1.52-doc | 2026-02-22 | 모호 표현 자동 스캔 정리: 구현 영향도가 큰 미확정 5건을 `Q-052~Q-056` open 후보로 압축 등록 | 26, 30 | no | Codex |
| v1.53-doc | 2026-02-22 | 모호 표현 5건 최종 확정: `Q-052~Q-056` decided 전환, ADR-052~ADR-056 추가, streak/stats/sync retry/support 계약을 스펙에 반영 | 19.3.2, 19.6, 19.8.3, 19.8.4, 19.9, 20.2.8, 24.3, 32.2, 32.4, 38.1.3, 39.1, 39.2, 39.3, 40.2, MASTER 7.1/7.2/9, 26, 27, 30 | no | Codex |
| v1.54-doc | 2026-02-22 | 감사 결과 반영: 생성/해시/RNG 규칙 고정, Daily 서버 검증 경로(`verifyDailyStamp`) 명시, Reset/Cache/Data action 계약 강화, IA/상태표/카피 키 정합 보강, Master-ADR 수익화 문구 충돌 해소 | MASTER 0/6.1/7.2/8.2/9/13.11.3/13.11.5, SPEC 16.1/18.1/18.2/18.5.3/18.7/19.7/20.2.8/23.2/23.3/23.4/24.1/24.3/32.4/38.1.1/38.1.2/38.5.2/39.2/39.4/40.2/41.4/41.6, 30 | no | Codex |
| v1.55-doc | 2026-02-22 | 남은 모호 표현 5건 수치 잠금: autosave debounce 400ms 고정, settings push 쿨다운 10초 고정, 이벤트 flush 조건(Completed/20건/15초) 고정, 생성 실패 임계치(3회차) 고정, events 스키마에 appSessionId 필드 추가 | SPEC 19.5, 19.7, 21.5.2, 23.1, 23.4, 24.1, 39.1.5, 30 | no | Codex |
| v1.56-doc | 2026-02-22 | 아이콘 세트 고정: Q-057 decided, ADR-057 추가, MVP 아이콘 라이브러리를 MaterialCommunityIcons(@expo/vector-icons)로 잠그고 브랜드 아이콘 예외 범위를 명시 | MASTER 12.1, SPEC 31.2, 26, 27, 30 | no | Codex |
| v1.57-doc | 2026-02-22 | semantic icon mapping 고정: Q-058 decided, ADR-058 추가, 41.7에 상태/액션별 `semanticKey -> glyphName` 표를 잠그고 크기 토큰(16/20/24)을 고정 | SPEC 31.2, 41.7, 26, 27, 30 | no | Codex |
| v1.58-doc | 2026-02-22 | 테스트 전략 고정: Q-059 decided, ADR-059 추가, RN 기본 자동화(ESLint/Jest/RNTL/Maestro) + Web 보조 스모크 + 릴리즈 네이티브 게이트 정책을 명시 | MASTER 10, SPEC 22.3, 38.2.6, 26, 27, 30 | no | Codex |
| v1.59-doc | 2026-02-22 | CI 명령어 계약 고정: Q-060 decided, ADR-060 추가, npm script 기반 게이트 순서(PR/RC)와 필수 스크립트 키셋을 명시 | MASTER 10, SPEC 38.2.6.1, 26, 27, 30 | no | Codex |
| v1.60-doc | 2026-02-22 | Sprint 0 테스트 준비 잠금: Q-061 decided, ADR-061 추가, 22.4에 `package.json` 스크립트 키셋 생성과 CI 템플릿 초안 체크리스트를 추가 | SPEC 22.4, 26, 27, 30 | no | Codex |
| v1.61-doc | 2026-02-22 | 문서 기준선 동결 선언: `v1.60-doc`를 작업 기준선으로 고정하고 구현 상태를 `not started`로 명시 (`PRD_INDEX`/`PRD_DECISIONS` 헤더 동기화) | index header, decisions header, 30 | no | Codex |
| v1.62-doc | 2026-02-22 | 브랜드명 고정: Q-062 decided, ADR-062 추가, 앱 표시명 `sudo9`를 고정하고 표시명/운영 식별자 분리 원칙 및 카피 키(`app.identity.display_name`)를 반영 | MASTER title, SPEC 38.1.1/40.2, index header, decisions header, 26, 27, 30 | no | Codex |
| v1.63-doc | 2026-02-23 | 상용화 감사(P0/P1) 보강: Rewarded 노출 조건을 Mistake Limit failed 기준으로 단일화, Premium 광고 차단 범위(요청/노출/CTA) 명시, 스토어 Privacy 템플릿에 광고 식별자/동의 항목 추가, 22.3 CI 게이트를 `pnpm run` 계약으로 동기화, Rewarded Opt-in 이벤트 2종(34~35)과 계산식 추가, 이벤트 상한은 MVP 35개 기준 유지(과거 25 언급은 최신 계약 아님) | MASTER 13.10.3/13.10.6/13.11.4.1, SPEC 20.2.8/22.3/23.2/23.3/38.1.1/38.1.1.1/38.1.2/38.1.5, 30 | no | Codex |
| v1.64-doc | 2026-02-23 | 감사 후속 정합 보강: `currentGame.generatorVersion` 타입을 events와 동일한 number로 통일, `purchase_restore_requested.source`에 `paywall` 추가, MASTER 광고 요약(8.1)에 Rewarded 조건/Interstitial 규칙을 MUST로 명시, PlaySession 시간 필드(`durationMs`)와 이벤트 시간 단위(ms) 규칙 고정, Paywall 환불 지연 고지 카피 키(`paywall.disclaimer.refund_delay`) 추가 | MASTER 5.4/7.2/8.1/13.11.4.1, SPEC 23.2/38.1.2/39.1.9/40.2, decisions header/index header, 30 | no | Codex |
| v1.65-doc | 2026-02-23 | 정합 재점검 반영: PlaySession timestamp 타입을 SPEC 39.1.4와 일치, resetProgress 큐 purge/멱등(requestId) 계약 강화, achievements를 Post-MVP reserved로 명시해 MVP 범위 충돌 제거, ad consent 이벤트 reason 필드와 SDK 실패 기록 규칙 고정, 온보딩 Classic preset의 tutor 항목 제거 | MASTER 1.1/3.3/5.4/7.1, SPEC 19.3.2/19.6/19.8.4/19.8.5/19.12/20.2.8/23.2/23.4/37.2/38.1.5/39.1/39.3/39.4, decisions header/index header, 30 | no | Codex |
| v1.66-doc | 2026-02-23 | 최종 감사 반영: 계정 삭제 오프라인/서버 커밋 게이트 및 차단 토스트 추가, GameState 예시를 후보/solutionHash 중심으로 정렬하고 정답 원문 저장 금지 명시, resetProgress requestId 영속/재시도/종결 삭제 규칙을 MMKV+멱등 계약에 고정, KPI 산식 데이터 소스(AdMob/RevenueCat/이벤트) 고정, premiumEffective 우선순위 규칙 및 game_start seed 타입(string) 명시 | MASTER 1.2/13.11.2.1, SPEC 19.3.1/20.2.8/23.2/24.10/38.1.2.1/38.1.4/39.4/40.2, decisions header/index header, 30 | no | Codex |
| v1.67-doc | 2026-02-23 | 최종 감사 후속 잠금: 계정 삭제 create timeout/unknown의 read-back/already_exists 처리 규칙 추가, deletionRequests 본인 read 허용(read-back 전용) 명시, resetUserProgress 응답 계약(status/retriable/errorCode)과 requestId 삭제 조건 고정, 상단 리텐션 요약에서 업적/리더보드 MVP 제외를 명문화 | MASTER 0/3.3, SPEC 20.2.8/38.1.4/39.3/40.2, decisions header/index header, 30 | no | Codex |
| v1.68-doc | 2026-02-23 | 최종 Freeze 전 정합: `ad_consent_updated.status` enum에 `unknown` 추가(상태머신과 동일), D1/D7 Retention 산식/UTC 경계/데이터 소스(`app_open`)를 MASTER KPI에 고정 | MASTER 1.1/3.3, SPEC 23.2, decisions header/index header, 30 | no | Codex |
| v1.69-doc | 2026-02-23 | Firestore singleton 문서 경로를 고정 docId `meta`로 정규화(`/users/{uid}/profile/meta` 등)해 collection/document 교대 규칙을 준수하고, resetProgress 멱등 마커 경로를 `/users/{uid}/ops/meta/resetProgressRequests/{requestId}`로 정합. 계정 삭제 "영구 삭제(done)"의 의미(Auth 삭제 + Firestore `/users/{uid}/**` recursive delete)를 명문화하고, `failed(server_timeout)` 표기를 `status=failed + reason=server_timeout`으로 정합 | MASTER 3.3/7.1, SPEC 19.6/38.1.4/39.1/39.3/39.4/39.4.1/39.6, 26/27, decisions header/index header, 30 | no | Codex |
| v1.70-doc | 2026-02-23 | 계정 삭제 timeout 표기 정합: deletionRequests 스키마는 `status` enum만 사용(사유 저장 금지)하고, timeout 사유는 `account_delete_failed.reason=server_timeout` 이벤트로만 기록하도록 문구를 통일 | SPEC 24.10/38.1.4/39.1.6/23.2, decisions header/index header, 30 | no | Codex |
| v1.71-doc | 2026-02-23 | 스토어 Privacy/Data Safety 제출 체크리스트(38.1.1.1) placeholder 제거 및 MVP 값 고정(수집/보관/컨트롤/정책 섹션), premiumEffective 기반으로 Premium 광고 차단 규칙을 강화(AdMob SDK 초기화 금지 포함), currentGame 복원 시 Undo 스택 초기화 규칙을 MUST로 승격 | SPEC 38.1.1.1/38.1.2.1/39.1.9, decisions header/index header, 30 | no | Codex |
| v1.72-doc | 2026-02-23 | 플랫폼 광고/추적 제출-런타임 정합 보강: iOS `NSUserTrackingUsageDescription` 카피 키(`att.usage_description`) 고정, Android `com.google.android.gms.permission.AD_ID` 선언 MUST, RevenueCat 로그인 바인딩(`logIn(firebaseUid)`) 완료 전 검증/구매/복원 금지 및 계정 삭제 직전 `logOut()` 캐시 초기화 규칙 고정. 접근성 설정 `screenReaderVerboseCandidates`를 Settings UI/기본값에 반영, `candidateRenderMode=auto` 저사양 감지 기준(p95 fps/응답시간) 수치 잠금 | SPEC 19.2/20.2.6/20.3/25.7/38.1.4/38.1.5/38.2.5/40.2, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.73-doc | 2026-02-23 | 동의 런타임 키의 클라우드 동기화 제외를 명시: `adConsentStatus/adConsentRegion/adConsentUpdatedAt/attStatus`는 디바이스 로컬 전용이며 Firestore `settings/meta.values`에 저장/동기화 MUST NOT. Cloud 저장 대상 목록(19.3.2)에 `settings`/`events`를 명시하고, settings 문서 스키마(39.1.2)에 “포함 키 범위(20.2.1~20.2.7) 고정”과 runtime key 제외 규칙을 추가 | SPEC 19.3.2/20.2.9/39.1.2/38.1.1.1, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.74-doc | 2026-02-23 | 상용화/제출/결제 경계 보강: Premium 로컬 캐시 갱신 규칙(purchaseState/premiumLastVerifiedAt) 고정 + 클라이언트 purchases write 금지 문구를 상태머신에 반영, RevenueCat webhook 규칙에서 로컬 키 갱신 문구 제거. 계정 삭제 서버 워커 계약(요청->processing 전이 SLA/삭제 단계/멱등/재시도) 추가. 스토어 제출/운영 고정값 강화: 식별자 고정 테이블(번들ID/패키지명/AdMob App ID/연령등급 등) 추가 및 “값 없으면 릴리즈 금지”, iOS Privacy Manifest/Required Reason API 제출 요구 및 Sprint 0 체크리스트 추가. 온보딩 1st-run에 Consent Gate 단계 삽입, ADR-051과 일치하도록 동의 거부 시 non-personalized fallback 규칙을 단일화. 이벤트 문서에 `clientTimestampMs` 필드를 추가해 오프라인 업로드에서도 발생 시각 분석 가능하도록 계약 고정. Paywall 오프라인 UX를 CTA 비활성+안내 카피로 정리 | SPEC 18.5.1/19.2/23.1/37.1/38.1.1/38.1.1.2/38.1.2.1/38.1.4/38.1.4.1/38.1.5/38.2.2/39.1.5/39.6/40.2/41.4, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.75-doc | 2026-02-23 | 온보딩 Consent Gate를 강제 규칙으로 명문화(`adConsentStatus=unknown` 상태로 Home/Game 진입 금지), Settings > Data에 `Logout` 액션을 추가하고 로그아웃 시 RevenueCat/Firebase signOut + user-scoped 로컬 데이터 purge 순서를 고정(동의 런타임 키는 유지). 퍼즐 프리생성 캐시에 14일 만료 규칙을 추가해 MMKV 캐시 비대화 리스크를 제어 | SPEC 18.5.1/19.2/20.2.8/20.2.9/37.1, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.76-doc | 2026-02-23 | Logout UI 카피 키 보강: Settings > Data 액션 라벨 `settings.data.logout`를 40.2 공통 카피 테이블에 추가해 하드코딩/로케일 누락을 방지 | SPEC 40.2, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.77-doc | 2026-02-23 | 계정 삭제 레이스 차단 + 동의 관리 UX 정합: deletionRequests(`requested|processing|done`) 동안 client `/users/{uid}/**` write 전면 금지, 서버 워커 done 전 `/users/{uid}/**` recursive delete 1회 추가 수행, Settings > Data `manageAdConsent` 화면 표시/ATT 재요청 금지/unknown 라우팅 규칙 고정, `adConsentRegion` enum(`EEA|US_CA|ROW`)으로 잠금 | SPEC 20.2.8/20.2.9/38.1.4.1/39.3, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.78-doc | 2026-02-23 | 상용화 운영 보강: Reset Progress 서버 함수명(`resetUserProgress`)을 단일로 고정하고 멱등 계약(39.4) 문구를 정합화. 광고 지면/빈도 규칙을 SPEC_LOCK에 잠금(배너/리워드/인터스티셜의 노출 위치/쿨다운/베스트에포트 스킵)하고 AdMob 프로덕션 Ad Unit ID 6종을 식별자 테이블에 포함 + Sprint0 체크리스트에 AdMob 콘솔 생성/검증을 추가. 계정 삭제 확인 카피에 “구매 복원” 안내를 포함하고, RevenueCat webhook 감사 로그를 allowlist 기반(민감값 금지)으로 고정 | SPEC 19.8.5/38.1.1.2/38.1.4/38.1.5.1/39.4/39.6/40.2/38.2.2, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.79-doc | 2026-02-23 | Sync/스토어 제출 리스크 추가 잠금: 충돌 해결의 `updatedAt` 비교 규칙(로컬 epoch ms + Firestore timestamp->ms 변환 + 동률 시 cloud 우선)을 MUST로 고정하고, 스토어 심사 편차 방지를 위해 Review Notes 템플릿(로그인/샌드박스 결제/광고 제거)을 운영 산출물로 추가 | SPEC 19.8, SPEC 38.1.1.3, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.80-doc | 2026-02-23 | 계측/요약 정합 보강: `ad_consent_updated.region`을 `adConsentRegion` enum(`EEA|US_CA|ROW`)과 동일하게 잠금하여 세그먼트 분산을 방지하고, MASTER Settings > Data 요약에 `로그아웃`을 추가해 SPEC(20.2.8)과 일치시킴 | SPEC 23.2, SPEC 20.2.9, MASTER 9, decisions header/index header, 30 | no | Codex |
| v1.81-doc | 2026-02-24 | 스토어 제출/개인정보 정합 보강: 38.1.1.1에 Firestore 플레이 데이터 및 고객지원 문의 data_item을 추가해 실제 저장/수집과 1:1 매핑을 고정하고, 동의 런타임 키의 보관/TTL 제외 규칙을 20.2.9에 명문화. iOS Required Reason API 선언 테이블(38.1.1.4) 신설 + Sprint0 체크리스트에 선언/TTL 검증 항목 추가. 결제/삭제 UX 정합: 38.1.2에 RevenueCat `logIn(firebaseUid)` 완료 전 결제/복원 금지 규칙을 재명시, 38.1.4의 로컬 purge는 `logout` 규칙(Consent 키 유지)으로 고정. Post-MVP 경로 표기(dateUTC) 통일 및 MASTER MVP 광고 스코프(인터스티셜 포함) 정합 | SPEC 19.6/20.2.9/38.1.1.1/38.1.1.4/38.1.2/38.1.3/38.1.4/38.2.2, MASTER 3.1, decisions header/index header, 30 | no | Codex |
| v1.82-doc | 2026-02-24 | Firebase 설정 파일 반영: google-services/GoogleService-Info 기반으로 앱 식별자(`bundleId`/`applicationId`) 및 Firebase projectId(prod)를 38.1.1.2 식별자 테이블에 확정 기입하여 `<FILL_ME>` 블로커를 축소 | SPEC 38.1.1.2, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.83-doc | 2026-02-24 | AdMob App ID 확정: iOS/Android AdMob App ID 값을 38.1.1.2 식별자 테이블에 기입하여 `<FILL_ME>` 블로커를 축소 | SPEC 38.1.1.2, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.84-doc | 2026-02-24 | 재화/힌트 BM 확정: 코인 wallet + Rewarded 코인 수급(일일 10) + 힌트 일일 3/광고 충전(일일 5) + Rewarded 목적 `currency_earn`/`hint_refill` 고정(revive 제거) + 코인 IAP 1-SKU + Pet/코스튬 Post-MVP 백로그 추가 | SPEC 15.7/16.2.1/19.3.2/19.6/23.2/38.1.1.1/38.1.1.2/38.1.2/38.1.2.2/38.1.5.1/38.1.6/39.1.13/39.1.14/39.3/39.4/39.4.2/39.6/40.2, MASTER 3.1/8.1/8.2/13.10.6/13.11.4.1, BACKLOG B-017~B-018, decisions header/index header | no | Codex |
| v1.85-doc | 2026-02-24 | 정합/운영 패치: Rewarded `currency_earn` CTA 위치를 Coins Store로 단일화하고 이벤트 source(`coins_store`)를 정합. `grantRewardedCoins`에서 wallet/meta 자동 생성 규칙 추가. 힌트 quota 로컬-only 정책을 15.7에 명시하고 HintGateSheet 표기(Quota gate) 정리. ADR-043(힌트 무제한)을 ADR-063으로 superseded 처리. ops 문서 TTL(expireAt) 규칙을 39.2에 포함 + Sprint0/릴리즈 TTL 게이트 갱신. AdMob Reward 설정은 앱 로직에서 신뢰하지 않음을 명문화하고 Review Notes에 “v1.0 코인 사용처 없음”을 추가 | SPEC 15.7/16.1/16.2.1/23.2/38.1.1.2/38.1.1.3/38.1.1.4/38.1.5.1/38.1.6.2/38.2.2/39.1.12/39.1.14/39.2/39.4.2, MASTER 8.1/13.11.4.1, ADR-043, decisions header/index header, 30 | no | Codex |
| v1.86-doc | 2026-02-24 | AdMob 프로덕션 Ad Unit ID 8종(iOS/Android: Banner/Interstitial/Rewarded CoinsEarn/Rewarded HintRefill) 확정 기입으로 `<FILL_ME>` 블로커 축소 | SPEC 38.1.1.2, decisions header/index header | no | Codex |
| v1.87-doc | 2026-02-24 | 스토어 연령등급 및 child-directed(COPPA) 여부 확정 기입(iOS 4+, Android 3+, child-directed=false)으로 `<FILL_ME>` 블로커 축소 | SPEC 38.1.1.2, decisions header/index header | no | Codex |
| v1.88-doc | 2026-02-24 | iOS Required Reason API 선언 테이블(38.1.1.4) lastVerifiedAt 값을 기입(2026-02-25)하여 `<FILL_ME>` 블로커 축소 | SPEC 38.1.1.4, decisions header/index header | no | Codex |
| v1.89-doc | 2026-02-24 | 스토어 제출/스코프 정합 패치: 38.1.1에 스토어 메타(ko/en short+full, iOS keywords, 스샷 6장 매핑) 확정값을 고정하고, 38.1.1.2 `<FILL_ME>` 게이트를 RC/스토어 제출용으로 한정 + Apple App ID 기입 규칙 추가. MASTER 테마/성능/보안 문구를 SPEC 단일 기준으로 정합하고, ADR-043 decision 블록의 superseded 충돌 문장을 제거 | SPEC 38.1.1/38.1.1.2, MASTER 6.1/13.11.5.1/13.11.5.2, ADR-043, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.90-doc | 2026-02-24 | 정합 패치 2: PRD_MASTER 4.2.2의 “L1 무제한” 문장을 SPEC/ADR 단일 기준 참조로 교체(ADR-063). 테마 범위를 전 문서에서 Light/Dark/system으로 정렬: SPEC 설정 enum에서 `paper|mono` 제거 + 유효값 외 관측 시 system 정규화 규칙 추가, MASTER parity 체크리스트의 “추가 테마” 문구 제거. Coins Pack1 환불/취소 시 wallet 차감은 `max(0, balance-500)` 클램프 + 채무 저장 금지로 고정. wallet 최초 생성 시 `currencyEarnDateUTC=todayUTC` 규칙을 스키마에 명문화. PRD_INDEX에 `<FILL_ME>` 잔존 시 RC/스토어 제출 금지 요약을 추가 | MASTER 4.2.2/6.1/13.11.7, SPEC 20.2.6/39.1.13/39.6, PRD_INDEX, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.91-doc | 2026-02-24 | 컴플라이언스/결제 UX 정합: iOS Required Reason API `lastVerifiedAt`는 미래 날짜 금지(MUST NOT)로 잠그고 값은 2026-02-24로 정렬. 코인 “사용처 없음” 고지를 유저용 카피로 강화하고(`coins.store.disclaimer.coming_soon`), Coins Store에서 코인 IAP CTA 바로 위에 해당 고지를 고정 노출하도록 UI 규칙을 명문화 | SPEC 38.1.1.4/38.1.2.2/40.2, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.92-doc | 2026-02-24 | 스코프 혼선 제거: PRD_MASTER의 데이터 모델 요약에 있는 Achievement를 Post-MVP reserved로 표기해 SPEC의 “MVP MUST NOT create/write”와 정합 | MASTER 7.2, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.93-doc | 2026-02-24 | 게이트/결제/스토어 제출 정합: RC/스토어 제출 블로커 규칙 문장에서 `<FILL_ME>` 리터럴을 제거하고 placeholder 표현으로 통일(자동 스캔 false-positive 방지) + PRD_INDEX에 authority order 1줄 고정. PRD_MASTER IAP 요약에서 entitlement 적용 범위를 Premium SKU로 한정하고 Coins Pack은 premium 변경 금지(MUST NOT)를 추가. Google Play Data Safety “encrypted in transit”를 Yes로 고정 제출(HTTPS/TLS only, HTTP 금지) | SPEC 38.1.1/38.1.1.2/38.1.1.4, MASTER 8.2, PRD_INDEX, decisions header/index header, MASTER 3.3, 30 | no | Codex |
| v1.94-doc | 2026-02-25 | 개발 착수/제출 게이트 명확화: 38.1.1.2 placeholder 잔존은 RC/스토어 제출/릴리즈만 금지(구현/로컬 dev build은 허용)로 문구를 보강하고, 문서 최종 감사 프롬프트 템플릿(28.4)을 추가 | SPEC 38.1.1.2, INDEX 운영 원칙, decisions header/index header, MASTER 3.3, DECISIONS 28, 30 | no | Codex |
| v1.95-doc | 2026-02-25 | 수익화/컴플라이언스 정합 보강: Paywall 혜택에 “힌트 무제한”을 포함해 Premium 가치 제시를 정합(혜택 3줄 + copy key 추가)하고, 광고 동의 정책의 지역 표기를 adConsentRegion(enum: US_CA)에 맞춰 정합. iOS AdMob App ID 반영을 Info.plist `GADApplicationIdentifier` MUST로 고정. 지원/진단 데이터 retention 운영 요건을 제출값과 정합되도록 `Sentry retention <=90일`, `support payload <=180일`로 잠금 + Sprint0 체크리스트에 확인 항목 추가 | SPEC 36.1/38.1.2/38.1.3/38.1.5/38.2.2/40.2, MASTER 8.2, index header, decisions header, MASTER 3.3, 30 | no | Codex |
| v1.96-doc | 2026-02-25 | Journey(Stage/Chapter) 모드 도입: 결정론적 stage seed + Cloud Sync stage 진행도(journeyStages). Journey는 gameover/failed 없음(실수 제한 off). 3-star 평가(시간/힌트) + stage 별 코인 보상(총 5/10/20, delta 지급) 추가. 스키마/보안 규칙/서버 검증 계약 `verifyJourneyStage` 추가 + 스토어 Privacy table에 journeyStages 항목 추가 + MASTER MVP 범위/요약에 Journey 반영 | SPEC 18.1/19.3.2/19.6/19.8.5/20.2.8/21.11/22.1/23.2/38.1.1.1/38.1.6.5/39.1.4/39.1.9/39.1.13/39.1.15/39.3/39.4.3/41.4, MASTER 0/3.1/4.6, ADR-067/ADR-068, decisions header/index header, 30 | no | Codex |

운영 규칙:
- 문서 변경 시 changelog를 같은 커밋에서 함께 업데이트한다.
- `migrationNeeded=yes`이면 코드/데이터 마이그레이션 절차를 함께 기록한다.

---
