import type { Level, Game, SectionId, ShopItem } from '../types'

export const levels: Level[] = Array.from({ length: 50 }, (_, i) => {
  const l = i + 1
  const stage = l > 40 ? 5 : l > 30 ? 4 : l > 20 ? 3 : l > 10 ? 2 : 1
  return {
    level: l, stage, expRequired: l * 100,
    rewardFood: l * 5, rewardGold: l % 5 === 0 ? 10 : null,
    unlockSection: l === 11 ? 'speech-dev' as SectionId : l === 21 ? 'educational' as SectionId : l === 31 ? 'school-prep' as SectionId : undefined,
    isStageComplete: l % 10 === 0,
  }
})

export function calcLevel(exp: number, currentLevel: number): { level: number; exp: number; leveledUp: boolean } {
  let level = currentLevel
  let xp = exp
  let leveledUp = false
  while (level < 50) {
    const req = levels.find(l => l.level === level)?.expRequired ?? level * 100
    if (xp >= req) { xp -= req; level++; leveledUp = true }
    else break
  }
  return { level, exp: xp, leveledUp }
}

export const games: Game[] = [
  { id:'g1', section:'speech-launch', title:'Найди звук', description:'Найди картинку с заданным звуком', category:'phonemic', stage:1, minAge:2, maxAge:8, expReward:30, foodReward:5, requiresSubscription:false, unlockLevel:null, usesSpeech:false },
  { id:'g2', section:'speech-launch', title:'Повтори за котиком', description:'Слушай и повторяй звуки', category:'articulation', stage:1, minAge:2, maxAge:8, expReward:40, foodReward:5, requiresSubscription:false, unlockLevel:null, usesSpeech:true },
  { id:'g3', section:'speech-dev', title:'Свистящие и шипящие', description:'Учимся произносить С, З, Ц, Ш, Ж', category:'whistling', stage:2, minAge:3, maxAge:8, expReward:50, foodReward:5, requiresSubscription:false, unlockLevel:11, usesSpeech:true },
  { id:'g4', section:'speech-dev', title:'Скороговорки', description:'Повторяем скороговорки', category:'tongue-twisters', stage:2, minAge:4, maxAge:8, expReward:60, foodReward:5, requiresSubscription:false, unlockLevel:15, usesSpeech:true },
  { id:'g5', section:'educational', title:'Найди пару', description:'Игра на память', category:'memory', stage:3, minAge:2, maxAge:8, expReward:25, foodReward:5, requiresSubscription:false, unlockLevel:21, usesSpeech:false },
  { id:'g6', section:'educational', title:'Логические ряды', description:'Продолжи ряд', category:'logic', stage:3, minAge:3, maxAge:8, expReward:35, foodReward:5, requiresSubscription:true, unlockLevel:25, usesSpeech:false },
  { id:'g7', section:'school-prep', title:'Алфавит', description:'Учим буквы', category:'alphabet', stage:4, minAge:4, maxAge:8, expReward:30, foodReward:5, requiresSubscription:false, unlockLevel:31, usesSpeech:true },
  { id:'g8', section:'school-prep', title:'Чтение', description:'Читаем первые слова', category:'reading', stage:4, minAge:5, maxAge:8, expReward:40, foodReward:5, requiresSubscription:false, unlockLevel:35, usesSpeech:false },
  { id:'g9', section:'speech-launch', title:'Подуй на шарик', description:'Тренируем выдох', category:'breathing', stage:1, minAge:2, maxAge:5, expReward:20, foodReward:5, requiresSubscription:false, unlockLevel:2, usesSpeech:false },
  { id:'g10', section:'speech-launch', title:'Словарь', description:'Учим новые слова', category:'vocabulary', stage:1, minAge:2, maxAge:8, expReward:20, foodReward:5, requiresSubscription:false, unlockLevel:3, usesSpeech:true },
  { id:'g11', section:'speech-dev', title:'Сонорные звуки', description:'Учимся произносить Л, Р', category:'sonor', stage:2, minAge:4, maxAge:8, expReward:50, foodReward:5, requiresSubscription:false, unlockLevel:16, usesSpeech:true },
  { id:'g12', section:'educational', title:'Запомни картинки', description:'Игра на внимание', category:'attention', stage:3, minAge:3, maxAge:8, expReward:25, foodReward:5, requiresSubscription:false, unlockLevel:22, usesSpeech:false },
]

export const sections = [
  { id: 'speech-launch' as SectionId, title: 'Запуск речи', description: 'Артикуляция, выдох, первые звуки', icon: '🗣️', stageRequired: 1 },
  { id: 'speech-dev' as SectionId, title: 'Развитие речи', description: 'Свистящие, шипящие, сонорные', icon: '📢', stageRequired: 2 },
  { id: 'educational' as SectionId, title: 'Развивающие игры', description: 'Логика, внимание, память', icon: '🧩', stageRequired: 3 },
  { id: 'school-prep' as SectionId, title: 'Подготовка к школе', description: 'Алфавит, счёт, чтение', icon: '📚', stageRequired: 4 },
]

export const shopItems: ShopItem[] = [
  { id:'h1', name:'Кепка', category:'hat', previewUrl:'🧢', priceFood:100, priceGold:null, levelRequirement:2, isPremium:false },
  { id:'h2', name:'Корона', category:'hat', previewUrl:'👑', priceFood:null, priceGold:5, levelRequirement:5, isPremium:false },
  { id:'h3', name:'Цилиндр', category:'hat', previewUrl:'🎩', priceFood:300, priceGold:null, levelRequirement:null, isPremium:true },
  { id:'g1', name:'Очки', category:'glasses', previewUrl:'👓', priceFood:150, priceGold:null, levelRequirement:3, isPremium:false },
  { id:'g2', name:'Солнцезащитные', category:'glasses', previewUrl:'🕶️', priceFood:null, priceGold:3, levelRequirement:null, isPremium:false },
  { id:'s1', name:'Шарфик', category:'scarf', previewUrl:'🧣', priceFood:80, priceGold:null, levelRequirement:1, isPremium:false },
  { id:'s2', name:'Бабочка', category:'scarf', previewUrl:'🎀', priceFood:200, priceGold:null, levelRequirement:4, isPremium:false },
  { id:'hs1', name:'Домик-тыква', category:'house', previewUrl:'🏠', priceFood:null, priceGold:10, levelRequirement:10, isPremium:false },
  { id:'b1', name:'Лес', category:'background', previewUrl:'🌲', priceFood:250, priceGold:null, levelRequirement:null, isPremium:true },
  { id:'b2', name:'Море', category:'background', previewUrl:'🌊', priceFood:null, priceGold:5, levelRequirement:8, isPremium:false },
]
