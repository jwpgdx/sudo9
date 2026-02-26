# PRD Index

> Baseline Status: **v1.96-doc frozen** (2026-02-25)
> Implementation Status: **not started** (문서 기준선만 확정)

- `PRD_MASTER.md`: 섹션 0~13 (비전/범위/핵심 UX/기본 구조)
- `PRD_SPEC_LOCK.md`: 섹션 14~25, 31~41 (구현/운영 스펙)
- `PRD_DECISIONS.md`: 섹션 26~30 (Open Questions/ADR/Prompt/Checklist/Changelog)
- `PRD_POST_MVP_BACKLOG.md`: 섹션 42 (Deferred/Post-MVP 실행 백로그)

운영 원칙:
- [MUST] 문서 권위 순서(충돌 시 우선 적용): `PRD_SPEC_LOCK.md` > `PRD_DECISIONS.md`(ADR/Q decided) > `PRD_MASTER.md` > `PRD_INDEX.md`
- 구현 시 우선 참조: `PRD_SPEC_LOCK.md`
- 미확정/논의 항목: `PRD_DECISIONS.md`
- 제품 방향/맥락 확인: `PRD_MASTER.md`
- 확정 정책 추적: `PRD_DECISIONS.md` ADR 섹션 (예: Cloud Sync 백엔드 = ADR-025)
- Deferred 실행 관리: `PRD_POST_MVP_BACKLOG.md` (예: Q-014/Q-015)
- 동결 운영: `v1.96-doc` 기준선에서 P0/P1 충돌 또는 운영 필수 변경만 허용하고, 모든 변경은 Changelog에 기록한다.
- [MUST] `PRD_SPEC_LOCK.md` 38.1.1.2 식별자 테이블에 placeholder가 남아 있으면 Release Candidate/스토어 제출/릴리즈를 금지한다(특히 Apple App ID).
- [MUST] 위 placeholder 게이트는 Release Candidate/스토어 제출/릴리즈에만 적용된다. 구현/로컬 dev build은 진행할 수 있다.
