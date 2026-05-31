# Logokitty — Agent Guide

## Single Source of Truth
- `docs/specs/logokitty-spec.md` — полная спецификация проекта (goals, models, API, AC)
- Любые изменения начинаются с обновления spec

## Build Loop
- `scripts/build-loop/setup.sh` — настройка окружения
- `scripts/build-loop/init.sh` — первичная инициализация
- `scripts/build-loop/decompose.sh` — разбивка spec на задачи
- `scripts/build-loop/run-loop.sh` — цикл генерации
- `scripts/build-loop/build-loop.sh` — полный цикл (decompose → generate)

## Architecture
- PWA (React + Vite)
- Telegram Login Widget → JWT
- Supabase (PostgreSQL + Auth + Storage)
- ElevenLabs TTS → git LFS → PWA cache
- YooKassa / Robokassa for payments

## Test Cases
- `docs/specs/test-cases.md` — 40+ automated test cases (auth, games, shop, sub, PWA, edge)
