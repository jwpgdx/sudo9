# AI Agent Working Rules (sudo9)

이 레포는 **docs-first**로 운영되며, AI 에이전트(Codex 등)가 작업할 때 “해석 분산(=vibe-coding variance)”을 막기 위한 최소 규칙을 고정한다.

## Source Of Truth

단일 SSoT 문서 세트:
- `PRD_INDEX.md`
- `PRD_MASTER.md`
- `PRD_SPEC_LOCK.md`
- `PRD_DECISIONS.md`
- `PRD_POST_MVP_BACKLOG.md`

충돌 시 권위 순서(반드시 준수):
- `PRD_SPEC_LOCK.md` > `PRD_DECISIONS.md`(ADR/Q decided) > `PRD_MASTER.md` > `PRD_INDEX.md`

현재 기준선:
- **v1.96-doc frozen (2026-02-25)**

## What You MUST NOT Do

- 문서에 없는 정책을 “임의 확정”하지 않는다. 필요한 경우 `PRD_DECISIONS.md`에 ADR/Q로 먼저 등록한다.
- 이미 decided/accepted 된 ADR/Q를 “재논의”하지 않는다. 단, **직접 모순이 있을 때만** file:line 증거로 이슈화한다.
- 범위 밖 기능(Post-MVP)을 MVP에 끌어오지 않는다.
- Public repo 기준으로 **시크릿/토큰/개인정보를 커밋하지 않는다**.

## Placeholder / Store Submission Gate

- `PRD_SPEC_LOCK.md` 38.1.1.2 식별자 테이블의 placeholder(예: Apple App ID)가 남아있으면:
  - **Release Candidate / 스토어 제출 / 릴리즈는 금지**
  - **구현/로컬 dev build은 허용**
- placeholder를 “가짜 숫자”로 대체해서 게이트를 무력화 MUST NOT.

## Security (Public Repo)

커밋 금지(예시):
- `.env*` (이미 `.gitignore`에 포함)
- RevenueCat server API key, webhook secret, Google service account JSON
- iOS 인증서/프로비저닝/`.p8`, Android keystore, signing configs

문서에 비밀값을 적지 않는다:
- `RC_API_KEY_SERVER`, `RC_WEBHOOK_SECRET` 등은 서버 Secret Manager로만 주입(문서에 이미 MUST로 잠금된 규칙을 따른다).

## Implementation Defaults (when coding starts)

핵심 제약(상세는 PRD를 단일 기준으로 따름):
- JS only (`.js/.jsx`) for MVP
- Expo Managed workflow
- 이벤트/스키마/경로/키 이름은 PRD 기준에서 변경하지 않는다.

## Verification Rules

프로젝트에 스크립트가 존재하는 경우:
- 변경 후 `pnpm run lint`, `pnpm run test:unit`를 우선 실행한다.
- e2e가 설정되어 있으면 “가장 작은 smoke”만 먼저 실행한다.

리포트 규칙(응답에 포함):
- 변경 파일 목록
- 실행한 커맨드 + 결과
- 남은 블로커를 “Implementation vs RC/Store submission”으로 분리
