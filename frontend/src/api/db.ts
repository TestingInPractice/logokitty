import type { User, Child, Cat, ShopItem, Inventory, Game, Level, Section, GameSession } from '../types'

const K = { user: 'lk_user', children: 'lk_children', cats: 'lk_cats', inv: 'lk_inventory', sess: 'lk_sessions' }
const load = <T>(key: string, fb: T): T => { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb } catch { return fb } }
const save = (k: string, d: unknown) => localStorage.setItem(k, JSON.stringify(d))

export const db = {
  getUser: () => load<User | null>(K.user, null),
  setUser: (u: User) => save(K.user, u),
  getChildren: () => load<Child[]>(K.children, []),
  setChildren: (c: Child[]) => save(K.children, c),
  getCat: (id: string) => load<Cat[]>(K.cats, []).find(c => c.childId === id) ?? null,
  saveCat: (cat: Cat) => { const c = load<Cat[]>(K.cats, []); const i = c.findIndex(x => x.childId === cat.childId); if (i >= 0) c[i] = cat; else c.push(cat); save(K.cats, c) },
  getInventory: (id: string) => load<Inventory[]>(K.inv, []).filter(i => i.childId === id),
  addToInventory: (item: Inventory) => { const i = load<Inventory[]>(K.inv, []); i.push(item); save(K.inv, i) },
  addSession: (s: GameSession) => { const a = load<GameSession[]>(K.sess, []); a.push(s); save(K.sess, a) },
  canClaimDaily: (id: string): boolean => {
    const c = load<Child[]>(K.children, []).find(x => x.id === id)
    if (!c || !c.lastDailyRewardAt) return true
    return new Date(c.lastDailyRewardAt).toDateString() !== new Date().toDateString()
  },
  claimDaily: (id: string): boolean => {
    const ch = load<Child[]>(K.children, []); const i = ch.findIndex(c => c.id === id)
    if (i < 0) return false
    const c = ch[i]
    if (c.lastDailyRewardAt && new Date(c.lastDailyRewardAt).toDateString() === new Date().toDateString()) return false
    ch[i] = { ...c, foodBalance: c.foodBalance + 50, lastDailyRewardAt: Date.now() }; save(K.children, ch); return true
  },
}

export const shopItems: ShopItem[] = [
  { id:'h1',name:'Кепка',category:'hat',previewUrl:'🧢',priceFood:100,priceGold:null,levelRequirement:2,isPremium:false },
  { id:'h2',name:'Корона',category:'hat',previewUrl:'👑',priceFood:null,priceGold:5,levelRequirement:5,isPremium:false },
  { id:'h3',name:'Цилиндр',category:'hat',previewUrl:'🎩',priceFood:300,priceGold:null,levelRequirement:null,isPremium:true },
  { id:'g1',name:'Очки',category:'glasses',previewUrl:'👓',priceFood:150,priceGold:null,levelRequirement:3,isPremium:false },
  { id:'g2',name:'Солнцезащитные',category:'glasses',previewUrl:'🕶️',priceFood:null,priceGold:3,levelRequirement:null,isPremium:false },
  { id:'s1',name:'Шарфик',category:'scarf',previewUrl:'🧣',priceFood:80,priceGold:null,levelRequirement:1,isPremium:false },
  { id:'s2',name:'Бабочка',category:'scarf',previewUrl:'🎀',priceFood:200,priceGold:null,levelRequirement:4,isPremium:false },
  { id:'hs1',name:'Домик-тыква',category:'house',previewUrl:'🏠',priceFood:null,priceGold:10,levelRequirement:10,isPremium:false },
  { id:'b1',name:'Лес',category:'background',previewUrl:'🌲',priceFood:250,priceGold:null,levelRequirement:null,isPremium:true },
  { id:'b2',name:'Море',category:'background',previewUrl:'🌊',priceFood:null,priceGold:5,levelRequirement:8,isPremium:false },
]

export const levels: Level[] = Array.from({length:50},(_,i)=>{const l=i+1,s=l>10?l>20?l>30?l>40?5:4:3:2:1;return{level:l,stage:s,expRequired:l*100,rewardFood:l*5,rewardGold:l%5===0?10:null,isStageComplete:l%10===0}})

export const sections: Section[] = [
  {id:'speech-launch',title:'Запуск речи',description:'Артикуляция, выдох, первые звуки',icon:'🗣️',stageRequired:1,isUnlocked:true,games:[]},
  {id:'speech-dev',title:'Развитие речи',description:'Свистящие, шипящие, сонорные',icon:'📢',stageRequired:2,isUnlocked:false,games:[]},
  {id:'educational',title:'Развивающие игры',description:'Логика, внимание, память',icon:'🧩',stageRequired:3,isUnlocked:false,games:[]},
  {id:'school-prep',title:'Подготовка к школе',description:'Алфавит, счёт, чтение',icon:'📚',stageRequired:4,isUnlocked:false,games:[]},
]

const gdata: Game[] = [
  {id:'g1',section:'speech-launch',title:'Найди звук',description:'Найди картинку с заданным звуком',category:'phonemic',stage:1,minAge:2,maxAge:8,expReward:30,foodReward:5,requiresSubscription:false,unlockLevel:null,usesSpeech:false},
  {id:'g2',section:'speech-launch',title:'Повтори за котиком',description:'Слушай и повторяй звуки',category:'articulation',stage:1,minAge:2,maxAge:8,expReward:40,foodReward:5,requiresSubscription:false,unlockLevel:null,usesSpeech:true},
  {id:'g3',section:'speech-launch',title:'Подуй на шарик',description:'Тренируем выдох',category:'breathing',stage:1,minAge:2,maxAge:5,expReward:20,foodReward:5,requiresSubscription:false,unlockLevel:2,usesSpeech:false},
  {id:'g4',section:'speech-dev',title:'Свистящие и шипящие',description:'Учимся произносить С, З, Ц, Ш, Ж',category:'whistling',stage:2,minAge:3,maxAge:8,expReward:50,foodReward:5,requiresSubscription:false,unlockLevel:11,usesSpeech:true},
  {id:'g5',section:'speech-dev',title:'Скороговорки',description:'Повторяем скороговорки',category:'tongue-twisters',stage:2,minAge:4,maxAge:8,expReward:60,foodReward:5,requiresSubscription:false,unlockLevel:15,usesSpeech:true},
  {id:'g6',section:'educational',title:'Найди пару',description:'Игра на память',category:'memory',stage:3,minAge:2,maxAge:8,expReward:25,foodReward:5,requiresSubscription:false,unlockLevel:21,usesSpeech:false},
  {id:'g7',section:'educational',title:'Логические ряды',description:'Продолжи ряд',category:'logic',stage:3,minAge:3,maxAge:8,expReward:35,foodReward:5,requiresSubscription:true,unlockLevel:null,usesSpeech:false},
  {id:'g8',section:'school-prep',title:'Алфавит',description:'Учим буквы',category:'alphabet',stage:4,minAge:4,maxAge:8,expReward:30,foodReward:5,requiresSubscription:false,unlockLevel:31,usesSpeech:true},
  {id:'g9',section:'school-prep',title:'Слоги',description:'Составляем слова из слогов',category:'syllable',stage:4,minAge:5,maxAge:8,expReward:40,foodReward:5,requiresSubscription:false,unlockLevel:35,usesSpeech:false},
  {id:'g10',section:'speech-dev',title:'Словарь',description:'Учим новые слова',category:'vocabulary',stage:2,minAge:2,maxAge:8,expReward:20,foodReward:5,requiresSubscription:false,unlockLevel:12,usesSpeech:true},
]
export const games = gdata
sections.forEach(s => { s.games = gdata.filter(g => g.section === s.id) })
