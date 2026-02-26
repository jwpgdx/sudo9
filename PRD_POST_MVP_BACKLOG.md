# PRD Post-MVP Backlog

> Canonical file: `PRD_POST_MVP_BACKLOG.md`
> Scope: Section 42 (Deferred/Post-MVP 실행 백로그)

## 42. Post-MVP Backlog (실행 관리)

> 목적: MVP에서 제외된 항목을 “다음 버전 실행 단위”로 관리한다.

운영 규칙:
- `PRD_DECISIONS.md`의 `status=deferred` 항목은 본 문서로 이관한다.
- 원본 질문 ID(`Q-xxx`)와 ADR 링크는 유지한다(추적성 보장).
- 구현 착수 전, 각 항목의 `targetVersion`, `acceptance`를 먼저 확정한다.

상태 정의:
- `queued`: 아이디어 등록/정리 완료
- `planned`: 버전 배정 완료
- `in_progress`: 구현 중
- `shipped`: 배포 완료
- `dropped`: 폐기

### 42.1 백로그 템플릿

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-xxx | Q-xxx | 작업 제목 | queued | v1.x | P1/P2/P3 | PM/FE/BE | 선행 작업 | 완료 기준(측정 가능) | 재검토 조건 |

### 42.2 Deferred 이관 항목 (현재)

#### 42.2.1 B-001 LearnHub 검색/상세/연습 묶음

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-001 | Q-014 | LearnHub 검색/상세/연습 도입 | queued | v1.2+ | P3 | Learn | 힌트/튜토리얼 확장 설계, 카피 키 확장, 이벤트 스키마 확장 | 검색(기술명/태그) + 상세 카드 + 연습 진입이 단일 플로우로 동작, 크래시 없이 20회 연속 진입/이탈 테스트 통과 | 학습 기능 사용률이 목표 미달이면 범위를 검색-only로 축소 |

연결:
- ADR: `ADR-024`
- Source Sections: `22.2`
- Note: MVP에서는 제외 상태를 유지한다.

#### 42.2.2 B-002 `candidate_keep` 하이라이트 타입

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-002 | Q-015 | `candidate_keep` 하이라이트 타입 추가 | queued | v1.1+ | P2 | Engine | HintStep 스키마 확장, 렌더 우선순위 규칙 업데이트, QA 케이스 확장 | `candidate_keep`가 Solver->UI 경로에서 정상 전달되고, 기존 `candidate_remove`와 충돌 없이 렌더/낭독 테스트 통과 | 가독성 저하/혼선 피드백 증가 시 타입 도입을 보류 |

연결:
- ADR: `ADR-024`
- Source Sections: `17.1`, `22.2`
- Note: MVP에서는 미지원 상태를 유지한다.

### 42.3 Master 3.2 기능 확장 백로그 (Post-MVP)

#### 42.3.1 B-003 Daily 리더보드(글로벌/친구) 도입

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-003 | - | Daily 리더보드(글로벌/친구) 기본 도입 | planned | v1.1 | P1 | PM/BE | 서버 검증 경로, 치팅 방지 규칙, 동기화 부하 측정 | Daily 결과 업로드 후 글로벌/친구 탭에서 3초 내 조회, 7일 연속 리셋/집계 검증 통과 | 서버 비용 또는 치팅 신고가 임계치 초과 시 friends-only로 축소 |

연결:
- ADR: `ADR-047`
- Source Sections: `3.2`, `19.6`, `22.2`

#### 42.3.2 B-004 시즌 운영(리더보드 시즌제) 추가

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-004 | - | 시즌 리셋/보상 포함 리더보드 시즌제 | queued | v1.2+ | P2 | PM/BE | B-003, 시즌 캘린더/보상 정책, 운영 도구 | 시즌 시작/종료 자동 전환과 시즌 보상 지급이 QA 시뮬레이션 100% 통과 | 시즌 운영 복잡도로 배포 리스크 증가 시 분기 1회 고정 운영으로 단순화 |

연결:
- Source Sections: `3.2`

#### 42.3.3 B-005 업적 시스템 확장

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-005 | - | 난이도/연속/무힌트 기반 업적 확장 | planned | v1.1 | P2 | PM/FE | 이벤트 스키마 안정화, 로컬/클라우드 해금 동기화 | 업적 조건 10종 이상이 로컬/클라우드에서 동일 해금되고 중복 해금 없음 | 업적 화면 진입률이 낮으면 핵심 5종만 유지하고 나머지는 숨김 |

연결:
- Source Sections: `3.2`, `7.2`

#### 42.3.4 B-006 고급 튜토리얼(논리기술 트랙)

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-006 | Q-014 | 논리기술 단계형 튜토리얼 트랙 | queued | v1.2+ | P3 | Learn | B-001, 카피/i18n 확장, 난이도별 예제 퍼즐 세트 | 기술별 튜토리얼 완료율 60% 이상, 튜토리얼 이탈 시 재진입 복원 정상 | 완료율이 목표 미달이면 자유 탐색형(검색 중심)으로 구조 단순화 |

연결:
- Source Sections: `3.2`

#### 42.3.5 B-007 퍼즐 팩/이벤트 테마 스토어

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-007 | - | 퍼즐 팩 및 이벤트 테마 스토어 | queued | v1.3+ | P3 | PM/BE | 시즌 운영(B-004), IAP SKU 설계, 콘텐츠 배포 파이프라인 | 팩 구매/다운로드/오프라인 재진입 플로우 및 영수증 복원 테스트 통과 | 스토어 전환율이 목표 미달이면 이벤트 무료팩 중심으로 전환 |

연결:
- Source Sections: `3.2`

#### 42.3.6 B-017 Pet(Companion) 기본 시스템

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-017 | - | Pet(Companion) 도입(홈/게임 표시 + 기본 상태) | queued | v1.2+ | P2 | PM/FE | 코인 지갑(wallet) 안정화, 에셋 파이프라인(아이콘/스프라이트) | (1) Pet 1종 기본 표시(Home + Game) (2) 크래시 없이 50회 진입/이탈 (3) 설정/동기화와 충돌 없이 상태 유지 | Pet 표시가 성능/FPS 임계값을 위반하면 Home-only로 축소 |

연결:
- Source Sections: `3.2`

#### 42.3.7 B-018 Pet 코스튬(꾸미기) 아이템 + 코인 사용처

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-018 | - | Pet 코스튬 아이템 상점(코인 결제) + 인벤토리 | queued | v1.3+ | P2 | PM/FE/BE | B-017, 코인 수급/구매(38.1.6), 구매/지갑 트랜잭션 스키마 확장 | (1) 코인으로 코스튬 구매(중복 구매 방지) (2) 인벤토리 착용/해제 (3) 재설치/다기기에서 코인/인벤 복구 정합 | 경제 인플레이션/CS 증가 시 가격/수급 상수 재조정 또는 아이템 수 축소 |

연결:
- Source Sections: `3.2`

#### 42.3.8 B-019 UI 테마(스킨) 상점 + Chapter 클리어 해금

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-019 | Q-068 | UI 테마(스킨) 상점(코인 결제) + Chapter 클리어 해금 | queued | v1.3+ | P3 | PM/FE/BE | B-018, Journey stage 진행도(ADR-067/ADR-068), 디자인 에셋 | (1) 테마 최소 3종 제공 + Preview/Equip (2) 코인으로 구매(중복 구매 방지) (3) Chapter 클리어 시 테마 자동 해금(정의는 Q-068/ADR-069) (4) 재설치/다기기에서 테마 소유/선택 복구 정합 | 전환율/리뷰 악화 또는 경제 인플레이션이 임계치 초과 시 테마 수 축소/가격 조정 또는 unlock-only로 단순화 |

연결:
- Source Sections: `3.2`

### 42.4 Master 5.3 통계 확장 백로그 (Post-MVP)

#### 42.4.1 B-008 성장 분석 카드(7일 비교)

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-008 | - | 최근 7일 vs 이전 7일 성장 분석 | planned | v1.1 | P2 | PM/FE | 집계 파이프라인 정합성, 세션 보관 정책 | 주요 지표 5종(완료율/평균시간/실수/힌트/플레이수) 주간 비교가 동일 데이터셋 재계산 시 오차 1% 이내 | 수치 신뢰성 이슈가 발생하면 카드 공개를 보류하고 내부 지표로 한정 |

연결:
- Source Sections: `5.3`

#### 42.4.2 B-009 퍼포먼스 그래프(분포/트렌드)

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-009 | - | 클리어 시간 분포/트렌드 그래프 | queued | v1.1+ | P2 | FE | 차트 컴포넌트 성능 검증, 집계 API | 30일 데이터에서 그래프 렌더 p95 300ms 이내, 스크롤/터치 프레임 저하 없음 | 저사양 성능 저하 시 요약 카드형으로 축소 |

연결:
- Source Sections: `5.3`

#### 42.4.3 B-010 논리기술 분석(Solver 로그 노출)

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-010 | - | 풀이 중 사용 논리기술 분석 화면 | queued | v1.2+ | P3 | Engine/FE | Solver 로그 표준화, 기술 taxonomy 고정 | 기술별 사용 빈도/성공률 표가 동일 퍼즐 재현 시 일관되게 노출 | 사용자 이해도 저하 시 기술명 노출을 단계별 뷰로 단순화 |

연결:
- Source Sections: `5.3`, `5.4`

#### 42.4.4 B-011 플레이 스타일 분석(input mode/pencil 비율)

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-011 | - | 입력 모드/메모 비율 기반 스타일 분석 | queued | v1.3+ | P3 | PM/FE | `inputModeUsage` 수집 설계, 개인정보 최소화 검토 | 셀/숫자 입력 비율과 pencil 사용 비율이 세션 집계와 일치(오차 1% 이내) | 복잡도 대비 사용률이 낮으면 내부 실험용으로 전환 |

연결:
- Source Sections: `5.3`, `5.4`

#### 42.4.5 B-012 Speed Mode 전용 통계

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-012 | - | Speed Mode 전용 기록/랭킹 통계 | queued | v1.2+ | P2 | PM/FE | Speed Mode 정의 고정, 세션 태깅 | Speed Mode 세션만 필터링한 기록(최고/평균/완료율)이 일반 모드와 혼합되지 않음 | 모드 사용률이 낮으면 일반 통계 내 탭으로 축소 |

연결:
- Source Sections: `5.3`

### 42.5 Master 기타 Post-MVP 후보

#### 42.5.1 B-013 TypeScript 전환 검토

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-013 | - | JS 기반 코드의 TypeScript 전환 검토 | queued | v1.3+ | P3 | FE | 빌드/타입체크 파이프라인, 점진 전환 전략 | 핵심 모듈 3개 이상 전환 후 타입 오류 0, 릴리즈 빌드 시간 증가 10% 이내 | 빌드/속도 비용이 높으면 JSDoc 강화 전략 유지 |

연결:
- Source Sections: `3.3`

#### 42.5.2 B-014 Hint Apply Undo 토글

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-014 | - | 힌트 적용 Undo 가능 토글 추가 | queued | v1.2+ | P3 | FE/UX | Undo 트랜잭션 분리, 힌트 통계 정의 재합의 | 토글 ON/OFF 모두에서 Undo 일관성 테스트 통과, 힌트 통계 누락 없음 | UX 혼선이 증가하면 토글 기능 제거하고 기존 정책 유지 |

연결:
- Source Sections: `3.3`, `21.6`

#### 42.5.3 B-015 고급 통계 별도 SKU 검토

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-015 | Q-007 | 고급 통계 유료 SKU(별도 패키지) 검토 | queued | v1.3+ | P3 | PM/Monetization | B-008~B-012 안정화, 가격 실험 설계 | 구매 플로우/복원/환불 시나리오 QA 통과, 무료/유료 경계 카피 오류 0 | 결제 전환율이 낮거나 불만 비율이 높으면 무료 제공 또는 번들화 |

연결:
- ADR: `ADR-021`
- Source Sections: `8.2`, `5.3`

#### 42.5.4 B-016 멀티 세이브 슬롯(최대 3) 확장

| backlogId | sourceQId | title | status | targetVersion | priority | owner | dependsOn | acceptance | rollbackTrigger |
|---|---|---|---|---|---|---|---|---|---|
| B-016 | - | 진행 중 퍼즐 멀티 슬롯(최대 3) 도입 | queued | v1.2+ | P2 | PM/FE | currentGame 단일 슬롯 안정화, 동기화 충돌 규칙 확장 | 슬롯 3개 생성/교체/삭제와 기기 간 동기화가 데이터 손실 없이 동작 | 동기화 충돌/복구 이슈 증가 시 단일 슬롯 정책 유지 |

연결:
- Source Sections: `19.4`

### 42.6 v1.1 실행 큐 (확정)

> 원칙: v1.1은 "MVP 안정화 + 체감 가치 추가"에 집중하고, 학습 트랙/스토어/고급 분석은 유지 보류한다.

| order | backlogId | title | status | owner | gate(착수 조건) | done(완료 기준) |
|---|---|---|---|---|---|---|
| 1 | B-003 | Daily 리더보드(글로벌/친구) 기본 도입 | planned | PM/BE | leaderboard write/read 부하 테스트 통과, 치팅 최소 검증 규칙 승인 | Daily 탭 조회 p95 3초 이내 + 리셋/집계 QA 통과 |
| 2 | B-005 | 업적 시스템 확장 | planned | PM/FE | 이벤트 스키마 freeze, 업적 조건표 확정 | 업적 10종 동기화/중복해금 테스트 통과 |
| 3 | B-008 | 성장 분석 카드(7일 비교) | planned | PM/FE | 세션 집계 재계산 오차 검증 완료 | 주간 비교 지표 오차 1% 이내 + 화면 렌더 회귀 없음 |

v1.1 보류(큐 유지):
- `B-002`, `B-004`, `B-006`, `B-007`, `B-009`, `B-010`, `B-011`, `B-012`, `B-013`, `B-014`, `B-015`, `B-016`

### 42.7 Sprint v1.1 Ticket Pack (실행 단위)

> 목적: 42.6의 `planned` 항목을 바로 구현 가능한 티켓 단위로 분해한다.

기본 규칙:
- 티켓 상태: `todo -> doing -> review -> done`
- 추정 단위: `SP(Story Point)`
- v1.1 권장 총량: 약 24 SP

| ticketId | backlogId | task | status | owner | SP | dependsOn | done(완료 기준) |
|---|---|---|---|---|---|---|---|
| T-1101 | B-003 | Daily leaderboard 저장 스키마/쓰기 경로 구현 | todo | BE | 3 | 19.6 Firestore 구조 | Daily 완료 시 leaderboard write가 중복 없이 기록되고 실패 시 재시도 로그가 남음 |
| T-1102 | B-003 | leaderboard 조회/정렬 규칙(글로벌+친구) 구현 | todo | BE | 3 | T-1101 | 조회 p95 3초 이내, 동점 정렬 규칙(시간/완료시각) 문서화 |
| T-1103 | B-003 | Leaderboard 화면 탭(UI/empty/error/loading) 구현 | todo | FE | 3 | T-1102 | Daily 탭에서 글로벌/친구 전환, empty/error 카피 노출, 크래시 없음 |
| T-1104 | B-003 | 치팅 최소 검증 + QA 시나리오 패스 | todo | BE/QA | 2 | T-1101, T-1102 | 시간 이상치/중복 제출/미완료 제출 차단 시나리오 테스트 통과 |
| T-1201 | B-005 | 업적 조건표 v1.1 확정(10종) | todo | PM | 1 | 없음 | 조건표 freeze 및 이벤트 키 매핑 승인 |
| T-1202 | B-005 | 업적 해금 엔진/중복해금 방지 구현 | todo | FE | 3 | T-1201 | 동일 조건 재발생 시 중복 해금 없음, 로컬/클라우드 동기화 정합 |
| T-1203 | B-005 | 업적 화면/상태(UI) 구현 | todo | FE | 2 | T-1202 | 잠김/해금/신규 해금 상태가 일관되게 렌더되고 접근성 라벨 포함 |
| T-1204 | B-005 | 업적 회귀 QA(재설치/다기기/오프라인) | todo | QA | 2 | T-1202, T-1203 | 재설치/다기기에서 해금 손실 없음, 오프라인 후 복귀 동기화 성공 |
| T-1301 | B-008 | 주간 비교 집계 계산 로직 구현 | todo | BE | 2 | 세션 집계 파이프라인 | 최근7일/이전7일 지표 오차 1% 이내(검증 데이터셋 기준) |
| T-1302 | B-008 | 성장 분석 카드 UI 구현 | todo | FE | 2 | T-1301 | 5개 핵심 지표 카드 노출, 렌더 회귀/프레임 저하 없음 |
| T-1303 | B-008 | 주간 비교 검증/회귀 테스트 | todo | QA | 1 | T-1301, T-1302 | 날짜 경계(UTC), 빈 데이터, 극단값 케이스 테스트 통과 |

권장 착수 순서:
1. `T-1201 -> T-1202` (업적 조건 고정 후 엔진)
2. `T-1101 -> T-1102 -> T-1103 -> T-1104` (리더보드 백엔드 선행)
3. `T-1301 -> T-1302 -> T-1303` (집계 로직 선행)
