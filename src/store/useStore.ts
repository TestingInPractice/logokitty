import { create } from 'zustand'
import type { User, Child, Cat } from '../types'

interface State {
  user: User | null
  children: Child[]
  activeChildId: string | null
  cat: Cat | null
  setUser: (u: User | null) => void
  setChildren: (c: Child[]) => void
  addChild: (c: Child) => void
  updateChild: (id: string, upd: Partial<Child>) => void
  setActiveChildId: (id: string | null) => void
  setCat: (c: Cat | null) => void
  loadUser: () => Promise<void>
}

export const useStore = create<State>((set, get) => ({
  user: null,
  children: [],
  activeChildId: null,
  cat: null,

  setUser: (u) => set({ user: u }),

  setChildren: (c) => set({ children: c }),

  addChild: (c) => set({ children: [...get().children, c] }),

  updateChild: (id, upd) =>
    set({ children: get().children.map(c => c.id === id ? { ...c, ...upd } : c) }),

  setActiveChildId: (id) => set({ activeChildId: id }),

  setCat: (c) => set({ cat: c }),

  loadUser: async () => {
    const { db } = await import('../api/db')
    const user = await db.getUser()
    if (!user) { set({ user: null, children: [], activeChildId: null, cat: null }); return }
    const children = await db.getChildren()
    const id = children[0]?.id ?? null
    const cat = id ? await db.getCat(id) : null
    set({ user, children, activeChildId: id, cat })
  },
}))
