# PRD Spec Lock

> Canonical file: `PRD_SPEC_LOCK.md`
> Scope: Sections 14~25, 31~41 (구현/운영 스펙)

## 14. 난이도 점수 시스템 (Logic-Based Difficulty Engine)

> 목표: 난이도를 ‘빈칸 개수’가 아닌, **사용된 논리기술과 풀이 복잡도** 기반으로 정량화한다.

---

### 14.1 기본 원칙
1. 모든 퍼즐은 Solver로 ‘논리 풀이 시뮬레이션’을 거친다.
2. Solver는 사용된 기술을 순서대로 로그로 반환한다.
3. 각 기술에는 가중치가 존재한다.
4. 총 점수 + 최고 난도 기술 + 체인 깊이를 기준으로 난이도를 판정한다.
5. 추측(Guess/Backtracking)이 필요한 퍼즐은 채택하지 않는다.

---

### 14.2 Solver 출력 스펙

Solver는 다음 구조를 반환해야 한다:

```js
{
  steps: [
    { technique: 'naked_single', impact: 1 },
    { technique: 'x_wing', impact: 4 }
  ],
  maxChainDepth: 3,
  totalSteps: 42,
  usedTechniques: ['naked_single', 'x_wing']
}
```

---

### 14.3 기술 가중치 테이블 (v1 기준)

| Technique      | Score |
|----------------|-------|
| naked_single   | 1     |
| hidden_single  | 1     |
| naked_pair     | 2     |
| hidden_pair    | 2     |
| naked_triple   | 3     |
| pointing_pair  | 3     |
| claiming_pair  | 3     |
| x_wing         | 6     |
| swordfish      | 8     |
| xy_wing        | 7     |
| coloring       | 7     |

---

### 14.4 총 난이도 점수 계산식

기본 점수:

baseScore = Σ(techniqueScore × 사용횟수)

보정 요소:
- chainBonus = maxChainDepth × 2
- stepBonus = totalSteps / 10

최종 점수:

difficultyScore = baseScore + chainBonus + stepBonus

---

### 14.5 난이도 티어 구간 정의 (v1 기준)

| Tier    | Score Range |
|---------|-------------|
| Easy    | 0 – 80      |
| Medium  | 81 – 160    |
| Hard    | 161 – 260   |
| Expert  | 261 – 380   |
| Evil    | 381+        |

추가 조건:
- Expert 이상은 최소 1회 이상 고급 기술 포함 필수.
- Evil은 최소 2종 이상의 고급 기술 포함 필수.

---

### 14.6 퍼즐 생성 파이프라인 연동

1. 완성 보드 생성
2. 셀 제거
3. 유일해 검증
4. Solver 실행 → 난이도 점수 산출
5. 목표 티어 범위에 포함되지 않으면 폐기
6. 조건 충족 시 퍼즐 채택

---

### 14.7 신뢰성 확보 전략

- 샘플 퍼즐을 수동 검증하여 점수 구간 튜닝
- 출시 후 플레이 데이터 기반 점수 범위 조정
- 특정 기술이 과대/과소 평가될 경우 가중치 조정

---

### 14.8 통계 시스템과의 연계

- [MUST] PlaySession에는 난이도 검증용 최소 필드만 저장한다.
  - `difficultyScore`
  - `maxTechniqueUsed`
- [MUST] MVP 통계 UI는 기본 지표만 노출하며, Solver 상세 로그/성장 분석 카드는 노출하지 않는다.
- [MUST] `logicUsed`, `techniqueTimeline`, 성장 분석 집계는 Post-MVP 백로그(B-008/B-011) 범위로 유지한다.

---

> 이 시스템은 앱의 난이도 신뢰도를 만드는 핵심 엔진이다.



---

## 15. 힌트 시스템 (MVP 고정)

> 목표: 복잡한 튜터/학습 기능 없이, 막힘 해소용 힌트(L0/L1)만 안정적으로 제공한다.

---

### 15.1 범위 (MVP)
- [MUST] 힌트는 `L0`, `L1`만 제공한다.
- [MUST] `L2/L3`, `TutorOverlay`, `LearnHub`는 v1.0에서 제외한다.
- [MUST] 힌트 정책은 Free/Premium으로 분기한다(Free: 일일 제한 + 광고 충전, Premium: 무제한). (ADR-063)

### 15.2 힌트 레벨 정의
- `L0` 단순 힌트:
  - 정답 숫자 1개를 즉시 입력한다.
- `L1` 가이드 힌트:
  - 관련 행/열/박스/후보를 하이라이트한다.
  - 자동 입력은 수행하지 않는다.

### 15.3 힌트 선택 로직
- [MUST] 현재 상태에서 적용 가능한 가장 쉬운 한 수를 우선 선택한다.
- 동점일 때 우선순위:
  1) 선택된 셀/숫자와 연관된 힌트
  2) 확정 입력 가능한 힌트
  3) 후보 제거 힌트

### 15.4 힌트 UX 규칙
- [MUST] 힌트 문구는 1~2문장으로 유지한다.
- [MUST] 한 번에 한 액션(한 수)만 제시한다.
- [MUST] 힌트 실패 시 `hint.not_found` 카피를 노출한다.
- [MUST] 힌트 적용은 Undo 스택에 포함하지 않는다.

### 15.5 모드별 제한
- [MAY] Speed Mode가 도입되는 버전(v1.2+)에서는 힌트를 비활성화한다(MVP에는 미적용).
- [SHOULD] 연속 힌트 요청 시 동일 메시지 중복 노출을 제한한다.

### 15.6 데이터/통계 연동 (MVP)
- [MUST] `hintLevelUsed`는 `L0`, `L1` 카운트만 기록한다.
- [MUST] 튜터 전용 필드(`tutorTechniquesUsed`)는 기록하지 않는다.

### 15.7 힌트 사용 제한 정책 (MVP)
- [MUST] 힌트 1회 소비는 `HintSheet > Apply`가 성공적으로 적용된 1회를 의미한다(`Cancel`/닫기/`hint.not_found`는 소비 아님).
- [MUST] Free 힌트 토큰 정책:
  - `freeHintsPerDay=3` (UTC 00:00 리셋)
  - `hintsRemaining`은 당일 잔여 힌트 토큰 수를 의미한다.
  - `hintsRemaining > 0`일 때만 힌트 Apply를 허용하며, Apply 성공 시 `hintsRemaining -= 1`을 수행한다.
- [MUST] 힌트 광고 충전 정책:
  - `hintRefillPerAd=+1`, `hintRefillAdsPerDayMax=5` (UTC 00:00 리셋)
  - CTA 노출 조건: `hintsRemaining == 0` AND `hintRefillAdsUsedToday < hintRefillAdsPerDayMax` AND `networkState=online` AND rewarded 광고가 `ready` 상태.
  - 광고 시청 완료(Reward granted) 시 `hintsRemaining += 1`, `hintRefillAdsUsedToday += 1`.
  - 광고 로드 실패/취소/timeout은 상태를 변경하지 않는다(무한 로딩 금지).
- [MUST] Premium 힌트 정책:
  - Premium은 힌트 무제한이다.
  - Premium에서는 힌트 충전 광고 CTA를 노출하지 않는다(광고 제거 정책 유지).
- [MUST] 일일 리셋 기준:
  - 리셋 기준은 UTC 00:00이다.
  - 리셋 시 Free 유저는 `hintsRemaining=freeHintsPerDay`, `hintRefillAdsUsedToday=0`으로 초기화한다.
- [MUST] 오프라인 정책:
  - 오프라인에서도 `hintsRemaining > 0`이면 힌트 사용은 허용한다(로컬 Solver 기반).
  - 오프라인에서는 힌트 충전 광고 CTA를 노출하지 않는다(광고 시청 불가).
- [MUST] 저장 범위(Quota):
  - 힌트 quota(`hintQuotaDateUTC`, `hintsRemaining`, `hintRefillAdsUsedToday`)는 계정 동기화 대상이 아니며, 기기 로컬(MMKV)에서만 저장/리셋한다. 다기기 사용 시 quota는 기기별로 독립 적용된다.
  - 앱 재설치/로컬 데이터 초기화 시 힌트 quota가 초기화될 수 있으며, 이는 MVP의 의도된 동작이다(서버 복구/CS 복구 대상 아님).

---

## 16. 힌트 UI IA + 컴포넌트 스펙 (MVP)

> 목표: 힌트 UI를 단일 경로로 단순화해 구현 난이도와 상태 충돌을 줄인다.

---

### 16.1 화면 목록 (IA)

App
 ├ Home
 ├ Journey
 ├ GameScreen
 │   ├ HintSheet (L0/L1)
 │   ├ HintGateSheet (quota gate)
 │   ├ PauseModal
 │   └ CompletedModal
 ├ Paywall
 └ Settings

### 16.2 HintSheet 스펙 (L0/L1)

진입 조건:
- [MUST] GameScreen에서 Hint 버튼 탭 시 열림(`hintsRemaining > 0` 또는 Premium 무제한인 경우)
- [MUST] `hintsRemaining == 0`(Free)인 경우 HintSheet 대신 `HintGateSheet`를 연다.

레이아웃:
- Title: `Hint`
- Body: 힌트 요약 1~2문장
- CTA:
  - Primary: `Apply`
  - Secondary: `Cancel`

동작 규칙:
- [MUST] L0: Apply 시 숫자 1개 입력
- [MUST] L1: Apply 시 하이라이트만 적용(숫자 입력 없음)
- [MUST] 적용 후 시트 자동 닫힘

### 16.2.1 HintGateSheet 스펙 (Hint Quota, MVP)

진입 조건:
- [MUST] `hintsRemaining == 0`(Free)일 때 Hint 버튼 탭 시 열림

레이아웃:
- Title: `Hint`
- Body: `hint.quota.exhausted.body` (40.2)
- CTA:
  - Primary: `hint.refill.rewarded.cta` (40.2, 조건 충족 시에만)
  - Secondary: `Upgrade to Premium` (Settings > Data `openPaywall`)
  - Close: `Close`

동작 규칙:
- [MUST] Primary CTA는 15.7의 노출 조건을 만족할 때만 노출한다(광고 `ready`, `networkState=online`, 일일 한도 미도달).
- [MUST] Primary CTA 성공(Reward granted) 시 `hintsRemaining += 1`을 반영하고 시트를 닫는다.

### 16.3 CompletedModal 스펙 (Journey 포함, MVP)

진입 조건:
- [MUST] GameScreen에서 `status=completed`로 전이된 경우 `CompletedModal`을 표시한다(21.9).

공통 표시:
- Title: `game.complete.title` (40.2)
- Summary: `game.complete.summary` (40.2)

`mode=journey` 추가 표시:
- [MUST] Stage header는 `{chapterId} {stageIndex2}/{stagesPerChapter}` 형태로 표시한다(예: `EASY 03/10`).
- [MUST] 이번 플레이의 stars(`1..3`)와 갱신 후 `bestStars`를 함께 표시한다(21.11, 39.4.3).
- [MUST] 코인 보상은 서버 검증 함수 `verifyJourneyStage(stageId, sessionId)`의 `coinsDelta`를 표시한다(38.1.6.5, 39.4.3). `coinsDelta=0`인 경우에도 `+0`을 표시한다(숨김 처리 금지).
- [MUST] 오프라인 또는 서버 검증 결과 대기 중에는 `journey.complete.reward_pending.body` 1줄을 노출하고 `coinsDelta` 표시는 숨김 처리한다(41.4).
- [MUST] `verifyJourneyStage` 응답이 없는 경우(offline 또는 verify pending) 이번 플레이의 stars는 21.11 규칙으로 클라이언트에서 계산한 값을 사용한다(PlaySession의 `durationMs`(=21.10 playing-only 타이머), `hintsUsed`).
- [MUST] `verifyJourneyStage` 응답이 없는 경우(offline 또는 verify pending) `bestStars`는 `journeyStagesCache[stageId].bestStars` 기준으로 `max(journeyStagesCache[stageId].bestStars, stars)`를 사용한다(없으면 0, 19.9).
- [MUST] Next Stage CTA의 unlocked 판정은 위 `bestStars`(=effective bestStars) 기준으로 한다.

CTA:
- Classic/Daily의 CompletedModal 구성은 `PRD_MASTER.md` 13.10.5를 따른다.
- Journey:
  - Primary: `journey.complete.next_stage.cta` (다음 stage가 존재하고 unlocked일 때만)
  - Secondary: `journey.complete.stage_list.cta`
  - Tertiary: `journey.complete.replay.cta` (optional)
- [MUST] `journey.complete.next_stage.cta` 탭은 CompletedModal close로 취급하며, Interstitial은 “CompletedModal 닫기 직후” 규칙을 그대로 적용한다(38.1.5.1). Interstitial이 노출되면 종료 후 다음 stage로 네비게이션한다.

### 16.4 상태/네비게이션 규칙
- [MUST] HintSheet가 열려 있으면 보드 직접 입력을 제한한다.
- [MUST] Back 동작 시 HintSheet를 먼저 닫고 게임 상태는 유지한다.
- [MUST] 힌트 화면에서 외부 학습 화면으로 이동하지 않는다.

---

## 17. 힌트 데이터 포맷 (Solver -> UI 계약, MVP)

> 목표: L0/L1 힌트를 구현하기 위한 최소 데이터 계약만 고정한다.

---

### 17.1 HintStep 스키마

```js
/**
 * @typedef {Object} HintStep
 * @property {'L0'|'L1'} levelSuggested
 * @property {string} technique
 * @property {string} messageKey
 * @property {{r:number,c:number,d:number}[]=} placements
 * @property {{type:'cell'|'row'|'col'|'box'|'candidate_remove', r?:number, c?:number, index?:number, digit?:number}[]} highlights
 */
```

규칙:
- [MUST] `L0`는 `placements` 1개 이상 포함
- [MUST] `L1`는 `highlights` 1개 이상 포함
- [MUST] `candidate_keep` 타입은 v1.0에서 지원하지 않는다.
- [MUST] `messageKey`는 `hint.l0.body` | `hint.l1.body` | `hint.not_found` 중 하나만 사용한다.

### 17.2 Solver API 계약

```js
/**
 * @param {number[][]} board
 * @param {number[][][]} candidates
 * @param {{level:'L0'|'L1'}} options
 * @returns {HintStep|null}
 */
function getHintStep(board, candidates, options) {}
```

### 17.3 예외/실패 처리
- [MUST] 반환값이 `null`이면 UI는 `hint.not_found`를 표시한다.
- [MUST] Solver timeout 시 L0 fallback을 1회 시도한다.
- [SHOULD] 실패 원인은 내부 로그로만 기록하고 사용자에게 코드 노출은 금지한다.

---

## 18. 퍼즐 생성기(Generator) 상세 스펙

> 목표: 로컬 생성 기반으로 서버 비용 없이 운영하되, **유일해/난이도 신뢰도/성능**을 확보한다.

---

### 18.1 생성 전략(고정: 하이브리드)
- **일반 퍼즐**: 디바이스 로컬 생성 + 캐싱
- **Daily/이벤트**: 클라이언트 로컬 계산 seed로 동일 퍼즐 생성(MVP)
- **Journey(Stage/Chapter)**: 클라이언트 로컬 계산 seed로 동일 퍼즐 생성(MVP)

장점:
- 서버비 최소
- 오프라인 플레이 가능
- Daily는 글로벌 동일 퍼즐 유지 가능
- [MUST] MVP에서는 Daily seed를 서버 fetch하지 않는다.
- [MUST] Daily seed는 `dailySeed = hash(YYYY-MM-DD(UTC)|generatorVersion)` 규칙으로 계산한다.
- [MAY] v1.1+에서 운영 이벤트용 `overrideSeed`를 서버에서 주입할 수 있다(기본 OFF).
- [MUST] MVP의 Daily Challenge는 dateUTC당 1개 퍼즐로 고정한다(난이도 선택 UI 미제공).
- [MUST] MVP의 Daily Challenge difficulty는 `medium`으로 고정한다.
- [MUST] 동일 dateUTC에 `verified` stamp가 이미 존재하면 추가 Daily 완료는 stamp/streak에 반영하지 않는다(세션 기록은 별도 허용).

- [MUST] MVP에서는 Journey seed를 서버 fetch하지 않는다.
- [MUST] MVP의 Journey(Stage/Chapter)는 아래 상수로 고정한다(ADR-067).
  - `journeyVersion=1`
  - `chapterId(=difficulty)`: `easy|medium|hard|expert|evil`
  - `stagesPerChapter=10` (stageIndex: `1..10`)
- [MUST] `stageId` 포맷은 `j{journeyVersion}_{chapterId}_{stageIndex2}`로 고정한다.
  - `stageIndex2`는 2자리 `01..10` 0-padding을 사용한다.
  - 예: `j1_easy_01`, `j1_medium_10`
- [MUST] Journey stage seed는 아래 규칙으로 계산한다:
  - `stageSeed = hash(journeyVersion|chapterId|stageIndex|generatorVersion)`
- [MUST] Journey stage puzzleId는 18.2 규칙으로 계산한다:
  - `puzzleId = hash(stageSeed|difficulty|generatorVersion)`
- [MUST] MVP에서 `chapterId`는 `difficulty`와 동일하게 취급한다.

---

### 18.2 퍼즐 ID & Seed 규칙
- 퍼즐 ID는 seed 기반으로 결정(재현 가능해야 함)
- `puzzleId = hash(seed|difficulty|generatorVersion)`
- [MUST] seed는 `uint64`를 문자열로 직렬화한 형식을 사용한다.

#### 18.2.1 `hash()` 정의 (고정)
- [MUST] 본 문서의 `hash(input)`는 `SHA-256(UTF-8)` digest의 상위 8바이트를 big-endian `uint64`로 해석한 값의 10진 문자열(leading zero 금지)로 고정한다.
- [MUST] hash 입력 문자열 결합은 구분자 `|`를 사용한다(구분자 없는 단순 concat 금지).
  - `dailySeed` 입력: `YYYY-MM-DD(UTC)|generatorVersion`
  - `puzzleId` 입력: `seed|difficulty|generatorVersion`
- [MUST] `seed(uint64)` 직렬화는 10진 문자열 단일 표현으로 고정한다(leading zero 금지).

버전(version) 규칙:
- 생성/솔버 로직이 바뀌면 `generatorVersion`을 올려서 구버전 퍼즐 재현 문제를 방지

---

### 18.3 생성 파이프라인(필수 단계)

1) **완성 보드 생성(Fill)**
- 임의 완성 스도쿠 그리드를 생성
- [MUST] 백트래킹(랜덤 순서)으로 완성 보드를 생성한다.
- [MUST] seed 기반 RNG를 사용해 재현성을 확보한다.

2) **클루 제거(Remove Clues)**
- 대칭 제거 옵션 지원(기본 ON, 설정에서 OFF 가능)
  - `rotational symmetry`(180도) 기본
- 제거는 단계적으로 진행
- 제거 중간마다 유일해/난이도 검증을 수행(성능 고려해 배치 검증 가능)

3) **유일해 검증(Unique Solution)**
- 해가 하나인지 검사
- [MUST] 해 탐색은 2개까지만 찾고(2개면 즉시 실패) 즉시 종료한다.

4) **Solver 시뮬레이션(Logic Solve)**
- 14장 난이도 점수 시스템으로 점수 산출
- 목표 티어 범위에 들어오지 않으면 폐기

5) **채택(Commit)**
- 조건 충족 퍼즐만 저장/캐시에 적재

---

### 18.4 난이도별 생성 목표(가이드)

> 점수 구간은 v1 기준이며 출시 후 튜닝한다.

- Easy: Singles 중심, Pairs 거의 없음
- Medium: Pairs/기본 제거 포함
- Hard: Pointing/Claiming 일부 포함
- Expert: X-Wing 등 고급 기술 최소 1회 포함(추측 금지)
- Evil: 고급 기술 2종 이상 또는 체인 깊이 높은 풀이(추측 금지)

추가 제약(참고):
- 난이도별 최소/최대 클루 수 가이드
  - Easy: 36~45
  - Medium: 32~38
  - Hard: 28~34
  - Expert: 24~30
  - Evil: 22~28

※ [MUST] 클루 수는 rejection 기준으로 사용하지 않으며, 최종 판정은 로직 점수로 고정한다.

---

### 18.5 성능 전략(모바일 최적화)

#### 18.5.1 프리생성(Pre-generation) 캐시
- 앱 최초 실행 또는 유휴 시간에 퍼즐을 미리 생성해 캐시
- [MUST] 난이도별 캐시 목표 개수를 아래 값으로 고정한다:
  - Easy 30, Medium 30, Hard 25, Expert 15, Evil 10
- [MUST] 난이도별 캐시는 위 목표 개수를 절대 상한으로 간주한다(초과 저장 금지).
- [MUST] 상한 초과가 발생하면 해당 난이도에서 LRU(가장 오래된 캐시)부터 삭제해 상한을 만족시킨다.
- [MUST] 캐시 엔트리는 `createdAt` 기준 14일이 경과하면 만료로 간주하고 app_open 또는 포그라운드 idle 정리 시점에 삭제한다.

#### 18.5.2 백그라운드 생성
- 게임 플레이 중에는 생성 작업을 최소화
- [MUST] MVP에서는 포그라운드 idle 구간에서만 프리생성을 수행한다.
- [MUST NOT] OS 백그라운드 작업 스케줄러(TaskManager/WorkManager/BGTask)를 MVP에 도입하지 않는다.

#### 18.5.3 타임아웃/재시도
- [MUST] 퍼즐 생성 1회 시도 타임아웃은 `1200ms`로 고정한다.
- [MUST] 동일 난이도에서 최대 3회까지 재시도한다.
- [MUST] 재시도 순서는 아래와 같이 고정한다:
  1) seed 재생성 1회
  2) 대칭 제거 OFF로 1회
  3) 난이도 1단계 완화 fallback 1회(ADR-046)
- [MUST] fallback으로 채택된 퍼즐은 실제 생성 난이도를 `difficulty`로 기록/표시한다(요청 난이도와 불일치 금지).

---

### 18.6 유일해 검증 알고리즘 스펙
- 입력: partially filled grid
- 출력: solutionCount (0, 1, 2+)
- 규칙:
  - 2개 이상이면 즉시 중단(유일해 실패)
  - 가장 후보가 적은 셀부터 탐색(MRV)

---

### 18.7 RNG(재현성) 규칙
- [MUST] seed 기반 RNG는 `mulberry32`로 고정한다(다른 RNG 사용 금지).
- [MUST] RNG 초기값(`seed32`)은 `seed(uint64)`를 파싱한 후 하위 32비트 값으로 고정한다.
- 같은 seed+version이면 항상 동일 퍼즐이 생성되어야 함
- Daily 퍼즐은 UTC 기준 seed 생성 규칙 정의:
  - `dailySeed = hash(YYYY-MM-DD(UTC)|generatorVersion)`
- [MUST] Daily 날짜 경계는 `UTC 00:00` 기준으로만 전환한다.

---

### 18.8 데이터 저장 포맷(캐시)

캐시 저장 구조 예시:

```js
{
  puzzleId: 'puz_...',
  generatorVersion: 1,
  seed: '...',
  difficulty: 'expert',
  givens: number[][],      // 0은 빈칸
  solutionHash: 'sha1...', // 해시만 저장(필수)
  createdAt: 0
}
```

주의:
- [MUST] `solutionHash`는 캐시에 항상 저장한다.
- [MUST NOT] 해답(solution) 전체를 로컬/클라우드에 저장하지 않는다.

---

### 18.9 품질 검증(QA) 체크리스트
- 모든 퍼즐은 유일해 100%
- 난이도 점수 구간에 맞는지 샘플링 검수
- 동일 seed 재현성 100%
- Evil에서 추측이 필요한 퍼즐이 나오지 않는지 검수
- 생성 실패율/평균 생성 시간 텔레메트리로 수집(출시 후)

---

### 18.10 운영(버전업) 정책
- generatorVersion 상승 시:
  - 기존 캐시 퍼즐 폐기 또는 버전별로 분리 저장
  - Daily seed 생성 규칙에 version 포함(동일 날짜라도 버전 바뀌면 다른 퍼즐)

---

> 이 Generator 스펙은 "퍼즐 품질"과 "난이도 신뢰"를 보장하는 핵심이다.



---

## 19. 저장/동기화(Sync) 상세 스펙 (MMKV + Firebase)

> 목표: 폰 교체/재설치에도 기록 복구 + 오프라인 플레이를 기본으로, 온라인에서 자연스럽게 동기화한다.
> 백엔드 확정: Firebase Auth + Firestore (ADR-025)

---

### 19.1 저장 계층(3 레이어)

1) **In-memory (Zustand)**
- 현재 게임 상태(보드/후보/선택 상태 등)

2) **로컬 영속 저장 (MMKV 단독, MVP)**
- 즉시 저장(autosave)
- 오프라인에서도 100% 동작
- [MUST] MVP 로컬 저장소는 MMKV 단독으로 고정한다.
- [MAY] AsyncStorage는 SDK/플랫폼 요구 또는 Post-MVP에서만 도입한다.

3) **클라우드 저장 (Firestore)**
- 모든 사용자(로그인 필수)
- 기기 변경/복구/리더보드/통계 집계

---

### 19.2 로그인 정책
- 게스트 모드 미지원(MVP)
- 로그인 옵션(MVP 고정):
  - Apple / Google
- [MUST] iOS/Android 모두 로그인 옵션은 Apple / Google 2개를 제공한다(ADR-026).
- [MUST] iOS의 Apple 로그인은 네이티브 Apple Sign-In 플로우를 사용한다.
- [MUST] Android의 Apple 로그인은 웹 기반 OAuth 플로우로 제공한다.

로그인/진입 규칙:
- 최초 실행 시 로그인 완료 후 게임 진입 가능
- 이전 로그인 이력이 있는 기기는 오프라인에서도 로컬 플레이 허용, 온라인 복귀 시 동기화 재개
- [MUST] Firebase Auth 로그인 성공 직후 앱은 RevenueCat `logIn(firebaseUid)`를 호출해 appUserId를 Firebase uid에 바인딩한다.
- [MUST] `logIn(firebaseUid)` 완료 이전에는 RevenueCat 검증(getCustomerInfo), 구매(purchase), 복원(restore) 호출을 수행하지 않는다.

---

### 19.3 저장 대상 (무엇을 저장할지)

#### 19.3.1 로컬(MMKV)
- settings
- currentGame (진행 중 1개)
- puzzleCache(Generator 캐시)
- localStats(요약 캐시; 최근 200개 completed sessions 기반 난이도별 평균/중앙값/평균 실수/평균 힌트 계산 결과)
- hintQuota(hint 일일 제한/광고 충전 로컬 카운터: `hintQuotaDateUTC`, `hintsRemaining`, `hintRefillAdsUsedToday`)
- purchaseState(`premium | unknown`; 광고/결제 gate는 38.1.2.1의 `premiumEffective` 규칙을 따른다)
- dailyPendingQueue (offline에서 Daily stamp/streak 검증 대기 엔트리; 19.9 규칙)
- retryQueue (offline/네트워크 실패 시 push/서버검증 재시도 엔트리; 39.4의 FIFO/7일 보관 규칙)
- journeyStagesCache (Journey stage 진행도 로컬 캐시. stage list/CompletedModal/언락 판정에 사용하며 `pending_verify` 상태를 포함할 수 있다)
- resetProgressRequestId(resetProgress 멱등 재시도용 requestId 캐시; 완료/종결 시 삭제)

#### 19.3.2 클라우드(Firestore)
- profile
- settings (사용자 설정, `/users/{uid}/settings/meta`)
- achievements (Post-MVP reserved; MVP에서는 read/write/동기화 MUST NOT)
- dailyStreak / calendar stamps (하이브리드: `streak` 집계 + `stamps/{dateUTC}` 원본)
- journeyStages (Journey stage 진행도: stageId별 bestStars, Cloud Sync; server-write)
- currentGame (진행 중 1개, Continue 복구 기준)
- sessions (최근 200개 고정 + 집계형 병행)
- statsAggregate(집계)
- events (운영/분석 이벤트, 90일 TTL; 23장/39.1.5 기준)
- purchases(서버 검증 결과)
- wallet(재화: coins 잔액, server-write; `/users/{uid}/wallet/meta`)

---

### 19.4 세이브 슬롯 정책
- 기본: **진행 중 게임 1개(Continue)**
- [MUST] MVP에서는 멀티 슬롯을 지원하지 않는다.
- [MAY] Post-MVP에서 슬롯 3개 확장을 검토한다(백로그 이관).

슬롯 모델:
- `currentGame: {puzzleId, mode, dateUTC?, stageId?, updatedAt}`

---

### 19.5 Autosave 규칙
- 저장 트리거:
  - 숫자 입력/삭제
  - 후보 토글
  - Undo/Redo
  - 모드 변경(Pencil ON/OFF)
  - 앱 background 전환

- 저장 방식:
  - [MUST] debounce는 `400ms`로 고정한다.
  - 저장 실패 시 다음 이벤트에서 재시도

---

### 19.6 Firestore 데이터 설계(고정)

컬렉션/문서 경로 규칙:
- [MUST] Firestore 경로는 `collection/document/collection/document` 교대 규칙을 따른다.
- [MUST] singleton 문서(`profile/settings/statsAggregate/currentGame/streak`)는 고정 docId `meta`를 사용한다.

컬렉션 구조:
- `/users/{uid}/profile/meta`
- `/users/{uid}/settings/meta`
- `/users/{uid}/statsAggregate/meta`
- `/users/{uid}/currentGame/meta`
- `/users/{uid}/streak/meta`
- `/users/{uid}/stamps/{dateUTC}`
- `/users/{uid}/sessions/{sessionId}`
- `/users/{uid}/journeyStages/{stageId}`
- `/users/{uid}/events/{eventId}`
- `/users/{uid}/purchases/{purchaseId}`
- `/users/{uid}/wallet/meta`
- `/users/{uid}/achievements/{achievementId}` (Post-MVP reserved; MVP MUST NOT create/write)
- `/users/{uid}/ops/meta/resetProgressRequests/{requestId}` (server-only, resetProgress 멱등 마커)
- `/users/{uid}/ops/meta/rewardedCoinsGrants/{requestId}` (server-only, `currency_earn` 멱등 마커)
- `/daily/{dateUTC}/leaderboard/{uid}` (Post-MVP, MVP 미포함; `dateUTC=YYYY-MM-DD` UTC)

주의:
- sessions를 무한 저장하지 말고 기간/개수 제한
- 집계는 `statsAggregate`로 관리

---

### 19.7 동기화 주기
- 로그인 시 1회 Pull
- 앱 포그라운드 진입 시 Pull(쿨다운 30분)
- 세션 완료(Completed) 시 Push
- [MUST] `currentGame` 클라우드 Push는 AppState background 진입 시 1회 수행한다.
- [MUST] `currentGame` 클라우드 Push는 게임 진행 중에는 `30초` throttle을 적용한다(최대 1회/30초).
- [MUST] `currentGame` 클라우드 Push 실패 시 재시도 큐(39.4)에 등록하고 다음 포그라운드 Pull 주기 또는 `retrySyncNow`에서 재시도한다.
- [MUST] Daily 완료 시에는 sessions Push 완료 후 서버 검증 함수 `verifyDailyStamp`를 호출한다.
- [MUST] `verifyDailyStamp` 실패 시 Daily pending 큐에 등록하고 다음 동기화 주기에서 재시도한다.
- [MUST] Journey stage 완료 시에는 sessions Push 완료 후 서버 검증 함수 `verifyJourneyStage(stageId, sessionId)`를 호출한다.
- [MUST] `verifyJourneyStage` 실패 처리(고정):
  - 네트워크/일시적 장애(예: 연결 실패/timeout 또는 `status="failed" && retriable=true`) → retryQueue(39.4)에 등록 후 다음 동기화 주기 또는 `retrySyncNow`에서 재시도한다.
  - `status="ignored"`(삭제 가드) 또는 `status="failed" && retriable=false` → retryQueue에 등록 MUST NOT. 해당 `stageId`의 `journeyStagesCache` 엔트리를 삭제한다(서버 반영 없음).
    - [MUST] 위 케이스에서는 Cloud Pull로 진행도(`journeyStages`)를 재수신해 로컬 캐시를 서버 기준으로 재정렬한다(19.9 hydrate 규칙).
- [MUST] 재시도 큐에서 `verifyJourneyStage`를 실행할 때는, 해당 `sessionId`의 sessions Push가 선행되어야 한다.
  - sessions Push가 아직 성공하지 않았으면 `verifyJourneyStage`는 skip하고 다음 sync 사이클로 미룬다.
- [MUST] 설정 변경 시 Push 쿨다운은 `10초`로 고정한다.

---

### 19.8 충돌 해결 정책(중요)

원칙:
- 서버와 로컬 중 “더 최신(updatedAt)”이 우선
- [MUST] 로컬 저장소에서 `updatedAt`은 epoch milliseconds(number)로 저장한다.
- [MUST] Firestore `timestamp`/`updatedAt`은 비교 시 epoch ms(number)로 변환하여 로컬 값과 비교한다.
- [MUST] `updatedAt`이 동일할 경우 tie-breaker는 `cloud 우선`으로 고정한다.
- 단, 데이터 종류별로 merge 규칙을 다르게 적용

#### 19.8.1 Settings
- 최신 timestamp 우선

#### 19.8.2 CurrentGame(진행 중)
- 기본은 “로컬 우선”(유저가 당장 하던 게임이 중요)
- 단, 다른 기기에서 더 최근 저장이 있으면 선택 모달:
  - “이 기기 진행을 유지”
  - “클라우드 진행 불러오기”

#### 19.8.3 StatsAggregate
- 합산 가능한 항목은 merge(sum)
- 최고 기록(bestTime)은 min
- [MUST] `avgTimeByDifficulty`의 canonical 값은 최근 200개 completed sessions 기반 재계산으로 산출한다.
- [MUST] 재계산 결과는 `statsAggregate`와 `localStats`에 write-through 캐시한다.
- [MUST NOT] 가중 평균 단독 경로를 canonical 계산 방식으로 사용하지 않는다.

#### 19.8.4 Achievements/Streak
- Achievements(Post-MVP reserved): union(이미 해금된 건 유지). [MUST] MVP에서는 achievements 생성/해금/동기화를 수행하지 않는다.
- Streak(하이브리드):
  - 원본: `stamps/{dateUTC}` (날짜별 1문서)
  - 집계: `streak` 문서(`currentStreak`, `longestStreak`, `lastCompletedDateUTC`)
  - 동일 `dateUTC` 충돌 시 상태 우선순위는 `verified > pending > expired`로 적용한다.
  - [MUST] 연속일수는 `verified` stamps만 기준으로 서버에서 재계산한다.

#### 19.8.5 Reset Progress
- [MUST] Reset Progress(서버 함수: `resetUserProgress`) 실행 시 로컬 삭제와 클라우드 삭제를 동일 요청 단위로 처리한다.
- [MUST] `resetProgress`는 로컬 삭제 이후 pending/재시도 큐 purge를 선행하고, 그 다음 클라우드 삭제를 수행해야 한다(클라우드만 초기화되고 로컬 큐가 재업로드하는 역전 MUST NOT).
- [MUST] 클라우드 삭제만 실패한 경우 `sync.pending.banner`를 표시하고 자동/수동 재시도 경로를 제공한다.
- [MUST] `resetProgressRequestId`가 존재하는 동안 Sync Pull은 reset 대상 데이터(`currentGame/journeyStages/sessions/statsAggregate/streak/stamps`)를 로컬에 재생성/덮어쓰기 MUST NOT 한다(`status=done`까지 NO_OP).
- [MUST] 위 상태에서는 `sync.pending.banner`를 노출하고 `retrySyncNow` 경로로만 재시도를 제공한다.

---

### 19.9 오프라인 동작
- [MUST] 오프라인 플레이는 “이전 로그인 완료 이력이 있는 기기”를 전제로 한다.
- [MUST] 최초 설치 + 미로그인 상태에서는 오프라인 플레이를 제공하지 않는다(로그인 필요).
- 전제 충족 시 오프라인에서도:
  - 퍼즐 플레이 100%
  - 통계 로컬 집계
  - 도장/스트릭은 로컬 pending 큐로 임시 기록(보존 7일)
- Journey(Stage/Chapter) 오프라인 진행/언락/검증 대기 (MVP 고정)
  - [MUST] Journey stage 완료 시 서버 검증 결과가 아직 없어도(offline 또는 verify pending) UI는 즉시 진행을 반영해야 한다.
    - `stars`는 21.11 규칙으로 클라이언트에서 계산할 수 있어야 한다(PlaySession의 `durationMs`, `hintsUsed` 사용).
    - `bestStars`(UI/언락 판정)는 `journeyStagesCache[stageId].bestStars` 기준으로 `max(journeyStagesCache[stageId].bestStars, stars)`로 즉시 갱신한다(없으면 0).
    - 단, **코인 지급은 서버 검증 성공 후에만** 반영한다(코인 표시는 pending 규칙을 따른다).
  - [MUST] 동일 `stageId`를 offline 상태에서 여러 번 완료(재플레이)하는 경우:
    - 매 완료마다 `stars`를 계산한다(21.11).
    - `stars`가 기존 `journeyStagesCache[stageId].bestStars`보다 클 때만 `pendingSessionId`를 새 `sessionId`로 갱신한다(낮은/동일 stars run으로 덮어쓰기 금지).
      - [MUST] 위 조건으로 `pendingSessionId`가 갱신되면 `journeyStagesCache[stageId].syncState = "pending_verify"`로 설정한다.
    - retryQueue의 `verify_journey_stage` 엔트리는 `stageId` 단위로 1개만 유지(upsert)하며, payload의 `sessionId`는 항상 현재 `pendingSessionId`와 같아야 한다.
  - [MUST] `journeyStagesCache` 최소 스키마(로컬):
    - `bestStars: 0|1|2|3`
    - `syncState: 'synced' | 'pending_verify'`
    - `pendingSessionId?: string`
  - [MUST] `journeyStagesCache`는 `stageId -> {bestStars, syncState, pendingSessionId?}`의 map으로 저장한다.
  - [MUST] `journeyStagesCache` 작성/동기화 규칙(고정):
    - (Pull → Cache hydrate) Cloud Pull로 `/users/{uid}/journeyStages/*`를 수신했을 때, 각 `stageId`에 대해 아래를 수행한다.
      - `serverBestStars = journeyStages[stageId].bestStars` (문서가 없으면 0)
      - `localBestStars = journeyStagesCache[stageId].bestStars` (없으면 0)
      - `mergedBestStars = max(localBestStars, serverBestStars)`
      - `journeyStagesCache[stageId].bestStars = mergedBestStars`
      - `journeyStagesCache[stageId].syncState = (mergedBestStars > serverBestStars) ? "pending_verify" : "synced"`
      - `syncState=="synced"`이면 `pendingSessionId`는 제거한다.
    - (Verify success fast-path) `verifyJourneyStage`가 `status="done"`으로 응답하면, Pull을 기다리지 말고 즉시:
      - `journeyStagesCache[stageId].bestStars = bestStars`
      - `journeyStagesCache[stageId].syncState = "synced"`
      - `pendingSessionId` 제거
    - (UI 단일 기준) Stage List의 clearedCount/언락/별 표시는 항상 `journeyStagesCache`를 단일 기준으로 사용한다(서버 journeyStages 문서를 직접 렌더링 MUST NOT).
    - (미존재 stage 처리) cache/서버에 stage 문서가 없는 경우 해당 stage의 `bestStars=0`으로 취급한다.
  - [MUST] offline/네트워크 실패 시 재시도 큐(retryQueue)에 아래 엔트리를 기록한다(39.4의 FIFO/7일 보관 적용):
    1) `upsert_session` (payload: PlaySession)
    2) `verify_journey_stage` (payload: { stageId, sessionId })
  - [MUST] 재시도 엔진은 같은 `sessionId`에 대해 `upsert_session` 성공 후에만 `verify_journey_stage`를 시도한다(세션 미존재 반복 실패 금지).
  - [MUST] retryQueue(39.4) 만료(최대 7일 보관)로 `verify_journey_stage` 엔트리가 폐기되는 경우:
    - 해당 stage의 `journeyStagesCache` 엔트리를 삭제한다(서버 반영 불가로 간주).
    - 토스트 `journey.pending.expired.toast`를 1회 노출한다.

온라인 복귀 시:
- 서버 타임스탬프로 Daily 유효성 검증 후 반영
- 7일 초과 pending은 `expired` 처리하고 streak 반영 대상에서 제외한다.

---

### 19.10 데이터 최소화/성능
- sessions는 최근 200개까지만 유지(고정)
- 오래된 세션은 집계에 반영 후 삭제(클라우드/로컬)
- 캐시 퍼즐은 버전 변경 시 폐기

---

### 19.11 보안/치팅 방지(기본)
- Daily 완료 기록은 서버 timestamp 기준
- 해답(solution) 전체를 클라우드에 저장하지 않음
- leaderboard는 필요 시 서버 검증(Cloud Functions)로 확장

---

### 19.12 복구 시나리오

1) 앱 재설치 후 로그인
- Firestore Pull
- local cache 재생성

2) 기기 2대 사용
- 최신 세이브 선택 모달
- 통계는 merge (업적은 Post-MVP reserved)

3) 토큰 만료/로그아웃 후 재로그인
- 재로그인 성공 시 Firestore Pull 후 최신 상태 재정렬
- 로컬 pending 큐가 있으면 FIFO로 Push 재시도

---

> 이 Sync 스펙은 "안심하고 오래 쓰는 앱"을 만드는 기반이다.



---

## 20. Settings 스펙 (옵션 목록 + 기본값 + 설명 문구)

> 목표: 설정을 먼저 고정해서 개발/디자인이 흔들리지 않게 한다.
> 기본값은 "Clean One 스타일"(몰입/미니멀) 기준으로 설정한다.

---

### 20.1 Settings IA

Settings
 ├ Gameplay
 │   ├ Input Mode
 │   ├ Pencil
 │   ├ Conflict & Validation
 │   ├ Highlights
 │   └ Timer
 ├ Appearance
 ├ Sound & Haptics
 ├ Data
 └ About

---

## 20.2 설정 항목 상세 (MVP)

아래 표는 **MVP에서 반드시 구현**해야 하는 설정이다.

### 20.2.1 Gameplay

1) **Input Mode**
- Key: `inputMode`
- Type: enum (`auto` | `cellFirst` | `digitFirst`)
- Default: `auto`
- UI: Segmented Control
- 설명:
  - “입력 방식을 선택합니다. 자동은 아래 규칙으로 동작합니다.”
- [MUST] `selectedDigit`가 선택된 상태에서 셀 탭 시 digit-first 입력을 수행하고, 입력 후 `selectedDigit`를 유지한다.
- [MUST] `selectedDigit`가 없는 상태에서 셀 -> 숫자 탭 입력 시 cell-first 입력을 수행하고, 입력 직후 `selectedDigit`를 자동 해제한다.
- [MUST] 숫자 버튼 재탭 시 해당 숫자 선택을 토글(off)한다.

2) **Auto Candidate Cleanup (자동 후보 삭제)**
- Key: `autoCandidateCleanup`
- Type: boolean
- Default: `true`
- UI: Switch
- 설명:
  - “숫자를 확정하면 같은 행/열/박스의 후보에서 해당 숫자를 자동으로 제거합니다.”

3) **Pencil Default (메모 기본값)**
- Key: `pencilDefault`
- Type: boolean
- Default: `false`
- UI: Switch
- 설명:
  - “새 게임 시작 시 메모 모드를 기본으로 켭니다.”

4) **Mistake Limit Mode (실수 제한)**
- Key: `mistakeLimitMode`
- Type: enum (`off` | `limit3`)
- Default: `off`
- UI: Segmented Control
- 설명:
  - “실수 제한을 설정합니다. 기본은 제한 없음입니다.”
- [MUST] `journey` 모드에서는 `mistakeLimitMode`를 강제로 `off`로 취급한다(게임오버/failed 금지).

5) **Auto Complete Last Digit (마지막 숫자 자동완성)**
- Key: `autoCompleteLastDigit`
- Type: boolean
- Default: `false`
- UI: Switch
- 설명:
  - “남은 숫자가 1개일 때 자동으로 채웁니다.”

---

### 20.2.2 Conflict

6) **Instant Conflict Highlight (충돌 즉시 표시)**
- Key: `instantConflict`
- Type: boolean
- Default: `true`
- UI: Switch
- 설명:
  - “규칙을 위반하는 입력을 즉시 표시합니다.”

7) **Block Invalid Input (잘못된 입력 차단)**
- Key: `blockInvalidInput`
- Type: boolean
- Default: `false`
- UI: Switch
- 설명:
  - “규칙을 위반하는 숫자 입력을 막습니다. 꺼두면 입력은 되지만 충돌로 표시됩니다.”
- [MUST] MVP 기본값은 “충돌 표시만”이며, 입력 차단(`blockInvalidInput`)은 기본 OFF로 유지한다.

---

### 20.2.3 Highlights

8) **Highlight Related Units (행/열/박스 하이라이트)**
- Key: `highlightRelated`
- Type: boolean
- Default: `true`
- UI: Switch
- 설명:
  - “선택한 칸과 같은 행/열/박스를 강조 표시합니다.”

9) **Highlight Same Digits (같은 숫자 하이라이트)**
- Key: `highlightSameDigit`
- Type: boolean
- Default: `true`
- UI: Switch
- 설명:
  - “같은 숫자를 가진 칸을 강조 표시합니다.”

추가 규칙(MVP):
- Key: `digitFirstPossibleCellHighlight`
- Type: boolean
- Default: `true`
- 설명: Digit-First에서 숫자 선택 시 “입력 가능한 셀” 약한 강조를 기본 활성화하고, Settings에서 OFF 가능하게 한다.

10) **Show Remaining Count (남은 개수 표시)**
- Key: `showRemainingCount`
- Type: boolean
- Default: `true`
- UI: Switch
- 설명:
  - “키패드에 숫자별 남은 개수를 표시합니다.”

11) **Highlight Strength (하이라이트 강도)**
- Key: `highlightStrength`
- Type: enum (`low` | `med` | `high`)
- Default: `med`
- UI: Segmented Control
- 설명:
  - “강조 표시의 강도를 조절합니다.”

11-A) **Candidate Render Mode (후보 렌더링 모드)**
- Key: `candidateRenderMode`
- Type: enum (`auto` | `on` | `off`)
- Default: `auto`
- UI: Segmented Control
- 설명:
  - “저사양 환경에서 후보 렌더링 간소화를 자동 적용하거나, 항상 켜기/끄기를 고정합니다.”

---

### 20.2.4 Timer

12) **Show Timer (타이머 표시)**
- Key: `showTimer`
- Type: boolean
- Default: `true`
- UI: Switch
- 설명:
  - “플레이 화면에 타이머를 표시합니다.”

13) **Auto Pause on Leave (앱 전환 시 자동 일시정지)**
- Key: `autoPauseOnLeave`
- Type: boolean
- Default: `true`
- UI: Switch
- 설명:
  - “앱을 떠나면 자동으로 일시정지합니다.”

---

### 20.2.5 Hint (MVP)

- [MUST] MVP에서는 튜터/학습 전용 설정 항목을 제공하지 않는다.
- [SHOULD] 힌트 관련 피드백은 공통 설정(진동/하이라이트 강도)을 재사용한다.

---

### 20.2.6 Appearance

18) **Theme**
- Key: `theme`
- Type: enum (`system` | `light` | `dark`)
- Default: `system`
- UI: Select
- 설명:
  - “테마를 선택합니다.”
- [MUST] MVP에서는 `paper`, `mono` 테마 값을 설정키/스토리지/동기화/UX 어디에서도 사용 MUST NOT 한다(Post-MVP에서만 ADR로 도입).
- [MUST] `theme` 값이 허용 enum(`system|light|dark`) 밖의 값을 관측하면, 클라이언트는 즉시 `theme=system`으로 정규화하고 `settings_changed` 이벤트를 기록한다.

19) **Large Text (큰 글씨)**
- Key: `largeText`
- Type: boolean
- Default: `false`
- UI: Switch
- 설명:
  - “글자 크기를 크게 표시합니다.”

19-A) **Screen Reader Verbose Candidates (스크린리더 후보 상세 읽기)**
- Key: `screenReaderVerboseCandidates`
- Type: boolean
- Default: `false`
- UI: Switch
- 설명:
  - “스크린리더가 빈 칸의 후보 숫자를 모두 읽도록 합니다.”

---

### 20.2.7 Sound & Haptics

20) **Haptics (진동)**
- Key: `haptics`
- Type: boolean
- Default: `true`
- UI: Switch
- 설명:
  - “입력/충돌 시 진동 피드백을 사용합니다.”

21) **Sound (효과음)**
- Key: `sound`
- Type: boolean
- Default: `false`
- UI: Switch
- 설명:
  - “효과음을 사용합니다.”

---

### 20.2.8 Data

Cloud Sync는 로그인 필수 정책에 따라 항상 활성화되며, 사용자 ON/OFF 토글은 제공하지 않는다.

22) **Reset Progress (기록 초기화)**
- Key: `resetProgress`
- Type: action
- Default: -
- UI: Button (danger)
- 설명:
  - “플레이 기록을 초기화합니다. 계정/구매/설정은 유지됩니다.”
- [MUST] 초기화 대상: `currentGame`, `journeyStages`, `sessions`, `statsAggregate`, `achievements`(Post-MVP reserved; MVP에서는 존재하지 않는 것으로 간주하되 존재할 경우 삭제), `dailyStreak`, `calendar stamps` 및 관련 로컬 캐시.
- [MUST] 유지 대상: `profile(uid)`, premium entitlement/purchaseState, `wallet(coinsBalance)`, `hintQuota`, `adConsentStatus`, `settings`.
- [MUST] Reset Progress는 로컬과 클라우드에 동일하게 적용되어야 한다.
- [MUST] 클라우드 초기화는 서버 함수 `resetUserProgress(uid, requestId)`로만 수행한다.
- [MUST] `resetUserProgress(uid, requestId)`는 `{ status: "done" | "processing" | "failed", retriable: boolean, errorCode?: string }` 응답을 반환해야 한다.
- [MUST] 클라이언트는 `status=done`일 때만 reset 성공으로 간주해야 한다.
- [MUST] `requestId` 기준 멱등 재시도를 지원해야 한다.
- [MUST] 클라이언트는 `requestId`를 MMKV에 `resetProgressRequestId`로 영속 저장하고, reset 완료 전까지 재시도 시 동일 값을 재사용한다.
- [MUST] 앱 재시작/foreground/`retrySyncNow` 실행 시 `resetProgressRequestId`가 존재하면 `resetUserProgress(uid, requestId)`를 재호출해 클라우드 초기화를 재시도한다.
- [MUST] 클라이언트는 `resetProgressRequestId`를 `status=done` 또는 (`status=failed` AND `retriable=false`)일 때만 삭제해야 한다.
- [MUST] 클라이언트는 (`status=processing`) 또는 (`status=failed` AND `retriable=true`)인 경우 `resetProgressRequestId`를 유지하고 `retrySyncNow` 경로에서 재시도해야 한다.
- [MUST] `errorCode`는 32.6 포맷을 따라야 하며, 사용자 UI에 직접 노출 MUST NOT 한다.
- [MUST] `resetProgress` 완료 시 로컬 pending/재시도 큐에서 진행 기록을 복원할 수 있는 엔트리를 모두 삭제해야 한다(최소 범위: Daily pending 큐(19.9), 재시도 큐(39.4)의 `sessions/stamps/streak/currentGame/journeyStages/statsAggregate/verifyJourneyStage` 관련 엔트리). 삭제 후 과거 기록 재업로드로 복구되는 경우는 MUST NOT 발생해야 한다.

23) **Clear Cache (퍼즐 캐시 삭제)**
- Key: `clearPuzzleCache`
- Type: action
- Default: -
- UI: Button
- 설명:
  - “저장된 퍼즐 캐시를 삭제합니다.”
- [MUST] `clearPuzzleCache`는 `puzzleCache`만 삭제하며 `currentGame/sessions/settings`는 변경하지 않는다.
- [MUST] 성공 시 토스트 1회를 노출한다.
- [MUST] 실패 시 `error` 모달과 `Retry` CTA를 노출한다.

24) **Retry Sync Now (동기화 다시 시도)**
- Key: `retrySyncNow`
- Type: action
- Default: -
- UI: Button
- 설명:
  - “동기화를 즉시 다시 시도합니다.”
- [MUST] 배너 CTA와 Settings 버튼은 동일 액션 핸들러(`retrySyncNow`)를 호출한다.

25) **Upgrade to Premium (프리미엄 업그레이드)**
- Key: `openPaywall`
- Type: action
- Default: -
- UI: Button
- 설명:
  - “프리미엄 혜택과 가격을 확인합니다.”

26) **Restore Purchases (구매 복원)**
- Key: `restorePurchases`
- Type: action
- Default: -
- UI: Button
- 설명:
  - “구매 내역을 복원합니다.”

27) **Manage Ad Consent (광고 동의 관리)**
- Key: `manageAdConsent`
- Type: action
- Default: -
- UI: Button
- 설명:
  - “광고 동의 상태를 확인하거나 변경합니다.”
- [MUST] `manageAdConsent` 화면은 `adConsentStatus`, `adConsentRegion`, `adConsentUpdatedAt`을 표시해야 한다.
- [MUST] iOS에서는 `attStatus`를 함께 표시해야 한다.
- [MUST] iOS에서 `attStatus=denied|restricted`인 경우, OS 설정으로 이동하는 CTA를 제공해야 한다.
- [MUST NOT] `manageAdConsent` 경로에서 ATT 프롬프트를 재호출하지 않는다.
- [MUST] 동의 필요 지역에서 `adConsentStatus=unknown`이면 `manageAdConsent` 대신 Consent Gate(37.1)로 강제 라우팅한다.

28) **Open Privacy Policy (개인정보 처리방침)**
- Key: `openPrivacyPolicy`
- Type: action
- Default: -
- UI: Button (link)
- 설명:
  - “개인정보 처리방침을 엽니다.”

29) **Open Terms of Service (이용약관)**
- Key: `openTermsOfService`
- Type: action
- Default: -
- UI: Button (link)
- 설명:
  - “이용약관을 엽니다.”

30) **Contact Support (문의하기)**
- Key: `contactSupport`
- Type: action
- Default: -
- UI: Button
- 설명:
  - “문의 채널(이메일/웹 폼)로 이동합니다.”
- [MUST] `contactSupport`는 1순위로 `mailto:support@sudoku-app.app`를 연다.
- [MUST] mailto subject/body에는 38.1.3 진단 정보 키셋을 prefill한다.
- [MUST] mailto 실행 실패 또는 클라이언트 미지원 시 2순위로 `https://sudoku-app.web.app/support`를 연다.
- [MUST] 문의 진입 시 아래 진단 정보를 자동 첨부한다.
- [MUST] 자동 첨부가 불가/실패하면 동일 payload를 `Copy diagnostics` 액션으로 즉시 제공한다.
  - `releaseTag(appVersion+buildNumber+generatorVersion)`
  - `uidHash`
  - `networkState`
  - `syncPending`
  - `lastErrorCode`(있으면)
  - `purchaseState`(`premium|unknown`)
  - `deletionRequestStatus`(있으면)
- [MUST] `uidHash`는 `sha256(uid)`의 상위 8바이트를 소문자 hex로 표현한 값으로 고정한다.
- [MUST] 진단 정보에 포함된 내부 에러코드는 사용자 화면에 직접 노출하지 않는다.

31) **Delete Account (계정 삭제)**
- Key: `deleteAccount`
- Type: action
- Default: -
- UI: Button (danger)
- 설명:
  - “계정과 클라우드 데이터를 삭제합니다. 이 작업은 되돌릴 수 없습니다.”

32) **Logout (로그아웃)**
- Key: `logout`
- Type: action
- Default: -
- UI: Button
- 설명:
  - “로그아웃하고 로그인 화면으로 이동합니다.”
- [MUST] `logout` 실행 시 아래 순서로 수행한다.
  - 1) RevenueCat `logOut()` 호출로 로컬 entitlement/customerInfo 캐시를 초기화한다.
  - 2) Firebase Auth `signOut()`을 수행한다.
  - 3) 로컬(MMKV)에서 user-scoped 데이터를 전부 삭제한다: `settings`, `currentGame`, `puzzleCache`, `localStats`, `purchaseState`, `premiumLastVerifiedAt`, `resetProgressRequestId`, `journeyStagesCache`, `dailyPendingQueue`, `retryQueue`(있으면).
  - 4) Auth Gate로 라우팅한다.
- [MUST] 로그아웃 상태에서는 오프라인 로컬 플레이를 제공하지 않는다(로그인 필수 정책 유지).
- [MUST] `adConsentStatus/adConsentRegion/adConsentUpdatedAt/attStatus`는 디바이스 로컬 상태이므로 `logout`으로 삭제하지 않는다.

---

### 20.2.9 Consent Runtime Keys (내부 저장 키)

- [MUST] 아래 키는 동의/추적 상태 관리를 위해 로컬에 저장한다.
  - `adConsentStatus`: `unknown | granted | denied | not_required`
  - `adConsentRegion`: enum (`EEA` | `US_CA` | `ROW`)
  - `adConsentUpdatedAt`: epoch ms
  - `attStatus`: `not_determined | authorized | denied | restricted`
- [MUST] 구매 런타임 상태 관리를 위해 아래 키를 로컬에 저장한다.
  - `purchaseFlowState`: `idle | purchasing | purchased | restored | cancelled | failed | revoked | pending`
  - `premiumLastVerifiedAt`: epoch ms
- [MUST] `adConsentStatus`, `adConsentRegion`, `adConsentUpdatedAt`, `attStatus`는 디바이스 로컬 상태로 취급하고, 클라우드 동기화 대상(Firestore `settings/meta.values`)에서 제외한다.
- [MUST] `manageAdConsent` 액션은 동의 폼 재표시 또는 상태 화면으로 연결된다.
- [MUST] Consent runtime keys(`adConsentStatus`, `adConsentRegion`, `adConsentUpdatedAt`, `attStatus`)는 디바이스 로컬 전용이며 Firestore TTL 삭제 대상이 아니다. 앱 삭제/OS 재설정 또는 Consent Gate/`manageAdConsent`를 통한 동의 변경에 의해서만 갱신/초기화된다.

---

## 20.3 설정 기본값 (MVP 잠금)

- [MUST] 아래 기본값을 초기 설치 기준값으로 고정한다.
  - `inputMode=auto`
  - `autoCandidateCleanup=true`
  - `instantConflict=true`
  - `highlightRelated=true`
  - `highlightSameDigit=true`
  - `showRemainingCount=true`
  - `candidateRenderMode=auto`
  - `screenReaderVerboseCandidates=false`
  - `autoPauseOnLeave=true`
- [MUST] MVP에서는 `showTechniqueNames`, `tutorExplainLength`를 설정키/동기화키로 사용하지 않는다.

---

## 20.4 설정 저장 규칙
- 변경 즉시 MMKV 저장
- 인증 완료 사용자는 쿨다운 후 Firestore 동기화
- 앱 시작 시:
  1) 로컬 세팅 로드
  2) 인증 상태가 유효하면 클라우드 세팅 Pull → 최신이면 덮어씀

---

## 20.5 설정 문구 톤 가이드
- 짧고 명확하게
- 죄책감 유발 문구 금지
- 기능이 바뀌는 결과를 한 문장으로 설명

---

> 이 Settings 스펙을 고정하면, 바이브코딩으로 구현해도 UX가 제멋대로 퍼지지 않는다.



---

## 21. 게임 이벤트/상태 정의 (Undo/Autosave/트랜잭션 명세)

> 목표: “무슨 행동이 어떤 상태를 바꾸는지”를 고정해 버그/혼선을 줄인다.
> 특히 Undo/Autosave/Hint Apply는 반드시 규칙이 있어야 한다.

---

### 21.1 핵심 상태(State) 모델

#### 21.1.1 GameStatus
- `idle` : 게임 없음
- `playing` : 플레이 중
- `paused` : 일시정지
- `completed` : 완료
- `failed` : 실패(선택 모드)

#### 21.1.2 GameMode
- `cell` : Cell-first 중심
- `digit` : Digit-first 중심
- [MUST] `inputMode`는 사용자 설정값이고, `GameMode`는 현재 상호작용 상태를 나타낸다.
- [MUST] `inputMode=auto`에서는 마지막 입력 패턴에 따라 `GameMode(cell|digit)`를 동적으로 갱신한다.

#### 21.1.3 InputSubMode
- `normal` : 숫자 입력
- `pencil` : 후보 토글

#### 21.1.4 PuzzleSource
- `classic`: 난이도 선택 New Game
- `daily`: dateUTC당 1개 Daily 퍼즐(난이도 선택 UI 없음)
- `journey`: Stage/Chapter 퍼즐(3-star 평가)

- [MUST] `PuzzleSource`는 `currentGame.mode` 및 이벤트 `mode`(23.2)로 저장/기록한다.
- [MUST] `journey`에서는 `failed` 상태로 전이 MUST NOT 한다(21.11).

---

### 21.2 이벤트(Event) 정의

이벤트는 “유저 행동” 기준으로 정의한다.

- `CELL_SELECT(pos)`
- `DIGIT_SELECT(digit)` (digit-first)
- `INPUT_DIGIT(pos, digit)`
- `TOGGLE_PENCIL(onOff)`
- `TOGGLE_CANDIDATE(pos, digit)`
- `ERASE_CELL(pos)`
- `UNDO()`
- `REDO()` (MVP UI 미노출, 내부 이벤트 준비만 허용)
- `HINT_REQUEST(level)`
- `HINT_APPLY(stepId)`
- `PAUSE()`
- `RESUME()`
- `RESTART()`
- `QUIT_REQUEST()`
- `QUIT_CONFIRM()`

---

### 21.3 Reducer/Engine 처리 규칙(중요)

#### 21.3.1 입력 이벤트 처리 순서
모든 입력은 다음 순서를 따른다:
1) 유효성 검사(고정 셀 여부, blockInvalidInput 여부)
2) 상태 변경(보드/후보)
3) 파생 상태 업데이트(remaining count, conflict map)
4) autosave 스케줄
5) undo 스택 기록(해당 이벤트가 기록 대상일 때)

---

### 21.4 Undo 스택 규칙

#### 21.4.1 Undo 단위
Undo는 다음을 “1 step”으로 되돌릴 수 있어야 한다:
- `INPUT_DIGIT`
- `ERASE_CELL`
- `TOGGLE_CANDIDATE`
- `TOGGLE_PENCIL`

- [MUST] `autoCandidateCleanup=true`일 때 자동 후보 삭제는 숫자 입력과 **하나의 트랜잭션**으로 묶어 Undo 1 step으로 처리한다.

#### 21.4.2 Undo 기록 포맷(기본 계약)

```js
{
  type: 'INPUT_DIGIT',
  before: { boardPatch: [...], candidatesPatch: [...] },
  after: { boardPatch: [...], candidatesPatch: [...] },
  timestamp: 0
}
```

원칙:
- [MUST] 전체 보드 스냅샷 저장을 금지하고 patch(변경분) 기반으로 저장한다.

#### 21.4.3 Undo 히스토리 크기
- 200 step 고정(MVP)

---

### 21.5 Autosave 규칙 (다시 고정)

#### 21.5.1 트리거 이벤트
- `INPUT_DIGIT`, `ERASE_CELL`, `TOGGLE_CANDIDATE`, `UNDO`, `REDO`, `TOGGLE_PENCIL`
- AppState background 진입

#### 21.5.2 저장 방식
- [MUST] debounce는 `400ms`로 고정한다.
- 저장 실패 시 다음 이벤트에서 재시도

저장 대상:
- 로컬 currentGame 전체(보드/후보/타이머/모드/undo 포인터)
- 클라우드 currentGame은 39.1.9 스키마 범위만 저장(Undo/Redo 히스토리 제외)

---

### 21.6 Hint Apply 트랜잭션 규칙 (핵심)

`HINT_APPLY(stepId)`는 반드시 원자적 트랜잭션으로 처리한다.

Apply 처리 순서:
1) step payload 조회(`HintStep`)
2) level 확인
3) `L0`이면 placements 1건 적용(숫자 입력)
4) `L1`이면 highlights만 표시(보드/후보 상태는 변경하지 않음)
5) conflict map / remaining count 재계산
6) autosave
- [MUST] MVP에서는 eliminations 커밋(후보 제거 커밋)을 수행하지 않는다.
- [MUST] `candidate_remove`는 시각적 하이라이트 타입이며 실제 후보 상태를 변경하지 않는다.

Undo 처리:
- Hint Apply는 Undo 스택에 **포함하지 않음**(기본 정책)
  - 이유: 힌트는 “도움 사용”의 성격이 강하고, Undo로 되돌리면 의미가 흐려짐
- [MUST NOT] MVP에서 “힌트 적용도 Undo 가능” 토글을 제공하지 않는다.
- [MUST] 해당 확장은 Post-MVP 백로그 `B-014`에서만 진행한다.

통계 기록:
- hintLevelUsed 증가
- hintAppliedCount 증가

---

### 21.7 Digit-First 입력 규칙(이벤트 관점)

- `inputMode=digitFirst`: `DIGIT_SELECT(d)` 이후 보드 탭은 `INPUT_DIGIT(pos, d)`로 변환하고, 입력 성공 후에도 `selectedDigit`를 유지한다.
- `inputMode=cellFirst`: 셀 선택 후 숫자 탭으로 입력하며, 입력 직후 `selectedDigit`를 해제한다.
- `inputMode=auto`: 20.2.1 규칙을 따른다(별도 digit 유지 설정키 없음).
- 입력 불가 셀 탭 시 보드 상태는 변경하지 않고 피드백만 제공한다.

---

### 21.8 충돌 처리 규칙

- `instantConflict=true`이면 입력 직후 conflict map 업데이트
- `blockInvalidInput=true`이면 규칙 위반 입력은 상태 변경 없이 차단
- [MUST] MVP 엔진 이벤트에는 `VALIDATE_BOARD()`를 포함하지 않는다.

---

### 21.9 완료 감지(Completion)

완료 조건:
- 모든 셀이 채워짐
- conflict map이 비어있음

완료 시:
- status → `completed`
- CompletedModal 표시
- PlaySession 확정 저장(로컬)
- 클라우드 Push
- 무료 유저 인터스티셜은 최소 5판 쿨다운을 적용한다.

---

### 21.10 타이머 규칙

- [MUST] 타이머(=PlaySession의 `durationMs`)는 `GameStatus=playing`에서만 증가한다.
- [MUST] `GameStatus=paused|completed|failed`에서는 타이머가 증가하지 않는다.
- [MUST] background 진입 시 `autoPauseOnLeave=true`면 즉시 `paused`로 전이한다.
- [MUST] `durationMs`는 Pause/Background 시간을 포함하지 않는 "active play time(ms)"으로 정의한다(=위 규칙에 따라 누적된 값).
- [MUST] Journey의 별 산출/제한 시간 판정 및 서버 검증은 `durationMs`를 단일 기준으로 사용한다(21.11, 39.4.3).
- [MUST] UI에 표시되는 Timer 값은 `durationMs`와 동일 기준(playing-only)이어야 한다(표시/판정 기준 불일치 금지).

---

### 21.11 Journey(Stage/Chapter) 모드 규칙 (MVP)

정의:
- Journey는 `chapterId`(=difficulty) + `stageIndex`로 구성된 Stage 목록이다(18.1).
- Journey stage는 `stageId`를 가진다(18.1, 예: `j1_easy_01`).
- [MUST] stage unlock 규칙: 각 chapter에서 stage `01`은 항상 unlocked. stage `02..10`은 직전 stage의 `bestStars>=1`일 때 unlocked로 취급한다(39.1.15).
- [MUST] unlocked stage는 재플레이를 허용한다(별(bestStars) 개선 가능, 코인 보상은 38.1.6.5의 delta 지급 규칙을 따른다).

핵심 규칙:
- [MUST] Journey는 게임오버/실패 상태를 사용하지 않는다. `mistakeLimitMode`는 Journey에서 강제 `off`로 취급한다.
- [MUST NOT] Journey에서 `GameStatus=failed`로 전이하거나 `game_fail` 이벤트를 발행하지 않는다.
- [MUST] Journey stage 완료 시 3-star 평가를 산출하고 Cloud Sync에 저장한다(39.4.3, 39.1.15).
  - ⭐ 1: 완료(클리어) 시 항상 획득(시간/힌트 무관)
  - ⭐⭐ 2: `hintsUsed==0` AND `durationMs <= softLimitMs(difficulty)`
  - ⭐⭐⭐ 3: `hintsUsed==0` AND `durationMs <= hardLimitMs(difficulty)`
- [MUST] `hintsUsed`는 "힌트가 실제로 적용(Apply)된 횟수"로 정의하며, 힌트 화면 열기/요청만으로는 증가하지 않는다.
- [MUST] `mistakes`는 별 산출 조건에 포함하지 않는다(통계/피드백 용도).
- [MUST] soft/hard 제한 시간은 난이도별로 아래 값을 고정한다(ADR-068).
  - easy: soft=`600000`(10m), hard=`300000`(5m)
  - medium: soft=`900000`(15m), hard=`480000`(8m)
  - hard: soft=`1200000`(20m), hard=`720000`(12m)
  - expert: soft=`1500000`(25m), hard=`900000`(15m)
  - evil: soft=`1800000`(30m), hard=`1200000`(20m)
- [MUST] 제한 시간 판정은 PlaySession의 `durationMs`(=21.10의 playing-only active play time, pause/background 시간 제외)를 단일 기준으로 사용한다(21.10, 39.1.4).
- [MUST] 별 보상 코인 지급은 서버 검증 경로(39.4.3)에서만 수행한다(38.1.6.5, wallet server-write).

#### 21.11.1 Journey Stage List 화면 (MVP 고정)

진입 경로:
- [MUST] Home의 Journey 진입 CTA → Journey Stage List 화면으로 이동한다.
- [MUST] CompletedModal(mode=journey)에서 `journey.complete.stage_list.cta` 탭 → Journey Stage List 화면으로 이동한다.

Chapter/Stage 범위:
- [MUST] Chapter는 난이도 enum `easy|medium|hard|expert|evil`(ADR-067)이며, **chapter 자체 잠금은 없다**.
- [MUST] 각 chapter의 `stage01`은 항상 unlocked이다(21.11 unlock 규칙의 `stageIndex==1`).
- [MUST] 선택된 chapter에 대해 stage `01..10` 목록을 제공한다.
- [MUST] 최초 진입 시 기본 선택 chapter는 `easy`로 한다.

표시 항목 (MVP 최소 고정):
- [MUST] Chapter progress를 표시한다: `clearedCount/10`
  - clearedCount 정의: 해당 chapter 내 `bestStars >= 1`인 stage 수
- [MUST] Stage item은 최소 아래를 표시한다:
  - `stageIndex2` 표기 (예: `03`)
  - `locked/unlocked` 상태(21.11 unlock 규칙)
  - `bestStars(0..3)` 표시(미클리어=0)
- [MUST] 네트워크 offline일 때 offline 배지를 표시한다(41.4).
- [MUST] Stage List 상단에 `state.sync_pending` 배지(41.7)를 표시하는 조건:
  - `journeyStagesCache` 내에 `syncState="pending_verify"` stage가 1개라도 존재할 때.
  - (offline 여부와 무관, 32.2의 "푸시 실패 카운트" 규칙과 분리)
- [MUST] Cloud Pull이 최신이 아니거나 offline인 경우에도 `journeyStagesCache`를 사용해 stage 목록의 진행도(bestStars) 및 언락 상태를 로컬 표시해야 한다(19.9).

인터랙션:
- [MUST] Stage List 상단 Back(또는 OS Back) 동작: Home으로 복귀한다(네비게이션 pop).
- [MUST] unlocked stage 탭 → GameScreen 시작: `mode=journey`, `stageId` 설정(19.4, 18.1).
- [MUST] locked stage는 disabled(탭 불가)로 렌더링한다.
- [MUST] locked stage item UI:
  - lock 아이콘을 표시한다.
  - 잠금 해제 조건 문구를 stage item 하단에 표시한다: `journey.stage.locked.body` (vars: `{prevStageIndex2}`)
- [MUST] 스테이지 재플레이는 동일 `stageId`로 재시작한다(보상/별 규칙은 21.11/38.1.6.5/39.4.3을 따른다).

이벤트/계측:
- [MUST NOT] Journey Stage List 진입/탭을 위한 **신규 이벤트명 추가 금지**(23.1/23.2의 35개 상한 준수).
  - 필요한 경우 기존 이벤트 재사용 또는 기존 이벤트의 props 추가만 허용한다.

---

> 이 이벤트/상태 명세를 따르면, 구현이 사람마다 달라도 결과 UX는 동일해진다.



---

## 22. MVP 스코프 컷라인 + 백로그 체크리스트 (바이브코딩용)

> 목표: 바이브코딩은 범위가 계속 늘어나기 쉬우므로, **MVP 라인을 강제로 고정**한다.
> MVP는 “출시”가 아니라 “완성도 있는 1차 프로덕트” 기준이다.

---

### 22.1 MVP 포함 범위 (Must Have)

#### A. 코어 플레이
- [ ] 퍼즐 로드/새 게임 생성(난이도 5단계)
- [ ] 보드/셀/키패드 UI (13.8/13.9/13.10 준수)
- [ ] Cell-first / Digit-first 입력 (auto 포함)
- [ ] Pencil(후보) + 자동 후보 삭제 옵션
- [ ] Undo (Redo UI는 MVP에서 숨김)
- [ ] 충돌 표시/차단 옵션
- [ ] 자동 저장 + Continue
- [ ] Journey(Stage/Chapter) 모드 + 3-star 평가 + stage 진행도(별/클리어) Cloud Sync 저장(18.1, 21.11, 39.4.3)

#### B. 힌트
- [ ] L0 단순 힌트(정답 1칸 채우기)
- [ ] L1 가이드 힌트(하이라이트 중심)

#### C. 난이도 엔진
- [ ] 유일해 검증(2개 이상이면 폐기)
- [ ] Solver 로그 기반 난이도 점수 계산(14장)
- [ ] 난이도 티어 판정 v1

#### D. 통계(기본)
- [ ] Overview(총 플레이/완료/완료율/평균/최고)
- [ ] 난이도별 평균/중앙값/최고/실수/힌트

#### E. 설정
- [ ] Settings MVP 항목 구현(20장)

#### F. 데이터/동기화
- [ ] MMKV 로컬 영속 저장
- [ ] Firebase Auth(애플/구글) + Firestore 기본 동기화(19장)

---

### 22.2 MVP 제외 범위 (Cut / Later)

#### 다음 버전으로 미루기
- [ ] L2/L3 고급 힌트 전체
- [ ] LearnHub 전체(검색/상세/연습 포함)
- [ ] 리더보드/업적(Game Center/Play Games)
- [ ] 시즌 이벤트/퍼즐 팩
- [ ] 변형 스도쿠(Irregular 등)
- [ ] 고급 통계(성장 분석/논리기술 분석)
- [ ] Erase 롱프레스(후보 하나씩 제거)
- [ ] Share 기능
- [ ] Redo(필요 시 1.1)

---

### 22.3 MVP 완료 기준(Definition of Done)

- [ ] Easy~Evil 전 난이도에서 퍼즐 20개 샘플링 테스트 통과
- [ ] 모든 퍼즐 유일해 100%
- [ ] Undo/Autosave/Continue 100% 정상
- [ ] 설정 변경이 즉시 반영되고 재실행 후 유지
- [ ] 오프라인에서 플레이/저장/통계 정상
- [ ] 로그인 후 다른 기기에서 기록 복구(샘플 검증)
- [ ] 크래시/프리즈 없는 30분 연속 플레이
- [ ] PR 게이트(ADR-060): `pnpm run lint -> pnpm run test:unit` 순서로 실행하고 100% pass 한다.
- [ ] 릴리즈 게이트(ADR-060, 38.2.6.1): `pnpm run lint -> pnpm run test:unit -> pnpm run test:e2e:ios -> pnpm run test:e2e:android -> pnpm run test:purchase:sandbox` 순서로 실행하고 100% pass 한다.
- [ ] Web entry가 활성화된 빌드에서는 릴리즈 게이트에 `pnpm run test:web:smoke`를 추가하고 100% pass 한다.
- [ ] CI/로컬 검증은 `pnpm run <script>` 경로로만 실행한다(도구 직접 호출 금지).

---

### 22.4 백로그 (우선순위 순)

#### Sprint 0 — 프로젝트 셋업
- [ ] RN(Expo) 프로젝트 생성
- [ ] NativeWind 세팅 + tailwind.config + classes.js
- [ ] Navigation 세팅(Home/Game/Stats/Settings/Learn Stub)
- [ ] MMKV 세팅
- [ ] `package.json` 스크립트 키셋 생성(`lint`, `test:unit`, `test:e2e:ios`, `test:e2e:android`, `test:purchase:sandbox`, optional `test:web:smoke`)
- [ ] PR/RC 게이트 실행 순서(38.2.6.1)와 동일한 CI 워크플로우 템플릿 초안 작성

#### Sprint 1 — Game Loop
- [ ] Board/Cell 렌더링(정사각 고정)
- [ ] Keypad 입력(Cell/Digit)
- [ ] Pencil + 후보 렌더링
- [ ] Conflict map
- [ ] Undo
- [ ] Autosave + Continue

#### Sprint 2 — Generator/Engine
- [ ] 완성 보드 생성(seed RNG)
- [ ] clue 제거(대칭 옵션)
- [ ] 유일해 검증
- [ ] Solver 기본(Singles/Pairs) + 로깅
- [ ] 난이도 점수 산출/티어 분류
- [ ] 캐시 프리생성

#### Sprint 3 — Hint v1
- [ ] L0 단순 힌트
- [ ] L1 가이드 힌트(하이라이트)

#### Sprint 4 — Stats + Settings
- [ ] 기본 통계 화면
- [ ] Settings MVP 전 항목

#### Sprint 5 — Sync
- [ ] Firebase Auth
- [ ] Firestore Push/Pull
- [ ] 충돌 해결(기본)

---

### 22.5 리스크 관리(바이브코딩 특화)

- 범위가 늘어나려 하면:
  - "MVP 제외"로 이동하고 버전(1.1/1.2)에 배치
- 엔진/솔버가 늦어지면:
  - Easy~Hard 먼저 출시 가능하도록 티어별 단계적 오픈
- 고급 힌트는 MVP 범위를 침범하기 쉬움:
  - L2/L3/LearnHub 요구는 즉시 Post-MVP 백로그(`PRD_POST_MVP_BACKLOG.md`)로 이동

---

> 이 컷라인을 지키면, 1차 출시가 ‘끝’이 아니라 ‘시작’이 된다.



---

## 23. 트래킹 이벤트 최소 명세 (제품 개선용)

> 목표: 광고가 아니라 **제품 개선을 위한 데이터**만 수집한다.
> MVP에서는 "적게, 명확하게"가 원칙이다.

---

### 23.1 이벤트 설계 원칙
1. 개인 식별 정보(PII)는 저장하지 않는다.
2. 퍼즐 품질/이탈 지점/학습 효과 파악이 목적이다.
3. 이벤트 수는 MVP에서 35개 이내로 유지한다(상용 운영 필수 이벤트 포함).
4. 모든 이벤트는 `timestamp`, `clientTimestampMs`, `appVersion`, `generatorVersion`, `appSessionId`를 포함한다.
5. [MUST] MVP에서는 제품 개선 이벤트(event) 및 진단 로그(error) 수집에 대한 별도 opt-out 토글을 제공하지 않는다. 제공 철회(삭제) 경로는 `Delete Account`(24.10/38.1.4)로만 제공한다.

---

## 23.2 핵심 이벤트 목록 (MVP)

- [MUST] `tutor_opened`, `learn_opened`, `practice_completed`는 Post-MVP 예약 이벤트로 유지하며 MVP에서는 발행하지 않는다.
- [MUST] 본 절의 시간 값 `duration`, `elapsedTime`은 ms 단위 number(정수)로 기록한다. `sessions.durationMs`(39.1.4), `currentGame.elapsedMs`(39.1.9)에서 단위 변환 없이 매핑한다.

### A. 퍼즐/플레이 흐름

1) `game_start`
- props:
  - mode (`classic` | `daily` | `journey`)
  - difficulty
  - puzzleId
  - seed (string; `seed(uint64)` 10진 직렬화, leading zero 금지 — 18.2 준수)
  - dateUTC? (`YYYY-MM-DD`, `mode=daily`일 때만)
  - stageId? (`j{journeyVersion}_{chapterId}_{stageIndex2}`, `mode=journey`일 때만)

2) `game_resume`
- props:
  - mode (`classic` | `daily` | `journey`)
  - puzzleId
  - elapsedTime

3) `game_complete`
- props:
  - mode (`classic` | `daily` | `journey`)
  - difficulty
  - duration
  - mistakes
  - hintsUsed
  - difficultyScore
  - maxTechniqueUsed
  - stageId? (`mode=journey`일 때만)
  - stars? (number, `1..3`, `mode=journey`일 때만)
  - coinsDelta? (number, server 검증으로 확정된 delta; `mode=journey`일 때만. offline/검증 대기면 omit)

4) `game_fail`
- props:
  - mode (`classic`)
  - difficulty
  - mistakes
  - duration

5) `game_quit`
- props:
  - mode (`classic` | `daily` | `journey`)
  - difficulty
  - elapsedTime
  - filledCells
  - dateUTC? (`mode=daily`일 때만)
  - stageId? (`mode=journey`일 때만)

---

### B. 입력/UX 관련

6) `undo_used`
- props:
  - countInSession

7) `hint_requested`
- props:
  - level (L0/L1)
  - difficulty

8) `hint_applied`
- props:
  - level
  - technique

9) `conflict_occurred`
- props:
  - countInSession

10) `digit_first_usage`
- props:
  - ratio

---

### C. 엔진/품질 관련

11) `generator_attempt`
- props:
  - difficulty
  - attempts
  - durationMs

12) `generator_fail`
- props:
  - difficulty
  - reason (timeout | uniqueness_fail | score_out_of_range)

13) `solver_timeout`
- props:
  - difficulty

---

### D. 설정 (MVP)

14) `settings_changed`
- props:
  - key
  - newValue

### D-Reserve. 학습 이벤트 (Post-MVP 예약)

- [MUST NOT] 아래 이벤트는 MVP 릴리즈에서 발행하지 않는다.

15) `tutor_opened`
- props:
  - technique

16) `learn_opened`
- props:
  - technique

17) `practice_completed`
- props:
  - technique
  - successCount

---

### E. 세션/유지

18) `app_open`
- props:
  - isLoggedIn

19) `daily_started`
- props:
  - dateUTC
- [MUST] `dateUTC`는 `YYYY-MM-DD`(UTC) 형식으로 기록한다.

20) `daily_completed`
- props:
  - dateUTC
  - duration
- [MUST] `dateUTC`는 `YYYY-MM-DD`(UTC) 형식으로 기록한다.

21) `purchase_restore_requested`
- props:
  - source (`paywall` | `settings_data`)
- [MUST] Paywall의 `Restore Purchases` 버튼으로 트리거된 경우 `source=paywall`로 기록한다.
- [MUST] Settings > Data의 `Restore Purchases`로 트리거된 경우 `source=settings_data`로 기록한다.

22) `ad_consent_updated`
- props:
  - status (`unknown` | `granted` | `denied` | `not_required`)
  - region (`EEA` | `US_CA` | `ROW`)
  - [MUST] `ad_consent_updated.status` 허용 값은 Settings key `adConsentStatus`의 상태 머신(`unknown|granted|denied|not_required`)과 동일해야 한다.
  - [MUST] `ad_consent_updated.region` 허용 값은 Settings key `adConsentRegion`의 enum(`EEA|US_CA|ROW`)과 동일해야 한다.
  - reason? (`user_action` | `sdk_timeout` | `sdk_error`)

23) `account_delete_requested`
- props:
  - source (`settings_data`)
  - reauthProvider (`apple` | `google`)

24) `account_deleted`
- props:
  - latencyHours
  - result (`success`)

25) `account_delete_failed`
- props:
  - phase (`request` | `processing` | `finalize`)
  - reason (`reauth_failed` | `server_timeout` | `server_validation_failed` | `unknown`)
  - retriable (boolean)

26) `ad_consent_prompt_shown`
- props:
  - region
  - entry (`app_open` | `settings_data`)

### F. 결제/복원

27) `purchase_started`
- props:
  - source (`paywall` | `settings_data` | `coins_store`)
  - productId (`sudoku.premium.lifetime` | `sudoku.coins.pack1`)
  - platform (`ios` | `android`)

28) `purchase_succeeded`
- props:
  - productId
  - entitlementId? (`premium`; premium 구매에서만)
  - coinsDelta? (number; coins pack 구매에서만, `+500`)
  - purchaseIdHash
  - platform (`ios` | `android`)
  - verifySource (`revenuecat`)

29) `purchase_failed`
- props:
  - productId
  - errorCode
  - retriable (boolean)
  - phase (`purchase` | `verify`)

30) `purchase_cancelled`
- props:
  - productId
  - phase (`store_sheet` | `store_confirm`)

31) `restore_succeeded`
- props:
  - entitlementId (`premium`)
  - restoredCount
  - platform (`ios` | `android`)

32) `restore_failed`
- props:
  - errorCode
  - retriable (boolean)
  - platform (`ios` | `android`)

33) `sync_retry_requested`
- props:
  - source (`banner_cta` | `settings_data`)
  - queueSize
  - networkState

34) `rewarded_offer_shown`
- props:
  - purpose (`currency_earn` | `hint_refill`)
  - source (`coins_store` | `hint_gate`)
  - rewardDelta (number; `currency_earn`=+20, `hint_refill`=+1)
  - difficulty? (hint_gate에서만; `easy`~`evil`)

35) `rewarded_opt_in`
- props:
  - purpose (`currency_earn` | `hint_refill`)
  - source (`coins_store` | `hint_gate`)
  - rewardDelta
  - difficulty?

- [MUST] Rewarded Opt-in은 `rewarded_opt_in / rewarded_offer_shown`(동일 기간, 동일 세그먼트)로 정의한다. purpose별(opt-in)을 함께 산출할 수 있어야 한다.

---

## 23.3 집계 목적 (왜 수집하는가)

- 난이도별 완료율 → 난이도 점수 구간 튜닝
- 평균 duration vs difficultyScore → 난이도 신뢰 검증
- hint_requested 비율 → 힌트 UX 개선
- generator_fail 비율 → 생성 알고리즘 최적화
- game_quit 위치 → UX 이탈 지점 분석
- purchase_started 대비 purchase_succeeded 비율 → 결제 전환 퍼널 진단
- purchase_failed/purchase_cancelled 비율 → 결제 마찰 원인 진단
- account_delete_failed 비율/사유 분포 → 계정 삭제 실패 원인 진단
- sync_retry_requested 대비 sync 성공률 → 수동 재시도 경로 효율 진단
- rewarded_offer_shown 대비 rewarded_opt_in 비율(purpose별) → Rewarded CTA 효율 진단

---

## 23.4 저장 전략

- 로컬에서 세션 단위로 이벤트 버퍼링
- [MUST] 본 섹션의 앱 세션은 `app_open`부터 앱 종료/다음 `app_open` 전까지의 앱 세션(`appSessionId`)을 의미한다.
- [MUST] 이벤트 업로드는 `Completed 시 즉시` 또는 `queueSize >= 20` 또는 `bufferedDuration >= 15s` 중 먼저 도달한 조건으로 flush한다.
- 오프라인일 경우 로컬 큐에 저장 후 온라인 복귀 시 업로드

---

## 23.5 MVP에서 하지 않는 것

- 과도한 클릭/스크롤 트래킹
- 셀 단위 세밀 로그
- 광고 클릭 추적(별도 SDK 위임)

---

> 이 이벤트 명세는 “데이터에 끌려다니지 않고, 데이터로 개선하기 위한 최소한”이다.



---

## 24. 에러 / 예외 UX 스펙

> 목표: 비정상 상황에서도 "신뢰감 있는 앱"처럼 동작하게 한다.
> 모든 에러는 조용히 실패하지 말고, 사용자에게 의미 있는 피드백을 제공한다.

---

### 24.1 퍼즐 생성 실패

#### 발생 조건
- generator timeout
- uniqueness 검증 실패 반복
- 난이도 점수 범위 미충족 반복

#### UX 처리
1) 1~2회 실패: 내부 재시도 (사용자에게 오류 카드 미표시)
   - 로딩 스켈레톤 유지
   - 메시지 표시: "퍼즐을 준비하는 중입니다..."
2) 3회차 실패:
   - 에러 카드 표시
   - 버튼: `다시 시도`
   - fallback: 18.5.3 규칙에 따라 내부적으로 난이도 1단계 완화 재시도(사용자 선택 모달 미사용)

로그 이벤트:
- `generator_fail`

---

### 24.2 Solver Timeout / 힌트 계산 실패

#### 발생 조건
- 고난도 퍼즐에서 Solver 시간 초과
- 힌트 단계 탐색 실패

#### UX 처리
- 메시지:
  - "현재 상태에서 논리 힌트를 찾을 수 없습니다."
- 버튼:
  - `기본 힌트 사용`
  - `닫기`

절대 하면 안 되는 것:
- 앱 멈춤
- 무한 로딩

로그 이벤트:
- `solver_timeout`

---

### 24.3 네트워크 오류 (Sync/Daily)

#### 발생 조건
- Firestore Push 실패
- Daily 서버 검증/도장 반영 실패

#### UX 처리
- 토스트:
  - "오프라인 모드로 전환되었습니다."
- Daily:
  - seed는 로컬 계산으로 항상 플레이 허용
  - 서버 검증 실패 시 도장/스트릭 반영만 pending 처리
  - MVP에서는 Daily 카드/결과 화면에 `offline` 배지를 노출(리더보드/순위 UI는 미노출)

동기화 재시도:
- 자동 재시도: `login/app_open/foreground/session_complete/settings_change` 수명주기에서 수행
- 수동 재시도: 배너 CTA 또는 Settings > Data `retrySyncNow` (동일 핸들러)

---

### 24.4 충돌(데이터 Merge) 문제

#### 발생 조건
- 다른 기기에서 더 최근 진행 상태 존재

#### UX 처리
모달 표시:
- "다른 기기에서 더 최근 진행 기록이 있습니다."
- 선택지:
  - `이 기기 진행 유지`
  - `클라우드 진행 불러오기`

기본값 없음(사용자 선택 필수)

---

### 24.5 저장 실패 (MMKV 오류 등)

#### 발생 조건
- 로컬 저장 예외

#### UX 처리
- 치명적 오류 시:
  - "저장 중 문제가 발생했습니다."
  - `앱 재시작`
- 경미한 오류:
  - 내부 재시도 후 조용히 복구

---

### 24.6 데이터 손상 감지

#### 발생 조건
- board/candidates 불일치
- invalid state 발견

#### UX 처리
- 게임 자동 종료
- 메시지:
  - "데이터 오류가 감지되어 현재 게임을 초기화합니다."
- 안전 모드로 복구(새 게임 제안)

로그 필수

---

### 24.7 예외 상태 공통 UX 규칙

1) 메시지는 짧고 명확하게
2) 기술적 용어 사용 금지
3) 버튼은 항상 1~2개
4) 반복 에러 시 동일 메시지 남발 금지(쿨다운)

---

### 24.8 치명적 오류(크래시 직전) 가이드

- 예외는 try/catch로 감싸고 Sentry(또는 유사)로 로깅
- 사용자에게는 "예상치 못한 오류가 발생했습니다." 표시
- 앱 강제 종료 대신 안전 화면으로 이동 시도

---

### 24.9 결제/복원 오류 및 상태 UX

#### 발생 조건
- `purchase_failed`
- `purchase_cancelled`
- store pending 상태 장기화
- `restore_failed`
- 환불/취소 반영으로 `revoked` 전환

#### UX 처리
- 결제 실패(`failed`):
  - 메시지: "결제를 완료하지 못했습니다."
  - CTA: `다시 시도` / `닫기`
  - 프리미엄 상태는 변경하지 않는다.
- 결제 취소(`cancelled`):
  - 토스트: "결제가 취소되었습니다."
  - 추가 차단 모달은 띄우지 않는다.
- 결제 대기(`pending`):
  - 배너: "결제 확인 중입니다. 확인 후 자동 반영됩니다."
  - 게임 플레이는 계속 허용하고 프리미엄 혜택은 비활성 유지
- 복원 실패(`restore_failed`):
  - 메시지: "구매 복원에 실패했습니다."
  - CTA: `다시 시도`
  - 내부 `errorCode`는 이벤트/로그로만 기록하고 사용자 UI에는 노출하지 않음
- 환불/취소 반영(`revoked`):
  - 배너: "구매 상태가 변경되어 프리미엄 혜택이 종료되었습니다."
  - 광고/잠금 상태를 즉시 무료 정책으로 복귀

동작 규칙:
- [MUST] 결제/복원 오류는 게임 진행을 차단하지 않는다.
- [MUST] 앱 시작/복귀 시 구매 상태를 재검증한다.
- [MUST] `pending` 상태가 24시간을 초과하면 Settings > Data에 재검증 유도 문구를 노출한다.
- [MUST] 결제 상태 변화는 23.2의 결제 이벤트(`purchase_*`, `restore_*`)로 기록한다.

---

### 24.10 회원 탈퇴 오류 및 상태 UX

#### 발생 조건
- `account_delete_requested` 직후 서버 처리 대기
- `deletionRequests.status=processing` 장기화
- `deletionRequests.status=failed`
- 재인증 실패로 삭제 요청 시작 실패

#### UX 처리
- 삭제 요청 직후(`requested`, `/deletionRequests/{uid}` create 서버 커밋 완료 이후):
  - 배너: "계정 삭제 요청이 접수되었습니다. 처리 완료까지 최대 7일이 걸릴 수 있습니다."
  - 즉시 로그아웃하고 로그인 화면으로 이동한다.
- 삭제 처리 중(`processing`):
  - 재로그인 시 정보 배너: "계정 삭제를 처리 중입니다."
  - 결제/복원 진입 버튼은 비활성 상태를 유지한다.
  - `processingStartedAt` 기준 24시간 초과 시 지연 배너: "계정 삭제 처리가 지연되고 있습니다. 문의하기로 도움을 받으세요."
  - 24시간 초과 상태에서는 `문의하기` CTA를 고정 노출한다.
- 삭제 실패(`failed`):
  - 모달: "계정 삭제 처리에 실패했습니다. 다시 시도하거나 문의해 주세요."
  - CTA: `다시 시도` / `문의하기`
  - `다시 시도`는 재인증 후 서버 함수 `retryDeletionRequest(uid)`를 호출한다(클라이언트 문서 재생성 금지).
- 삭제 요청 시작 실패(재인증 실패/오프라인/네트워크 오류 포함):
  - 토스트: 재인증 실패 시 `account.delete.reauth_failed.toast`, 오프라인/네트워크 오류 시 `account.delete.offline.block.toast`
  - 게임 데이터는 삭제하지 않고 기존 세션을 유지한다.

동작 규칙:
- [MUST] `requested|processing` 상태에서는 결제/복원 CTA를 비활성화하고 안내 문구를 노출한다.
- [MUST] `failed` 상태에서는 사용자 재시도 경로(`Delete Account`)를 다시 활성화한다.
- [MUST] `done` 상태에서는 자동 로그인/자동 복원을 시도하지 않는다.
- [MUST] 삭제 실패/지연 상태에서 `contactSupport` 액션으로 즉시 이동 가능해야 한다.
- [MUST] 회원 탈퇴 관련 상태 변화는 `account_delete_requested`, `account_deleted`, `account_delete_failed` 이벤트로 기록한다.
- [MUST] `processingStartedAt` 기준 24시간 초과 시 지연 배너 + `문의하기` CTA를 강제 노출한다.
- [MUST] `processingStartedAt` 기준 7일(168시간) 초과 시 서버는 `deletionRequests.status=failed`로 전이하고, `account_delete_failed(reason=server_timeout)`를 기록한다.

---

> 이 섹션은 “문제 상황에서 앱이 얼마나 성숙해 보이는지”를 결정한다.



---

## 25. 퍼포먼스 기준 & 최적화 규칙 (RN + Board)

> 목표: 저사양 기기에서도 "버벅임 없는" 보드 입력 경험을 보장한다.
> 성능은 기능이 아니라 품질이며, 초기 설계에서 규칙을 고정해야 한다.

---

### 25.1 성능 목표(KPI)
- 보드 입력 반응: 탭/입력 후 **50ms 이내** 시각 피드백
- 보드 렌더링 프레임: **60fps 목표**, 최소 45fps 유지
- 게임 중 프리즈(프레임 드랍 체감): 연속 200ms 이상 정지 금지
- 메모리: 장시간 플레이(30분) 후 누수로 인한 성능 저하 금지

---

### 25.2 렌더링 규칙(필수)

#### 25.2.1 9x9 Grid 구현
- FlatList/VirtualizedList 사용 금지(오버헤드)
- 81개 셀을 고정 렌더링
- 셀 컴포넌트는 반드시 `React.memo` 적용

#### 25.2.2 props 최소화
- [MUST] 셀에 전달하는 props는 최소로 유지한다.
- [MUST] `selectedPos`, `sameDigit`, `conflictMap` 전체 객체를 하위 셀에 직접 전달하지 않는다.
- [MUST] Zustand selector로 셀 단위 파생값만 구독한다.
- [MUST] 셀 컴포넌트 입력 props는 아래 필드로 고정한다.
  - `isSelected`, `isRelated`, `isConflict`, `digit`, `notes`
- [MUST NOT] 위 필드 외 파생 UI 상태를 셀 props로 추가 전달하지 않는다.

#### 25.2.3 state 구조
- [MUST NOT] 입력 1회마다 2차원 배열 전체(`board`, `candidates`)를 재생성하지 않는다.
- [MUST] patch 기반 업데이트를 사용해 변경된 셀만 갱신한다(21장 Undo 패치 구조와 정합).

---

### 25.3 후보(메모) 렌더링 최적화

- [MUST] 후보는 존재할 때만 렌더링한다(빈 후보 렌더 금지).
- [MUST] 후보 렌더는 3x3 고정 레이아웃을 사용한다.
- [MUST NOT] 후보 숫자 배열(1~9)을 렌더마다 새로 생성하지 않는다.
- [MUST] 후보 UI 계산에는 셀 단위 9-bit bitmask 캐시를 사용한다.
- [MUST] bitmask 해석은 UI 표시 단계(1~9 매핑)에서만 수행한다.
- [MUST] 엔진/저장용 canonical candidates 구조는 기존 계약(17장/21장)을 유지하고, bitmask는 렌더 최적화용 파생 캐시로 취급한다.

---

### 25.4 하이라이트/파생 상태 계산 최적화

- [MUST NOT] related cells(행/열/박스) 계산을 매 렌더마다 수행하지 않는다.
- [MUST] related cells는 `selectedPos` 변경 시에만 재계산한다.
- [MUST] 동일 숫자 하이라이트는 `selectedDigit` 변경 시에만 재계산한다.
- [MUST] `useMemo` + selector 조합으로 파생 상태를 계산한다.
- [MUST] row/col/box 인덱스 lookup 테이블은 앱 시작 시 1회 생성 후 재사용한다.

---

### 25.5 애니메이션 규칙

- [MUST] 애니메이션은 Reanimated로 처리한다.
- [MUST] 후보 제거/확정 입력 애니메이션 duration은 `150~250ms` 범위로 고정한다.
- [MUST] 연속 입력 중에는 보드 장식 애니메이션(배경 이동/대규모 scale)을 금지한다.
- [MUST] 입력 1회당 동시 애니메이션 레이어는 최대 1개로 제한한다.

---

### 25.6 Generator/Solver 작업 스케줄링

- [MUST] 퍼즐 생성/솔버 분석은 UI 스레드를 막지 않도록 분리한다.
- [MUST] 플레이 도중에는 생성 작업을 최소화한다.
- [MUST] 새 게임 요청 시 캐시에서 1개를 즉시 로드하고, 부족분은 생성 큐로 보충한다.
- [MUST] 캐시 보충은 포그라운드 idle 구간에서만 수행한다(18.5.2와 정합).

타임아웃:
- [MUST] generator 1회 시도 타임아웃은 `1200ms`로 고정한다.
- [MUST] generator 재시도는 최대 3회이며 순서는 `seed 재생성 -> 대칭 제거 OFF -> 난이도 1단계 완화`로 고정한다.
- [MUST] solver 힌트 탐색 타임아웃은 `250ms`로 고정하고, timeout 시 L0 fallback 1회를 수행한다(17.3과 정합).

---

### 25.7 저사양 기기 대응 모드 (MVP 잠금)

- [MUST] 저사양 대응 모드 활성 상태는 `candidateRenderMode`로 결정한다.
  - `auto`: 저사양 감지 시 활성화
  - `on`: 기기 성능과 무관하게 항상 활성화
  - `off`: 자동 감지를 무시하고 비활성화
- [MUST] `candidateRenderMode=auto`의 저사양 감지는 33.1 예산을 기준으로 세션 시작 후 최초 60초 동안 측정된 p95 값으로 판정한다.
- [MUST] 판정 조건: (a) 화면 프레임 p95 < 45fps OR (b) 입력 후 시각 반응 p95 > 50ms.
- [MUST] 위 조건을 만족하면 해당 세션에서 저사양 대응 모드를 ON으로 강제 적용한다(저장된 `candidateRenderMode` 값은 변경하지 않음).
- [MUST] 사용자가 Settings에서 `candidateRenderMode=on|off`를 명시 선택한 경우 자동 판정은 적용 MUST NOT 한다.
- [MUST] `candidateRenderMode` 기본값은 `auto`를 유지한다.
- [MUST] 저사양 대응 모드 활성 시 아래를 강제 적용한다.
  - `highlightStrength=low` (런타임 강제, 저장값은 변경하지 않음)
  - 입력/후보 관련 애니메이션은 `120ms` 이내로 축소
  - 후보 렌더링은 간소화 경로(bitmask 캐시 + 무애니메이션)로 고정
- [MUST] 사용자는 Settings에서 `candidateRenderMode`를 언제든 변경할 수 있어야 한다.

---

### 25.8 성능 측정/디버그 기준

- [MUST] 개발/테스트 빌드에서 perf overlay를 활성화한다.
- [MUST] 아래 시나리오를 성능 측정 기본 세트로 고정한다.
  - 셀 선택 연타 200회
  - digit-first 연속 입력 200회
  - 후보 토글 연속 입력 200회
  - Undo 연타 50회
- [MUST] 성능 측정 결과는 기준기기(33.3)별로 분리 저장한다.
- [MUST] 최소 로그 항목은 아래 2개를 항상 수집한다.
  - 입력 처리 시간(ms, p50/p95)
  - 셀별 렌더 횟수
- [MUST] 릴리즈 후보 빌드 승격 전, 최신 성능 로그 1세트를 첨부한다.

---

### 25.9 금지 사항(성능 망치는 패턴)

- [MUST NOT] 일반 입력/Undo 경로에서 `board` 전체를 setState로 통째로 교체한다.
  - 허용 예외: `NEW_GAME`, `RESTART`, 손상 복구 초기화 경로
- [MUST NOT] 일반 입력 경로에서 `candidates`를 전체 재생성한다.
- [MUST NOT] memoized 셀에 inline function/inline object props를 전달한다.
- [MUST NOT] `useEffect`에서 파생 상태를 매 렌더 재계산하는 구조를 사용한다.
- [MUST] 파생 상태 계산은 selector + memo 경로로 이동한다(25.4 정합).
- [MUST] 위 금지 패턴 위반이 발견되면 release 차단 대상으로 분류한다(33.4 정합).

---

> 이 규칙을 지키면, RN에서도 “보드 입력감”이 네이티브 수준에 가까워진다.

---

## 31. 접근성(Accessibility) 상세 스펙

> 목적: 글로벌 배포 기준에서 접근성 관련 리뷰 리스크를 줄이고, 설정/렌더링 동작을 수치로 고정한다.

### 31.1 범위 (MVP)
- 시각: 색약 대응, 하이라이트 강도, 대비 유지
- 입력: 최소 터치 타깃 보장
- 텍스트: large text + Dynamic Type 대응
- 보조기기: VoiceOver(iOS), TalkBack(Android) 기본 탐색 지원

### 31.2 색약 모드 규칙 (강제)
- red/green 색상만으로 상태를 구분하지 않는다.
- MVP 기본 조합은 `보더 + 아이콘`으로 고정한다.
- [MUST] 보조 신호 아이콘 세트는 `@expo/vector-icons`의 `MaterialCommunityIcons`로 고정한다.
- [MUST] Apple/Google 로그인 버튼의 브랜드 아이콘은 스토어 가이드 준수를 위해서만 예외(`FontAwesome` brands)로 허용한다.
- [MUST] 상태/액션별 아이콘 glyph 매핑은 41.7 표를 따른다(화면별 임의 변경 금지).
- 상태 표현은 반드시 2개 이상 신호를 조합한다:
  - 색상 + 보더 굵기
  - 색상 + 아이콘(예: conflict `!`)
- 셀 패턴(점선/사선 오버레이)은 접근성 fallback 옵션으로만 사용한다.
- conflict 셀은 색상과 무관하게 `2px` 보더를 적용한다.
- related/selected/conflict가 겹칠 때도 conflict 신호(보더/아이콘)가 최우선으로 유지된다.

### 31.3 하이라이트 강도 수치화
- `low`: 배경 alpha `0.08`, 보더 alpha `0.35`
- `med`: 배경 alpha `0.14`, 보더 alpha `0.50`
- `high`: 배경 alpha `0.20`, 보더 alpha `0.70`
- 숫자 텍스트 대비(배경 대비)는 항상 WCAG AA(4.5:1) 이상 유지

### 31.4 Dynamic Type / 글꼴 스케일
- 지원 범위: fontScale `0.9 ~ 1.4` (MVP)
- OS fontScale 요청이 `1.4`를 초과하면 앱 내부 렌더링은 `1.4`로 clamp한다.
- 보드 숫자는 레이아웃 붕괴 방지를 위해 clamp 적용:
  - given/user digit: `16 ~ 30`
  - notes digit: `9 ~ 14`
- fontScale이 큰 경우에도 보드 크기는 고정하고, 텍스트만 축약/클램프한다.

### 31.5 VoiceOver/TalkBack 지원 범위 (MVP)
- 탐색 순서: TopBar → Board(좌상단→우하단) → Keypad → 하단 액션
- 설정 키 `screenReaderVerboseCandidates`를 제공한다:
  - 기본값: `false` (후보 개수만 낭독)
  - `true`: 빈 칸 후보를 전체 숫자 목록으로 낭독
- 셀 접근성 라벨(locale 분기):
  - `ko-KR`:
    - given: `행 r, 열 c, 고정 숫자 n`
    - user: `행 r, 열 c, 입력 숫자 n`
    - empty (`screenReaderVerboseCandidates=false`): `행 r, 열 c, 빈 칸, 후보 k개`
    - empty (`screenReaderVerboseCandidates=true`): `행 r, 열 c, 빈 칸, 후보 {n1,n2,...}`
  - `en-US`:
    - given: `Row r, Column c, Given digit n`
    - user: `Row r, Column c, Entered digit n`
    - empty (`screenReaderVerboseCandidates=false`): `Row r, Column c, Empty, k candidates`
    - empty (`screenReaderVerboseCandidates=true`): `Row r, Column c, Empty, candidates {n1,n2,...}`
- 핵심 버튼(`Undo`, `Erase`, `Pencil`, `Hint`)에 접근성 힌트 텍스트를 제공한다.
- 힌트 적용/충돌 발생 시 스크린리더 알림(announce)을 1회 제공한다.

### 31.6 터치 영역/제스처 기준
- 최소 터치 영역:
  - iOS: `44x44 pt`
  - Android: `48x48 dp`
- 시각 크기가 작아도 hitSlop으로 최소 영역을 보장한다.
- 롱프레스 기능은 대체 버튼 없이 단독 필수 동작으로 쓰지 않는다.

### 31.7 접근성 검수 게이트
- [ ] 색약 모드 ON에서 conflict/selected/related 3상태가 구분 가능
- [ ] VoiceOver/TalkBack로 게임 시작~완료까지 진행 가능
- [ ] fontScale 1.4에서 보드/키패드 레이아웃 붕괴 없음
- [ ] 핵심 액션 버튼 접근성 라벨/힌트 누락 없음
- [ ] `screenReaderVerboseCandidates` ON/OFF 모두에서 빈 칸 낭독이 스펙과 일치

---

## 32. 에러/예외 운영 정책 보강

> 목적: 24장의 UX 스펙에 운영 수치(노출/재시도/백오프)를 추가해 구현 일관성을 확보한다.

### 32.1 오류 노출 레벨
- `silent`: 내부 재시도만 수행, 사용자 노출 없음
- `toast`: 일시적 오류 안내 (동작 계속 가능)
- `banner`: 현재 세션 상태 경고 (예: sync 지연)
- `modal`: 사용자 선택이 필요한 충돌/복구 상황

### 32.2 Sync 실패 표시 정책
- Firestore push 실패 1회: `silent`
- 연속 2~3회 실패: 상단 `sync pending` 배지 표시
- 연속 4회 이상 또는 5분 초과 미동기화: 배너 표시 + 수동 재시도 버튼 노출
- sync가 성공하면 배지/배너 즉시 제거
- [MUST] 수동 재시도 경로는 `retrySyncNow` 단일 액션으로 통일한다(배너 CTA/Settings 동일).

### 32.3 재시도/백오프 기준
- 기본 backoff: `1s → 2s → 4s → 8s` (최대 30s cap)
- jitter: `±20%`
- 세션 종료 후에도 pending queue는 유지하며 다음 app_open에서 재시도
- 동일 오류는 60초 내 토스트 1회만 노출(중복 노출 방지)

### 32.4 Daily 네트워크 실패 처리
- [MUST] Daily seed는 로컬 계산이므로 네트워크 상태와 무관하게 항상 플레이 가능해야 한다.
- [MUST] 네트워크 실패 처리는 서버 검증/도장 반영(스트릭) 지연에 한정한다.
- [MUST] 본 섹션의 서버 검증은 `verifyDailyStamp` 호출을 의미한다.
- [MUST] MVP에서는 Daily 카드/결과 화면에 `offline` 배지를 노출한다(리더보드/순위 UI 미노출).
- [MUST] 온라인 복귀 후 같은 `dateUTC`로 서버 검증을 다시 수행한다.
- [MUST] Daily pending 큐의 보존 기간은 7일로 고정한다.
- [MUST] 7일 초과 pending은 `expired`로 전이하고 streak 반영에서 제외한다.
- [MUST] 만료 처리 시 사용자에게 `daily.pending.expired.toast`를 1회 노출한다.

### 32.5 데이터 손상 복구 전략
- [MUST] currentGame autosave 시 최근 스냅샷 `3개`를 순환 보관한다.
- [MUST] 신규 스냅샷 저장 시 가장 오래된 스냅샷부터 교체한다(FIFO ring).
- [MUST] 복구 우선순위:
  1) 최신 스냅샷 복원
  2) 이전 스냅샷 복원
  3) 실패 시 세이브 초기화 + 새 게임 제안
- [SHOULD] 손상 복구가 발생하면 `data_corruption_recovered` 이벤트를 기록한다.

### 32.6 에러 코드 표준
- 코드 포맷: `DOMAIN_REASON` (예: `SYNC_TIMEOUT`, `GEN_SCORE_OUT_OF_RANGE`)
- 사용자 메시지는 코드와 분리해 로컬라이징 가능 구조로 유지한다.
- 에러 이벤트 필수 공통 필드: `errorCode`, `retryCount`, `networkState`, `appVersion`

---

## 33. 퍼포먼스 예산 & 리렌더 임계값

> 목적: 25장의 목표를 실제 측정 가능한 예산으로 변환한다.

### 33.1 프레임/입력 예산
- 탭 입력 처리(JS): 평균 `<= 8ms`, p95 `<= 16ms`
- 입력 후 시각 반응: p95 `<= 50ms`
- 화면 프레임: 목표 60fps, 저사양 p95 45fps 이상
- 콜드 스타트(Home 진입): p95 `<= 2.5s` (저사양 p95 `<= 3.5s`)
- 백그라운드 복귀(Game 복원): p95 `<= 1.0s`
- 메모리(JS heap): 저사양 30분 플레이 p95 `<= 80MB`
- 메모리(프로세스 RSS): 저사양 30분 플레이 p95 `<= 350MB`

### 33.2 리렌더 허용 범위 (보드 81셀)
- 셀 선택 변경 1회당:
  - 기대 리렌더: `<= 21` 셀
  - 절대 상한: `<= 30` 셀
- 숫자 입력 1회당:
  - 기대 리렌더: `<= 30` 셀
  - 절대 상한: `<= 40` 셀
- Undo 1회당:
  - 기대 리렌더: `<= 35` 셀
  - 절대 상한: `<= 45` 셀

### 33.3 저사양 디바이스 기준 (MVP)
- [MUST] 저사양 성능 검증은 플랫폼별 2기기 세트로 고정한다.
- Android 기준기기(2):
  - [MUST] `Google Pixel 4a`
  - [MUST] `Samsung Galaxy A52`
- iOS 기준기기(2):
  - [MUST] `iPhone SE (2nd gen)`
  - [MUST] `iPhone 11`
- [MUST] 위 기준기기에서 30분 플레이 시 프리즈(200ms+) 3회 이하를 만족해야 한다.
- [SHOULD] 기준기기 세트는 반기 1회 재검토하고, 변경 시 ADR을 남긴다.

### 33.4 측정 방법
- [MUST] 개발/테스트 빌드에서 렌더 카운트 로거를 활성화한다.
- [MUST] 시나리오: 연속 입력 200회, Undo 50회, 후보 토글 200회를 수행한다.
- [MUST] 시나리오: 콜드 스타트 20회, 백그라운드 복귀 20회 반복 측정한다.
- [MUST] 시나리오: 30분 연속 플레이 중 heap/RSS를 1분 간격으로 샘플링한다.
- [MUST] 성능 예산 위반은 `release 차단`을 기본으로 한다.
- [MUST] PR 단계에서는 경고를 허용할 수 있으나, release candidate 승격은 금지한다.
- [MAY] 예외 릴리즈는 ADR 승인과 만료일이 있는 임시 플래그로 제한적으로 허용한다.

---

## 34. 퍼즐 품질 QA 루프 (체감 난이도 포함)

> 목적: 유일해/점수뿐 아니라 실제 체감 난이도 일관성을 유지한다.

### 34.1 사전 검수 표본 수 (릴리즈 전)
- [MUST] 난이도별 최소 표본:
  - Easy/Medium/Hard/Expert/Evil 각각 `100개`
- [MUST] Daily 후보 표본:
  - 향후 `30일분`을 사전 생성 후 검수
- [MUST] 기준 미달 난이도는 해당 티어 출고를 중지한다.
- [MAY] 일정 여유가 있을 때 상위 난이도(Expert/Evil) 표본을 추가 채집할 수 있다.

### 34.2 휴먼 리뷰 루브릭
- 항목(5점 척도):
  - 논리 흐름 자연스러움
  - 막힘 체감 빈도
  - 힌트 의존도
  - “표기 난이도와 체감 난이도 일치도”
- 평균 3.5 미만이면 점수 구간/가중치 재조정

### 34.3 베타 테스트 기준
- [MUST] 최소 100명, 7일 이상
- [MUST] 난이도별 완료율/이탈율/힌트 사용률 수집
- [MUST] 아래 조건 중 1개라도 충족 시 튜닝 스프린트를 진행한다:
  - 표기 난이도 대비 완료율 편차 20%p 이상
  - Evil 힌트 사용률 70% 초과
  - Hard 이상 중도 이탈률 45% 초과
- [SHOULD] MVP 기간에는 위 임계값을 유지하고, 임계값 조정은 ADR 승인 후 수행한다.

### 34.4 점수 조정 프로세스
- 주기: 출시 후 2주 간격
- 절차:
  1) 통계 분석(23장 이벤트)
  2) 후보 변경안 생성
  3) A/B 또는 shadow re-score 검증
  4) ADR 기록 후 반영
- 조정 단위:
  - technique weight
  - tier boundary
  - chain/step bonus 계수

### 34.5 릴리즈 게이트
- [ ] 난이도별 표본 수 충족
- [ ] 체감 루브릭 평균 3.5 이상
- [ ] Evil 추측 의존 퍼즐 0건
- [ ] generator fail 비율 목표 이내

---

## 35. 아키텍처 경계 & 책임 다이어그램

> 목적: 바이브코딩 중 모듈 경계 붕괴를 방지한다.

### 35.1 논리 아키텍처 다이어그램

```text
[UI Layer]
  GameScreen / Board / Keypad / Overlays
        |
        v
[Game Store]
  Zustand state + actions (only entry for UI mutations)
        |
        +----> [Game Engine]
        |        applyInput, validate, conflict, completion
        |
        +----> [Hint Service]
        |        getNextHintStep (uses Solver)
        |
        +----> [Persistence]
        |        autosave/load (MMKV)
        |
        +----> [Sync Service]
                 push/pull/merge (Firestore)

[Solver] <---- [Generator]
  pure logic      uses solver for validation/scoring
```

### 35.2 경계 규칙 (강제)
- [MUST] UI는 solver/generator를 직접 호출하지 않는다.
- [MUST] state 변경은 store action을 통해서만 수행한다.
- [MUST] solver/generator는 pure function으로 유지하고 side effect를 금지한다.
- [MUST] sync/persistence는 engine 내부 로직을 직접 수정하지 않는다.
- [MUST] 모듈 경계 위반은 lint 규칙으로 탐지하고 CI에서 차단한다.

### 35.3 단일 책임 규칙
- `GameEngine`: 규칙/검증/파생 상태 계산
- `Solver`: 논리 단계 탐색/난이도 로그
- `Generator`: 퍼즐 생성/유일해/난이도 충족
- `Store`: 상태 저장/트랜잭션/undo 포인터
- `Service`: I/O(Auth, Firestore, Ads, IAP)

### 35.4 의존성 허용 매트릭스
- 허용:
  - UI -> Store
  - Store -> Engine/Services
  - Engine -> Solver (읽기)
  - Generator -> Solver
- 금지:
  - UI -> Solver/Generator 직접 호출
  - Solver -> Store/UI 참조
  - Service -> UI 상태 직접 변경
- [MUST] 허용/금지 매트릭스를 위반하는 import는 lint 실패로 처리한다.
- [MUST] CI 파이프라인은 매트릭스 위반 시 merge를 차단한다.
- [SHOULD] 신규 모듈 추가 시 허용 매트릭스를 먼저 업데이트한다.

---

## 36. 크래시/로그 정책

> 목적: 운영 중 장애를 빠르게 탐지하고, 개인정보 없이 원인 분석 가능하게 한다.

### 36.1 크래시 수집 (Sentry 기준)
- 환경별 설정:
  - dev: 샘플링 0~10%
  - staging: 샘플링 50%
  - prod: 샘플링 100% (에러), 트레이스 10%
- [MUST] prod 트레이스 샘플링은 MVP 기간 동안 `10%` 고정(실험적 가변 금지)
- [MUST] release 태그: `appVersion + buildNumber + generatorVersion`
- [MUST] source map 업로드를 배포 파이프라인 필수 단계로 둔다.
- [MUST] prod Sentry 프로젝트의 데이터 보존 기간(retention)은 38.1.1.1 “진단 로그(error)” 제출값과 정합되도록 `90일 이하`로 고정한다.

### 36.2 로그 레벨 정책
- `debug`: 로컬 개발 전용, 프로덕션 비활성
- `info`: 주요 상태 전이(게임 시작/완료/sync 성공)
- `warn`: 자동 복구 가능한 오류
- `error`: 사용자 영향 오류/크래시 직전

### 36.3 PII/보안 규칙
- 로그에 이메일/실명/정확한 UID 원문 저장 금지
- puzzle state 전체 덤프 금지 (필요 시 해시/요약만)
- 이벤트/로그 공통으로 민감 필드 마스킹 적용

### 36.4 알림/대응 기준
- [MUST] crash-free session 목표:
  - MVP: 99.5% 이상
- [MUST] 24시간 내 동일 `errorCode` `50건` 이상이면 hotfix 검토를 시작한다.
- [MUST] 치명 오류 신규 발생 시 1영업일 내 triage 완료
- [MAY] 대규모 이벤트/출시일에는 ADR 승인 하에 임계값을 일시 조정할 수 있다.

---

## 37. 온보딩 전략 (First-Run UX)

> 목적: 첫 1세션 이탈을 줄이고, 사용자 타입별 기본 설정을 빠르게 맞춘다.

### 37.1 첫 실행 플로우 (MVP)
1) Auth Gate (Apple/Google 로그인 완료 필수, Skip 없음)
2) Consent Gate (동의 필요 지역만):
   - UMP 동의 확정(`granted|denied|not_required`)
   - iOS는 ATT 1회 시도(정책: 38.1.5)
3) Welcome (2~3문장 가치 제안)
4) 입력 방식 선호 질문:
   - `빠른 입력 선호` / `차분한 풀이 선호`
5) 추천 프리셋 제안:
   - Speed preset / Classic preset
6) 30초 미니 가이드:
   - 셀 선택, 후보 입력, Undo, Hint
7) 첫 게임 시작 (Medium 기본)
- [MUST] MVP에서는 첫 게임 난이도 분기 로직을 두지 않고 `Medium` 단일 기본값으로 고정한다.
- [MUST] Consent Gate는 첫 광고 요청(load/request) 이전에 반드시 완료되어야 한다(38.1.5/ADR-051).
- [MUST] 동의 필요 지역에서는 `adConsentStatus`가 `unknown`인 상태로 Home/Game로 진입 MUST NOT 한다(Consent Gate를 강제 라우팅).

### 37.2 추천 프리셋 정의
- `Speed preset`:
  - digit-first 유지 ON
  - same digit highlight ON
  - auto candidate cleanup ON
  - animation 최소화
- `Classic preset`:
  - cell-first 중심
  - conflict 표시 ON, 입력 차단 OFF
  - [MUST] MVP에서는 Tutor/LearnHub가 없으므로 tutor 관련 설정/카피/플로우를 포함하지 않는다.

### 37.3 Digit-First 추천 규칙
- onboarding 질문에서 `빠른 입력 선호` 선택 시 기본값 제안
- 사용자가 첫 3게임에서 digit-first 사용률 60% 이상이면 추천 배너 재노출 안 함
- 첫 3게임에서 실수율이 높으면 classic 전환 제안 1회 노출

### 37.4 온보딩 건너뛰기/재진입 (튜토리얼)
- [MUST] 본 섹션의 `Skip`은 로그인 스킵이 아니라 미니 가이드 스킵만 의미한다.
- [MUST] `Skip`은 언제든 허용한다.
- [MUST] Skip 사용자는 다음 앱 실행에서 미니 가이드를 `1회` 재노출한다.
- [MUST] 재노출 1회 이후에는 자동 재노출하지 않는다.
- [MUST] Skip 시 기본 프리셋은 `Classic`으로 고정한다.
- [MUST] Settings에서 `온보딩 다시 보기`를 제공한다.
- [SHOULD] 온보딩 완료 여부/선택 프리셋/재노출 여부는 로컬+클라우드에 동기 저장한다.

### 37.5 온보딩 KPI
- 온보딩 완료율 70% 이상
- 첫 세션 완료율 55% 이상
- 첫 세션 이탈률 30% 이하
- 프리셋 선택 후 7일 유지율 추적

---

## 38. 상용화 갭 보강 (지속 확장용)

> 목적: 상용화 관점의 빠진 부분/모순/추상 표현을 줄이고, 실행 가능한 규칙으로 고정한다.

### 38.1 제품 완성도 보강

#### 38.1.1 필수 운영 산출물 (릴리즈 전)
- [MUST] MVP 앱 표시명(display name)은 `sudo9`로 고정한다.
- [MUST] 앱 표시명 변경은 ADR 승인 후 다음 마일스톤에서만 허용한다.
- [MUST] 앱 식별자(iOS `bundleId`, Android `applicationId`) / 운영 도메인 / 지원 이메일은 표시명과 별개 식별자로 관리하며, MVP에서는 38.1.1.2의 “식별자 고정 테이블” 값으로 고정한다.
- [MUST] `productId`는 IAP 상품 식별자(38.1.2)이며, 앱 식별자(bundleId/applicationId)와 혼동 MUST NOT 한다.
- [MUST NOT] 본 문서에 값이 없는 식별자를 “기존 고정값”으로 간주 MUST NOT 한다.
- [MUST] Privacy Policy URL은 `https://sudoku-app.web.app/privacy`로 고정한다(Settings > Data `openPrivacyPolicy`에서 접근).
- [MUST] Terms of Service URL은 `https://sudoku-app.web.app/terms`로 고정한다(Settings > Data `openTermsOfService`에서 접근).
- [MUST] 문의 채널은 아래 2개를 고정한다(Settings > Data `contactSupport`에서 접근).
  - support email: `support@sudoku-app.app`
  - support form: `https://sudoku-app.web.app/support`
- [MUST] 법적 고지 문구는 아래 3개 카피 키(40.2)를 단일 기준으로 사용한다(앱/스토어 문구를 동일 키셋으로 운영).
  - 광고 고지: `legal.notice.ads`
  - 인앱결제 고지: `legal.notice.iap`
  - 데이터 처리 고지: `legal.notice.data`
- [MUST] App Store / Play Store 메타 초안은 아래 기준으로 고정한다.
  - 스크린샷: 플랫폼별 6장(게임플레이 3, 통계 1, 설정/데이터 1, 결제/복원 1)
  - 설명(ko/en): short 1개 + full 1개
  - 키워드: 10개 이하, 브랜드명/경쟁사명 제외
- [MUST] `short`는 iOS(App Store)의 Subtitle 및 Google Play의 Short description을 의미한다.
- [MUST] `full`은 iOS(App Store)의 Description 및 Google Play의 Full description을 의미한다.
- [MUST] `키워드`는 iOS(App Store)의 Keywords 필드에만 적용한다(Google Play는 별도 키워드 필드 제출을 요구하지 않는다).
- [MUST] 스토어 메타 확정 문구(v1.0, ko/en)는 아래 값으로 고정한다(Release Candidate/스토어 제출 시 1:1 사용, 임의 수정 금지).
  - iOS Subtitle / Google Play Short (ko): `논리로 푸는 데일리 스도쿠`
  - iOS Subtitle / Google Play Short (en): `Logic-first Daily Sudoku`
  - Full description (ko): `sudo9는 논리로 푸는 스도쿠 앱입니다. Daily 퍼즐과 난이도(Easy~Evil)를 제공하며 메모/후보, Undo, 자동 후보로 플레이를 돕습니다. 막히면 힌트(L0/L1)를 사용할 수 있습니다(Free: 하루 3개, 광고로 하루 최대 5개 추가 충전, Premium: 무제한). 계정 동기화, 기록 초기화(Reset Progress), 계정 삭제를 지원합니다. Free는 광고를 포함할 수 있으며 Premium은 광고를 제거합니다. 코인은 광고/결제/스테이지 별 보상으로 획득하며 사용처는 추후 업데이트에서 제공됩니다.`
  - Full description (en): `sudo9 is a logic-first Sudoku app with Daily puzzles and difficulty levels (Easy–Evil). Play with notes/candidates, undo, and auto-candidates. If you get stuck, use hints (L0/L1) (Free: 3/day, up to 5/day via rewarded refills; Premium: unlimited). We support account sync, Reset Progress, and Delete Account. Free may include ads; Premium removes ads. Coins can be earned via rewarded ads, stage rewards, or purchases; spending will be added in a future update.`
  - iOS Keywords (<=10): `sudoku, logic, number puzzle, brain, daily, classic, grid, numbers, challenge, notes`
  - Screenshot 6장 매핑:
    - (1) 게임 보드 플레이
    - (2) 메모/후보 사용 화면
    - (3) 힌트/힌트 게이트 화면
    - (4) 통계(Stats) 화면
    - (5) 설정+데이터(Reset Progress/Delete Account 진입) 화면
    - (6) 코인 스토어 + Premium + Restore Purchases 화면
- [MUST] 릴리즈 전 `스토어 Privacy/Data Safety 제출 체크리스트`를 작성하고 실제 수집/처리 데이터와 1:1 매핑한다.
- [MUST] 광고/분석 SDK(AdMob, Sentry, Firebase) 사용 여부를 기준으로 수집 데이터 항목(계정/사용/진단)을 고정한다.
- [MUST] 스토어 제출 폼과 앱 내 고지/개인정보 처리방침 간 데이터 항목이 불일치하면 릴리즈를 차단한다.
- [MUST] Google Play Data Safety 제출값에서 “Data is encrypted in transit”는 `Yes`로 고정 제출한다. 앱의 모든 외부 네트워크 통신은 HTTPS(TLS)만 허용하며, 평문 HTTP 통신은 MUST NOT 한다.
- [MUST] 광고 SDK(AdMob)를 포함하는 빌드에서는 광고 식별자/추적/동의 상태 항목을 스토어 제출 체크리스트에 반드시 포함한다.
- [MUST] iOS 제출물은 앱 레벨 `PrivacyInfo.xcprivacy`(Privacy Manifest)를 포함해야 하며, Required Reason API 선언(`NSPrivacyAccessedAPITypes`)을 포함해야 한다.
- [MUST] 포함된 third-party SDK(AdMob/Firebase/RevenueCat/Sentry)는 Privacy Manifest를 포함하는 배포 형태로만 사용한다. 미포함 SDK가 존재하면 iOS 릴리즈를 금지한다.
- [MUST] MVP 스토어 제출 이전에 앱의 대상 연령/연령등급 및 “아동 대상(child-directed) 여부”를 확정하고 문서에 고정한다(미확정 상태에서는 릴리즈를 금지한다).
- [MUST] Privacy Policy/Terms 페이지는 38.1.1.1 체크리스트의 data_item/purpose/shared/retention/user_controls 내용을 1:1로 반영해야 한다.
- [MUST] Privacy Policy/Terms 페이지는 `lastUpdated(YYYY-MM-DD)`와 지원 이메일을 명시해야 한다.
- [MUST] 프로덕션 Firestore TTL 정책(39.2의 `events.expireAt`, `idempotencyEvents.expireAt`, `resetProgressRequests.expireAt`, `rewardedCoinsGrants.expireAt`)이 활성화되어 있어야 하며, TTL 미활성 상태에서는 릴리즈를 금지한다.

#### 38.1.1.1 스토어 Privacy/Data Safety 제출 체크리스트 템플릿 (MVP)
- [MUST] 아래 테이블을 릴리즈마다 1회 갱신하고, 스토어 제출값과 1:1로 일치시킨다.
- [MUST] MVP 스토어 제출 기준으로 아래 체크리스트 값을 최초 1회 확정한다(SDK/데이터 처리 변경 없이는 수정 금지).
- [MUST] Firestore에 저장되는 플레이 데이터(`currentGame/journeyStages/sessions/statsAggregate/stamps/streak/settings`)는 스토어 제출 체크리스트에 data_item으로 포함해야 하며, 19.3.2/39.1 스키마와 1:1 매핑되어야 한다.

| data_item | collected | source(SDK/feature) | purpose | shared_with_third_party | retention | user_controls | store_form_field | policy_section |
|---|---|---|---|---|---|---|---|---|
| 계정 식별자(uid) | yes | Firebase Auth | 로그인/동기화 | yes | 계정 삭제 완료 시까지(삭제 요청 후 최대 7일) | 설정/탈퇴 경로 | 계정 정보 | Privacy: Account Identifiers |
| 구매 상태(premium) | yes | RevenueCat/Firebase | 결제 검증/광고 제거 적용 | yes | 앱 서버 저장분: 계정 삭제 완료 시까지(삭제 요청 후 최대 7일); 결제 검증 서비스/스토어: provider-managed | 복원/탈퇴 경로 | 구매 데이터 | Privacy: Purchases |
| 재화 지갑(wallet, coinsBalance) | yes | Firestore(`/users/{uid}/wallet/meta`) | 재화 잔액 동기화/구매 반영/표시 | yes | 계정 삭제 완료 시까지(삭제 요청 후 최대 7일) | Delete Account | 사용 데이터 | Privacy: Economy |
| 플레이 진행 데이터(currentGame) | yes | Firestore(`/users/{uid}/currentGame/meta`) | Continue 복구/동기화 | yes | 최신 1개 유지; Reset Progress 시 삭제; 계정 삭제 완료 시까지(삭제 요청 후 최대 7일) | Reset Progress / Delete Account | 사용 데이터 | Privacy: Gameplay Data |
| Journey stage 진행도(journeyStages) | yes | Firestore(`/users/{uid}/journeyStages/{stageId}`) | Journey stage 진행도(별/클리어) 동기화 | yes | Reset Progress 시 삭제; 계정 삭제 완료 시까지(삭제 요청 후 최대 7일) | Reset Progress / Delete Account | 사용 데이터 | Privacy: Gameplay Data |
| 플레이 세션 기록(sessions) | yes | Firestore(`/users/{uid}/sessions/{sessionId}`) | 통계/품질 지표/동기화 | yes | 최근 200개 유지(고정); Reset Progress 시 삭제; 계정 삭제 완료 시까지(삭제 요청 후 최대 7일) | Reset Progress / Delete Account | 사용 데이터 | Privacy: Gameplay Data |
| 통계 집계(statsAggregate) | yes | Firestore(`/users/{uid}/statsAggregate/meta`) | 통계 화면 제공/동기화 | yes | Reset Progress 시 삭제; 계정 삭제 완료 시까지(삭제 요청 후 최대 7일) | Reset Progress / Delete Account | 사용 데이터 | Privacy: Gameplay Data |
| Daily 도장/스트릭(stamps/streak) | yes | Firestore(`/users/{uid}/stamps/{dateUTC}`, `/users/{uid}/streak/meta`) | Daily/도장/스트릭 제공 | yes | Reset Progress 시 삭제; 계정 삭제 완료 시까지(삭제 요청 후 최대 7일) | Reset Progress / Delete Account | 사용 데이터 | Privacy: Gameplay Data |
| 사용자 설정(settings) | yes | Firestore(`/users/{uid}/settings/meta`) | 설정 동기화 | yes | 계정 삭제 완료 시까지(삭제 요청 후 최대 7일) | Settings(수정) / Delete Account | 사용 데이터 | Privacy: Settings |
| 사용 이벤트(event) | yes | Firestore(`/users/{uid}/events/{eventId}`) | 품질/운영 지표 | yes | 90일(TTL) | 계정 삭제(Settings > Data > Delete Account) | 사용 데이터 | Privacy: Usage Data |
| 진단 로그(error) | yes | Sentry/Crash | 장애 대응/품질 개선 | yes | 90일 | 계정 삭제(Settings > Data > Delete Account) | 진단 데이터 | Privacy: Diagnostics |
| 고객 지원 문의(메일/웹폼) + 진단 payload | yes | Settings > Data `contactSupport`(mailto/support form; 20.2.8/38.1.3) | 고객 지원/장애 대응 | yes | 180일(지원 채널 기준) | 문의 발송(사용자 제출) | Customer support | Privacy: Customer Support |
| 광고 식별자(AAID/IDFA) | yes | AdMob + OS | 광고 제공/측정 | yes | provider-managed(OS/AdMob 정책) | OS 광고 ID 재설정 + 동의 관리 | Advertising Identifier/Tracking | Privacy: Advertising & Tracking |
| 추적/광고동의 상태(ATT/adConsentStatus) | yes | OS + UMP + Events | 광고 개인화 제어/컴플라이언스 | yes | 디바이스 로컬(Consent Runtime Keys): 사용자가 동의를 변경하거나 앱 삭제/OS 재설정 시까지; 이벤트 로그: 90일(TTL) | Settings > Data > manageAdConsent | Tracking/Consent | Privacy: Advertising & Tracking |

#### 38.1.1.2 식별자 고정 테이블 (MVP)
- [MUST] 본 섹션(38.1.1.2)의 **식별자 값 라인**에 placeholder(실제 운영값이 아닌 임시 토큰)가 1개라도 남아 있으면 Release Candidate 빌드, 스토어 제출, 릴리즈(프로덕션 배포 포함)를 금지한다.
- [MUST] placeholder 잔존 상태에서도 개발/구현(로컬 dev build)은 진행할 수 있다. 단, Release Candidate/스토어 제출/릴리즈는 본 절의 규칙을 따른다.
- iOS `bundleId`: `com.sudoku.sudo9`
- Android `applicationId`(packageName): `com.sudoku.sudo9`
- Apple App ID(App Store Connect): `<FILL_ME>`
- [MUST] Apple App ID는 App Store Connect에 표시되는 숫자 ID를 그대로 기입한다(공백/문자/접두사 포함 금지).
- AdMob App ID(iOS): `ca-app-pub-3125100873852926~3623753762`
- AdMob App ID(Android): `ca-app-pub-3125100873852926~2796234743`
- AdMob Ad Unit ID(iOS Banner): `ca-app-pub-3125100873852926/8272252279`
- AdMob Ad Unit ID(iOS Interstitial): `ca-app-pub-3125100873852926/8336665605`
- AdMob Ad Unit ID(iOS Rewarded CoinsEarn): `ca-app-pub-3125100873852926/6959170605`
- AdMob Ad Unit ID(iOS Rewarded HintRefill): `ca-app-pub-3125100873852926/9234814307`
- AdMob Ad Unit ID(Android Banner): `ca-app-pub-3125100873852926/3622231250`
- AdMob Ad Unit ID(Android Interstitial): `ca-app-pub-3125100873852926/5042619559`
- AdMob Ad Unit ID(Android Rewarded CoinsEarn): `ca-app-pub-3125100873852926/8292938155`
- AdMob Ad Unit ID(Android Rewarded HintRefill): `ca-app-pub-3125100873852926/2860977647`
- Firebase projectId(prod): `sudo9-prod`
- 스토어 연령등급(iOS/Android): `iOS 4+, Android 3+ (전체이용가)`
- 아동 대상(child-directed) 여부: `false`
- RevenueCat entitlementId: `premium` (고정)
- IAP productId(Premium): `sudoku.premium.lifetime` (고정)
- IAP productId(Coins Pack1): `sudoku.coins.pack1` (고정)
- [MUST NOT] 프로덕션 빌드에서는 AdMob 테스트 App ID/Ad Unit ID 사용 MUST NOT 한다.

#### 38.1.1.3 Store Review Notes (Template)
- [MUST] App Store/Play Review Notes에는 아래를 반드시 포함한다.
  - 로그인은 Apple/Google로만 가능(게스트/스킵 없음)
  - 핵심 플레이는 로그인 완료 후 즉시 가능
  - 프리미엄 결제/복원 검증은 스토어 Sandbox/Test purchase로 수행
  - Premium에서는 광고가 제거됨(배너/인터스티셜/리워디드 모두)
  - Rewarded는 `코인 수급` 및 `힌트 충전` 목적으로만 사용됨(게임 진행을 막지 않음)
  - Journey(Stage/Chapter)는 3-star 평가를 제공하며, 별 성과에 따라 코인 보상이 지급된다(중복 지급 없음).
  - Coins Pack1(소모성)은 코인을 즉시 지급한다. v1.0에서는 코인 사용처(spend)가 없고 코인은 누적만 되며, 후속 버전 아이템(예: Pet 코스튬)에서 사용된다. 이 내용은 Coins Store에 고지 문구로 노출된다(`coins.store.disclaimer.coming_soon`, 40.2).

#### 38.1.1.4 iOS Required Reason API 선언 테이블 (MVP)
- [MUST] iOS 릴리즈마다 앱 레벨 Privacy Manifest의 `NSPrivacyAccessedAPITypes` 선언 결과를 아래 테이블에 기록하고, 실제 빌드 산출물과 일치해야 한다.
- [MUST] 선언 항목이 0개인 경우, 테이블에 `none`을 1행으로 기록한다(“미기록” 금지).
- [MUST] Release Candidate/스토어 제출용 빌드에서는 `lastVerifiedAt`를 실제 검증 날짜(`YYYY-MM-DD`)로 채워야 하며 placeholder 기입은 허용하지 않는다.
- [MUST] `lastVerifiedAt`에는 미래 날짜를 기입 MUST NOT 한다.

| apiType | reasonCode | justification | lastVerifiedAt(YYYY-MM-DD) |
|---|---|---|---|
| none | - | 앱 코드에서 Required Reason API 접근 없음(또는 SDK manifest로만 처리됨) | `2026-02-24` |

#### 38.1.2 결제/복원 정책
- [MUST] 결제 방식은 Store IAP only로 고정한다(Apple IAP / Google Play Billing).
- [MUST NOT] 외부 결제 링크/웹 결제/대체 결제 유도 문구를 앱 내에 노출하지 않는다.
- [MUST] 무료/프리미엄 경계를 화면별로 명시한다(잠금 아이콘 + 설명 1줄).
- [MUST] MVP IAP SKU는 아래 2개로 고정한다(ADR-066).
  - Premium(영구, non-consumable): productId(iOS/Android)=`sudoku.premium.lifetime`, entitlementId(RevenueCat)=`premium`, 가격(USD)=`3.99`(store tier 환산 적용)
  - Coins Pack1(소모성, consumable): productId(iOS/Android)=`sudoku.coins.pack1`, 제공량=`+500 coins`, 가격(USD)=`1.99`
- [MUST] `Restore Purchases`는 Premium 복원 전용이다(Coins Pack은 restore 대상이 아님).
- [MUST] Coins Pack 구매로 획득한 코인 잔액은 Cloud Sync로 복구된다(로그인 후 wallet pull).
- [MUST] 앱 시작/복귀/수동 복원 시 RevenueCat 검증으로 premium 상태를 재동기화한다.
- [MUST] Paywall에서 getCustomerInfo/purchase/restore를 호출하기 전에 RevenueCat `logIn(firebaseUid)`가 완료되어 있어야 한다(19.2). `logIn` 완료 전 결제/복원 진입 MUST NOT.
- [MUST] 복원 실패 시 로컬라이즈된 메시지 + 재시도 버튼을 표시한다(무한 로딩 금지).
- [MUST] 내부 `errorCode`는 사용자에게 직접 노출하지 않고 이벤트/로그로만 기록한다.
- [MUST] Paywall 하단에 `paywall.disclaimer.refund_delay`(40.2) 1줄을 고정 노출한다.
- [MUST] Paywall 화면을 제공한다.
  - 혜택 3줄(광고 제거, 힌트 무제한, 영구 이용)
  - 가격 표시
  - `구매` CTA
  - `Restore Purchases`
  - 닫기 버튼
  - `Terms`/`Privacy` 링크
- [MUST] Paywall 진입 경로는 최소 2개를 제공한다.
  - Home 상단 Premium 버튼
  - Settings > Data `Upgrade to Premium` 버튼
- [MUST] 구매/복원 진행 중에는 CTA를 disabled 처리하고 무한 로딩을 금지한다.

#### 38.1.2.2 Coins Store (MVP)
- [MUST] `Coins Store` 화면(또는 시트)을 제공한다.
- [MUST] 진입 경로: Home에서 코인 잔액 영역 탭 또는 `Get Coins` CTA로 진입한다.
- [MUST] 구성 요소:
  - 현재 코인 잔액 표시(`/users/{uid}/wallet/meta.coinsBalance`)
  - `광고 보고 코인 받기(+20)` CTA (`currency_earn`)
  - `코인 구매(+500)` CTA (productId=`sudoku.coins.pack1`)
- [MUST] MVP에서는 코인 사용처(spend)가 없으므로 `Coins Store`에서 `코인 구매(+500)` CTA 바로 위에 `coins.store.disclaimer.coming_soon`(40.2) 안내 1줄을 고정 노출한다.
- [MUST] `광고 보고 코인 받기` CTA는 아래 조건을 모두 만족할 때만 노출한다:
  - `premiumEffective=false`
  - `networkState=online`
  - 광고 `ready`
  - 서버 일일 한도(`currencyEarnAdsPerDayMax`) 미도달
- [MUST] `코인 구매` CTA는 `networkState=online`일 때만 활성화한다(오프라인에서는 비활성 + 안내 문구).

#### 38.1.2.1 Premium Ad Suppression (MVP)
- [MUST] `premiumEffective=true` 동안 `banner/interstitial/rewarded` 광고 요청(load/request) 및 노출(show)을 전부 금지한다.
- [MUST] `premiumEffective=true` 동안 광고 UI 영역(배너 슬롯 포함)을 렌더링하지 않는다.
- [MUST] `premiumEffective=true` 동안 Rewarded 기반 CTA(`currency_earn`, `hint_refill`)는 숨김 처리한다.
- [MUST] `mistakeLimit` `failed` 화면은 `Restart/Quit`만 제공한다(Rewarded 부활 CTA 금지).
- [MUST NOT] `premiumEffective=true` 동안 AdMob SDK 초기화를 수행하지 않는다.
- [MUST] `premiumEffective`는 아래 우선순위로 단일 계산한다: (1) 이번 세션 RevenueCat 검증 결과, (2) Firestore `profile.premium` 로컬 캐시, (3) `purchaseState=premium` 로컬 캐시.
- [MUST] `premiumEffective=true`이면 Firestore `profile.premium` 동기화 상태와 무관하게 즉시 광고 suppression/CTA 숨김 규칙을 적용한다.
- [MUST] RevenueCat 검증(getCustomerInfo)이 성공으로 종료되면(권한 활성/비활성 무관) 클라이언트는 `premiumLastVerifiedAt`를 현재 epoch ms(`Date.now()`)로 갱신한다.
- [MUST] RevenueCat 검증 결과 entitlement `premium`이 active이면 클라이언트는 `purchaseState=premium`으로 갱신하고, active가 아니면 `purchaseState=unknown`으로 갱신한다.
- [MUST] `purchaseState`, `premiumLastVerifiedAt`는 로컬(MMKV) 키이며 서버(webhook/Firestore)에서 갱신 대상으로 취급 MUST NOT 한다.

결제 상태머신(MVP):
- 상태 집합: `idle`, `purchasing`, `purchased`, `restored`, `cancelled`, `failed`, `revoked`, `pending`
- 전이 규칙:
  - `idle -> purchasing`: 구매 버튼 탭
  - `purchasing -> purchased`: 스토어 성공 + 검증 성공
  - `purchasing -> pending`: 스토어 pending 응답
  - `purchasing -> cancelled`: 사용자 취소
  - `purchasing -> failed`: 스토어 오류 또는 검증 실패
  - `pending -> purchased | failed | cancelled`: 후속 검증 결과 반영
  - `purchased/restored -> revoked`: 환불/취소 감지
  - `cancelled/failed/revoked -> idle`: 사용자 확인 후 대기 상태 복귀
- 저장 규칙:
  - `idle`, `purchasing`은 로컬 런타임 상태로만 유지
  - [MUST] 클라이언트는 상태 변화(`purchased|restored|pending|revoked|failed|cancelled`)를 23.2의 결제/복원 이벤트로 즉시 기록한다.
  - [MUST NOT] 클라이언트는 Firestore `/users/{uid}/purchases/{purchaseId}`에 write MUST NOT 하며, purchase 문서 생성/갱신은 39.6 서버 검증 경로로만 수행한다.

#### 38.1.3 CS/운영 SLA (MVP)
- 크리티컬 결함(데이터 손상/진행 불가): 1영업일 내 1차 답변
- 일반 문의: 3영업일 내 1차 답변
- 동일 이슈 10건 이상 발생 시 FAQ 업데이트 + changelog 반영
- [MUST] 문의 채널로 접수되는 케이스에는 진단 정보(`releaseTag`, `uidHash`, `networkState`, `syncPending`, `lastErrorCode`, `purchaseState`, `deletionRequestStatus`)를 포함한다.
- [MUST] 지원 채널이 prefill을 지원하면 진단 정보를 자동 첨부하고, 미지원/실패 시 `Copy diagnostics` fallback을 제공한다.
- [MUST] support mail/form으로 수신되는 문의/진단 payload는 38.1.1.1 체크리스트의 “고객 지원 문의” data_item으로 스토어 제출/개인정보 처리방침에 포함되어야 한다.
- [MUST] support mail/form으로 수신되는 문의/진단 payload는 38.1.1.1 제출값과 정합되도록 수신일 기준 `180일 이하`로 보존하고, 이후 삭제한다(지원 채널별 보존 정책/자동 삭제 설정).

#### 38.1.4 계정/데이터 생명주기 (상용 필수)
- [MUST] Settings > Data에 `Delete Account`를 상시 노출한다.
- [MUST] 계정 삭제는 재인증(Apple/Google) 후 최종 확인 1회로 실행한다.
- [MUST] Delete Account 확인 UI는 “스토어 구매 내역은 플랫폼 정책상 유지될 수 있으며, 재로그인 후 `Restore Purchases`로 프리미엄을 다시 활성화할 수 있음”을 반드시 고지한다.
- [MUST] `Delete Account` 요청은 `networkState=online`일 때만 시작한다(오프라인에서는 시작 MUST NOT).
- [MUST] `/deletionRequests/{uid}` create가 서버에 커밋(ack)되기 전에는 로컬 데이터 삭제/로그아웃을 수행하지 않는다.
- [MUST] create 커밋 실패(offline 또는 timeout/read-back 실패 포함) 시 로컬 데이터는 유지하고 `account.delete.offline.block.toast`를 1회 노출한다.
- [MUST] `/deletionRequests/{uid}` create 요청이 `timeout/deadline_exceeded/unknown`으로 종료되면, 앱은 즉시 `/deletionRequests/{uid}` read-back 1회를 수행해 문서 존재 여부를 확인해야 한다.
- [MUST] read-back 결과 문서가 존재하면 create 커밋 성공으로 간주하고, create 커밋 완료 직후 규칙(로컬 데이터 삭제 + 로그아웃)을 동일 적용해야 한다.
- [MUST] create 응답이 `already_exists`이면 문서 존재와 동일하게 취급하고 로컬 데이터 삭제 + 로그아웃을 수행해야 한다.
- [MUST] read-back이 실패(offline 포함)하면 로컬 데이터 삭제/로그아웃을 수행 MUST NOT 하며 `account.delete.offline.block.toast`를 1회 노출해야 한다.
- [MUST] `/deletionRequests/{uid}` create 커밋 완료 직후 `logout` 동작 규칙(20.2.8)을 그대로 수행하여 user-scoped 로컬 데이터(`settings`, `currentGame`, `puzzleCache`, `localStats`, `purchaseState`, `premiumLastVerifiedAt`, `resetProgressRequestId` 및 재시도 큐)를 전부 삭제하고 로그아웃한다(RevenueCat `logOut()` 포함).
- [MUST] 디바이스 로컬 동의 런타임 키(`adConsentStatus`, `adConsentRegion`, `adConsentUpdatedAt`, `attStatus`)는 삭제하지 않는다(20.2.9).
- [MUST] 클라우드 사용자 데이터는 삭제 요청 후 최대 7일 내 영구 삭제한다.
- [MUST] "영구 삭제(완료, done)"는 아래를 모두 만족해야 한다.
  - Firebase Auth의 해당 uid 사용자 레코드를 영구 삭제한다.
  - Firestore `/users/{uid}/**` 하위 모든 문서 및 모든 서브컬렉션을 recursive delete 한다.
- [MUST NOT] Firestore에서 "부모 문서만 삭제"로 영구 삭제 완료 처리 MUST NOT (서브컬렉션 포함 삭제 완료 후에만 `done` 처리).
- [MUST] 서버 삭제 작업은 재시도/재개가 가능해야 하며, 부분 실패 시 `deletionRequests.status=processing`을 유지하고 재시도 후 `done|failed`로 종결한다.
- [MUST] 계정 삭제/완료/실패 상태는 이벤트(`account_delete_requested`, `account_deleted`, `account_delete_failed`)로 기록한다.
- [MUST] `/deletionRequests/{uid}` 상태가 `requested|processing|done`이면 결제/복원 진입을 차단한다.
- [MUST] 삭제 상태의 uid는 RevenueCat webhook 반영 대상에서 제외하고, 삭제 실패(`failed`) 후 재로그인 시에만 결제/복원 재진입을 허용한다.
- [MUST] `processing`이 24시간을 초과하면 앱은 `contactSupport` CTA를 강제 노출한다.
- [MUST] `processing`이 7일을 초과하면 서버는 `deletionRequests.status=failed`로 전이하고, `account_delete_failed(reason=server_timeout)`를 기록한다(24.10과 정합).

##### 38.1.4.1 Account Deletion 서버 워커 계약 (MVP)
- [MUST] 서버는 `/deletionRequests/{uid}` 문서가 `status=requested`로 생성되면 1분 이내에 `status=processing`, `processingStartedAt=serverTimestamp`, `updatedAt=serverTimestamp`로 전이한다(멱등: 이미 `processing|done|failed`이면 NO_OP).
- [MUST] 서버 워커는 영구 삭제 작업을 아래 순서로 수행하고, 각 단계는 재실행 가능(멱등)해야 한다.
  - 1) Firestore `/users/{uid}/**` 하위 모든 문서 및 모든 서브컬렉션 recursive delete 완료
  - 2) Firebase Auth uid 사용자 레코드 삭제
  - 3) Firestore `/users/{uid}/**` recursive delete를 1회 추가 수행하여 잔존 문서가 없음을 보장한다(멱등)
  - 4) `/deletionRequests/{uid}`를 `status=done`, `deletedAt=serverTimestamp`, `updatedAt=serverTimestamp`로 전이
- [MUST] 단계 중 일부가 실패하면 `status=processing`을 유지하고 지수 백오프로 재시도한다(24h 경고/7일 실패 전이 규칙은 24.10/38.1.4를 따른다).
- [MUST] 실패 사유는 `/deletionRequests/{uid}`에 저장 MUST NOT 하며, 이벤트 `account_delete_failed.reason`으로만 기록한다(39.1.6, 24.10).

#### 38.1.5 광고 동의/추적 정책 (상용 필수)
- [MUST] 광고 SDK 초기화 전 지역 기반 동의 상태를 확인한다(EEA/US_CA 규정 준수).
- [MUST] iOS에서 IDFA 사용 시 ATT 프롬프트를 명시적으로 처리한다.
- [MUST] iOS 빌드는 Info.plist에 `NSUserTrackingUsageDescription`을 포함해야 하며, 값은 40.2의 `att.usage_description`를 사용한다.
- [MUST] iOS 빌드 산출물(Info.plist)은 `GADApplicationIdentifier`를 포함해야 하며, 값은 38.1.1.2의 `AdMob App ID(iOS)`로 고정한다.
- [MUST] Android 빌드는 Manifest에 `com.google.android.gms.permission.AD_ID`를 선언해야 하며, 38.1.1.1 체크리스트의 “광고 식별자(AAID/IDFA)” 및 “Tracking/Consent” 제출값과 일치해야 한다.
- [MUST] `adConsentStatus=denied` 또는 동의 SDK 실패/타임아웃 시 개인화 광고 요청 MUST NOT 하며, non-personalized 요청만 허용한다(ADR-051).
- [MUST] non-personalized 요청이 no-fill/실패일 때에만 해당 placement를 미노출로 fallback한다(“거부=광고 0”을 기본 정책으로 두지 않는다).
- [MUST] 동의/거부 상태는 Settings > Data에서 재확인/변경 가능해야 한다.
- [MUST] Rewarded/Interstitial/Banner는 동의 필요 지역에서 `adConsentStatus=unknown`인 동안 요청(load/request)을 보내지 않는다.
- [MUST] Rewarded CTA는 광고가 `ready` 상태가 아닐 경우 화면에서 숨김 처리한다.
- [MUST] 동의 SDK 실패/타임아웃(2s 초과) 시 `non_personalized` 모드로 강등하고 `ad_consent_updated` 이벤트를 `status=denied`, `reason=sdk_error|sdk_timeout`으로 기록해야 한다.
- [MUST] ATT는 첫 광고 요청 이전에 1회만 시도하며, 거부 시 재요청하지 않는다.
- [MUST] 동의 상태는 `granted | denied | not_required | unknown` 4값으로 표준화한다.
- [MUST] ATT를 사용하는 경우 스토어 제출 폼의 Tracking 항목과 앱 내 고지/동의 흐름이 불일치하면 릴리즈를 차단한다.

##### 38.1.5.1 Ad Placements & Frequency (MVP)
- [MUST] MVP 광고 지면은 `banner`, `rewarded`, `interstitial` 3종으로 제한한다(추가 지면은 Post-MVP + ADR로만 허용).
- [MUST] Banner는 무료 유저에게만 노출하며, 게임 화면 하단 고정 1개로만 노출한다(추가 배너 슬롯/복수 배너 금지).
- [MUST] Rewarded 목적은 `currency_earn`, `hint_refill` 2개로만 고정한다(ADR-065).
- [MUST] Rewarded(`currency_earn`): Coins Store에서 “광고 보고 코인 받기” CTA로만 노출한다. Home에서는 Coins Store 진입 CTA만 제공한다. 보상은 `+20 coins`, 일일 한도는 `10회/일(UTC 00:00 리셋)`로 고정한다(ADR-064).
- [MUST] Rewarded(`hint_refill`): `hintsRemaining==0`일 때만 “광고 보고 힌트 +1” CTA를 노출한다. 보상은 `+1 hint`, 일일 한도는 `5회/일(UTC 00:00 리셋)`로 고정한다(ADR-063).
- [MUST] 앱 내 보상 반영은 `purpose` 기준 상수로 고정한다: `currency_earn=+20 coins`, `hint_refill=+1 hint`.
- [SHOULD] AdMob Rewarded 광고 단위의 Reward 설정은 진단/운영 가독성을 위해 아래로 설정한다(콘솔에서 변경 불가; 앱은 해당 값을 신뢰하지 않고 무시한다).
  - Rewarded CoinsEarn: reward item=`coins`, amount=`20`
  - Rewarded HintRefill: reward item=`hint`, amount=`1`
- [MUST NOT] MVP에서 `revive(부활)` 목적의 Rewarded 노출/요청을 수행하지 않는다(실수 제한 `failed` 화면 포함).
- [MUST] Rewarded CTA는 광고가 `ready` 상태가 아니거나 `networkState != online`이면 화면에서 숨김 처리한다(노출/요청 금지).
- [MUST] Interstitial은 `CompletedModal` 닫기 직후에만 노출하며, 최소 `5판` 쿨다운을 적용한다.
- [MUST] Interstitial/Rewarded는 best-effort로 처리하며, 로드 실패/timeout 시 UX를 막지 않고 즉시 스킵한다(무한 로딩 금지).
- [MUST] 본 절의 광고 지면/빈도는 38.1.2.1(Premium Ad Suppression) 및 38.1.5(Consent/ATT gate) 규칙을 항상 우선 적용한다.

#### 38.1.6 재화/보상형 루프 (Economy, MVP)
> 목표: 재화/힌트 제한/보상형 목적을 문서로 잠궈 구현 분산(=수익/UX/KPI 붕괴)을 방지한다.

##### 38.1.6.1 용어/상수(고정)
- [MUST] 재화는 단일 `coins`만 사용한다(ADR-064).
- [MUST] 본 절의 “일일” 리셋 기준은 UTC 00:00으로 고정한다(dateUTC, `YYYY-MM-DD`).
- [MUST] Rewarded 목적은 `currency_earn`, `hint_refill` 2개로만 고정한다(ADR-065).
- [MUST] 코인 수급(Rewarded): `coinsPerAd=+20`, `currencyEarnAdsPerDayMax=10`(UTC 00:00 리셋) (ADR-064).
- [MUST] 힌트 정책: `freeHintsPerDay=3`, `hintRefillPerAd=+1`, `hintRefillAdsPerDayMax=5`(UTC 00:00 리셋) (ADR-063, 15.7).
- [MUST] 코인 IAP(소모성) SKU(MVP): productId=`sudoku.coins.pack1`, 제공량=`+500 coins`, 기준 가격(USD)=`1.99` (ADR-066).
- [MUST] Journey stage 별 보상 코인(총 지급 기준): `star1Total=+5`, `star2Total=+10`, `star3Total=+20` (ADR-068).
- [MUST] `coins` 획득 경로는 아래 3개로만 고정한다:
  - Rewarded `currency_earn`(38.1.6.2)
  - IAP `sudoku.coins.pack1`(38.1.6.4)
  - Journey stage 별 보상(38.1.6.5)
- [MUST] MVP(v1.0)에서는 `coins` 사용처(spend)를 제공하지 않는다. `coins`는 `wallet`에 누적만 되며, 최초 사용처는 Post-MVP B-018(Pet 코스튬)에서 도입한다.

##### 38.1.6.2 코인 수급: Rewarded(`currency_earn`)
- [MUST] `currency_earn` CTA는 Coins Store에만 제공한다(이벤트 source=`coins_store`). Home에서는 Coins Store 진입 CTA만 제공한다.
- [MUST] Premium(`premiumEffective=true`)에서는 `currency_earn` CTA를 노출/요청 MUST NOT 한다(광고 제거 정책 유지).
- [MUST] `currency_earn`는 일일 한도를 서버가 강제한다(ADR-064).
- [MUST] 코인 보상 반영은 서버 함수 `grantRewardedCoins(uid, requestId)` 경로로만 수행한다(클라이언트 직접 증감 금지).
  - [MUST] `requestId`는 UUID v4로 생성하고 재시도 시 동일 값을 재사용한다(멱등).
  - [MUST] 서버는 `(uid, requestId)` 단위 멱등 처리를 보장해야 한다(중복 호출 허용, 중복 크레딧 금지).

##### 38.1.6.3 힌트 충전: Rewarded(`hint_refill`)
- [MUST] `hint_refill` CTA는 `hintsRemaining==0`일 때만 GameScreen Hint 게이트에서 노출한다(이벤트 source=`hint_gate`).
- [MUST] Premium(`premiumEffective=true`)에서는 `hint_refill` CTA를 노출/요청 MUST NOT 한다(힌트 무제한 + 광고 제거 정책).
- [MUST] 상세 규칙은 15.7을 단일 기준으로 한다.

##### 38.1.6.4 코인 구매(IAP)
- [MUST] 코인 구매는 Store IAP only로 고정하며, 결제/검증은 RevenueCat을 사용한다.
- [MUST] 코인 크레딧은 RevenueCat webhook 서버 경로(39.6)에서만 수행한다(클라이언트 직접 증감 금지).

##### 38.1.6.5 코인 수급: Journey stage 별 보상(3-star)
- [MUST] Journey stage 완료 보상(별/코인)은 서버 검증 함수 `verifyJourneyStage(stageId, sessionId)`로만 수행한다(39.4.3).
- [MUST] 별 보상 코인(총 지급 기준)은 아래로 고정한다(ADR-068).
  - ⭐ 1: `star1Total=+5 coins`
  - ⭐⭐ 2: `star2Total=+10 coins`
  - ⭐⭐⭐ 3: `star3Total=+20 coins`
- [MUST] 코인 지급은 stageId 기준 1회성으로만 허용한다.
  - 이미 ⭐ 1을 지급받은 stage에서 ⭐⭐ 달성 시 `+5`만 추가 지급한다.
  - 이미 ⭐⭐를 지급받은 stage에서 ⭐⭐⭐ 달성 시 `+10`만 추가 지급한다.
  - 동일/하위 별 재시도는 추가 지급하지 않는다.
- [MUST] Premium/Free 구분 없이 Journey 별 보상 코인은 동일하게 지급한다(광고 제거와 무관).
- [MUST] 별 보상 지급 이력은 wallet(server-write)에 저장하여 Reset Progress 이후에도 중복 지급 MUST NOT 한다(39.1.13).

##### 38.1.6.6 저장/리셋/삭제 정책
- [MUST] 코인 잔액은 계정 단위로 동기화되어야 하며 Firestore `/users/{uid}/wallet/meta`에 저장한다(39.1.13).
- [MUST] Reset Progress는 코인 잔액 및 코인 구매 내역을 초기화 MUST NOT 한다(구매 가치 보호).
- [MUST] Reset Progress는 Journey stage 진행도(별/완료)를 초기화하되, Journey 별 보상 코인을 재수급할 수 있어서는 안 된다(지급 이력은 wallet에 유지).
- [MUST] Delete Account 완료 시 코인 잔액 및 관련 문서는 `/users/{uid}/**` recursive delete에 포함되어야 한다.

### 38.2 기술 구현 가능성 보강

#### 38.2.1 플랫폼/워크플로우 결정 게이트
- 기본은 Expo Managed로 시작한다.
- MVP 기간에는 Expo SDK/RN 버전을 킥오프 시점 안정 버전으로 고정한다.
- `latest` 자동 추종은 금지하고, 보안/치명 버그 대응 외 major/minor 업데이트는 다음 마일스톤(v1.1+)에서만 수행한다.

##### 38.2.1.1 MVP 킥오프 버전 락 (2026-02-22)

| component | lockedVersion | note |
|---|---|---|
| Node.js | `22.11.0` | 로컬/CI 공통 |
| pnpm | `10.2.0` | lockfile 생성 도구 |
| Expo SDK | `52.0.0` | Managed 기준 |
| React Native | `0.76.3` | Expo SDK 52 baseline |
| React | `18.3.1` | Expo SDK 52 baseline |
| NativeWind | `4.1.23` | 디자인 토큰 구현 기준 |

- [MUST] 위 항목은 `package.json`/CI 런타임에서 exact 버전으로 고정한다(`^`, `~` 금지).
- [MUST] 버전 변경은 ADR 기록 후 다음 마일스톤에서만 수행한다.
- 아래 항목 중 1개라도 충족하면 Bare 전환 ADR을 생성한다:
  - 핵심 SDK가 Managed에서 불안정/미지원
  - 성능 병목을 Managed로 해소 불가
  - 네이티브 모듈 커스터마이징이 필수

#### 38.2.2 구현 가능성 체크리스트 (Sprint 0 종료 조건)
- [ ] MMKV, AdMob, RevenueCat, Firebase Auth/Firestore 실기기 동작 확인
- [ ] AdMob 콘솔에서 iOS/Android 앱 등록 및 Banner/Interstitial/Rewarded(CoinsEarn/HintRefill) Ad Unit ID 8종 생성/검증 완료(테스트 ID 미사용)
- [ ] iOS/Android 양 플랫폼에서 빌드 성공
- [ ] iOS 빌드에 `PrivacyInfo.xcprivacy` 포함 및 38.1.1.4(Required Reason API 선언 테이블) 기록값이 산출물과 일치함을 확인
- [ ] App Store Connect 업로드 시 Privacy Manifest/Required Reason API 관련 경고/거절 0건 확인
- [ ] Firestore TTL 정책(`events.expireAt`, `idempotencyEvents.expireAt`, `resetProgressRequests.expireAt`, `rewardedCoinsGrants.expireAt`) 설정 완료 및 dev/staging에서 샘플 문서 TTL 삭제 동작 확인
- [ ] 의존성 lockfile 커밋 및 고정 설치(`--frozen-lockfile` 또는 동등 옵션) 확인
- [ ] `package.json` 버전이 38.2.1.1 버전 락 표와 일치함을 확인
- [ ] 릴리즈 빌드에서 source map 업로드 성공
- [ ] Sentry prod retention이 `90일 이하`로 설정됨을 확인(36.1, 38.1.1.1)
- [ ] 고객 지원 문의 채널(mailbox/form) 보존 정책이 `180일 이하`로 설정됨을 확인(38.1.3, 38.1.1.1)
- [ ] 오프라인 시작/재시작/복구 플로우 확인
- [ ] RevenueCat 콘솔 체크리스트(38.2.5) 완료

#### 38.2.3 환경 분리 규칙
- 프로젝트 환경은 최소 `dev`, `staging`, `prod` 3개로 분리한다.
- 환경별로 다음 키를 분리한다:
  - Firebase projectId
  - Ad unit id
  - RevenueCat public SDK key (`REVENUECAT_PUBLIC_API_KEY`)
  - RevenueCat server API key (`RC_API_KEY_SERVER`)
  - RevenueCat webhook secret (`RC_WEBHOOK_SECRET`)
  - Sentry DSN
- [MUST] `RC_API_KEY_SERVER`, `RC_WEBHOOK_SECRET`는 서버 Secret Manager에서만 읽고 클라이언트 번들/OTA에 포함하지 않는다.
- 환경 혼용 배포를 막기 위해 앱 시작 시 환경 배지를 내부 빌드에서 노출한다.

#### 38.2.4 런타임 지원 매트릭스 (MVP 고정)
- iOS 최소 지원: `15.0`
- Android 최소 지원: `API 26`
- [MUST] 최소 지원 버전 미만에서는 설치/실행을 지원하지 않는다.
- [MUST] 기준기기(33.3)는 최소 지원 매트릭스와 모순되지 않아야 한다.

#### 38.2.5 RevenueCat 콘솔 잠금 체크리스트 (MVP)
- [MUST] 환경은 `dev`/`staging`/`prod` 프로젝트로 분리 운영한다.
- [MUST] Entitlement를 `premium` 단일 키로 생성한다.
- [MUST] Product는 아래 2개로 고정한다(iOS/Android 공통 id).
  - Premium(영구): `sudoku.premium.lifetime`
  - Coins Pack1(소모성): `sudoku.coins.pack1`
- [MUST] `premium` entitlement에 `sudoku.premium.lifetime`를 연결한다(Coins Pack은 entitlement 연결하지 않음).
- [MUST] Offering은 `default` 1개만 운영하고 Premium 패키지는 `$rc_lifetime` 1개만 노출한다.
- [MUST] Coins Pack은 Offering 노출을 요구하지 않으며, productId 기반 구매로만 호출해도 된다(38.1.2.2).
- [MUST] 앱은 결제 호출 전 `logIn(firebaseUid)`를 완료해야 한다(익명 appUserId 결제 금지).
- [MUST] 가격 티어는 아래 2개를 양 스토어에서 동일 단계로 설정한다.
  - Premium: USD `3.99`
  - Coins Pack1: USD `1.99`
- [MUST] Webhook endpoint를 서버 검증 경로(39.6)로 연결한다.
- [MUST] Webhook 인증 시크릿(`RC_WEBHOOK_SECRET`)을 설정하고 서버에서 검증한다.
- [MUST] Sandbox 테스트 계정을 iOS/Android 각각 최소 2개 준비한다.
- [MUST] 아래 시나리오를 출시 전 통과한다:
  - 신규 구매 성공
  - 구매 취소
  - 복원 성공/실패
  - 환불 또는 취소 반영(revoked)
  - pending 후 승인/실패 전환
  - Coins Pack 신규 구매 성공(코인 크레딧 반영 확인)

#### 38.2.6 자동 테스트 매트릭스 (RN 기본 + Web 보조)
- [MUST] MVP 자동 테스트 기본 조합을 `ESLint + Jest + @testing-library/react-native + Maestro`로 고정한다.
- [MUST] `Detox`는 v1.1+ CI hardening 보조 옵션으로만 허용한다(MVP 필수 아님).
- [MAY] Expo Web/React Native Web entry가 있는 경우 `Playwright` 웹 스모크를 운영할 수 있다.
- [MUST] 웹 스모크 미구축 자체는 릴리즈 차단 사유가 아니다.
- [MUST] PR 게이트는 `lint + unit/component` 통과를 요구한다.
- [MUST] Release Candidate 게이트는 다음 2가지를 모두 통과해야 한다.
  - iOS/Android Native E2E 핵심 플로우(게임 루프, autosave/continue, sync retry, paywall 진입)
  - RevenueCat 샌드박스 시나리오(38.2.5)
- [MUST] 아래 항목은 웹 테스트 통과로 대체할 수 없다.
  - AdMob/ATT 동의 및 광고 요청 경로
  - RevenueCat 구매/복원/환불/보류 상태 전이
  - iOS 스와이프 백/Android 하드웨어 백 동작
  - 앱 background/foreground 복귀 및 orientation 관련 상태 보존
- [SHOULD] 릴리즈 후보마다 실기기 수동 스모크 1회(Home->Game->Complete->Paywall->Settings > Data)를 수행한다.

#### 38.2.6.1 CI 명령어 계약 (MVP 고정)
- [MUST] CI/로컬 검증은 npm script(`pnpm run <script>`) 경로로만 실행한다(직접 CLI 호출 금지).
- [MUST] `package.json`에 아래 스크립트를 동일 키로 제공한다.
  - `lint`: ESLint strict(`--max-warnings=0`)
  - `test:unit`: Jest CI 프로필(unit/component)
  - `test:e2e:ios`: Maestro iOS 핵심 플로우
  - `test:e2e:android`: Maestro Android 핵심 플로우
  - `test:purchase:sandbox`: 구매/복원/환불/pending 전이 검증 플로우
  - `test:web:smoke` (optional): Expo Web/React Native Web entry가 있을 때만 제공
- [MUST] PR 게이트 명령어는 순서 고정:
  1) `pnpm run lint`
  2) `pnpm run test:unit`
- [MUST] Release Candidate 게이트 명령어는 순서 고정:
  1) `pnpm run lint`
  2) `pnpm run test:unit`
  3) `pnpm run test:e2e:ios`
  4) `pnpm run test:e2e:android`
  5) `pnpm run test:purchase:sandbox`
  6) `pnpm run test:web:smoke` (web entry가 있을 때만)
- [MUST] 위 명령 중 하나라도 실패(exit code != 0)하면 릴리즈를 차단한다.
- [MUST] 선택 실행/재시도는 가능하지만 최종 승격 전 전체 순서 1회 통과 로그를 남겨야 한다.

### 38.3 UX 일관성 보강

#### 38.3.1 전역 상태 우선순위 (화면 충돌 방지)
- 우선순위: `FatalError > MergeConflictModal > PauseModal > HintOverlay > NormalHUD`
- 상위 상태가 활성화되면 하위 입력은 차단한다.
- 복귀 시 직전 포커스(선택 셀/선택 숫자)를 복원한다.

#### 38.3.2 용어/라벨 사전 (UI 일관성)
- `Hint`: 힌트 요청
- `Guide Hint`: 하이라이트 중심 안내형 힌트
- `Notes`와 `Pencil`은 문서/앱에서 하나로 통일 (`Pencil`)
- 동일 액션은 모든 화면에서 동일 라벨을 사용:
  - `Retry`, `Resume`, `Quit`, `Restore Purchases`

#### 38.3.3 피드백 정책
- 성공 피드백은 최대 1개 레이어(진동 또는 토스트)만 사용한다.
- 오류 피드백은 코드 없이 사용자 문장으로 노출한다.
- 동일 토스트는 60초 내 중복 노출 금지(32.3과 정합).

### 38.4 성능 리스크 보강

#### 38.4.1 리스크 레지스터 (MVP)
| riskId | trigger | threshold | mitigation | owner |
|---|---|---|---|---|
| PERF-01 | 셀 입력 지연 | p95 > 50ms | selector 최적화 + 파생 상태 캐시 | FE |
| PERF-02 | 과리렌더 | 입력 1회 렌더 상한 초과 | props 축소 + memo 경계 재설정 | FE |
| PERF-03 | generator 지연 | 평균 > 1200ms | 캐시 우선 로드 + 포그라운드 idle 프리생성 | Engine |
| PERF-04 | 힌트 timeout 증가 | timeout 비율 > 2% | 탐색 depth 제한 + fallback 힌트 | Engine |

#### 38.4.2 성능 게이트 운영
- 주간 성능 리포트 1회 생성(핵심 지표 5개: 입력 지연, fps, freeze, timeout, crash-free).
- 2주 연속 임계값 위반 시 성능 전용 스프린트를 우선 배정한다.
- 임계값 위반 기능은 기본 OFF 플래그로 출시 가능하나, ADR 기록이 필수다.

### 38.5 확장성 보강

#### 38.5.1 Firestore 스키마/인덱스 운영
- 모든 문서에 `updatedAt`(server timestamp)을 필수로 둔다.
- 쿼리 패턴이 2회 이상 반복되면 인덱스를 명시적으로 생성한다.
- 세션 문서는 일괄 업로드 시 chunk(예: 20개) 단위로 분할해 쓰기 제한을 회피한다.

#### 38.5.2 멱등성/중복 방지
- `sessionId`, `eventId`는 클라이언트에서 UUID로 생성한다.
- 서버 업로드는 `eventId` 기준 멱등 처리한다(중복 push 허용, 중복 반영 금지).
- [MUST] 재시도 큐는 FIFO를 유지하고 최대 보관 기간을 7일로 고정한다.

#### 38.5.3 데이터 보존/마이그레이션
- 스키마 변경 시 `schemaVersion`을 증가시키고 마이그레이션 함수를 추가한다.
- 하위 호환 불가 변경은 앱 실행 시 차단하지 말고, 백그라운드 변환 후 안내한다.
- 세션 원본 삭제 정책은 집계 완료 확인 후에만 수행한다.

#### 38.5.4 Feature Flag 운영 규칙
- [MUST] 신규 확장 기능(v1.1+)은 원칙적으로 remote flag로 게이트한다.
- [MUST] 모든 flag는 `owner`, `createdAt`, `expireAt`, `removeByVersion` 메타를 포함한다.
- [MUST] 만료된 flag는 다음 마이너 릴리즈에서 제거한다(영구 flag 금지).
- [MUST] flag 기본값은 `off`로 시작하고, 단계적 rollout 비율을 기록한다.

### 38.6 추상 표현 정리 규칙

#### 38.6.1 문장 강도 레벨
- `MUST`: 구현 필수
- `SHOULD`: 특별한 사유 없으면 준수
- `MAY`: 선택 사항

#### 38.6.2 문서 작성 규칙
- “추후 설정”, “필요 시” 문구는 단독으로 쓰지 않는다.
- 모든 정책 문장은 최소 1개 이상 포함해야 한다:
  - 기본값
  - 임계값(수치)
  - 실패 시 동작
  - 측정 방법
- 추상 문구 발견 시 26장 Open Questions에 등록 후 ADR로 처리한다.

---

## 39. 데이터 계약 상세 (Firestore + Event)

> 목적: 동기화/분석에서 타입 불일치와 중복 반영을 방지하기 위해 필드 계약을 고정한다.

### 39.1 Firestore 문서 스키마 (MVP)

#### 39.1.1 `/users/{uid}/profile/meta`
| field | type | required | default | note |
|---|---|---|---|---|
| uid | string | yes | - | Auth uid와 동일 |
| createdAt | timestamp | yes | serverTimestamp | 계정 생성 시점 |
| updatedAt | timestamp | yes | serverTimestamp | 모든 업데이트 시 갱신 |
| premium | boolean | yes | false | 캐시/검증 결과 반영(서버 검증 경로만 write) |
| onboardingCompleted | boolean | yes | false | 온보딩 완료 여부 |
| onboardingPreset | string enum | no | `classic` | `classic` \| `speed` |
| deleteRequestedAt | timestamp | no | null | 계정 삭제 요청 시점 |

#### 39.1.2 `/users/{uid}/settings/meta`
| field | type | required | default | note |
|---|---|---|---|---|
| schemaVersion | number | yes | 1 | 설정 스키마 버전 |
| values | map<string, any> | yes | `{}` | 20장 키-값 저장 |
| updatedAt | timestamp | yes | serverTimestamp | 충돌 해결 기준 |
- [MUST] `settings/meta.values`에는 20.2.1~20.2.7의 사용자 설정 키만 포함한다.
- [MUST NOT] 20.2.9 Consent Runtime Keys(`adConsentStatus`, `adConsentRegion`, `adConsentUpdatedAt`, `attStatus`)는 `settings/meta.values`에 저장/동기화 MUST NOT.

#### 39.1.3 `/users/{uid}/statsAggregate/meta`
| field | type | required | default | note |
|---|---|---|---|---|
| totalGames | number | yes | 0 | 합산 |
| completedGames | number | yes | 0 | 합산 |
| bestTimeByDifficulty | map<string, number> | yes | `{}` | min merge |
| avgTimeByDifficulty | map<string, number> | yes | `{}` | recent 200 sessions 재계산(canonical) + 캐시 |
| updatedAt | timestamp | yes | serverTimestamp | 최신 기준 |
- [MUST] 난이도별 평균/중앙값/평균 실수/평균 힌트는 최근 200개 completed sessions를 기반으로 클라이언트에서 계산한다.
- [MUST] 난이도별 completed sessions가 5개 미만이면 해당 지표는 `-`로 표시한다.
- [SHOULD] 계산 결과는 `localStats` 캐시에 저장하고 sessions 변경 시에만 재계산한다.
- [MUST] `avgTimeByDifficulty`는 재계산 결과를 기준으로 갱신하고, 가중 평균은 보조 최적화로만 사용한다.

#### 39.1.4 `/users/{uid}/sessions/{sessionId}`
| field | type | required | default | note |
|---|---|---|---|---|
| sessionId | string | yes | UUID v4 | 문서 ID와 동일 |
| puzzleId | string | yes | - | |
| generatorVersion | number | yes | 1 | 생성기 버전(정수) |
| difficulty | string enum | yes | - | `easy`~`evil` |
| durationMs | number | yes | 0 | ms 단위 |
| mistakes | number | yes | 0 | |
| hintsUsed | number | yes | 0 | |
| difficultyScore | number | yes | 0 | 난이도 신뢰 검증용 점수 |
| maxTechniqueUsed | string | no | null | 세션 내 최고 난이도 기술명 |
| completed | boolean | yes | false | |
| startedAt | timestamp | yes | serverTimestamp | |
| endedAt | timestamp | no | null | |
| updatedAt | timestamp | yes | serverTimestamp | |

#### 39.1.5 `/users/{uid}/events/{eventId}`
| field | type | required | default | note |
|---|---|---|---|---|
| eventId | string | yes | UUID v4 | 멱등 처리 키 |
| eventName | string | yes | - | 23장 이벤트명 |
| eventSchemaVersion | number | yes | 1 | 이벤트 스키마 버전 |
| appSessionId | string | yes | UUID v4 | `app_open` 단위 세션 ID |
| payload | map<string, any> | yes | `{}` | 이벤트별 속성 |
| timestamp | timestamp | yes | serverTimestamp | 발생 시각 |
| clientTimestampMs | number | yes | - | 클라이언트 발생 시각(epoch ms). 오프라인 업로드에서도 실제 발생 시각 분석에 사용 |
| expireAt | timestamp | yes | `timestamp + 90d` | TTL 삭제 기준(보존 90일) |
| appVersion | string | yes | - | |
| generatorVersion | number | yes | 1 | |
- [MUST] `timestamp`는 serverTimestamp를 유지하고, `clientTimestampMs`는 이벤트 발생 시각(epoch ms, `Date.now()`)으로 기록한다.

#### 39.1.6 `/deletionRequests/{uid}`
| field | type | required | default | note |
|---|---|---|---|---|
| uid | string | yes | - | 요청자 uid(문서 ID와 동일, 클라이언트 create 시 고정) |
| requestedAt | timestamp | yes | serverTimestamp | 삭제 요청 시각(클라이언트 create 시 1회만 설정) |
| status | string enum | yes | `requested` | `requested` \| `processing` \| `done` \| `failed` (클라이언트는 create 시 `requested`만 허용, 이후 서버 전용) |
| processingStartedAt | timestamp | no | null | `processing` 전이 시각(지연 임계값 계산 기준, 서버 전용 write) |
| deletedAt | timestamp | no | null | 영구 삭제 완료 시각(서버 전용 write) |
| retryCount | number | yes | 0 | 실패 재시도 횟수(서버 전용 write) |
| updatedAt | timestamp | yes | serverTimestamp | 상태 갱신 시각(서버 전용 write) |
- [MUST] timeout/실패 사유는 `/deletionRequests/{uid}`에 저장하지 않고 `account_delete_failed.reason` 이벤트로만 기록한다.

#### 39.1.7 `/users/{uid}/purchases/{purchaseId}`
| field | type | required | default | note |
|---|---|---|---|---|
| purchaseId | string | yes | - | 문서 ID와 동일(스토어 트랜잭션 기준 해시) |
| uid | string | yes | - | 소유자 uid |
| platform | string enum | yes | - | `ios` \| `android` |
| productId | string | yes | - | `sudoku.premium.lifetime` \| `sudoku.coins.pack1` |
| entitlementId | string | no | null | RevenueCat entitlement(premium 구매에서만) |
| state | string enum | yes | `pending` | `purchased` \| `restored` \| `cancelled` \| `failed` \| `revoked` \| `pending` |
| isPremiumActive | boolean | yes | false | 권한 활성 여부(premium 구매에서만 의미 있음) |
| coinsDelta | number | no | null | 코인 구매/환불 시 반영된 코인 증감량(예: `+500`, `-500`) |
| source | string enum | yes | `purchase` | `purchase` \| `restore` \| `server_sync` |
| priceUsd | number | yes | - | 기준 가격(USD, productId별 상이) |
| storeCurrency | string | no | null | 스토어 통화 코드(예: USD, KRW) |
| purchasedAt | timestamp | no | null | 최초 구매 시각 |
| restoredAt | timestamp | no | null | 복원 시각 |
| revokedAt | timestamp | no | null | 환불/취소 반영 시각 |
| lastWebhookEventType | string | no | null | 마지막 반영 webhook 이벤트 타입 |
| storeTransactionIdHash | string | no | null | 스토어 트랜잭션 식별자 해시 |
| verifiedAt | timestamp | yes | serverTimestamp | 서버 검증 시각 |
| updatedAt | timestamp | yes | serverTimestamp | 상태 갱신 시각 |

#### 39.1.8 `/idempotencyEvents/{eventId}`
| field | type | required | default | note |
|---|---|---|---|---|
| eventId | string | yes | - | RevenueCat event id와 동일(문서 ID) |
| source | string enum | yes | `revenuecat_webhook` | 멱등 마커 소스 |
| eventType | string enum | yes | - | `INITIAL_PURCHASE` \| `NON_RENEWING_PURCHASE` \| `CANCELLATION` \| `REFUND` \| `TRANSFER` \| `RESTORE` |
| purchaseId | string | no | null | 관련 purchase upsert 키 |
| primaryUid | string | no | null | 비-TRANSFER 이벤트의 기준 uid |
| transferFromUid | string | no | null | TRANSFER source uid |
| transferToUid | string | no | null | TRANSFER target uid |
| status | string enum | yes | `processed` | `processed` \| `ignored` |
| ignoredReason | string enum | no | null | `account_deletion_requested` \| `account_deletion_processing` \| `account_deleted` |
| processedAt | timestamp | yes | serverTimestamp | 처리 완료 시각 |
| expireAt | timestamp | yes | `timestamp + 30d` | TTL 삭제 기준(보존 30일) |
| updatedAt | timestamp | yes | serverTimestamp | 상태 갱신 시각 |

#### 39.1.9 `/users/{uid}/currentGame/meta`
| field | type | required | default | note |
|---|---|---|---|---|
| puzzleId | string | yes | - | 진행 중 퍼즐 ID |
| mode | string enum | yes | `classic` | `classic` \| `daily` \| `journey` |
| difficulty | string enum | yes | - | `easy`~`evil` |
| seed | string | yes | - | 재현용 seed(uint64 직렬화) |
| dateUTC | string | no | null | `YYYY-MM-DD`(UTC), `mode=daily`에서만 |
| stageId | string | no | null | `j{journeyVersion}_{chapterId}_{stageIndex2}`, `mode=journey`에서만 |
| generatorVersion | number | yes | 1 | 생성기 버전(정수) |
| board | string | yes | - | 길이 81, 빈칸은 `0` |
| candidatesBitmask | array<number> | no | null | 길이 81, 각 원소 9-bit bitmask |
| elapsedMs | number | yes | 0 | 누적 플레이 시간(ms) |
| mistakes | number | yes | 0 | 누적 실수 수 |
| hintsUsed | number | yes | 0 | 누적 힌트 사용 수 |
| updatedAt | timestamp | yes | serverTimestamp | 최신 저장 시각 |
- [MUST] `currentGame.generatorVersion`은 `39.1.5`의 `events.generatorVersion`과 동일한 타입(number)으로 저장한다.
- [MUST] `solution`/`solutionHash`/정답 전체는 `currentGame`에 저장하지 않는다.
- [MUST] Undo/Redo 히스토리는 로컬에만 유지하고, 클라우드 `currentGame` 복원 시 Undo 스택은 초기화한다.

#### 39.1.10 `/users/{uid}/streak/meta`
| field | type | required | default | note |
|---|---|---|---|---|
| currentStreak | number | yes | 0 | 현재 연속 일수 |
| longestStreak | number | yes | 0 | 최고 연속 일수 |
| lastCompletedDateUTC | string | no | null | 마지막 완료 날짜(`YYYY-MM-DD`, UTC) |
| verifiedStampCount | number | yes | 0 | 검증 완료 stamp 수 |
| updatedAt | timestamp | yes | serverTimestamp | 최신 갱신 시각 |
- [MUST] `currentStreak/longestStreak/lastCompletedDateUTC`는 `verified` stamp 기준 서버 재계산으로만 갱신한다.

#### 39.1.11 `/users/{uid}/stamps/{dateUTC}`
| field | type | required | default | note |
|---|---|---|---|---|
| dateUTC | string | yes | 문서 ID | `YYYY-MM-DD`(UTC), 문서 ID와 동일 |
| status | string enum | yes | `pending` | `pending` \| `verified` \| `expired` |
| sourceSessionId | string | no | null | 검증 근거 session id |
| submittedAt | timestamp | yes | serverTimestamp | pending 등록 시각 |
| verifiedAt | timestamp | no | null | 검증 완료 시각 |
| expireAt | timestamp | no | null | pending 만료 시각(기본: +7d) |
| updatedAt | timestamp | yes | serverTimestamp | 최신 갱신 시각 |
- [MUST] 동일 `dateUTC`에는 stamp 문서 1개만 유지한다.
- [MUST] `pending` 상태가 7일을 초과하면 `expired`로 전이한다.
- [MUST] 상태 우선순위는 `verified > pending > expired`를 따른다.

#### 39.1.12 `/users/{uid}/ops/meta/resetProgressRequests/{requestId}`
| field | type | required | default | note |
|---|---|---|---|---|
| requestId | string | yes | UUID v4 | 문서 ID와 동일 |
| status | string enum | yes | `received` | `received` \| `processing` \| `done` \| `failed` |
| createdAt | timestamp | yes | serverTimestamp | 최초 수신 시각 |
| expireAt | timestamp | yes | `createdAt + 30d` | TTL 삭제 기준(보존 30일) |
| updatedAt | timestamp | yes | serverTimestamp | 최신 처리 시각 |
| lastErrorCode | string | no | null | 실패 시 표준 에러코드(32.6) |

#### 39.1.13 `/users/{uid}/wallet/meta`
| field | type | required | default | note |
|---|---|---|---|---|
| uid | string | yes | - | Auth uid와 동일 |
| schemaVersion | number | yes | 1 | wallet 스키마 버전 |
| coinsBalance | number | yes | 0 | `coins` 잔액(정수, 음수 금지) |
| currencyEarnDateUTC | string | yes | - | `YYYY-MM-DD`(UTC), 일일 한도 카운터 기준일 |
| currencyEarnAdsUsedToday | number | yes | 0 | dateUTC 기준 `currency_earn` Rewarded 반영 횟수 |
| journeyRewardedStarsByStage | map<string, number> | yes | `{}` | stageId별 “별 보상 지급 기준 bestStars”(Reset Progress 이후에도 유지; 중복 지급 방지) |
| updatedAt | timestamp | yes | serverTimestamp | 상태 갱신 시각(server-write) |
- [MUST] `/users/{uid}/wallet/meta` 문서는 서버 write 전용이다(클라이언트 직접 증감 금지).
- [MUST] `coinsBalance`는 음수로 내려갈 수 없다.
- [MUST] wallet 최초 생성 시 `currencyEarnDateUTC`는 서버 UTC 기준 오늘(`YYYY-MM-DD`)로 설정한다.

#### 39.1.14 `/users/{uid}/ops/meta/rewardedCoinsGrants/{requestId}`
| field | type | required | default | note |
|---|---|---|---|---|
| requestId | string | yes | UUID v4 | 문서 ID와 동일(멱등 키) |
| dateUTC | string | yes | - | `YYYY-MM-DD`(UTC), 일일 한도 카운터 기준일 |
| coinsDelta | number | yes | 20 | `currency_earn` 1회 크레딧(+20) |
| createdAt | timestamp | yes | serverTimestamp | 최초 수신 시각 |
| expireAt | timestamp | yes | `createdAt + 30d` | TTL 삭제 기준(보존 30일) |

#### 39.1.15 `/users/{uid}/journeyStages/{stageId}`
| field | type | required | default | note |
|---|---|---|---|---|
| stageId | string | yes | 문서 ID | `j{journeyVersion}_{chapterId}_{stageIndex2}` 문서 ID와 동일 |
| bestStars | number | yes | 0 | `0..3` (0=미클리어) |
| bestDurationMs | number | no | null | bestStars를 달성한 플레이 시간(ms) |
| sourceSessionId | string | no | null | bestStars의 근거 sessionId |
| updatedAt | timestamp | yes | serverTimestamp | 최신 갱신 시각(server-write) |

### 39.2 인덱스/쿼리 규칙
- 필수 인덱스:
  - `sessions`: `updatedAt desc`
  - `sessions`: `difficulty asc, endedAt desc`
  - `events`: `eventName asc, timestamp desc`
  - `purchases`: `updatedAt desc`
  - `purchases`: `state asc, updatedAt desc`
  - `stamps`: `updatedAt desc`
  - `idempotencyEvents`: `processedAt desc`
- TTL 규칙:
  - `events.expireAt`: 보존 90일
  - `idempotencyEvents.expireAt`: 보존 30일
  - `resetProgressRequests.expireAt`: 보존 30일
  - `rewardedCoinsGrants.expireAt`: 보존 30일
- [MUST] Firestore TTL 정책은 `events.expireAt`, `idempotencyEvents.expireAt`, `resetProgressRequests.expireAt`, `rewardedCoinsGrants.expireAt` 필드에 대해 활성화해야 한다(TTL 미활성 상태 릴리즈 금지).
- 쿼리 페이지네이션은 `updatedAt` 커서 기반으로 통일한다.
- 이벤트 업로드는 배치 20건 단위로 제한한다.

### 39.3 보안 규칙 (기본)
- 기본 규칙: `/users/{uid}/**` 경로는 `request.auth.uid == uid`일 때만 접근을 허용한다.
- 예외 규칙: 아래 경로/필드는 서버 검증 경로만 write를 허용한다.
- 서버 타임스탬프 필드(`updatedAt`, `timestamp`)는 클라이언트 임의 문자열/숫자 입력 금지.
- leaderboard write는 서버 검증 경로(Cloud Functions) 도입 전까지 MVP에서 비활성.
- 계정 삭제는 `/deletionRequests/{uid}` 생성으로만 요청하고, 실제 사용자 데이터 삭제는 서버 작업으로만 수행한다.
- 클라이언트는 타 사용자 `deletionRequests` 문서 read/write를 수행할 수 없다.
- `/deletionRequests/{uid}`는 클라이언트 `create`만 허용한다(조건: `request.auth.uid == uid`, `resource == null`, `request.resource.data.uid == uid`).
- `/deletionRequests/{uid}` read는 본인(`request.auth.uid == uid`)에 한해 허용한다(read-back 검증 경로).
- 클라이언트 `create` payload는 `uid`, `requestedAt`, `status=requested`만 허용하고 `processingStartedAt`, `deletedAt`, `retryCount`, `updatedAt` 설정을 금지한다.
- `/deletionRequests/{uid}`의 `update`/`delete`는 서버 계정(Cloud Functions/Admin SDK)만 허용한다.
- [MUST] `/deletionRequests/{uid}` 문서가 존재하고 `status`가 `requested|processing|done`인 경우, 클라이언트의 `/users/{uid}/**` write를 전부 거부한다(설정/세션/이벤트/currentGame 포함).
- 삭제 요청 상태 전이(`requested -> processing -> done|failed`)는 서버 경로에서만 수행한다.
- 삭제 재시도는 서버 함수 `retryDeletionRequest(uid)` 경로만 허용한다.
  - 호출 조건: `request.auth.uid == uid`, 현재 상태가 `failed`
  - 수행 동작: `status=requested`, `processingStartedAt=null`, `retryCount += 1`, `updatedAt=serverTimestamp`
  - [MUST NOT] 클라이언트가 `/deletionRequests/{uid}`를 삭제 후 재생성하는 우회 경로를 허용하지 않는다.
- `/users/{uid}/profile/meta` 문서의 `premium` 필드는 클라이언트 write를 금지하고 서버 검증 경로(RevenueCat webhook/Cloud Functions)에서만 갱신한다.
- `/users/{uid}/purchases/{purchaseId}`는 클라이언트 read-only로 두고, 상태 write는 서버 검증 경로(RevenueCat webhook/Cloud Functions)로만 수행한다.
- `/users/{uid}/wallet/meta`는 클라이언트 read-only로 두고, 잔액/카운터 write는 서버 경로(Rewarded 크레딧/RevenueCat webhook)에서만 수행한다.
- `/users/{uid}/currentGame/meta` 문서는 클라이언트 write를 허용하되 `solution`, `solutionHash`, 정답 전체 필드 write를 금지한다.
- `/users/{uid}/journeyStages/{stageId}`는 클라이언트 read-only로 두고, 진행도(bestStars) write는 서버 검증 함수 `verifyJourneyStage`로만 수행한다.
- `/users/{uid}/streak/meta` 문서는 클라이언트 read-only로 두고, 집계 필드 write는 서버 검증 경로에서만 수행한다.
- `/users/{uid}/stamps/{dateUTC}`는 클라이언트 read-only를 기본으로 하며, `verified/expired` 상태 전이는 서버 검증 경로에서만 수행한다.
- `/users/{uid}/ops/meta/resetProgressRequests/{requestId}`는 클라이언트 read/write를 금지하고 서버 함수 계정만 접근한다.
- `/users/{uid}/ops/meta/rewardedCoinsGrants/{requestId}`는 클라이언트 read/write를 금지하고 서버 함수 계정만 접근한다.
- `/idempotencyEvents/{eventId}`는 클라이언트 read/write 모두 금지하고 서버 함수 계정만 접근한다.
- 서버 검증 경로에서도 `/deletionRequests/{uid}`가 `requested|processing|done`인 uid의 purchase/profile write를 금지하고 idempotency ignored 처리만 허용한다.

### 39.4 멱등성 계약
- `eventId`, `sessionId`는 클라이언트가 생성하고 재시도 시 동일 ID를 재사용한다.
- `resetUserProgress(uid, requestId)`의 `requestId`는 UUID v4로 생성하고 재시도 시 동일 값을 재사용한다.
- `grantRewardedCoins(uid, requestId)`의 `requestId`는 UUID v4로 생성하고 재시도 시 동일 값을 재사용한다.
- [MUST] 클라이언트는 resetProgress `requestId`를 `resetProgressRequestId`로 영속 저장하여 앱 재시작 후에도 동일 값 재사용을 보장한다.
- [MUST] Reset Progress 서버 함수명은 `resetUserProgress`로 고정한다. `resetProgress` 함수는 존재 MUST NOT 한다.
- 업로드 API는 동일 ID 재수신 시 upsert(중복 생성 금지)해야 한다.
- 재시도 큐는 FIFO + 최대 7일 보관 후 만료 삭제한다.
- events 보존 기간은 `90일`로 고정하며, `expireAt` 기준 TTL 삭제를 적용한다.
- `purchaseId`는 동일 스토어 트랜잭션에서 재생성하지 않고 upsert 키로 재사용한다.
- RevenueCat webhook 멱등 마커는 `/idempotencyEvents/{eventId}` upsert로 처리하고 `30일` TTL 삭제를 적용한다.
- 서버는 `(uid, requestId)` 단위 reset 멱등 처리를 위해 `/users/{uid}/ops/meta/resetProgressRequests/{requestId}`를 upsert해야 한다(중복 호출 허용, 중복 처리/부분 실패 MUST NOT).
- 서버는 `(uid, requestId)` 단위 `currency_earn` 멱등 처리를 위해 `/users/{uid}/ops/meta/rewardedCoinsGrants/{requestId}` upsert를 수행해야 한다(중복 호출 허용, 중복 크레딧 MUST NOT).

### 39.4.1 Daily Stamp/Streak 서버 검증 계약 (MVP)
- [MUST] `/users/{uid}/stamps`, `/users/{uid}/streak/meta` write는 서버 함수 `verifyDailyStamp`로만 수행한다(클라이언트 직접 write 금지).
- [MUST] `verifyDailyStamp` 입력은 `dateUTC(YYYY-MM-DD)`, `sessionId`로 고정한다.
- [MUST] `verifyDailyStamp`는 `(uid, dateUTC)` 단위 멱등 upsert를 수행한다(중복 호출 허용, 중복 반영 금지).
- [MUST] 서버 검증 규칙:
  - 인증 `uid`가 존재해야 한다.
  - `dateUTC`는 서버 UTC 기준 오늘 포함 과거 7일 범위여야 한다(범위 밖은 `stamps/{dateUTC}.status=expired`로 upsert).
  - `/users/{uid}/sessions/{sessionId}`가 존재하고 `completed=true`여야 한다.
  - session의 `puzzleId`는 해당 `dateUTC`의 Daily puzzleId 규칙(18.1, 18.2.1; seed 계산에 `session.generatorVersion` 사용)과 정합해야 한다.
- [MUST] 검증 성공 시 `/users/{uid}/stamps/{dateUTC}`를 `status=verified`로 upsert하고 `verifiedAt=serverTimestamp`, `sourceSessionId=sessionId`를 기록한다.
- [MUST] 검증 성공 시 `/users/{uid}/streak/meta`는 `verified` stamps 기준 서버 재계산으로 갱신한다.

### 39.4.2 Rewarded `currency_earn` 코인 크레딧 서버 계약 (MVP)
- [MUST] 코인 크레딧은 서버 함수 `grantRewardedCoins(uid, requestId)`로만 수행한다(클라이언트 직접 wallet write 금지).
- [MUST] 입력은 `requestId(UUID v4)`만을 최소 계약으로 사용한다(추가 파라미터 도입 시 ADR 필요).
- [MUST] 서버는 아래 검증을 수행해야 한다.
  - 인증 uid가 존재해야 한다.
  - `/deletionRequests/{uid}`가 `requested|processing|done`이면 NO_OP(ignored) 처리한다.
  - `/users/{uid}/profile/meta.premium=true`이면 크레딧을 거부한다(Premium은 광고 제거 정책 유지).
  - 서버 UTC 기준 `dateUTC=YYYY-MM-DD`를 계산하고, wallet의 `currencyEarnDateUTC`가 다르면 `currencyEarnAdsUsedToday=0`으로 리셋 후 dateUTC를 갱신한다.
  - `currencyEarnAdsUsedToday < 10`(ADR-064)일 때만 크레딧을 허용한다.
- [MUST] 크레딧 허용 시 서버는 단일 트랜잭션으로 아래를 수행한다.
  - `/users/{uid}/ops/meta/rewardedCoinsGrants/{requestId}` upsert(멱등 마커)
  - [MUST] `/users/{uid}/wallet/meta`가 존재하지 않으면 동일 트랜잭션 내에서 기본값으로 생성한 후 delta를 반영한다(예: `schemaVersion=1`, `coinsBalance=0`, `currencyEarnDateUTC=todayUTC`, `currencyEarnAdsUsedToday=0`, `journeyRewardedStarsByStage={}`).
  - `/users/{uid}/wallet/meta.coinsBalance += 20`, `currencyEarnAdsUsedToday += 1`, `currencyEarnDateUTC=dateUTC`, `updatedAt=serverTimestamp`
- [MUST] 일일 한도 초과 시 wallet/purchases 어떤 write도 수행 MUST NOT 하며, 표준 에러코드(32.6)로 실패를 반환한다(예: `COINS_DAILY_CAP_REACHED`).

### 39.4.3 Journey Stage 서버 검증 계약 (MVP)
- [MUST] Journey stage 완료 검증 + 별 산출 + 별 보상 코인 크레딧은 서버 함수 `verifyJourneyStage(stageId, sessionId)`로만 수행한다(클라이언트 직접 지급/진행도 write 금지).
- [MUST] 입력은 `stageId`, `sessionId`만을 최소 계약으로 사용한다(추가 파라미터 도입 시 ADR 필요).
- [MUST] 서버는 아래 검증을 수행해야 한다.
  - 인증 uid가 존재해야 한다.
  - `/deletionRequests/{uid}`가 `requested|processing|done`이면 NO_OP(ignored) 처리한다.
  - `stageId`가 18.1의 Journey 규칙(`j{journeyVersion}_{chapterId}_{stageIndex2}`)과 정합해야 한다.
  - `/users/{uid}/sessions/{sessionId}`가 존재하고 `completed=true`여야 한다.
  - session의 `difficulty`는 `chapterId(=difficulty)`와 정합해야 한다.
  - session의 `puzzleId`는 `stageId`로부터 계산되는 Journey puzzleId(18.1, 18.2; seed 계산에 `session.generatorVersion` 사용)와 정합해야 한다.
- [MUST] 별(stars) 산출 규칙:
  - 기본: 완료 시 ⭐ 1
  - ⭐⭐ 2: `hintsUsed==0` AND `durationMs <= softLimitMs`
  - ⭐⭐⭐ 3: `hintsUsed==0` AND `durationMs <= hardLimitMs`
  - 제한 시간(soft/hard)은 21.11을 단일 기준으로 사용한다.
- [MUST] 검증 성공 시 서버는 단일 트랜잭션으로 아래를 수행한다.
  - `/users/{uid}/journeyStages/{stageId}.bestStars = max(existingBestStars, stars)` upsert
  - bestStars가 갱신된 경우 `bestDurationMs=session.durationMs`, `sourceSessionId=sessionId`를 갱신한다.
  - 별 보상 코인 크레딧은 wallet의 `journeyRewardedStarsByStage[stageId]`를 기준으로 delta 지급만 허용한다(38.1.6.5).
    - 예: 기존 rewardedStars=1에서 이번 stars=2면 `+5`만 지급, 기존 rewardedStars=2에서 stars=3이면 `+10`만 지급.
  - wallet `/users/{uid}/wallet/meta`가 존재하지 않으면 동일 트랜잭션 내에서 기본값으로 생성한 후 delta를 반영한다(예: `schemaVersion=1`, `coinsBalance=0`, `currencyEarnDateUTC=todayUTC`, `currencyEarnAdsUsedToday=0`, `journeyRewardedStarsByStage={}`).
  - wallet `coinsBalance += coinsDelta`, `journeyRewardedStarsByStage[stageId]=max(prevRewardedStars, stars)`, `updatedAt=serverTimestamp`
- [MUST] 본 함수는 동일 stageId/sessionId 재시도 호출에도 중복 크레딧 MUST NOT 하며, delta 계산 + 트랜잭션으로 멱등성을 보장해야 한다.
- [MUST] 응답 계약(고정):
  - 성공: `{ status: "done", stageId, stars: 1|2|3, coinsDelta: number, bestStars: 0|1|2|3 }`
  - NO_OP(삭제 가드): `{ status: "ignored", stageId, reason: "DELETION_GUARD_NO_OP" }`
  - 실패: `{ status: "failed", stageId, errorCode: string, retriable: boolean }`
    - [MUST] `errorCode`는 32.6 포맷을 따라야 한다.
    - [MUST] `retriable=true`는 네트워크/일시적 장애에 한정한다.
    - [MUST] `retriable=false`는 입력/세션/정합성 검증 실패로 간주하며, 서버는 wallet/journeyStages를 변경 MUST NOT 한다.

### 39.5 Daily Leaderboard 서버 검증 계약 (v1.1 planned)

- 적용 조건:
  - [MUST] `ff_daily_leaderboard=true`일 때만 write/read 경로를 활성화한다.
  - [MUST] 플래그 OFF에서는 leaderboard 관련 UI/쓰기 호출을 비활성화한다.

- 쓰기 경로:
  - [MUST] 클라이언트 직접 Firestore write를 금지하고 서버 함수(`submitDailyResult`)만 허용한다.
  - [MUST] 요청 필수값: `dateUTC`, `puzzleId`, `durationMs`, `mistakes`, `hintsUsed`, `sessionId`.

- 서버 검증 규칙:
  - [MUST] 인증 uid와 제출 uid가 동일해야 한다.
  - [MUST] `dateUTC`는 서버 UTC 날짜와 일치해야 한다.
  - [MUST] `durationMs` 범위는 `30000 ~ 21600000`(30초~6시간)로 제한한다.
  - [MUST] `mistakes`, `hintsUsed`는 `0 ~ 500` 범위로 제한한다.
  - [MUST] `sessionId`가 `/users/{uid}/sessions/{sessionId}`에 존재하고 `completed=true`여야 한다.
  - [MUST] session의 `puzzleId`, `durationMs`가 제출값과 정합해야 한다(허용 오차 ±3000ms).
  - [MUST] 1일 최대 제출 횟수는 uid당 5회로 제한한다.

- 랭킹 정렬 규칙:
  - [MUST] 1순위 `durationMs asc`
  - [MUST] 2순위 `hintsUsed asc`
  - [MUST] 3순위 `mistakes asc`
  - [MUST] 4순위 `submittedAt asc`

- 저장 규칙:
  - [MUST] 동일 uid/date/puzzleId 재제출은 upsert 처리한다(중복 문서 생성 금지).
  - [MUST] best 기록만 랭킹 반영하고 원본 제출은 감사 로그로 보관할 수 있다.

- 오류 코드:
  - [MUST] 검증 실패 시 `LB_VALIDATION_FAILED`
  - [MUST] 제출 제한 초과 시 `LB_RATE_LIMIT`
  - [MUST] 비활성 플래그 시 `LB_FEATURE_DISABLED`

### 39.6 RevenueCat Webhook 서버 검증 계약 (MVP)

- 엔드포인트:
  - [MUST] `POST /webhooks/revenuecat` 단일 엔드포인트를 사용한다.
  - [MUST] 공개 인터넷 직접 노출 대신 서버 게이트웨이(Cloud Functions/API Gateway) 경유로 처리한다.

- 인증/보안:
  - [MUST] 요청 인증은 `Authorization: Bearer <RC_WEBHOOK_SECRET>` 검증으로 처리한다.
  - [MUST] 인증 실패는 `401`로 즉시 종료하고 본문 처리를 금지한다.
  - [MUST] webhook 감사 로그는 Cloud Logging 전용 log bucket에만 기록하며 retention은 `7일`로 고정한다.
  - [MUST] 감사 로그에는 raw request body/headers를 그대로 기록 MUST NOT 하며, 아래 allowlist 필드만 기록한다.
    - `eventId`, `eventType`, `platform`, `productId`, `purchaseId(hash)`, `occurredAt`, `receivedAt`, `signatureVerified`, `handlerResult(httpStatus)`, `ignoredReason`(있으면)
    - `primaryUidHash`, `transferFromUidHash`, `transferToUidHash` (raw uid 저장 금지)
  - [MUST NOT] `raw_receipt`, `purchase_token`, 원문 `transaction_id`, `subscriber_attributes`, `email`, `advertisingId`, `ip` 등 민감값을 감사 로그에 기록 MUST NOT 한다.
  - [MUST] `transaction_id` 등 식별자는 해시 처리 후에만 기록한다.

- 멱등 처리:
  - [MUST] RevenueCat 이벤트 ID를 멱등 키로 사용한다.
  - [MUST] 동일 이벤트 ID 재수신 시 상태 변경 없이 `200 OK`로 종료한다.
  - [MUST] 이벤트 처리 실패는 지수 백오프로 재시도하되 최대 24시간까지만 허용한다.

- 상태 반영 규칙:
  - [MUST] webhook은 productId별로 다른 반영 경로를 사용한다.
    - Premium: productId=`sudoku.premium.lifetime`
    - Coins Pack1: productId=`sudoku.coins.pack1`
  - Premium(`sudoku.premium.lifetime`) 반영:
    - [MUST] `INITIAL_PURCHASE` 또는 `NON_RENEWING_PURCHASE` 수신 시 purchase 문서는 `state=purchased`, `isPremiumActive=true`로 반영한다.
    - [MUST] `RESTORE` 수신 시 purchase 문서는 `state=restored`, `isPremiumActive=true`로 반영한다.
    - [MUST] `CANCELLATION` 또는 `REFUND` 수신 시 purchase 문서는 `state=revoked`, `isPremiumActive=false`로 반영한다.
    - [MUST] 반영 시 `/users/{uid}/profile/meta.premium`과 `/users/{uid}/purchases/{purchaseId}`를 단일 트랜잭션으로 갱신한다(TRANSFER는 source/target을 동일 트랜잭션에 포함).
  - Coins Pack1(`sudoku.coins.pack1`) 반영:
    - [MUST] `INITIAL_PURCHASE` 또는 `NON_RENEWING_PURCHASE` 수신 시 purchase 문서는 `state=purchased`로 반영하고, wallet `/users/{uid}/wallet/meta.coinsBalance`에 `+500`을 크레딧한다.
    - [MUST] `CANCELLATION` 또는 `REFUND` 수신 시 purchase 문서는 `state=revoked`로 반영하고, wallet에 `-500`을 반영한다. 이때 `coinsBalance`는 `max(0, coinsBalance-500)`로 클램프한다(음수 금지).
    - [MUST] 클램프가 발생해도(잔액 < 500) purchase 문서는 `state=revoked`로 유지하며, 채무/추가 보정 값을 저장 MUST NOT 한다.
    - [MUST NOT] Coins Pack1에서는 entitlement/profile.premium 반영을 수행하지 않는다.
  - [MUST] 대상 uid의 `/deletionRequests/{uid}` 상태가 `requested|processing|done`이면 상태 반영을 수행하지 않는다(ignored 처리).
  - [MUST] `TRANSFER`는 Premium productId에서만 처리한다(Coins Pack1에서는 `NO_OP`).

- 검증/정합:
  - [MUST] webhook의 app user id는 Firebase uid 규칙과 정합해야 한다.
  - [MUST] productId가 `sudoku.premium.lifetime` 또는 `sudoku.coins.pack1`가 아니면 상태 반영을 거부하고 `purchase_failed` 로그만 남긴다.
  - [MUST] webhook 서버는 아래 Firestore 문서만 갱신한다.
    - Premium: `/users/{uid}/profile/meta.premium`, `/users/{uid}/purchases/{purchaseId}`
    - Coins Pack1: `/users/{uid}/wallet/meta.coinsBalance`, `/users/{uid}/purchases/{purchaseId}`
  - [MUST] `premiumLastVerifiedAt`(20.2.9)는 클라이언트가 RevenueCat 검증(getCustomerInfo) 성공 시 로컬(MMKV)에서만 갱신한다.

- 장애 대응:
  - [MUST] webhook 지연으로 Premium 반영이 10분 이상 늦어지면 `restorePurchases` 수동 경로를 안내한다.
  - [MUST] 24시간 내 webhook 처리 실패 누적 20건 이상이면 incident를 생성하고 릴리즈 차단 조건으로 승격한다.

#### 39.6.1 서버 처리 함수 체인 (구현 계약)

- [MUST] webhook 처리는 아래 순서의 함수 체인으로 고정한다.
  1) `handleRevenueCatWebhook(req, res)`
  2) `verifyWebhookAuth(headers, secret)`
  3) `parseAndNormalizeEvent(body)`
  4) `validatePurchaseEvent(normalized)`
  5) `acquireEventIdempotencyLock(eventId)`
  6) `resolveDeletionGuard(normalized)`
  7) `resolvePurchaseStateTransition(normalized, deletionGuard)`
  8) `applyPurchaseMutationInTransaction(mutationContext)`
  9) `emitPurchaseDomainEvents(transition)`
  10) `releaseIdempotencyLock(eventId)`

- [MUST] 각 함수 책임은 단일 책임으로 분리한다.
  - `verifyWebhookAuth`: 인증 헤더 검증만 수행
  - `parseAndNormalizeEvent`: 필드 정규화만 수행
  - `validatePurchaseEvent`: 스키마/productId/uid/transfer 쌍 정합만 검증
  - `resolveDeletionGuard`: deletionRequests 조회 + 삭제 경합 차단 판단만 수행
  - `resolvePurchaseStateTransition`: 상태 전이 계산만 수행(삭제 경합 시 `DELETION_GUARD_NO_OP`)
  - `applyPurchaseMutationInTransaction`: Firestore 트랜잭션 write만 수행(single uid 또는 transfer pair)
  - `emitPurchaseDomainEvents`: 23.2 이벤트 발행만 수행

#### 39.6.2 정규화 payload 계약

- 입력 payload에서 아래 정규 필드를 추출해 `NormalizedPurchaseEvent`로 변환한다.
  - `eventId` (RevenueCat event id)
  - `eventType` (`INITIAL_PURCHASE` | `NON_RENEWING_PURCHASE` | `CANCELLATION` | `REFUND` | `TRANSFER` | `RESTORE`)
  - `primaryUid` (비-TRANSFER 이벤트의 app user id, TRANSFER에서는 target uid)
  - `transferFromUid` (TRANSFER source uid, 그 외 null)
  - `transferToUid` (TRANSFER target uid, 그 외 null)
  - `productId`
  - `purchaseId` (store transaction id hash)
  - `occurredAt` (event timestamp)
  - `platform` (`ios` | `android`)
- [MUST] `purchaseId`가 비어 있으면 `eventId`를 대체 멱등 키로 사용한다.
- [MUST] `eventType != TRANSFER`이면 `primaryUid`는 필수이고 `transferFromUid`/`transferToUid`는 null이어야 한다.
- [MUST] `eventType == TRANSFER`이면 `transferFromUid`/`transferToUid`가 모두 존재하고 서로 달라야 하며 `primaryUid == transferToUid`로 정규화한다.
- [MUST] 정규화 실패는 즉시 `400`으로 종료한다.

#### 39.6.3 상태 전이 함수 규칙

- 함수: `resolvePurchaseStateTransition(normalized, deletionGuard, currentPurchaseDoc)`
- [MUST] 허용 전이만 반환하고, 허용되지 않는 전이는 `NO_OP`를 반환한다.
- [MUST] `deletionGuard.blocked=true`이면 `DELETION_GUARD_NO_OP`를 반환한다.
- 허용 전이:
  - `pending|failed|cancelled|revoked -> purchased` (`INITIAL_PURCHASE`, `NON_RENEWING_PURCHASE`)
  - `pending|failed|cancelled|revoked|purchased -> restored` (`RESTORE`)
  - `purchased|restored|pending -> revoked` (`CANCELLATION`, `REFUND`)
- [MUST] `TRANSFER`는 `TRANSFER_REEVAL` 특수 전이를 반환하고 source/target 양쪽 재평가를 지시한다.
- [MUST] `TRANSFER_REEVAL` 반환값은 `sourceUid`, `targetUid`, `sourceTransition=revoked`, `targetTransition=restored`를 포함해야 한다.

#### 39.6.4 Firestore 트랜잭션 함수 규칙

- 함수: `applyPurchaseMutationInTransaction(mutationContext)`
- [MUST] `transition == DELETION_GUARD_NO_OP`이면 아래 1개 write만 수행한다.
  - `/idempotencyEvents/{eventId}` (`status=ignored`, `ignoredReason=account_deletion_requested|account_deletion_processing|account_deleted`)
- [MUST] `transition`이 `TRANSFER_REEVAL`, `DELETION_GUARD_NO_OP`가 아니면 아래 write를 단일 트랜잭션으로 처리한다.
  - `/users/{primaryUid}/purchases/{purchaseId}`
  - `/idempotencyEvents/{eventId}` (processed marker)
  - productId별 추가 갱신(둘 중 1개만):
    - Premium(`sudoku.premium.lifetime`) -> `/users/{primaryUid}/profile/meta`의 `premium`, `updatedAt`
    - Coins Pack1(`sudoku.coins.pack1`) -> `/users/{primaryUid}/wallet/meta`의 `coinsBalance`, `updatedAt`
- [MUST] Coins Pack1 반영 시 `/users/{uid}/wallet/meta`가 존재하지 않으면 동일 트랜잭션 내에서 기본값으로 생성한 후 delta를 반영한다(예: `schemaVersion=1`, `coinsBalance=0`, `currencyEarnDateUTC=todayUTC`, `currencyEarnAdsUsedToday=0`, `journeyRewardedStarsByStage={}`).
- [MUST] `transition == TRANSFER_REEVAL`은 Premium productId에서만 허용하며, source/target 2계정을 하나의 트랜잭션으로 동시에 갱신한다.
  - `/users/{transferFromUid}/purchases/{purchaseId}` (`state=revoked`, `isPremiumActive=false`)
  - `/users/{transferFromUid}/profile/meta`의 `premium` 재계산
  - `/users/{transferToUid}/purchases/{purchaseId}` (`state=restored`, `isPremiumActive=true`)
  - `/users/{transferToUid}/profile/meta`의 `premium` 재계산
  - `/idempotencyEvents/{eventId}` (processed marker)
- [MUST] 트랜잭션 성공 전에는 이벤트 발행(`emitPurchaseDomainEvents`)을 수행하지 않는다.
- [MUST] 트랜잭션 실패 시 재시도 큐에 `eventId` 기준으로 재적재한다.

#### 39.6.5 도메인 이벤트 발행 규칙

- 함수: `emitPurchaseDomainEvents(transition)`
- 전이별 발행:
  - `purchased` -> `purchase_succeeded`
  - `restored` -> `restore_succeeded`
  - `revoked` -> `purchase_failed`(phase=`verify`)
  - `NO_OP` -> 이벤트 미발행
  - `DELETION_GUARD_NO_OP` -> 이벤트 미발행(감사 로그만 기록)
- [MUST] 사용자 배너/안내(“프리미엄이 비활성화됨”)는 productId=`sudoku.premium.lifetime`에서만 트리거한다(Coins Pack 환불은 배너 트리거 대상이 아님).
- [MUST] `purchase_started`/`purchase_cancelled`는 클라이언트 결제 플로우에서만 발행한다.
- [MUST] 서버 webhook 경로에서 `purchase_cancelled`를 임의 발행하지 않는다.

#### 39.6.6 에러 코드 매핑 (서버 내부)

| code | http | retryable | action |
|---|---|---|---|
| `RC_AUTH_INVALID` | 401 | no | 요청 폐기 + 경고 로그 |
| `RC_PAYLOAD_INVALID` | 400 | no | 요청 폐기 + 검증 로그 |
| `RC_UID_DELETION_LOCKED` | 200 | no | `idempotencyEvents`에 `ignored` 기록 후 종료 |
| `RC_EVENT_DUPLICATE` | 200 | no | 멱등 종료 |
| `RC_STATE_CONFLICT` | 409 | yes | 재시도 큐 적재 |
| `RC_DB_TX_FAILED` | 500 | yes | 지수 백오프 재시도 |


---

## 40. UX 카피 키 사전 (Copy Contract)

> 목적: 화면/상태별 카피를 키 기반으로 고정해 톤과 문구 일관성을 유지한다.

### 40.1 키 규칙
- 형식: `screen.component.intent`
- 변수는 `{name}` 형태로 표기한다.
- 키는 삭제 대신 deprecated 처리하고, 대체 키를 명시한다.

### 40.2 공통 카피 테이블 (MVP)
| key | default_ko | default_en | vars | usage |
|---|---|---|---|---|
| `app.identity.display_name` | `sudo9` | `sudo9` | - | 앱 표시명 |
| `game.quit.confirm.title` | `게임을 종료할까요?` | `Quit this game?` | - | 진행 중 종료 확인 모달 제목 |
| `game.quit.confirm.body` | `현재 진행 상황은 자동 저장됩니다.` | `Your current progress will be auto-saved.` | - | 종료 확인 모달 본문 |
| `game.complete.title` | `완료했습니다` | `Completed` | - | 완료 모달 제목 |
| `game.complete.summary` | `시간 {time}, 실수 {mistakes}, 힌트 {hints}` | `Time {time}, Mistakes {mistakes}, Hints {hints}` | `time,mistakes,hints` | 완료 요약 문구 |
| `journey.complete.next_stage.cta` | `다음 스테이지` | `Next stage` | - | Journey 완료 모달 CTA |
| `journey.complete.stage_list.cta` | `스테이지 목록` | `Stage list` | - | Journey 완료 모달 CTA |
| `journey.complete.replay.cta` | `다시 하기` | `Replay` | - | Journey 완료 모달 CTA |
| `journey.complete.reward_pending.body` | `보상은 온라인 복귀 후 반영됩니다.` | `Rewards will be applied when you're back online.` | - | Journey 완료 모달 보상 대기 안내 |
| `journey.stage.locked.body` | `{prevStageIndex2} 스테이지에서 ⭐ 1개를 획득하면 잠금이 해제됩니다.` | `Unlock by earning ⭐ 1 in stage {prevStageIndex2}.` | `prevStageIndex2` | Journey Stage List locked stage 안내 |
| `journey.pending.expired.toast` | `오프라인 기록이 오래되어 일부 Journey 보상이 반영되지 않았습니다.` | `Some Journey rewards couldn't be applied because offline data expired.` | - | retryQueue 만료로 Journey 보상 미반영 안내 |
| `hint.l0.body` | `이 칸은 {digit}로 확정됩니다.` | `This cell is determined as {digit}.` | `digit` | L0 힌트 본문 |
| `hint.l1.body` | `강조된 영역을 확인해 보세요.` | `Check the highlighted area.` | - | L1 힌트 본문 |
| `hint.not_found` | `현재 상태에서 논리 힌트를 찾을 수 없습니다.` | `No logical hint is available in the current state.` | - | 힌트 탐색 실패 |
| `hint.quota.exhausted.body` | `오늘의 힌트를 모두 사용했습니다.` | `You've used all hints for today.` | - | 힌트 잔여 0 안내 |
| `hint.refill.rewarded.cta` | `광고 보고 힌트 +1` | `Watch an ad to get +1 hint` | - | 힌트 광고 충전 CTA |
| `hint.refill.daily_cap.toast` | `오늘의 힌트 광고 충전 횟수를 모두 사용했습니다.` | `You've reached today's hint refill limit.` | - | 힌트 광고 충전 한도 초과 |
| `sync.pending.banner` | `동기화 대기 중입니다.` | `Sync is pending.` | - | sync pending 배너 |
| `sync.offline.toast` | `오프라인 모드로 전환되었습니다.` | `Switched to offline mode.` | - | 네트워크 전환 토스트 |
| `daily.pending.expired.toast` | `오프라인 기록 보관 기간이 만료되어 일부 Daily 기록이 반영되지 않았습니다.` | `Some offline Daily records expired and could not be applied.` | - | Daily pending 만료 안내 |
| `error.retry.cta` | `다시 시도` | `Retry` | - | 공통 재시도 버튼 |
| `error.close.cta` | `닫기` | `Close` | - | 공통 닫기 버튼 |
| `data.corruption.body` | `데이터 오류가 감지되어 현재 게임을 초기화합니다.` | `Data corruption was detected. The current game will be reset.` | - | 손상 복구 안내 |
| `settings.data.reset_progress` | `기록 초기화` | `Reset Progress` | - | Data 설정 액션 라벨 |
| `settings.data.clear_puzzle_cache` | `퍼즐 캐시 삭제` | `Clear Puzzle Cache` | - | Data 설정 액션 라벨 |
| `settings.data.retry_sync_now` | `동기화 다시 시도` | `Retry Sync Now` | - | Data 설정 액션 라벨 |
| `settings.data.restore_purchases` | `구매 복원` | `Restore Purchases` | - | Data 설정 액션 라벨 |
| `settings.data.open_paywall` | `프리미엄 업그레이드` | `Upgrade to Premium` | - | Data 설정 액션 라벨 |
| `settings.data.open_privacy_policy` | `개인정보 처리방침` | `Privacy Policy` | - | Data 설정 액션 라벨 |
| `settings.data.open_terms_of_service` | `이용약관` | `Terms of Service` | - | Data 설정 액션 라벨 |
| `settings.data.contact_support` | `문의하기` | `Contact Support` | - | Data 설정 액션 라벨 |
| `settings.data.logout` | `로그아웃` | `Logout` | - | Data 설정 액션 라벨 |
| `account.delete.requested.banner` | `계정 삭제 요청이 접수되었습니다. 처리 완료까지 최대 7일이 걸릴 수 있습니다.` | `Your account deletion request was received. It may take up to 7 days to complete.` | - | 계정 삭제 요청 접수 배너 |
| `account.delete.processing.banner` | `계정 삭제를 처리 중입니다.` | `Your account deletion is in progress.` | - | 계정 삭제 처리중 배너 |
| `account.delete.processing.delayed.banner` | `계정 삭제 처리가 지연되고 있습니다. 문의하기로 도움을 받으세요.` | `Account deletion is taking longer than expected. Please contact support for help.` | - | 계정 삭제 지연 배너(24h+) |
| `account.delete.failed.body` | `계정 삭제 처리에 실패했습니다. 다시 시도하거나 문의해 주세요.` | `We couldn't complete account deletion. Please try again or contact support.` | - | 계정 삭제 실패 모달 본문 |
| `account.delete.reauth_failed.toast` | `본인 확인에 실패했습니다. 다시 시도해 주세요.` | `Verification failed. Please try again.` | - | 계정 삭제 재인증 실패 토스트 |
| `account.delete.offline.block.toast` | `오프라인에서는 계정 삭제를 시작할 수 없습니다. 네트워크 연결 후 다시 시도해 주세요.` | `You can't start account deletion while offline. Please try again when you're online.` | - | 계정 삭제 오프라인 차단 토스트 |
| `coins.store.title` | `코인` | `Coins` | - | Coins Store 제목 |
| `coins.store.balance` | `보유 코인 {coins}` | `Coins {coins}` | `coins` | 코인 잔액 표시 |
| `coins.store.rewarded.cta` | `광고 보고 코인 +20` | `Watch an ad to get +20 coins` | - | 코인 광고 수급 CTA |
| `coins.store.iap.pack1.cta` | `코인 +500 구매` | `Buy +500 coins` | - | 코인 IAP CTA |
| `coins.store.daily_cap.toast` | `오늘의 코인 광고 보상 횟수를 모두 사용했습니다.` | `You've reached today's coin reward limit.` | - | 코인 광고 일일 한도 초과 |
| `coins.store.disclaimer.coming_soon` | `v1.0에서는 코인 사용처가 없고 코인은 누적만 됩니다. 사용처는 후속 업데이트에서 제공됩니다.` | `In v1.0, coins can only be accumulated. Spending will be added in a future update.` | - | 코인 사용처 안내 |
| `legal.notice.ads` | `이 앱은 광고를 포함할 수 있습니다.` | `This app may include ads.` | - | 법적 고지(광고) |
| `legal.notice.iap` | `프리미엄/코인 등 일부 항목은 인앱결제로 제공됩니다.` | `Premium and some items (e.g., coins) are provided via in-app purchases.` | - | 법적 고지(인앱결제) |
| `legal.notice.data` | `계정/플레이 데이터는 서비스 제공 및 동기화를 위해 처리됩니다.` | `Account and gameplay data are processed to provide service and sync.` | - | 법적 고지(데이터 처리) |
| `purchase.failed.body` | `결제를 완료하지 못했습니다.` | `We couldn't complete your purchase.` | - | 결제 실패 문구 |
| `paywall.title` | `프리미엄으로 업그레이드` | `Upgrade to Premium` | - | Paywall 제목 |
| `paywall.benefit.ads_free` | `광고 제거` | `Ad-free experience` | - | Paywall 혜택 문구 |
| `paywall.benefit.unlimited_hints` | `힌트 무제한` | `Unlimited hints` | - | Paywall 혜택 문구 |
| `paywall.benefit.lifetime` | `영구 이용` | `Lifetime access` | - | Paywall 혜택 문구 |
| `paywall.cta.purchase` | `구매` | `Purchase` | - | Paywall 구매 버튼 |
| `paywall.cta.restore` | `구매 복원` | `Restore Purchases` | - | Paywall 복원 버튼 |
| `paywall.cta.close` | `닫기` | `Close` | - | Paywall 닫기 버튼 |
| `paywall.disclaimer.refund_delay` | `환불/취소 반영은 스토어 정책에 따라 지연될 수 있습니다.` | `Refund/cancellation updates may be delayed due to store policies.` | - | Paywall 환불/취소 반영 지연 안내 |
| `paywall.offline.body` | `온라인에서만 구매/복원이 가능합니다.` | `Purchases and restores are available only when you're online.` | - | Paywall 오프라인 안내 |
| `purchase.pending.banner` | `결제 확인 중입니다. 확인 후 자동 반영됩니다.` | `Your purchase is pending. It will be applied automatically once confirmed.` | - | 결제 대기 배너 |
| `purchase.revoked.banner` | `구매 상태가 변경되어 프리미엄 혜택이 종료되었습니다.` | `Your purchase status changed and premium access ended.` | - | 환불/취소 반영 배너 |
| `purchase.restore.failed` | `구매 복원에 실패했습니다.` | `Failed to restore purchases.` | - | 구매 복원 실패 문구 |
| `settings.data.manage_ad_consent` | `광고 동의 관리` | `Manage Ad Consent` | - | Data 설정 액션 라벨 |
| `att.usage_description` | `맞춤 광고를 제공하기 위해 광고 식별자를 사용합니다.` | `We use your advertising identifier to provide personalized ads.` | - | iOS `NSUserTrackingUsageDescription` |
| `settings.data.delete_account.confirm` | `계정을 삭제하면 클라우드 데이터가 삭제됩니다. 스토어 구매 내역은 플랫폼 정책상 유지될 수 있으며, 재로그인 후 ‘구매 복원’으로 프리미엄을 다시 활성화할 수 있습니다.` | `Deleting your account will remove cloud data. Store purchases may be retained by the platform; after re-sign-in you can re-enable Premium via Restore Purchases.` | - | 계정 삭제 확인 본문 |
| `settings.data.delete_account` | `계정 삭제` | `Delete Account` | - | Data 설정 액션 라벨 |

### 40.3 카피 운영 규칙
- 사용자 노출 문구에는 내부 에러코드를 직접 노출하지 않는다.
- 단, `contactSupport` 진단정보 payload에는 내부 에러코드를 포함할 수 있다.
- 버튼 라벨은 2~6글자 범위를 권장하며 동사형으로 통일한다.
- 한 화면에서 동일 의미 버튼은 같은 라벨만 사용한다(`Retry`, `닫기`, `Resume`).
- MVP(1.0)에서 loading/empty 문구는 현재 기본 문구를 유지하고, 브랜드 톤 개편은 Post-MVP로 이관한다.

### 40.4 로컬라이징 규칙
- UI는 키 기반 렌더를 기본으로 하고, 하드코딩 문자열 사용을 금지한다.
- MVP 키셋은 `ko`/`en` 2개 언어를 필수로 유지한다.
- 변수 포함 문구는 숫자/시간 포맷을 locale에 맞춰 변환한다.
- 번역 리소스 누락 시 `ko` 기본값으로 fallback한다.

---

## 41. 네비게이션/백버튼/상태 매트릭스

> 목적: 화면 상태 충돌과 플랫폼별 백 동작 차이를 제거한다.

### 41.1 상태 우선순위와 입력 차단
| priority | state | input policy |
|---|---|---|
| 1 | `fatal_error` | 모든 입력 차단, 복구 액션만 허용 |
| 2 | `merge_conflict_modal` | 모달 액션 외 입력 차단 |
| 3 | `pause_modal` | Resume/Restart/Quit만 허용 |
| 4 | `hint_overlay` | overlay 액션 우선, 보드 입력 제한 |
| 5 | `normal_play` | 보드/키패드 입력 허용 |

### 41.2 Android 하드웨어 백 규칙
- `hint_overlay` 열림: overlay 닫기(상태 유지)
- `pause_modal` 열림: 모달 닫기 후 `playing` 복귀
- `playing` 상태: `quit confirm` 모달 표시
- `completed`/`failed` 상태: 결과 화면 닫고 Home으로 이동
- `fatal_error` 상태: 안전 화면으로 이동(앱 종료 금지)

### 41.3 iOS 네비게이션 백 규칙
- 스와이프 백은 GameScreen 전 상태(`playing`, `paused`, `completed`, `failed`)에서 전면 비활성화한다.
- 상단 Back 버튼 탭 시 Android와 동일하게 `quit confirm` 모달을 사용한다.
- 모달 계층이 있으면 화면 pop보다 모달 닫기를 우선한다.

### 41.4 로딩/빈 상태/오프라인 상태 규칙
| screen | loading | empty | offline |
|---|---|---|---|
| Home | skeleton 3개 카드 | `새 게임을 시작해보세요` | Daily 카드에 offline 배지 |
| Journey | stage list skeleton | 해당 없음 | stage 목록/진행도 로컬 표시 + (`syncState="pending_verify"` 존재 시 sync 배지) + 플레이 허용(코인 지급은 online 후 서버 검증) |
| Stats | skeleton 차트/카드 | `플레이 기록이 아직 없습니다` | 마지막 집계 시점 표시 |
| Game | board skeleton | 해당 없음 | sync 배지 + 게임 진행 허용 |
| Paywall | 가격/혜택 skeleton | 해당 없음 | 구매/복원 CTA 비활성 + `paywall.offline.body` 안내 + `error.retry.cta` 버튼 |

### 41.5 방향/회전 정책
- MVP 기본 방향: portrait 고정
- tablet에서도 보드/키패드 비율 유지(레이아웃 확장만 허용)
- orientation 변경 이벤트는 진행 상태를 리셋하지 않는다.

### 41.6 포커스 복구 규칙
- modal/overlay 종료 후 직전 `selectedCell`, `selectedDigit`, `inputMode`를 복구한다.
- 앱 background -> foreground 복귀 시 `autoPauseOnLeave=true`이면 `paused`로 유지한다.
- [MUST] 복구 실패 시 안전 기본값은 `selectedCell=null`, `selectedDigit=null`, `inputMode=auto`, `pencil=false`로 고정한다.
- [MUST NOT] `inputMode`에 `cell|digit` 값을 사용하지 않는다.

### 41.7 아이콘 의미 매핑 (MVP 고정)
- [MUST] 아래 `semanticKey -> glyphName` 매핑을 고정한다.
- [MUST] 동일 `semanticKey`는 어떤 화면에서도 같은 glyph를 사용한다.
- [MUST] 아이콘 크기 토큰은 `16(status) / 20(button) / 24(nav)`만 허용한다.

| semanticKey | iconLib | glyphName | usage |
|---|---|---|---|
| `state.conflict` | MaterialCommunityIcons | `alert-circle` | 보드 conflict 보조 신호 |
| `state.offline` | MaterialCommunityIcons | `wifi-off` | 오프라인 상태 배지/행 |
| `state.sync_pending` | MaterialCommunityIcons | `cloud-upload-outline` | 동기화 pending 표식 |
| `state.sync_failed` | MaterialCommunityIcons | `cloud-alert-outline` | 동기화 실패 표식 |
| `state.premium_locked` | MaterialCommunityIcons | `lock-outline` | 무료/프리미엄 잠금 표식 |
| `action.retry_sync` | MaterialCommunityIcons | `cloud-sync-outline` | Settings > Data `retrySyncNow` |
| `action.open_paywall` | MaterialCommunityIcons | `crown-outline` | Premium 업그레이드 진입 |
| `action.restore_purchase` | MaterialCommunityIcons | `restore` | 구매 복원 액션 |
| `action.contact_support` | MaterialCommunityIcons | `lifebuoy` | 문의하기 액션 |
| `action.delete_account` | MaterialCommunityIcons | `account-remove-outline` | 계정 삭제 액션 |
| `action.open_privacy` | MaterialCommunityIcons | `shield-lock-outline` | Privacy Policy 링크 |
| `action.open_terms` | MaterialCommunityIcons | `file-document-outline` | Terms 링크 |
| `state.daily_completed` | MaterialCommunityIcons | `calendar-check` | Daily 완료/도장 상태 |
| `brand.apple_signin` | FontAwesome (brands) | `apple` | Apple 로그인 버튼 전용 |
| `brand.google_signin` | FontAwesome (brands) | `google` | Google 로그인 버튼 전용 |
