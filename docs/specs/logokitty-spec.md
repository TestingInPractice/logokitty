# Логопотам — Specification

> Логопедическое PWA-приложение для детей 2–8 лет.
> Родитель авторизуется через Telegram, ребёнок занимается с котиком: запуск речи,
> развитие речи, игры, подготовка к школе. Геймификация с уровнями, валютой и магазином.

---

## Goals

- **Telegram auth** — родитель входит через Telegram Login Widget, без пароля.
  Создаёт профиль ребёнка (имя, возраст). Можно добавить несколько детей.
- **Котик** — ребёнок выбирает имя и цвет котика при первом входе.
  Котик — гид: озвучивает задания, хвалит, подсказывает.
- **4 раздела ребёнка:**
  - Запуск речи — артикуляция, фонематический слух, первые звуки и слова
  - Развитие речи — свистящие/шипящие/сонорные, скороговорки, чистоговорки, словарь
  - Развивающие игры — логика, внимание, память, эмоции, нейроупражнения, моторика
  - Подготовка к школе — алфавит, слоги, чтение, счёт, грамматика, письмо
- **Лента** (главный экран родителя) — прогресс ребёнка, последние достижения,
  ежедневный бонус, кнопка «переключить ребёнка», уведомления
- **Образовательный путь — 5 этапов последовательно:**
  1. Запуск речи (ур. 1–10) — артикуляция, выдох, первые звуки (А, О, У, М, П, Б),
     фонематический слух (различение звуков на слух), простые слова (мама, папа)
  2. Произношение (ур. 11–20) — свистящие (С, З, Ц), шипящие (Ш, Ж, Ч, Щ),
     сонорные (Л, Р), скороговорки, чистоговорки, расширение словаря
  3. Буквы и слоги (ур. 21–30) — алфавит, звуко-буквенный анализ,
     слоги (прямые/обратные), составление слов из слогов, подготовка руки к письму
  4. Чтение и речь (ур. 31–40) — чтение слов, чтение фраз и предложений,
     пересказ, грамматика (род, число, падеж), построение предложений
  5. Школа (ур. 41–50+) — беглое чтение, счёт и простые операции,
     составление рассказов, письмо печатными буквами, логика
- **Каждый этап открывает новый раздел в интерфейсе ребёнка**
- **Уровни-прогрессии 1–50+**
  - EXP = игры + пройденные звуки (за звуки больше)
  - За уровень открываются новые игры внутри текущего этапа
  - За этап открывается целый новый раздел
  - Уровни 5, 10, 15, 20, 30 — мини-игры-боссы (например, «Покорми котика»)
- **🐟 Корм** (бесплатная валюта)
  - Ежедневный вход: +50 корма (раз в 24ч)
  - За пройденную игру: +5 корма
  - За пройденный звук: +20 корма
- **⭐ Золото** (премиум-валюта)
  - Донат (через подписку или покупку набора золота)
  - Рефералы: +100 золота за приведённого друга
  - Достижение N уровня: +10 золота за каждый 5-й уровень
- **Магазин косметики для котика**
  - Категории: шапки, очки, шарфы, домики, фоны
  - Цена: корм / золото / уровень (некоторые предметы требуют уровень)
  - Предмет надевается на котика и отображается визуально
- **Диагностика речи** — Web Speech API, ребёнок произносит звуки,
  приложение определяет качество и выдаёт отчёт родителю
- **Подписка за рубли** — YooKassa / Robokassa
  - Freemium: база бесплатно (первые 2 раздела, звуки С/З)
  - Премиум: все разделы, все звуки, полная диагностика, золото за уровни
- **PWA** — установка на home screen, офлайн-игры (без голоса),
  Service Worker, манифест, иконки
- **Админка** — отдельное protected SPA (или страница входа по роли admin):
  - Управление тестовыми подписками: создать/продлить/отменить без оплаты
  - Feature flags: включить/выключить любой раздел, этап, игру для всех или для конкретного пользователя
  - Настройки приложения: лимиты валют, EXP-требования для уровней, цены подписок
  - Просмотр пользователей и детей (фильтр, поиск, статус подписки)
  - Назначение золота/корма любому ребёнку (для тестирования)
  - Реферальная статистика
  - Просмотр логов ошибок в реальном времени
  - Доступ по роли admin (отдельная таблица админов, не через Telegram)
- **Логирование** — структурированные логи на backend:
  - Все запросы к API (метод, путь, статус, длительность, userId)
  - Ошибки с полным stacktrace и контекстом (какой ребёнок, игра, звук)
  - Действия админа (кто, что, когда изменил)
  - События подписки (создание, оплата, продление, ошибка платежа)
  - Логи хранятся 30 дней, ротация автоматическая
  - В админке — просмотр логов с фильтром по уровню (debug/info/warn/error) и дате

---

## Озвучка

Озвучка — критическая часть приложения. Дети учатся произношению через подражание.
Любая ошибка в дикции или интонации котика закрепит неправильное произношение у ребёнка.

### Стратегия: однократная генерация ElevenLabs

- **Один раз** синтезируем все звуки/слоги/слова через ElevenLabs TTS (выбран голос, максимально близкий к детскому логопеду)
- ElevenLabs free tier (10k символов/мес) — на весь датасет может потребоваться несколько месяцев или однократная оплата $22 (Creator-план)
- После генерации — все mp3 хранятся в git и никогда не перегенерируются
- Никаких ongoing-платежей за TTS: заплатили один раз — пользуемся всегда

### Что озвучивается
| Категория | Примеры | Количество |
|-----------|---------|-----------|
| **Звуки изолированно** | С-С-С, Ш-Ш-Ш, Р-Р-Р (тянем звук, коротко, твёрдо/мягко) | ~40 |
| **Слоги прямые/обратные** | СА-СО-СУ, АС-ОС-УС, РА-РО-РУ, АР-ОР-УР | ~200 |
| **Слова** | СОБАКА, СОРОКА, РАК, ШАПКА, ЗАЯЦ | ~1000 |
| **Скороговорки** | «Шла Саша по шоссе и сосала сушку» | ~50 |
| **Чистоговорки** | «Са-са-са — в лесу бегает лиса» | ~100 |
| **Инструкции к играм** | «Найди картинку, где есть звук С», «Подуй на шарик» | ~200 |
| **Похвала / обратная связь** | «Молодец!», «У тебя отлично получается!», «Попробуй ещё раз» | ~100 |
| **Буквы алфавита** | А — [а], Б — [б], В — [в] (не название буквы, а звук!) | 33 |
| **Цифры и счёт** | «Один, два, три», «Сколько яблок на картинке?» | ~50 |
| **Котик (персонаж)** | Приветствие, подсказки, реакции на награды, мурлыканье | ~100 |
| **Всего** | | ~1773 |

### Репозиторий аудиофайлов

Отдельный git-репозиторий (с Git LFS для mp3):

```
логопотам-аудио/
├── manifest.json              # маппинг: ключ фразы → путь к файлу
├── sounds/                    # звуки изолированно
│   ├── a_traction.mp3         # А — тянем
│   ├── a_short.mp3            # А — коротко
│   ├── s_traction.mp3         # С — тянем
│   ├── s_soft_traction.mp3    # Сь — тянем
│   └── ...
├── syllables/                 # слоги
│   ├── sa_direct.mp3          # СА
│   ├── so_direct.mp3          # СО
│   ├── as_reverse.mp3         # АС
│   └── ...
├── words/                     # слова (сгруппированы по звукам)
│   ├── s/                     # звук С
│   │   ├── sobaka.mp3
│   │   ├── soroka.mp3
│   │   └── ...
│   ├── sh/                    # звук Ш
│   │   └── ...
│   └── r/                     # звук Р
│       └── ...
├── phrases/                   # скороговорки, чистоговорки
├── instructions/              # инструкции к играм
├── praise/                    # похвала
├── alphabet/                  # буквы
├── numbers/                   # цифры
└── .lfsconfig                 # Git LFS: mp3 под LFS
```

**manifest.json** — единственный источник правды о том, какой файл какой фразе соответствует:

```json
{
  "phrases": [
    {
      "key": "sound_s_traction",
      "file": "sounds/s_traction.mp3",
      "text": "С-С-С",
      "category": "sound",
      "sound": "С",
      "durationMs": 1500
    },
    {
      "key": "syllable_sa_direct",
      "file": "syllables/sa_direct.mp3",
      "text": "СА",
      "category": "syllable",
      "sound": "С"
    },
    {
      "key": "word_sobaka",
      "file": "words/s/sobaka.mp3",
      "text": "СОБАКА",
      "category": "word",
      "sound": "С",
      "targetPosition": "start"
    }
  ]
}
```

### Кэширование при установке PWA

- Service Worker при первом запуске скачивает `manifest.json`
- В фоне загружает все mp3 из `manifest.json` в Cache API
- Прогресс загрузки: полоса на экране загрузки (первый запуск)
- **Все аудиофайлы работают офлайн** с первого дня — никаких повторных запросов
- Размер всего датасета: ~200-300 MB mp3 (все 1773 фразы)
- При обновлении: Service Worker скачивает только новые/изменённые файлы

### Killer feature (будущее) — голос родителя через Voice Cloning
- Когда появится revenue: ElevenLabs Voice Cloning ($5/мес)
- Родитель записывает 5–10 фраз в микрофон → создаётся цифровая копия голоса
- Все TTS-фразы синтезируются голосом мамы/папы
- Ребёнок слышит родной голос — доверие выше, занятия эффективнее
- На MVP: отключено, используем голос котика по умолчанию

---

### API Endpoints

```
### Auth
POST   /api/auth/telegram         { initData }              → { token, user }

### Children
POST   /api/children              { name, age, catName, catColor } → Child
GET    /api/children                                            → Child[]
PUT    /api/children/:id          { name, age }                 → Child
GET    /api/children/:id/progress                               → Progress

### Feed
GET    /api/feed                                                → FeedItem[]
GET    /api/feed/daily-reward                                   → { reward, nextAvailableAt }

### Games
GET    /api/games?sections&age&page                              → { items: Game[], total }
GET    /api/games/:id                                            → Game
POST   /api/games/:id/start      { childId }                   → GameSession
POST   /api/games/:id/complete   { childId, score, soundResults? } → { exp, foodReward }
POST   /api/games/:id/check-sound { audio }                    → { accuracy, soundLabel }

### Diagnostics
POST   /api/diagnostics          { childId, audio[] }          → DiagnosticResult
GET    /api/diagnostics/:id                                     → DiagnosticResult

### Levels & Currencies
GET    /api/levels/progress      { childId }                    → { level, exp, nextLevelExp }
POST   /api/levels/claim-reward  { childId }                   → { reward }
GET    /api/currencies           { childId }                    → { food, gold }

### Shop
GET    /api/shop                                                → ShopItem[]
GET    /api/shop/categories                                     → Category[]
POST   /api/shop/buy             { childId, itemId, currency }  → Inventory

### Referrals
POST   /api/referrals/link                                      → { code, url }
POST   /api/referrals/activate   { code }                      → { goldReward }

### Subscriptions
GET    /api/subscriptions/plans                                 → Plan[]
GET    /api/subscriptions/status { childId }                    → { isActive, expiresAt }
POST   /api/subscriptions/pay    { planId, childId }            → { paymentUrl }
POST   /api/subscriptions/webhook { /* YooKassa payload */ }    → { ok }

### Admin
POST   /api/admin/login             { login, password }        → { token }
GET    /api/admin/users                                        → { items: User[], total }
GET    /api/admin/users/:id                                     → User
GET    /api/admin/children                                      → { items: Child[], total }
POST   /api/admin/subscriptions/test { childId, planId, durationDays } → Subscription
DELETE /api/admin/subscriptions/:id                              → { ok }
POST   /api/admin/currencies       { childId, food?, gold? }    → { food, gold }
GET    /api/admin/feature-flags                                  → FeatureFlag[]
PUT    /api/admin/feature-flags/:id { enabled }                 → FeatureFlag
GET    /api/admin/settings                                       → { [key]: value }
PUT    /api/admin/settings         { [key]: value }             → { ok }
GET    /api/admin/logs?level&from&to&page                        → { items: LogEntry[], total }

### Settings
PUT    /api/settings/notifications { enabled }                  → { ok }
DELETE /api/children/:id                                        → { ok }
```

### Data Models

```yaml
User:
  id                    uuid          PK, Telegram ID
  name                  string        из Telegram
  telegramAvatarUrl     string?
  createdAt             timestamp

Child:
  id                    uuid          PK
  userId                uuid          FK → User.id
  name                  string
  age                   int           2–8
  level                 int           default 1
  exp                   int           default 0
  foodBalance           int           default 0
  goldBalance           int           default 0
  lastDailyRewardAt     timestamp?    null если сегодня не забирал
  subscriptionId        uuid?         FK → Subscription.id
  createdAt             timestamp

Cat:
  id                    uuid          PK
  childId               uuid          FK → Child.id, unique
  name                  string        имя котика
  color                 string        hex
  equippedItems         uuid[]        FK → Inventory.id

ShopItem:
  id                    uuid          PK
  name                  string
  category              enum          hat | glasses | scarf | house | background
  previewUrl            string
  priceFood             int?          null если нельзя за корм
  priceGold             int?          null если нельзя за золото
  levelRequirement      int?          null если без уровня
  isPremium             boolean       true = только для подписки

Inventory:
  id                    uuid          PK
  childId               uuid          FK → Child.id
  itemId                uuid          FK → ShopItem.id
  purchasedAt           timestamp

Level:
  level                 int           PK
  stage                 int           1–5
  expRequired           int
  rewardFood            int
  rewardGold            int?
  unlockGameId          uuid?         какая игра открывается на этом уровне
  unlockSection         enum?         speech-launch | speech-dev | educational | school-prep
  isStageComplete       boolean       последний уровень этапа (открывает след. раздел)

Game:
  id                    uuid          PK
  section               enum          speech-launch | speech-dev | educational | school-prep
  title                 string
  description           text
  category              enum          articulation | phonemic | breathing | first-words |
                                      whistling | hissing | sonor | tongue-twisters |
                                      logic | memory | attention | emotion | neuro |
                                      motorics | alphabet | syllable | reading | counting |
                                      grammar | handwriting | vocabulary
  stage                 int           1–5        какой этап обучения
  minAge                int           2
  maxAge                int           8
  expReward             int
  foodReward            int
  requiresSubscription  boolean
  unlockLevel           int?          какой уровень нужен для доступа
  usesSpeech            boolean       нужен ли микрофон

GameSession:
  id                    uuid          PK
  childId               uuid          FK → Child.id
  gameId                uuid          FK → Game.id
  score                 int
  soundsTested          string[]?     какие звуки проверялись
  soundsPassed          string[]?     какие звуки сданы
  expEarned             int
  foodEarned            int
  completedAt           timestamp

SoundProgress:
  id                    uuid          PK
  childId               uuid          FK → Child.id
  sound                 string        звук: А, О, У, М, П, Б, С, З, Ц, Ш, Ж, Ч, Щ, Л, Р
  stage                 int           1–5
  accuracy              float         0.0–1.0
  lastTestedAt          timestamp
  isMastered            boolean       accuracy > 0.8

PhonemicSkill:
  id                    uuid          PK
  childId               uuid          FK → Child.id
  skill                 enum          distinguish-by-ear | find-sound-in-word |
                                      count-sounds | rhyme-recognition
  accuracy              float         0.0–1.0
  lastTestedAt          timestamp
  isMastered            boolean

LetterProgress:
  id                    uuid          PK
  childId               uuid          FK → Child.id
  letter                string        А–Я
  recognizes           boolean       узнаёт букву
  pronounces            boolean       произносит звук буквы
  writes                boolean       пишет печатную букву
  masteredAt            timestamp?

SyllableProgress:
  id                    uuid          PK
  childId               uuid          FK → Child.id
  syllable              string        ма, па, ба, да, ...
  canRead               boolean
  canWrite              boolean
  masteredAt            timestamp?

VocabularyProgress:
  id                    uuid          PK
  childId               uuid          FK → Child.id
  category              enum          body | food | animals | home | colors | nature | emotions
  wordsLearned          int
  wordsTotal            int
  lastTestedAt          timestamp

MotorSkill:
  id                    uuid          PK
  childId               uuid          FK → Child.id
  skill                 enum          trace-line | trace-shape | color-inside |
                                      copy-letter | copy-word | scissor-cut
  accuracy              float
  lastTestedAt          timestamp
  isMastered            boolean

DiagnosticResult:
  id                    uuid          PK
  childId               uuid          FK → Child.id
  overallAccuracy       float
  sounds:               [{
    sound:              string
    accuracy:           float
    recommendation:     text
  }]
  summary               text
  createdAt             timestamp

Subscription:
  id                    uuid          PK
  planId                uuid
  status                enum          active | expired | cancelled
  startedAt             timestamp
  expiresAt             timestamp

SubscriptionPlan:
  id                    uuid          PK
  name                  string        месяц / 3 месяца / год
  priceRub              int
  durationDays          int

Referral:
  id                    uuid          PK
  userId                uuid          FK → User.id (кто пригласил)
  code                  string        уникальный код
  usedByUserId          uuid?         FK → User.id (кто активировал)
  goldRewardClaimed     boolean
  createdAt             timestamp

Admin:
  id                    uuid          PK
  login                 string        unique
  passwordHash          string
  role                  enum          admin | superadmin
  createdAt             timestamp

FeatureFlag:
  id                    uuid          PK
  key                   string        unique (раздел/игра/этап)
  description           text
  enabled               boolean       default true
  updatedBy             uuid?         FK → Admin.id
  updatedAt             timestamp

AppSetting:
  key                   string        PK
  value                 text          JSON
  description           text          для чего этот параметр
  updatedBy             uuid?         FK → Admin.id
  updatedAt             timestamp

LogEntry:
  id                    uuid          PK
  level                 enum          debug | info | warn | error
  source                enum          api | subscription | auth | admin | game | diagnostic
  message               text
  metadata              json?         контекст ошибки (userId, childId, gameId, stacktrace)
  adminId               uuid?         FK → Admin.id (если действие админа)
  createdAt             timestamp

VoiceProfile:
  id                    uuid          PK
  childId               uuid          FK → Child.id (чей ребёнок — тот и голос)
  provider              enum          elevenlabs | openvoice
  voiceId               text          ID клонированного голоса у провайдера
  sampleCount           int           сколько фраз наговорено для клонирования
  isActive              boolean       активен ли этот голос (false = голос котика по умолчанию)
  createdAt             timestamp
  expiresAt             timestamp?    когда истекает (ElevenLabs $5/мес)
```

---

## Acceptance Criteria

### Auth
- [ ] Вход через Telegram Login Widget создаёт пользователя по Telegram ID
- [ ] Повторный вход не создаёт дубликат — выдаёт JWT существующего пользователя
- [ ] Без валидного JWT все эндпоинты → 401

### Дети
- [ ] После входа родитель создаёт профиль ребёнка: имя, возраст, имя котика, цвет котика
- [ ] Родитель может добавить 2+ детей и переключаться между ними
- [ ] Прогресс у каждого ребёнка независимый

### Лента
- [ ] Лента показывает: ежедневный бонус (кнопка «забрать»), последние достижения,
      уровень ребёнка, кнопка выбора ребёнка
- [ ] Ежедневный бонус — +50 корма, доступен раз в 24ч
- [ ] Если бонус уже забран сегодня — кнопка неактивна с таймером
- [ ] После первого входа ребёнка за день — показать popup «корм получен»

### Образовательный путь
- [ ] Новичку доступен только 1-й раздел (Запуск речи). Остальные заблокированы с подписью «откроется на N уровне»
- [ ] Этап 1 (ур. 1–10): артикуляция, выдох, фонематический слух, звуки А/О/У/М/П/Б, первые слова
- [ ] Этап 2 (ур. 11–20): свистящие С/З/Ц, шипящие Ш/Ж/Ч/Щ, сонорные Л/Р, скороговорки
- [ ] Этап 3 (ур. 21–30): алфавит, звуко-буквенный анализ, слоги прямой/обратный, составление слов
- [ ] Этап 4 (ур. 31–40): чтение слов → фраз → предложений, грамматика (род/число/падеж), пересказ
- [ ] Этап 5 (ур. 41–50+): беглое чтение, счёт до 100 +-*/1, письмо печатными буквами, рассказы
- [ ] При переходе на новый этап — всплывает окно «Новый раздел открыт!»
- [ ] Игры ранжируются не только по разделу, но и по этапу обучения внутри раздела

### Разделы
- [ ] 4 раздела отображаются как большие иконки на экране ребёнка
- [ ] Недоступные разделы — заблокированы с подписью «откроется на N уровне»
- [ ] Внутри раздела — игры только текущего этапа и пройденных этапов
- [ ] Игры следующего этапа внутри раздела — заблокированы до перехода на этап
- [ ] Премиум-игры для неподписанных — показаны с иконкой замка

### Уровни и EXP
- [ ] За завершённую игру: +EXP (по Game.expReward)
- [ ] За пройденный звук (SoundProgress.isMastered): +EXP × 2
- [ ] При достижении expRequired → всплывает окно «Новый уровень!» с наградой
- [ ] За каждый 5-й уровень: +10 золота (автоматически)
- [ ] Шкала прогресса уровня видна на экране ребёнка

### Валюты
- [ ] Баланс корма и золота отображается в шапке экрана ребёнка
- [ ] Корм нельзя купить за реальные деньги — только ежедневный вход + игры + звуки
- [ ] Золото: донат, рефералы, каждый 5-й уровень

### Магазин
- [ ] Магазин открывается с экрана ребёнка (иконка корзины)
- [ ] Предметы с levelRequirement > уровня ребёнка — заблокированы
- [ ] Покупка за корм: цена списывается, предмет в инвентаре
- [ ] Покупка за золото: цена списывается
- [ ] После покупки предмет можно «надеть» на котика
- [ ] Котик отображается с надетым предметом на всех экранах

### Фонематический слух
- [ ] Игры на различение звуков на слух: «найди слово со звуком С», «где спрятался звук?»
- [ ] Ребёнок слышит звук → выбирает картинку → приложение подтверждает или исправляет
- [ ] Прогресс по каждому навыку сохраняется в PhonemicSkill

### Буквы и слоги
- [ ] Каждая буква алфавита: показ → произношение → ассоциация с картинкой → поиск в слове
- [ ] Слоги: показ → чтение слога → составление слова из слогов
- [ ] Прогресс по каждой букве и слогу сохраняется (LetterProgress, SyllableProgress)

### Словарь
- [ ] Игры на категории: тело, еда, животные, дом, цвета, природа, эмоции
- [ ] Картинка + слово + произношение → ребёнок повторяет → засчитывается в словарь
- [ ] Прогресс по каждой категории отображается родителю

### Моторика
- [ ] Упражнения: обведи линию, обведи фигуру, раскрась внутри контура, напиши букву
- [ ] Работает пальцем на сенсорном экране
- [ ] Прогресс по каждому навыку сохраняется (MotorSkill)

### Диагностика
- [ ] Режим диагностики доступен с экрана ребёнка
- [ ] Ребёнок произносит звуки в микрофон (Web Speech API)
- [ ] Приложение определяет точность произношения по каждому звуку
- [ ] После диагностики — отчёт: какие звуки пройдены, какие нужно тренировать
- [ ] Результат сохраняется в историю

### Рефералы
- [ ] Родитель может сгенерировать реферальную ссылку в настройках
- [ ] При регистрации по ссылке: +100 золота пригласившему
- [ ] Золото начисляется после первого входа ребёнка приглашённого

### Подписка
- [ ] Экран подписки показывает 3 тарифа: месяц / 3 месяца / год
- [ ] Оплата через YooKassa/Robokassa
- [ ] После оплаты — премиум-контент разблокирован
- [ ] Без подписки: доступны первые 2 раздела, звуки С/З, базовая диагностика
- [ ] С подпиской: все разделы, все звуки, полная диагностика, золото на уровнях

### Озвучка
- [ ] Все 1773 фразы синтезированы через ElevenLabs TTS одним выбранным голосом (детский логопед)
- [ ] После генерации — все mp3 закоммичены в git (Git LFS), никогда не перегенерируются
- [ ] manifest.json содержит все записи с key, file path, text, category, duration
- [ ] Структура репозитория: sounds/, syllables/, words/ (по звукам), phrases/, instructions/, praise/, alphabet/, numbers/
- [ ] Каждая фраза произнесена с корректной интонацией (похвала ≠ подсказка ≠ ошибка)
- [ ] Все слова с целевым звуком в начале, середине и конце слова (по manifest.json)
- [ ] Service Worker при установке скачивает manifest.json → загружает все mp3 в Cache API
- [ ] Полоса прогресса загрузки аудио на первом запуске
- [ ] Все аудиофайлы работают офлайн с первого дня
- [ ] На экране ребёнка всегда есть кнопка «повторить» (повторяет последнюю озвучку)
- [ ] При обновлении приложения — скачиваются только новые/изменённые файлы
- [ ] Voice cloning (голос родителя) — отключено на MVP, опция в будущем

### Админка
- [ ] Админка доступна по отдельному URL (/admin) с базовой авторизацией по логину+паролю
- [ ] Вход создаёт JWT с ролью admin, без привязки к Telegram
- [ ] Список пользователей: поиск, фильтр по подписке, просмотр детей
- [ ] Тестовая подписка: выбрать ребёнка → план → длительность → создать без оплаты
- [ ] Feature flags: включение/выключение раздела или игры для всех пользователей
- [ ] Настройки: редактирование лимитов (expRequired, dailyReward, цены) в JSON-редакторе
- [ ] Логи ошибок: фильтр по уровню, дате, источнику; просмотр stacktrace

### Логирование
- [ ] Каждый API-запрос логируется: method, path, status, durationMs, userId
- [ ] Ошибки платежей логируются с полным телом ответа платёжной системы
- [ ] Действия админа логируются с adminId и diff изменений
- [ ] Логи доступны в админке с пагинацией и фильтрацией
- [ ] Логи старше 30 дней автоматически удаляются

### PWA
- [ ] При установке на home screen — иконка, splash screen, без адресной строки
- [ ] Офлайн: игры без микрофона работают (логика, память, внимание)
- [ ] Офлайн: прогресс кэшируется локально, синхронизируется при появлении сети
- [ ] Требуется интернет: голосовые игры, диагностика, магазин, лента
