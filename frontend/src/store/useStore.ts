import { create } from 'zustand'
import type { User, Child, Cat, Page } from '../types'
import { db } from '../api/db'

interface State {
  user: User | null
  children: Child[]
  activeChildId: string | null
  page: Page
  cat: Cat | null
  dailyClaimed: boolean
  setUser: (u: User | null) => void
  setChildren: (c: Child[]) => void
  addChild: (c: Child) => void
  updateChild: (id: string, upd: Partial<Child>) => void
  setActiveChildId: (id: string | null) => void
  setPage: (p: Page) => void
  setCat: (c: Cat | null) => void
  setDailyClaimed: (v: boolean) => void
  init: () => void
}

export const useStore = create<State>((set, get) => ({
  user: null, children: [], activeChildId: null, page: 'auth', cat: null, dailyClaimed: false,
  setUser: (u) => { if (u) db.setUser(u); set({ user: u }) },
  setChildren: (c) => { db.setChildren(c); set({ children: c }) },
  addChild: (c) => { const ch = [...get().children, c]; db.setChildren(ch); set({ children: ch }) },
  updateChild: (id, upd) => { const ch = get().children.map(c => c.id === id ? { ...c, ...upd } : c); db.setChildren(ch); set({ children: ch }) },
  setActiveChildId: (id) => set({ activeChildId: id }),
  setPage: (p) => set({ page: p }),
  setCat: (c) => { if (c) db.saveCat(c); set({ cat: c }) },
  setDailyClaimed: (v) => set({ dailyClaimed: v }),
  init: () => {
    const user = db.getUser()
    const children = db.getChildren()
    const id = children[0]?.id ?? null
    const cat = id ? db.getCat(id) : null
    set({ user, children, activeChildId: id, cat, dailyClaimed: id ? !db.canClaimDaily(id) : false, page: user ? 'feed' : 'auth' })
  },
}))
