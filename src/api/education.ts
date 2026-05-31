export interface SoundData { sound: string; words: { word: string; position: 'start' | 'middle' | 'end' }[]; syllables: string[] }
export interface StageContent { stage: number; title: string; sounds: SoundData[]; description: string }

export const stages: StageContent[] = [
  {
    stage: 1,
    title: 'Запуск речи',
    description: 'Артикуляция, дыхание, первые звуки (А, О, У, М, П, Б), первые слова',
    sounds: [
      {
        sound: 'А', words: [
          { word: 'Арбуз', position: 'start' }, { word: 'Банан', position: 'middle' }, { word: 'Пила', position: 'end' },
          { word: 'Автобус', position: 'start' }, { word: 'Машина', position: 'middle' },
        ], syllables: ['А', 'АМ', 'АП', 'МА', 'ПА', 'БА'],
      },
      {
        sound: 'О', words: [
          { word: 'Окно', position: 'start' }, { word: 'Кот', position: 'middle' }, { word: 'Молоко', position: 'end' },
          { word: 'Ослик', position: 'start' }, { word: 'Сорока', position: 'middle' },
        ], syllables: ['О', 'ОМ', 'ОП', 'МО', 'ПО', 'БО'],
      },
      {
        sound: 'У', words: [
          { word: 'Утка', position: 'start' }, { word: 'Стул', position: 'middle' }, { word: 'Кенгуру', position: 'end' },
          { word: 'Утюг', position: 'start' }, { word: 'Петух', position: 'end' },
        ], syllables: ['У', 'УМ', 'УП', 'МУ', 'ПУ', 'БУ'],
      },
      {
        sound: 'М', words: [
          { word: 'Мама', position: 'start' }, { word: 'Ромашка', position: 'middle' }, { word: 'Дом', position: 'end' },
          { word: 'Мяч', position: 'start' }, { word: 'Самолёт', position: 'middle' }, { word: 'Ком', position: 'end' },
        ], syllables: ['МА', 'МО', 'МУ', 'АМ', 'ОМ', 'УМ'],
      },
      {
        sound: 'П', words: [
          { word: 'Папа', position: 'start' }, { word: 'Лопата', position: 'middle' }, { word: 'Суп', position: 'end' },
          { word: 'Поезд', position: 'start' }, { word: 'Шапка', position: 'middle' },
        ], syllables: ['ПА', 'ПО', 'ПУ', 'АП', 'ОП', 'УП'],
      },
      {
        sound: 'Б', words: [
          { word: 'Баба', position: 'start' }, { word: 'Собака', position: 'middle' }, { word: 'Зуб', position: 'end' },
          { word: 'Бочка', position: 'start' }, { word: 'Рыба', position: 'middle' },
        ], syllables: ['БА', 'БО', 'БУ', 'АБ', 'ОБ', 'УБ'],
      },
    ],
  },
  {
    stage: 2,
    title: 'Произношение',
    description: 'Свистящие (С, З, Ц), шипящие (Ш, Ж, Ч, Щ), сонорные (Л, Р), скороговорки',
    sounds: [
      {
        sound: 'С', words: [
          { word: 'Собака', position: 'start' }, { word: 'Лиса', position: 'middle' }, { word: 'Нос', position: 'end' },
          { word: 'Слон', position: 'start' }, { word: 'Оса', position: 'middle' }, { word: 'Автобус', position: 'end' },
          { word: 'Сорока', position: 'start' }, { word: 'Колесо', position: 'middle' },
        ], syllables: ['СА', 'СО', 'СУ', 'АС', 'ОС', 'УС', 'СЫ'],
      },
      {
        sound: 'З', words: [
          { word: 'Заяц', position: 'start' }, { word: 'Коза', position: 'middle' }, { word: 'Арбуз', position: 'end' },
          { word: 'Зонт', position: 'start' }, { word: 'Ваза', position: 'middle' },
        ], syllables: ['ЗА', 'ЗО', 'ЗУ', 'АЗ', 'ОЗ', 'УЗ'],
      },
      {
        sound: 'Ц', words: [
          { word: 'Цапля', position: 'start' }, { word: 'Овца', position: 'middle' }, { word: 'Певец', position: 'end' },
          { word: 'Цирк', position: 'start' }, { word: 'Кольцо', position: 'middle' },
        ], syllables: ['ЦА', 'ЦО', 'ЦУ', 'АЦ', 'ОЦ', 'УЦ'],
      },
      {
        sound: 'Ш', words: [
          { word: 'Шапка', position: 'start' }, { word: 'Машина', position: 'middle' }, { word: 'Камыш', position: 'end' },
          { word: 'Шар', position: 'start' }, { word: 'Каша', position: 'middle' }, { word: 'Душ', position: 'end' },
        ], syllables: ['ША', 'ШО', 'ШУ', 'АШ', 'ОШ', 'УШ'],
      },
      {
        sound: 'Ж', words: [
          { word: 'Жук', position: 'start' }, { word: 'Лужа', position: 'middle' }, { word: 'Нож', position: 'end' },
          { word: 'Жираф', position: 'start' }, { word: 'Пижама', position: 'middle' },
        ], syllables: ['ЖА', 'ЖО', 'ЖУ', 'АЖ', 'ОЖ', 'УЖ'],
      },
      {
        sound: 'Ч', words: [
          { word: 'Чай', position: 'start' }, { word: 'Печка', position: 'middle' }, { word: 'Мяч', position: 'end' },
          { word: 'Черепаха', position: 'start' }, { word: 'Девочка', position: 'middle' },
        ], syllables: ['ЧА', 'ЧО', 'ЧУ', 'АЧ', 'ОЧ', 'УЧ'],
      },
      {
        sound: 'Щ', words: [
          { word: 'Щука', position: 'start' }, { word: 'Вещи', position: 'middle' }, { word: 'Плющ', position: 'end' },
          { word: 'Щенок', position: 'start' }, { word: 'Ящик', position: 'middle' },
        ], syllables: ['ЩА', 'ЩО', 'ЩУ', 'АЩ', 'ОЩ', 'УЩ'],
      },
      {
        sound: 'Л', words: [
          { word: 'Лампа', position: 'start' }, { word: 'Молоко', position: 'middle' }, { word: 'Стол', position: 'end' },
          { word: 'Лиса', position: 'start' }, { word: 'Белка', position: 'middle' }, { word: 'Пенал', position: 'end' },
        ], syllables: ['ЛА', 'ЛО', 'ЛУ', 'АЛ', 'ОЛ', 'УЛ'],
      },
      {
        sound: 'Р', words: [
          { word: 'Ракета', position: 'start' }, { word: 'Корова', position: 'middle' }, { word: 'Шар', position: 'end' },
          { word: 'Рыба', position: 'start' }, { word: 'Барабан', position: 'middle' }, { word: 'Забор', position: 'end' },
          { word: 'Робот', position: 'start' }, { word: 'Сорока', position: 'middle' },
        ], syllables: ['РА', 'РО', 'РУ', 'АР', 'ОР', 'УР'],
      },
    ],
  },
  {
    stage: 3,
    title: 'Буквы и слоги',
    description: 'Алфавит, звуко-буквенный анализ, слоги, составление слов',
    sounds: [
      {
        sound: 'А-Я', words: [
          { word: 'Алфавит', position: 'start' }, { word: 'Яблоко', position: 'start' },
          { word: 'Буква', position: 'middle' },
        ], syllables: ['МЯ', 'СЯ', 'ЛЯ', 'РЯ', 'НЯ'],
      },
      {
        sound: 'Е-Ё', words: [
          { word: 'Енот', position: 'start' }, { word: 'Ёжик', position: 'start' },
          { word: 'Печенье', position: 'middle' },
        ], syllables: ['МЕ', 'МЁ', 'СЕ', 'СЁ'],
      },
      {
        sound: 'И-Ю', words: [
          { word: 'Иголка', position: 'start' }, { word: 'Юла', position: 'start' },
          { word: 'Ключ', position: 'middle' },
        ], syllables: ['МИ', 'СИ', 'ЛИ', 'РИ'],
      },
    ],
  },
  {
    stage: 4,
    title: 'Чтение и речь',
    description: 'Чтение слов, фраз, предложений, грамматика, пересказ',
    sounds: [],
  },
  {
    stage: 5,
    title: 'Школа',
    description: 'Беглое чтение, счёт, письмо, логика',
    sounds: [],
  },
]
