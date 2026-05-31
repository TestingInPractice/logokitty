import { openDB, type IDBPDatabase } from 'idb'
import type { User, Child, Cat, ShopItem, Inventory, GameSession, SoundProgress, DiagnosticResult, Subscription, Referral, LogEntry, VoiceProfile, FeatureFlag, AppSetting } from '../types'

const DB_NAME = 'logokitty'
const DB_VERSION = 1

let _db: IDBPDatabase | null = null

async function getDb() {
  if (_db) return _db
  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('user')) db.createObjectStore('user')
      if (!db.objectStoreNames.contains('children')) db.createObjectStore('children', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('cats')) db.createObjectStore('cats', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('inventory')) db.createObjectStore('inventory', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('sessions')) db.createObjectStore('sessions', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('soundProgress')) db.createObjectStore('soundProgress', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('diagnostics')) db.createObjectStore('diagnostics', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('subscriptions')) db.createObjectStore('subscriptions', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('referrals')) db.createObjectStore('referrals', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('logs')) db.createObjectStore('logs', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('voiceProfiles')) db.createObjectStore('voiceProfiles', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('featureFlags')) db.createObjectStore('featureFlags', { keyPath: 'id' })
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' })
    },
  })
  return _db
}

function generateId(): string { return crypto.randomUUID() }

function now(): number { return Date.now() }

export const db = {
  async ready() { await getDb() },

  async getUser(): Promise<User | null> {
    const d = await getDb()
    const user = await d.get('user', 'current')
    return user ?? null
  },
  async setUser(u: User) {
    const d = await getDb(); await d.put('user', u, 'current')
  },
  async clearUser() {
    const d = await getDb(); await d.delete('user', 'current')
  },

  async getChildren(): Promise<Child[]> {
    const d = await getDb(); return (await d.getAll('children')) ?? []
  },
  async setChildren(children: Child[]) {
    const d = await getDb()
    await d.clear('children')
    for (const c of children) await d.put('children', c)
  },
  async addChild(child: Child) {
    const d = await getDb(); await d.put('children', child)
  },
  async updateChild(id: string, upd: Partial<Child>) {
    const d = await getDb(); const existing = await d.get('children', id)
    if (existing) await d.put('children', { ...existing, ...upd })
  },
  async deleteChild(id: string) {
    const d = await getDb(); await d.delete('children', id)
  },

  async getCat(childId: string): Promise<Cat | null> {
    const d = await getDb()
    const all = await d.getAll('cats')
    return all.find(c => c.childId === childId) ?? null
  },
  async saveCat(cat: Cat) {
    const d = await getDb(); await d.put('cats', cat)
  },
  async deleteCat(childId: string) {
    const d = await getDb(); const cat = await this.getCat(childId)
    if (cat) await d.delete('cats', cat.id)
  },

  async getInventory(childId: string): Promise<Inventory[]> {
    const d = await getDb()
    return (await d.getAll('inventory')).filter(i => i.childId === childId)
  },
  async addToInventory(item: Inventory) {
    const d = await getDb(); await d.put('inventory', item)
  },
  async deleteFromInventory(id: string) {
    const d = await getDb(); await d.delete('inventory', id)
  },

  async addSession(session: GameSession) {
    const d = await getDb(); await d.put('sessions', session)
  },
  async getSessions(childId: string): Promise<GameSession[]> {
    const d = await getDb()
    return (await d.getAll('sessions')).filter(s => s.childId === childId)
  },

  async getSoundProgress(childId: string): Promise<SoundProgress[]> {
    const d = await getDb()
    return (await d.getAll('soundProgress')).filter(s => s.childId === childId)
  },
  async saveSoundProgress(sp: SoundProgress) {
    const d = await getDb(); await d.put('soundProgress', sp)
  },

  canClaimDaily(child: Child): boolean {
    if (!child.lastDailyRewardAt) return true
    return new Date(child.lastDailyRewardAt).toDateString() !== new Date().toDateString()
  },

  claimDaily(child: Child): Child {
    return { ...child, foodBalance: child.foodBalance + 50, lastDailyRewardAt: now() }
  },

  generateId, now,
}
