# PRD Master

> Canonical file: `PRD_MASTER.md`
> Scope: Sections 0~13 (비전/범위/핵심 UX/기본 구조)

# sudo9 고도화 기획안 (PRD v1)

> 목표: **마니아가 ‘이 앱은 디테일이 있다’고 느끼는 코어 UX + 매일 들어오게 만드는 리텐션 + 상용화 가능한 수익/백엔드**를 한 번에 잡는다.
> 앱 표시명(Display Name): **sudo9**

---

## 0. 한 줄 요약
- **코어**: 난이도 = 빈칸 개수(X) → **필요 논리기술 난이도(예: X-Wing, Swordfish) 기반 생성/검증(O)**
- **차별화**: 빠른 입력감 + 안정적인 퍼즐 난이도 신뢰도
- **리텐션**: Daily Challenge + Journey(Stage) + 기본 통계(Stats). 업적/리더보드 MUST NOT 포함(Post-MVP).
- **상용화**: Cloud Sync + 광고(Banner/Interstitial) + Rewarded(코인/힌트) + Journey stage 보상(별/코인) + IAP(프리미엄/코인)

---

## 1. 성공지표 (KPI)
### 1.1 런칭(초기 30일)
- D1 Retention ≥ 35%
- D7 Retention ≥ 12%
- [MUST] D1 Retention 정의: 코호트 Day0는 uid별 최초 `app_open`의 UTC 날짜(00:00~23:59:59.999)로 고정한다. D1 Retention = (Day1(UTC)에 `app_open`이 1회 이상 존재하는 코호트 uid 수) / (Day0 코호트 uid 수). (Data source: `PRD_SPEC_LOCK.md` 23.2의 `app_open`)
- [MUST] D7 Retention 정의: 코호트/날짜 경계는 위와 동일(UTC)로 고정한다. D7 Retention = (Day7(UTC)에 `app_open`이 1회 이상 존재하는 코호트 uid 수) / (Day0 코호트 uid 수). (Data source: `PRD_SPEC_LOCK.md` 23.2의 `app_open`)
- 평균 퍼즐 세션(PlaySession) 길이 ≥ 6분
- [MUST] 본 KPI의 퍼즐 세션 길이는 `/users/{uid}/sessions/{sessionId}.durationMs` 평균으로 측정한다(`PRD_SPEC_LOCK.md` 39.1.4).
- 퍼즐 완료율(시작 대비 완료) ≥ 55%

### 1.2 수익화(안정화 60~90일)
- 광고 ARPDAU(Ads) + IAP 합 ≥ **$0.01** (USD, 보수적 Floor)
- IAP 전환율 ≥ **0.3%** (프리미엄, 보수적 Floor)
- Rewarded Opt-in Rate ≥ **10%** (보수적 Floor)
- [MUST] `ARPDAU(Ads)` 분자는 AdMob Reporting(수익)으로 산정하고, 분모(DAU)는 `app_open` 이벤트(23.2) 고유 uid 기준으로 산정한다.
- [MUST] `IAP 전환율`은 `purchase_succeeded / app_open`(동일 기간)으로 산정한다.
- [MUST] `IAP 매출(USD)`은 RevenueCat Dashboard(Reporting)의 USD 수치를 단일 기준으로 사용한다.
- [MUST] `Rewarded Opt-in Rate`는 `rewarded_opt_in / rewarded_offer_shown`으로 산정한다(purpose별로 분해 가능해야 함; `PRD_SPEC_LOCK.md` 23.2).

---

## 2. 타겟 유저 & 페르소나
- **스피드런 유저**: Digit-First 선호, 입력속도/오류 최소화/기록 경쟁
- **논리 풀이 마니아**: 막힘 없이 안정적으로 풀리는 힌트/입력 UX를 선호
- **라이트 유저**: Daily로 가볍게 1판, 테마/도장으로 동기 부여

---

## 3. 범위 (Scope)
### 3.1 MVP (상용화 가능한 1차)
- 난이도 5단계 + 생성/검증 파이프라인
- Pencil Marks + 자동 후보 삭제 옵션
- Cell-First / Digit-First / Auto 입력 모드
- Hint v1(L0 단순 + L1 가이드) + 일일 제한/광고 충전
- Daily Challenge(UTC 00:00 리셋) + 도장
- Journey(Stage/Chapter) + 3-star 평가 + 코인 보상(Cloud Sync 저장)
- 통계(난이도별 시간/횟수/승률)
- Cloud Sync(로그인/복구)
- 광고(배너+보상형+인터스티셜) + Journey stage 보상(3-star 코인) + IAP(프리미엄+코인)

### 3.2 Post-MVP (고도화)
- 리더보드(글로벌/친구) + 시즌제
- 업적 시스템 확장
- 고급 튜토리얼(논리기술 학습 트랙)
- 퍼즐 팩/이벤트 테마 스토어
- Pet(Companion) + 코스튬(코인 사용처) 스토어
- 상세 실행 항목은 `PRD_POST_MVP_BACKLOG.md`를 기준으로 관리한다.

### 3.3 문서 운영 규칙 (단일 기준 고정)
- 이 문서는 “상세 스펙(14~41장)”을 구현 기준(Single Source of Truth)으로 사용한다.
- 요약/벤치마크 섹션은 방향 참고용이며, 상세 스펙과 충돌 시 상세 스펙이 우선한다.
- 아래 확정표는 **2026-02-26 기준(v1.97-doc 동결)** MVP 기본값이다.
- (Note) Journey(Stage/Chapter) 및 3-star/코인 보상 스펙은 `PRD_SPEC_LOCK.md` 18.1, 21.11, 38.1.6.5, 39.4.3을 단일 기준으로 한다.
- (추가 정책 포함) 힌트/재화/Rewarded 목적은 `PRD_SPEC_LOCK.md` 15.7, 38.1.5.1, 38.1.6을 단일 기준으로 한다.

| 항목 | 최종 결정 (MVP) | 비고 |
|---|---|---|
| 코드 언어 | JavaScript만 사용 (`.js`, `.jsx`) | TypeScript는 Post-MVP 검토 |
| Undo/Redo | Undo 필수, Redo UI는 MVP 숨김 | Redo는 v1.1 우선순위 |
| Hint Apply Undo | 기본 미포함 | Post-MVP 백로그(B-014)로 이관(MVP 미지원) |
| 고급 힌트 범위 | MVP 제외 (L0/L1만 구현) | 상세: 22.1 B / 22.2 |
| 진행 중 슬롯 | 1개(Continue) | 멀티 슬롯은 확장 기능 |
| Daily 리더보드 | MVP 제외 | Daily 플레이/완료만 MVP 포함 |

---

## 4. 코어 게임 로직 & UX

### 4.1 난이도 설계 (5단계)
| 단계 | 목표 체감 | 허용 논리기술 예시 | 생성/검증 원칙 |
|---|---|---|---|
| 초급 | 막히지 않음 | Naked/Hidden Single | 추측 없이 단순 확정만으로 풀이 가능 |
| 중급 | 생각 좀 함 | Single + Naked Pair/Triple 일부 | 후보 제거 중심 |
| 고급 | 전략 필요 | Pointing/Claiming, X-Wing 준비 | 2~3단계 연쇄 추론 |
| 전문가 | 마니아 영역 | X-Wing, Swordfish 일부 | 고급 패턴 최소 1회 이상 포함 |
| 악마 | 빡센 논리 | Swordfish/XY-Wing/Coloring 등 | 여러 기술 조합 + 깊은 체인 |

**핵심 규칙**
- 난이도는 “빈칸 수”가 아니라 **‘해결 가능한 논리기술의 상한/하한’**으로 정의.
- 퍼즐 생성 후 **솔버가 난이도를 판정**하고 기준에 맞지 않으면 폐기/재생성.

#### 4.1.1 퍼즐 생성 파이프라인
1) 완성 보드 생성(랜덤 완성)  
2) 셀 제거(대칭/패턴, 기본: 대칭 ON)  
3) 유일해(Unique Solution) 검증  
4) 솔버로 논리 풀이 시뮬레이션 → 사용된 기술 로그 수집  
5) 난이도 기준에 맞는 퍼즐만 채택  

**추가 옵션(설정)**
- 대칭 제거: 기본 ON (설정에서 OFF 가능)
- 힌트 표시(가능한 셀 강조): 기본 ON (설정에서 OFF 가능)

---

### 4.2 Hint v1 시스템 (MVP)

#### 4.2.1 힌트 타입
1) **L0 단순 힌트**: 특정 칸에 정답 1개 채워줌
2) **L1 가이드 힌트**: 관련 행/열/박스/후보를 하이라이트로 안내

#### 4.2.2 힌트 UX 흐름 (L0/L1)
- 사용자가 힌트 버튼 탭 → `HintSheet(Cancel/Apply)` 오픈
- 시스템이 현재 상태에서 적용 가능한 기술 중 **가장 쉬운 것부터** 선택
- 안내는 2단계:
  1) **관찰(Highlight)**: 관련 행/열/박스/후보를 하이라이트
  2) **결론(Action)**:
     - L0: 정답 1칸 적용
     - L1: 적용 가능한 셀/후보를 안내(하이라이트만, 보드/후보 상태 변경 없음)
- [MUST] L0/L1 힌트의 소비/제한/충전/Free vs Premium 분기는 `PRD_SPEC_LOCK.md` 15.7 및 ADR-063을 단일 기준으로 한다.
- (Note) 과거 “L1 무제한” 논의는 ADR-043에 남아 있으며, 현행 MVP 기준은 ADR-063이다.

#### 4.2.3 카피 규칙 (MVP)
- 문장은 1~2문장으로 짧게 유지
- 기술명 노출/장문 설명/다음 단계 제안은 Post-MVP로 이관

**기술 우선순위(기본값)**
Singles 중심으로 동작하며, 고급 기법 노출은 하지 않는다.

---

### 4.3 Pencil Marks(연필 모드)
- 셀마다 후보 1~9 표시
- 후보 입력 방식:
  - 셀 선택 → 후보 토글
  - Digit-First에서도 후보 토글 가능

**자동 후보 삭제 옵션(설정)**
- 정답 확정 시 같은 행/열/박스의 후보에서 해당 숫자 자동 제거
- 사용자 수동 메모를 보호하기 위해 옵션 제공(기본 ON, 설정에서 OFF 가능)

---

### 4.4 입력 방식 (Auto / Cell-First / Digit-First)
- **Auto(기본)**:
  - 숫자 선택 상태에서 셀 탭 시 digit-first로 입력, 선택 숫자 유지
  - 숫자 미선택 상태에서는 cell-first로 입력, 입력 직후 선택 숫자 해제
- **Cell-First**: 셀 → 숫자
- **Digit-First**: 숫자 선택 후 여러 셀에 연속 입력

Digit-First UX 디테일
- 숫자 선택 시 해당 숫자를 넣을 수 있는 후보 셀만 약하게 표시(기본 ON, 설정에서 OFF 가능)
- 잘못 입력 시 즉시 피드백(진동/빨간 테두리)

---

### 4.5 시각적 피드백
- 같은 숫자 하이라이트 + 남은 개수 표시
- 충돌(규칙 위반) 표시
- 충돌 기본 정책: 표시 ON + 입력 차단 OFF(표시만 기본)
- 남은 숫자 1개 자동완성: 기본 OFF (설정에서 ON 가능)

---

### 4.6 Journey(Stage/Chapter) 모드 (MVP)
- Journey는 stage 기반 진행 모드이며, 퍼즐은 목록/서버 제공이 아니라 결정론적 seed 계산으로 생성한다.
- 진행도는 Cloud Sync에 저장하며 stageId별 bestStars(0~3)를 유지한다.
- chapter 구성:
  - chapterId는 난이도(`easy|medium|hard|expert|evil`)와 동일하게 취급한다.
  - chapter당 stage는 10개(`01..10`)로 고정한다.
- stage unlock:
  - stage `01`은 항상 unlocked.
  - stage `02..10`은 직전 stage를 클리어(별 1개 이상)해야 unlocked로 취급한다.
  - unlocked stage는 재플레이 가능하며 bestStars 개선(별/시간)만 허용한다.
- [MUST NOT] Journey에는 게임오버/failed 상태가 없다(실수 제한 강제 ON 금지).
- 3-star 평가(별 1~3개):
  - ⭐ 1: stage 클리어
  - ⭐⭐ 2: 여유로운 제한 시간 내 클리어 + 힌트 사용 없음
  - ⭐⭐⭐ 3: 빡센 제한 시간 내 클리어 + 힌트 사용 없음
  - (시간 기준) 제한 시간 판정은 `PRD_SPEC_LOCK.md` 21.10의 Timer(`durationMs`, pause 제외) 기준이다.
- 코인 보상:
  - 별 총 지급 기준: ⭐=+5, ⭐⭐=+10, ⭐⭐⭐=+20. 재플레이로 별이 개선될 때는 delta만 추가 지급한다(중복 지급 금지).
  - 코인 지급/중복 방지는 서버 검증 함수 `verifyJourneyStage(stageId, sessionId)`에서만 수행한다(`PRD_SPEC_LOCK.md` 39.4.3).
- 단일 기준: 상세 규칙(상수/seed/타이머/별/보상/서버 검증)은 `PRD_SPEC_LOCK.md` 18.1, 21.11, 38.1.6.5, 39.4.3을 따른다.

---

## 5. 통계 시스템 (Statistics) — MVP 기본형

> 목표: MVP에서는 복잡한 분석보다, 다른 상용 스도쿠 앱 수준의 기본 통계를 안정적으로 제공한다.

---

### 5.1 통계 설계 원칙 (MVP)
1. 기본 지표의 정확성과 안정성을 우선한다.
2. 고급 분석/해석 카드는 Post-MVP로 이관한다.
3. 통계 화면은 1~2탭 내에서 핵심 수치 확인이 가능해야 한다.

---

## 5.2 무료 통계 (Basic Tier)

### 5.2.1 Overview
- 총 플레이 수
- 완료 수
- 완료율 (%)
- 전체 평균 클리어 시간
- 최고 기록
- 난이도별 플레이 수

### 5.2.2 난이도별 상세
각 난이도 카드 클릭 시:
- 평균 시간
- 중앙값 시간
- 최고 기록
- 평균 실수 수
- 평균 힌트 사용량
- 산출 기준: 최근 200개 completed session 기반(난이도별 5개 미만이면 `-` 표시)

---

## 5.3 Post-MVP 통계 백로그 (1.1+)
- 성장 분석 (최근 7일 vs 이전 7일)
- 퍼포먼스 그래프(분포/트렌드)
- 논리기술 분석(Solver 로그 노출)
- 플레이 스타일 분석(input mode, pencil 비율)
- Speed Mode 전용 통계

---

## 5.4 데이터 모델 (MVP 최소)

```js
/**
 * @typedef {Object} PlaySession
 * @property {string} userId
 * @property {string} puzzleId
 * @property {string} difficulty
 * @property {number} durationMs
 * @property {number} mistakes
 * @property {number} hintsUsed
 * @property {number} difficultyScore
 * @property {string=} maxTechniqueUsed
 * @property {boolean} completed
 * @property {timestamp} startedAt
 * @property {timestamp=} endedAt
 * @property {timestamp} updatedAt
 */
```

참고:
- `logicUsed`, `inputModeUsage`는 Post-MVP 확장 필드로 예약한다.
- Solver 로그는 난이도 검증용 내부 데이터로 유지하고, MVP 통계 UI에는 노출하지 않는다.
- [MUST] Firestore 저장 스키마의 단일 기준은 `PRD_SPEC_LOCK.md` 39.1.4이며, `startedAt/endedAt/updatedAt`은 epoch ms(number)가 아니라 `timestamp(serverTimestamp)`로 저장한다.

---

## 6. 리텐션 & 소셜
디자인 & 커스터마이징 중심 리텐션

### 6.1 테마 시스템
- [MUST] MVP: Light/Dark만 제공한다.
- [MUST NOT] 확장 테마(종이/나무/야간/파스텔) 및 해금(도전과제/출석 보상)은 Post-MVP 범위이며 MVP에서 구현하지 않는다.
- [MUST] MVP의 테마는 Light/Dark(및 system)만 제공하며, 스토어 메타/스크린샷/리뷰 노트에서 “추가 테마”를 암시하는 문구를 사용 MUST NOT 한다.

### 6.2 접근성
- 색약 모드(대비 강화)
- 큰 글씨 모드
- 진동/사운드 토글

---

## 7. 백엔드 & 데이터 모델

### 7.1 Cloud Sync
- 확정: Firebase Auth + Firestore
- 로그인(확정): Apple/Google (게스트 미지원)
- 동기화 정책: 항상 ON (사용자 OFF 토글 미제공)
- 세션 원본 보관 정책: 최근 200개 고정(MVP)
- 동기화 대상
  - 유저 프로필(MVP), 트로피/배지(Post-MVP reserved)
  - 통계
  - Daily streak/stamps
  - 진행 중 퍼즐(세이브, `/users/{uid}/currentGame/meta`)
  - 구매 상태(프리미엄) + wallet(coinsBalance)
- Reset Progress는 로컬/클라우드에 동일 반영(계정/구매/설정은 유지)
- [MUST] Reset Progress는 wallet(coinsBalance)/구매 이력(프리미엄 포함)을 유지한다(코인 0 초기화 금지).
- [MUST] Reset Progress 이후에도 Journey 별 보상 재수급은 불가해야 한다(보상 이력 유지; ADR-068 + `PRD_SPEC_LOCK.md` 39.4.3).
- [MUST] Reset Progress 완료 시 로컬 pending/재시도 큐를 purge해야 한다(과거 진행이 재업로드되는 것 방지; `PRD_SPEC_LOCK.md` 19.8.5).

### 7.2 핵심 데이터 모델(초안)
- 구현 필드명/타입/동기화 규칙의 단일 기준은 `PRD_SPEC_LOCK.md` 39.1이다(본 절은 개념 요약).
- User
  - id, createdAt, premium, settings
- Puzzle
  - id, seed, difficulty, board, solutionHash, createdAt
- PlaySession
  - userId, puzzleId, startedAt, endedAt, durationMs, mistakes, hintsUsed, difficultyScore, maxTechniqueUsed, completed
  - [MUST] PlaySession의 시간 값은 ms 단위이며, 필드명은 `durationMs`로 고정한다(단일 기준: `PRD_SPEC_LOCK.md` 39.1.4).
- Achievement
  - id, condition, unlockedAt
  - (Post-MVP reserved; MVP MUST NOT create/write)
- Streak
  - currentStreak, longestStreak, lastCompletedDateUTC, updatedAt

---

## 8. 수익화 (BM)

### 8.1 광고
- 배너: 플레이 하단 고정(UX 방해 최소)
- Rewarded:
  - [MUST] 목적은 `currency_earn`, `hint_refill` 2개로만 고정한다(부활 목적 제거, ADR-065).
  - [MUST] `currency_earn`: Coins Store에서만 노출. Home에서는 Coins Store 진입 CTA만 제공한다. 광고 1회 시청 보상 `+20 coins`, 일일 한도 `10회/일`(UTC 00:00 리셋).
  - [MUST] `hint_refill`: 힌트가 0개일 때만 노출. 광고 1회 시청 보상 `+1 hint`, 일일 한도 `5회/일`(UTC 00:00 리셋). Free 기본 `3 hints/day`.
- [MUST] Interstitial은 CompletedModal 직후에만 노출하며, 최소 5판 쿨다운을 적용한다(13.10.5).
- [MUST] Premium은 광고 제거 정책을 적용하며 Rewarded CTA(`currency_earn`, `hint_refill`)를 노출하지 않는다.

### 8.2 IAP
- 프리미엄 업그레이드
  - 광고 제거
  - 힌트 무제한
  - 고급 통계 확장은 Post-MVP 별도 SKU로 검토
- 코인 구매(소모성)
  - `+500 coins`
- 결제 방식: Store IAP only (외부 결제 링크/웹 결제 미사용)
- Entitlement(RevenueCat): `premium` (Premium SKU `sudoku.premium.lifetime`에만 적용)
- [MUST NOT] Coins Pack1(`sudoku.coins.pack1`) 구매는 entitlement/profile.premium을 변경 MUST NOT 하며, 구매 효과는 wallet coinsBalance 크레딧(+500)만이다.
- Paywall(필수): 혜택 3줄(광고 제거/힌트 무제한/영구 이용) + 가격 + 구매 CTA + Restore + 닫기 + Terms/Privacy 링크
- Paywall 진입: Home 상단 Premium 버튼, Settings > Data `Upgrade to Premium`

**초기 패키지(런칭 기준)**
- Premium 단일 SKU(영구): 광고 제거 + 힌트 무제한
- productId(iOS/Android 공통): `sudoku.premium.lifetime`
- 기준가: USD 3.99 (로컬 스토어 환율/티어 적용)
- Coins Pack1 단일 SKU(소모성): 코인 구매
- productId(iOS/Android 공통): `sudoku.coins.pack1`
- 제공량: `+500 coins`
- 기준가: USD 1.99 (로컬 스토어 환율/티어 적용)
- 가격 A/B는 안정화 60일 이후에만 수행

---

## 9. 설정(Settings)
- 입력 방식: Auto / Cell-First / Digit-First
- Pencil Marks 자동 삭제: ON/OFF
- 충돌 표시: ON/OFF
- 자동완성: ON/OFF
- 하이라이트 강도/효과음/진동
- Data: 기록 초기화 / 퍼즐 캐시 삭제 / 동기화 재시도 / 구매 복원 / 프리미엄 업그레이드 / 광고 동의 관리 / 계정 삭제 / 로그아웃 / 문의하기 / Privacy Policy / Terms

---

## 10. 품질/테스트 기준
- 퍼즐 유일해 100% 보장
- 난이도 분류 정확도(샘플링 수동 검수 포함)
- 오프라인/온라인 전환 시 데이터 충돌 해결
- 광고/IAP가 게임 진행을 막지 않도록 안전장치
- 자동 테스트 게이트 고정: PR(`lint + jest`) + 릴리즈(`iOS/Android Native E2E + 결제 샌드박스`) (상세: `PRD_SPEC_LOCK.md` 38.2.6)
- CI 실행 명령어 표준 고정: `pnpm run lint` / `pnpm run test:unit` / `pnpm run test:e2e:ios` / `pnpm run test:e2e:android` / `pnpm run test:purchase:sandbox` (상세: `PRD_SPEC_LOCK.md` 38.2.6.1)

---

## 11. 릴리즈 플랜(제안)
- v1.0: 코어 + Daily + Sync + Ads/IAP
- v1.1: 리더보드/업적 + 안정화/UX 개선
- v1.2: 시즌제 이벤트/테마 상점 + 학습 트랙

---

## 12. 기술 스택 확정 (React Native 기반)

### 12.1 프레임워크/아키텍처 (JavaScript + NativeWind)
- Framework: **React Native + Expo (Managed Workflow)**
- 버전 정책: **최신 자동 추종 금지, 킥오프 시점의 Expo 안정 버전으로 고정** (세부 숫자 락: `PRD_SPEC_LOCK.md` 38.2.1.1)
- 언어: **JavaScript (TypeScript 미사용)**
- 타입 안전 대안: **JSDoc + ESLint** (필수), 선택적으로 **zod**로 런타임 스키마 검증
- 상태관리: Zustand (게임 상태는 로컬 중심)
- 네비게이션: React Navigation
- 아이콘: `@expo/vector-icons` + `MaterialCommunityIcons` 고정 (Apple/Google 브랜드 아이콘만 예외 허용)
- 스타일링: **NativeWind (Tailwind CSS 문법)**
- 로컬 저장: MMKV(성능 우선, MVP 단일 저장소)
- 애니메이션: Reanimated 3
- 광고: Google AdMob (react-native-google-mobile-ads)
- IAP: RevenueCat (react-native-purchases)
- 인증/클라우드: Firebase Auth + Firestore

---

## 13. 디자인 토큰 & NativeWind 규칙 (필수)

> 목표: 바이브코딩이라도 UI가 흔들리지 않도록 **토큰/규칙을 고정**한다.

---

### 13.1 토큰 원칙
- 모든 UI는 토큰으로만 조절한다(임의 px 금지).
- 화면/컴포넌트 간 간격은 4px 스케일(4,8,12,16,20,24…)로 통일한다.
- 보드(9x9)는 정사각 고정, 주변 여백/버튼 크기만 반응형으로 조절한다.

---

### 13.2 Tailwind(NativeWind) 스케일 정의
#### Spacing
- 기본 패딩: `px-4` / `py-3`
- 섹션 간격: `gap-3` 또는 `gap-4`
- 화면 바깥 여백: `px-4` (큰 화면은 `px-6`까지)

#### Radius
- 카드/모달: `rounded-2xl`
- 버튼/칩: `rounded-xl`
- 셀: `rounded-md` (너무 둥글면 가독성 떨어짐)

#### Typography
- 제목: `text-xl font-semibold`
- 섹션 타이틀: `text-base font-semibold`
- 본문: `text-sm`
- 보드 숫자: `text-lg font-semibold`
- 후보(메모): `text-[10px] leading-3`

---

### 13.3 tailwind.config.js (토큰 고정: NativeWind)
> 목표: 색/간격/폰트를 코드로 잠궈서 바이브코딩에서도 UI가 흔들리지 않게 한다.

**권장 패키지**
- `nativewind`
- `tailwindcss`
- `react-native-reanimated`
- `clsx`(또는 `classnames`)

**tailwind.config.js 예시**
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      // ✅ "의미" 기반 토큰(라이트/다크를 쌍으로 고정)
      colors: {
        bg: '#F8FAFC',
        bgDark: '#0B1220',

        surface: '#FFFFFF',
        surfaceDark: '#0F172A',

        surface2: '#F1F5F9',
        surface2Dark: '#111827',

        text: '#0F172A',
        textDark: '#E5E7EB',

        muted: '#64748B',
        mutedDark: '#94A3B8',

        border: '#E2E8F0',
        borderDark: '#1F2937',

        accent: '#2563EB',
        accentDark: '#60A5FA',

        danger: '#DC2626',
        dangerDark: '#F87171',

        success: '#16A34A',
        successDark: '#4ADE80',
      },
    },
  },
  plugins: [],
}
```

**사용 규칙(중요)**
- 의미 토큰만 사용: `bg-bg dark:bg-bgDark`, `text-text dark:text-textDark` 처럼 **항상 라이트/다크 쌍으로** 작성
- 화면/컴포넌트에서 직접 hex 값 금지
- 상태 표현은 `accent/danger/success`만 사용

---

### 13.4 컬러 시스템 (라이트/다크)
> 색상은 "의미" 중심으로 토큰화한다.

#### Semantic tokens (권장)
- `bg` / `surface` / `surface2`
- `text` / `muted`
- `border`
- `accent` (선택/강조)
- `danger` (충돌)
- `success` (완료)

#### 상태 컬러 사용 규칙
- 선택된 셀: `accent` 배경(약) + `accent` 보더(강)
- 같은 숫자 하이라이트: `accent` 배경(아주 약)
- 충돌: `danger` 보더 + `danger` 텍스트(선택)
- 고정 숫자(given): `text` 강
- 사용자 입력: `text` 기본
- 확정된 정답 애니메이션: `success`는 짧게, 과하면 촌스러움

---

### 13.4.1 다크모드 전략
- NativeWind `dark:` 규칙만 사용
- 다크 배경에서 보드 라인은 너무 밝지 않게(눈뽕 방지)
- 대비(AA 수준)를 기본 목표로 한다

---

### 13.5 className 작성 규칙
- 레이아웃: `flex`/`items-`/`justify-`/`gap-` 우선
- 색상은 semantic class만(직접 hex 금지)
- 조건부 스타일은 `clsx`(또는 `classnames`)로 분기
- 재사용 컴포넌트는 `variant` 기반(예: Button `primary|ghost`, Cell `selected|related|conflict`)

---

### 13.6 ui/classes.js (프리셋으로 흔들림 방지)
> 목표: 자주 쓰는 className 조합을 한 곳에 모아 **일관성 + 생산성**을 확보한다.

**파일 위치 제안**: `/src/ui/classes.js`

```js
import clsx from 'clsx'

// ✅ Screen
export const screen = {
  base: 'flex-1 bg-bg dark:bg-bgDark',
  container: 'px-4 py-4',
  sectionGap: 'gap-4',
}

// ✅ Card
export const card = {
  base: 'rounded-2xl bg-surface dark:bg-surfaceDark border border-border dark:border-borderDark',
  pad: 'p-4',
}

// ✅ Text
export const text = {
  title: 'text-xl font-semibold text-text dark:text-textDark',
  section: 'text-base font-semibold text-text dark:text-textDark',
  body: 'text-sm text-text dark:text-textDark',
  muted: 'text-sm text-muted dark:text-mutedDark',
}

// ✅ Button
export const button = {
  base: 'h-12 rounded-xl items-center justify-center',
  primary: 'bg-accent dark:bg-accentDark',
  ghost: 'bg-transparent',
  outline: 'border border-border dark:border-borderDark',
  text: {
    primary: 'text-white font-semibold',
    ghost: 'text-text dark:text-textDark font-semibold',
    outline: 'text-text dark:text-textDark font-semibold',
  },
}

// ✅ Board/Cell
export const board = {
  wrap: 'items-center justify-center',
  frame: 'rounded-2xl bg-surface dark:bg-surfaceDark border border-border dark:border-borderDark overflow-hidden',
  grid: 'flex-row flex-wrap',
  // 셀은 상태에 따라 class를 합성
  cellBase: 'items-center justify-center border border-border dark:border-borderDark',
  cellTextGiven: 'text-lg font-semibold text-text dark:text-textDark',
  cellTextUser: 'text-lg font-semibold text-text dark:text-textDark',
  cellTextNote: 'text-[10px] leading-3 text-muted dark:text-mutedDark',
  state: {
    selected: 'bg-accent/15 dark:bg-accentDark/15',
    related: 'bg-accent/10 dark:bg-accentDark/10',
    conflict: 'border-danger dark:border-dangerDark',
  },
}

// ✅ Helper
export const cx = (...args) => clsx(...args)
```

**사용 예시(공적/전문 스타일)**
- `className={cx(board.cellBase, isSelected && board.state.selected)}` 처럼 상태를 합성합니다.
- 텍스트/카드/버튼은 반드시 프리셋을 우선 사용하고, 예외는 PRD에 근거를 남깁니다.

---

### 13.7 컴포넌트 스타일 표준
#### Button
- 기본 높이: `h-12` (키패드 버튼은 `h-14`까지)
- 터치 영역 최소: 44pt 이상

#### Modal/BottomSheet
- `rounded-2xl` + `p-4`
- 모달 내 버튼은 1열(큰 버튼) 또는 2열(동등 액션)

#### Board
- 9x9 Grid는 절대 스크롤 금지
- 굵은 구분선(3x3)은 `border` 강도만 1단계 올림
- 셀 크기 계산은 화면 width 기반으로 고정(레이아웃 점프 금지)

---

## 13.8 Board/Cell 상세 UI 스펙 (고정 규칙)

> 목표: 보드가 제품의 얼굴이므로, "가독성/반응성/일관성"을 규칙으로 잠근다.

### 13.8.1 보드 레이아웃 규칙
- 보드 전체는 정사각형 유지
- 보드 크기 산식(권장):
  - `boardSize = min(screenWidth - 32, 420)`
  - 32는 `px-4` 좌우 여백(16*2)
  - 큰 화면(태블릿)에서 과도하게 커지지 않도록 상한 420 권장
- 셀 크기: `cellSize = boardSize / 9`
- 보드 프레임은 `board.frame` 프리셋 사용

### 13.8.2 Grid 라인 규칙
- 기본 셀 보더: 1px
- 3x3 경계 보더: 2px (시각적으로만 한 단계 강조)
- 구현 규칙:
  - `row % 3 === 0` 이면 위쪽 경계 굵게
  - `col % 3 === 0` 이면 왼쪽 경계 굵게
  - 마지막 행/열도 바깥 프레임과 충돌 없게 처리

### 13.8.3 셀 상태 우선순위(겹침 처리)
> 여러 상태가 동시에 걸릴 때 우선순위를 고정한다.
1) **Selected(선택된 셀)**
2) **Conflict(규칙 위반/충돌)**
3) **Same Digit Highlight(같은 숫자)**
4) **Related(같은 행/열/박스)**
5) 기본

### 13.8.4 셀 탭/입력 UX
- 탭 시:
  - 셀 선택
  - 선택된 셀의 행/열/박스 하이라이트(기본 ON, 설정에서 OFF 가능)
  - 선택된 셀 값이 있으면 동일 숫자 하이라이트(기본 ON, 설정에서 OFF 가능)
- 입력 시:
  - Given(초기 고정 숫자) 셀은 입력 불가
  - Pencil 모드 ON이면 후보 토글, OFF이면 숫자 입력

### 13.8.5 후보(메모) 렌더링 규칙
- 후보는 3x3 미니 그리드(1~9 위치 고정)
- 후보 텍스트 크기: `text-[10px] leading-3`
- 성능 규칙:
  - 후보는 해당 셀에 후보가 있을 때만 렌더링
  - 상태 변화가 없는 셀은 `React.memo`로 재렌더 방지

### 13.8.6 숫자 표시 규칙
- Given 숫자:
  - 굵게, 색상은 `text-text` (다크는 `text-textDark`)
- 사용자 입력 숫자:
  - Given과 동일 크기, 필요 시 약간 다른 색(토큰 기반)로 구분 가능
- 완료 애니메이션:
  - `success` 색은 "짧게" 사용(과한 연출 금지)

### 13.8.7 Conflict(충돌) 표시 규칙
- 충돌은 "보더" 중심으로 표현(배경 전체 빨갛게 금지)
- 옵션:
  - 즉시 충돌 표시(ON/OFF)
  - 입력 시 진동(ON/OFF)

### 13.8.8 Same Digit Highlight 규칙
- 숫자 선택(키패드 또는 선택 셀 값) 시:
  - 동일 숫자 셀 배경을 `accent` 약색으로 하이라이트
  - 남은 개수 표시(키패드 뱃지)

### 13.8.9 Digit-First 모드에서의 보드 반응
- 숫자 선택 상태에서는:
  - 해당 숫자가 들어갈 수 있는 셀을 약하게 강조(기본 ON, 설정에서 OFF 가능)
  - 입력 불가 셀 탭 시 가벼운 피드백(진동/토스트)

### 13.8.10 접근성/가독성 체크
- 숫자 대비가 낮아지지 않도록 다크모드에서 보더/텍스트 대비 유지
- 작은 화면에서도 후보 숫자가 읽히는지(최소 10px) 확인

---

## 13.9 Keypad 상세 UI 스펙 (고정 규칙)

> 목표: 입력 속도/정확도를 좌우하는 핵심 컴포넌트이므로, "버튼 규격 + 상태 + 동작"을 고정한다.

### 13.9.1 레이아웃 규칙
- 키패드는 1~9 숫자 버튼 + 보조 액션 4개를 기본으로 한다.
- 기본 구성(권장):
  - 숫자 1~9 (3x3)
  - 하단 보조: `Undo`, `Erase`, `Pencil`, `Hint`
- 터치 영역 최소: 44pt
- 숫자 버튼 높이 권장: `h-14` (기기별로 `h-12~h-16` 범위)

### 13.9.2 숫자 버튼 상태
각 숫자(1~9)는 다음 상태를 가진다.
- `default`: 사용 가능
- `selected`: Digit-First에서 선택된 숫자
- `disabled`: 해당 숫자가 더 이상 들어갈 곳이 없는 경우(보드에 9개 채워짐)

표현 규칙:
- `selected`: `accent` 배경 약 + 보더 강조
- `disabled`: 불투명도 낮춤 + 터치 불가

### 13.9.3 남은 개수 뱃지(Remaining Count)
- 각 숫자 버튼 우상단에 남은 개수 표시(0~9)
- 0이면 `disabled` 처리
- 기본 ON (설정에서 OFF 가능)

### 13.9.4 Digit-First 동작 규칙
- 숫자 버튼 탭 → 해당 숫자 선택(토글)
- 숫자 선택 상태에서 빈 셀 탭 → 해당 셀에 숫자 입력
- 동일 숫자 버튼 재탭 → 선택 해제
- 입력 불가 셀 탭 → 가벼운 피드백(진동/토스트)

### 13.9.5 Cell-First 동작 규칙
- 셀 탭 → 선택
- 숫자 버튼 탭 → 선택된 셀에 숫자 입력

### 13.9.6 Pencil(메모) 버튼 규칙
- Pencil은 토글 상태를 가진다(ON/OFF)
- ON 상태에서는 숫자 입력이 후보 토글로 동작
- Pencil ON 상태는 키패드/상태바에 항상 표시

### 13.9.7 Erase 버튼 규칙
- 선택된 셀의 입력 숫자를 삭제
- Given 셀은 삭제 불가
- Pencil ON일 때:
  - (기본) 해당 셀 후보 전체 삭제
  - 후보 하나씩 제거(롱프레스 UI)는 MVP 제외 (v1.1 검토)

### 13.9.8 Undo/Redo 규칙
- 기본: Undo 제공
- Redo는 MVP UI에서 숨김(내부 훅만 유지)
- Undo 스택 상한: 200 step 고정(MVP)
- Undo는 다음 이벤트를 포함:
  - 숫자 입력/삭제
  - 후보 토글
  - 자동 후보 삭제(옵션 ON 시)도 하나의 트랜잭션으로 묶기

### 13.9.9 Hint 버튼 규칙
- 힌트는 2종:
  - L0 단순 힌트
  - L1 가이드 힌트
- 힌트 실행 시, 보드 하이라이트와 함께 결과를 보여준다.
- 힌트는 Undo에 포함하지 않는다(일반적으로 힌트는 상태 변화이지만, UX 혼란 방지)

### 13.9.10 롱프레스/제스처(선택)
- 숫자 버튼 롱프레스:
  - 후보 모드 빠른 토글(선택)
- Undo 롱프레스:
  - 히스토리 미리보기(고도화)

---

## 13.10 Game Screen 전체 레이아웃 & 상태 스펙

> 목표: 플레이 화면의 구조와 상태 전환을 명확히 정의하여, 화면 설계가 흔들리지 않도록 한다.

### 13.10.1 기본 레이아웃 구조

GameScreen
 ├ TopBar
 │   ├ Back / Close
 │   ├ Difficulty Label
 │   ├ Timer
 │   └ Pause Button
 ├ Board Area (Center)
 ├ Keypad Area (Bottom)
 └ Optional Banner Slot (무료 유저, 화면 하단 외부 영역)

레이아웃 원칙:
- 세로 3단 구조 고정 (Top / Board / Keypad)
- 보드는 항상 중앙 정렬
- 키패드는 화면 하단 고정
- SafeArea 고려 필수

---

### 13.10.2 TopBar 스펙
- 높이: `h-12`~`h-14`
- 구성:
  - 좌측: 뒤로가기 (진행 중 경고 모달 필요)
  - 중앙: 난이도 표시 (`EASY / MEDIUM / ...`)
  - 우측: 타이머 + 일시정지 버튼

타이머 규칙:
- 기본: mm:ss 형식
- 1시간 초과 시 hh:mm:ss
- 일시정지 시 타이머 정지

---

### 13.10.3 화면 상태(State Machine)

Game 상태는 다음 중 하나를 가진다:
- `playing`
- `paused`
- `completed`
- `failed` (Mistake Limit ON일 때만)

상태 전환 규칙:
- playing → paused: Pause 버튼 탭
- paused → playing: Resume
- playing → completed: 퍼즐 완성 감지
- playing → failed: 실수 제한 초과(설정에서 Mistake Limit ON일 때만)

---

### 13.10.4 Pause 모달
구성:
- Resume
- Restart
- Settings
- Quit

규칙:
- Resume은 가장 강조 버튼
- Quit 선택 시 확인 모달 1회 더 표시

---

### 13.10.5 Completed 화면
완료 시 전체 화면 모달(CompletedModal) 표시

공통 표시 항목:
- 완료 시간
- 실수 수
- 힌트 사용 수
- 난이도

Journey(mode=`journey`) 추가 표시:
- Stage header: `{chapterId} {stageIndex2}/10` (예: `EASY 03/10`)
- 획득 stars(1~3) + bestStars
- 코인 보상: 별 보상 코인은 `⭐=+5`, `⭐⭐=+10`, `⭐⭐⭐=+20` 총 지급 기준이며, 재플레이로 별이 개선될 때는 delta만 추가 지급한다(중복 지급 금지). 코인 지급/중복 방지는 서버 검증 함수 `verifyJourneyStage(stageId, sessionId)`에서만 수행한다.
- [MUST] 코인 표기는 `verifyJourneyStage` 응답의 `coinsDelta`만 사용한다(offline/검증 대기 중이면 숨김). 총 지급 기준(+5/+10/+20)을 UI에서 직접 계산/표기 MUST NOT 한다.
- 오프라인/검증 대기 중이면 “보상은 온라인 복귀 후 반영” 안내를 노출한다.

버튼(모드별):
- classic/daily: `New Game`, `Replay`
- journey: `Next Stage`(다음 stage 존재 시), `Stage List`, `Replay`
- Share 버튼 없음(MVP 제외, v1.1 검토)

광고 규칙(무료 유저):
- CompletedModal 닫기 직후 인터스티셜은 최소 5판 쿨다운을 적용한다(Next Stage도 “모달 닫기”로 취급).

---

### 13.10.6 Failed 화면 (설정 옵션)
- 실수 3회 초과 등
- 기본 OFF, Mistake Limit ON일 때만 사용
- 동작:
  - Restart
  - Quit
- [MUST NOT] `failed` 화면에서 Rewarded 부활/부스터 CTA를 제공하지 않는다(MVP).

---

### 13.10.7 힌트 오버레이
- 힌트는 전체 화면을 덮지 않음
- 보드 위 강조 + 하단 설명 카드 형태

---

### 13.10.8 접근성(최소 기준)
- 글자 크기 옵션(large text)
- 진동/사운드 토글
- 색약 모드(충돌/선택 구분 강화)

---

## 13.11 RN 구현 요약 (중복 통합 섹션)

### 13.11.1 폴더 구조 제안
```
/src
  /app (navigation, providers)
  /features
    /game
      GameScreen.jsx
      useGameEngine.js
      solver/
      generator/
    /daily
    /stats
    /profile
  /components
  /theme
  /services (firebase, ads, iap)
  /store
```

---

### 13.11.2 게임 엔진 구조 (RN 기준)

#### 13.11.2.1 상태 구조 (예시: JSDoc)
```js
/**
 * @typedef {Object} GameState
 * @property {number[][]} board
 * @property {number[][][]} candidates
 * @property {string=} solutionHash
 * @property {number} mistakes
 * @property {number} hintsUsed
 * @property {'easy'|'medium'|'hard'|'expert'|'evil'} difficulty
 * @property {'cell'|'digit'} mode
 */
```
- [MUST NOT] `solution`(정답 전체) 및 정답 원문은 로컬/클라우드 저장 MUST NOT이다(단일 기준: `PRD_SPEC_LOCK.md` 18.8, 39.1.9).

#### 13.11.2.2 엔진 분리 원칙
- UI와 Solver/Generator 완전 분리
- solver는 pure function 유지
- 난이도 분석은 solver 로그 기반으로 판정

---

### 13.11.3 퍼즐 생성 전략 (RN 최적화)

#### 13.11.3.1 일반 퍼즐
- 디바이스 로컬 생성
- 프리생성 캐시 목표: Easy 30 / Medium 30 / Hard 25 / Expert 15 / Evil 10
- MVP에서는 포그라운드 idle 구간에서만 프리생성(OS 백그라운드 스케줄러 미사용)
- 생성 타임아웃 시 난이도 1단계 완화 fallback을 허용한다(MVP).

#### 13.11.3.2 Daily 퍼즐
- seed는 클라이언트에서 `hash(YYYY-MM-DD(UTC)|generatorVersion)`로 계산
- 서버에 completion 결과만 업로드

이 구조로 서버 비용 최소화 + 글로벌 동일 퍼즐 유지.

---

### 13.11.4 광고 & IAP 설계 (RN)

#### 13.11.4.1 광고 노출 규칙
- 배너: GameScreen 하단 고정
- [MUST] Interstitial은 CompletedModal 직후에만 노출하며, 최소 5판 쿨다운을 적용한다(13.10.5).
- Rewarded:
  - [MUST] 목적은 `currency_earn`, `hint_refill` 2개로만 고정한다(ADR-065).
  - [MUST] `currency_earn`: Coins Store에서만 노출. Home에서는 Coins Store 진입 CTA만 제공한다. `+20 coins`, 일일 한도 `10회/일`(UTC 00:00 리셋).
  - [MUST] `hint_refill`: 힌트가 0개일 때만 노출. `+1 hint`, 일일 한도 `5회/일`(UTC 00:00 리셋). Free 기본 `3 hints/day`.
  - [MUST NOT] `revive(부활)` 목적의 Rewarded 노출/요청을 수행하지 않는다(MVP).

#### 13.11.4.2 프리미엄 플래그 처리
- Firestore + 로컬 캐시 동시 저장
- 앱 시작 시 RevenueCat 검증 → premium 상태 갱신
- 서버 반영 경로: RevenueCat webhook → purchases/profile premium 동기화
- `premium=true` 동안 `banner/interstitial/rewarded` 광고 요청/노출 및 Rewarded CTA 노출을 금지한다.
- 결제 상태머신: `idle/purchasing/purchased/restored/cancelled/failed/revoked/pending`

---

### 13.11.5 퍼포먼스/보안/스프린트 요약
#### 13.11.5.1 퍼포먼스 고려사항
- 보드 렌더링은 FlatList 사용 금지 (9x9 고정 grid 직접 구현)
- 셀은 React.memo 적용
- 후보 숫자 렌더링 최소화
- Digit-First 하이라이트는 derived state로 계산
- [MUST] 저사양 대응(자동 감지/수동 설정/후보 렌더링 간소화 포함)은 `PRD_SPEC_LOCK.md` 25.7 및 33.3을 단일 기준으로 따른다.

---

#### 13.11.5.2 보안 & 치팅 방지
- MVP Daily는 점수/순위를 저장하지 않고, dateUTC 완료 여부와 도장 검증 시각만 서버 기준으로 기록
- [MUST] 힌트 사용 기록은 세션 단위 집계(예: `sessions.hintsUsed`) 및 힌트 관련 이벤트(예: `hint_requested`, `hint_applied`)로만 서버에 기록한다.
- [MUST NOT] 힌트 quota(`hintQuotaDateUTC`, `hintsRemaining`, `hintRefillAdsUsedToday`)는 서버 저장/동기화/복구 대상으로 취급하지 않는다(`PRD_SPEC_LOCK.md` 15.7).
- 난이도는 서버에서 재검증 가능 구조로 설계

---

#### 13.11.5.3 초기 스프린트 제안
1) GameBoard UI + 상태관리
2) Solver 기본(Single + Pair)
3) 난이도 판정 v1
4) Pencil Mode + 자동 후보 삭제
5) 광고 SDK 연동 테스트

Sprint 1 완료 기준:
- 퍼즐 생성 → 플레이 → 완료까지 전체 루프 동작
- 힌트 1종 동작
- 광고 정상 노출

---

### 13.11.6 벤치마크 기준 (The Clean One 스타일)

#### 13.11.6.1 기준 앱: Sudoku – The Clean One
- 개발사: Dustland Design
- 포지셔닝: 미니멀 UX + 마니아 친화 입력 편의 + 광고 절제형

---

### 13.11.7 The Clean One 기반 제품 전략

#### 13.11.7.1 핵심 UX 철학
- 군더더기 없는 UI
- 입력 속도 최적화
- 방해 요소 최소화 (과한 이펙트/광고 배제)
- 설정을 통해 유저가 행동 방식을 직접 선택

#### 13.11.7.2 반드시 포함해야 할 기능 (Parity)
- Cell-first / Digit-first 자연 전환
- Pencil marks + 자동 후보 제거
- Undo 기본 제공 + Redo UI는 MVP 숨김
- 자동 저장
- 남은 숫자 카운트 표시
- 충돌 하이라이트 옵션
- 난이도 5단계
- [MUST] MVP 테마는 Light/Dark(및 system)만 제공한다(단일 기준: `PRD_SPEC_LOCK.md` 20.2.6, `PRD_MASTER.md` 6.1). 추가 스킨은 Post-MVP이다.

#### 13.11.7.3 화면 IA (Clean One 스타일 기준)

Home
 ├ Continue (진행중 게임)
 ├ New Game (난이도 선택)
 ├ Daily Challenge
 ├ Statistics
 ├ Settings

Game Screen
 ├ 상단: 타이머 / 일시정지
 ├ 중앙: 9x9 Board
 ├ 하단: 숫자 키패드
 ├ 하단 보조: Undo / Erase / Pencil / Hint

설정 화면
 ├ 입력 방식 선택
 ├ 자동 후보 삭제 ON/OFF
 ├ 충돌 표시 ON/OFF
 ├ 자동 완성 ON/OFF
 ├ 하이라이트 강도
 ├ 테마 선택

#### 13.11.7.4 차별화 포인트 (우리 버전 추가)
- 논리기술 기반 난이도 판정 신뢰도 강화
- Speed Mode (기록 경쟁 전용 UI)

#### 13.11.7.5 벤치마크 업데이트 체크리스트(Parity)
- Notes/Pencil + 자동 후보 삭제
- Undo + 자동 저장 (Redo UI는 MVP 숨김)
- Digit highlight + 남은 숫자 카운트
- Daily Challenge + 출석/배지
- [MUST] MVP 테마는 Light/Dark(및 system)만 제공한다. 추가 스킨은 Post-MVP이다.

#### 13.11.7.6 우리가 가져갈 ‘차별화’(Differentiation)
- 난이도 = 논리기술 로그 기반(‘악마’ 신뢰도)
- Digit-First 스피드런 UX(연속 입력 + 후보 가능 셀 표시)

#### 13.11.7.7 고도화 아이디어(선택)
- Microsoft처럼 변형 모드 1~2개를 이벤트로 도입(예: Irregular)
- CTC처럼 ‘퍼즐 팩/작가/테마’ 기반 시즌 운영



---
