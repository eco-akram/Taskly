import { useSyncExternalStore } from 'react'

const KEY = 'taskly.board.v1'

const seed = () => {
  const c = (id, title, note, tag) => ({ id, title, note, tag })
  const cards = [
    c('c1', 'Sketch the new landing hero', 'Try a collage layout with floating chips.', 'design'),
    c('c2', 'Write the warning-label headline', undefined, 'copy'),
    c('c3', 'Pick a serif for display type', 'Instrument Serif vs Cormorant.', 'design'),
    c('c4', 'Wire drag-and-drop on the board', undefined, 'build'),
    c('c5', 'Ship to-do list to friends for feedback', undefined, 'launch'),
    c('c6', 'Buy domain taskly.so', undefined, 'ops'),
  ]
  return {
    cards: Object.fromEntries(cards.map(x => [x.id, x])),
    columns: [
      { id: 'todo',  title: 'To do',       cardIds: ['c1', 'c2', 'c3'] },
      { id: 'doing', title: 'In progress',  cardIds: ['c4'] },
      { id: 'done',  title: 'Done',         cardIds: ['c5', 'c6'] },
    ],
  }
}

let state = seed()
let hydrated = false
const listeners = new Set()

function hydrate() {
  if (hydrated || typeof window === 'undefined') return
  hydrated = true
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) state = JSON.parse(raw)
  } catch {}
}

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
}

function emit() {
  persist()
  listeners.forEach(l => l())
}

const subscribe = l => { listeners.add(l); return () => listeners.delete(l) }
const getSnapshot = () => { hydrate(); return state }
const getServerSnapshot = () => state

export const useBoard = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

const uid = () => Math.random().toString(36).slice(2, 10)

export const boardActions = {
  addCard(columnId, title) {
    const id = uid()
    state = {
      ...state,
      cards: { ...state.cards, [id]: { id, title, note: '', tag: '' } },
      columns: state.columns.map(c =>
        c.id === columnId ? { ...c, cardIds: [...c.cardIds, id] } : c
      ),
    }
    emit()
  },
  updateCard(id, patch) {
    state = { ...state, cards: { ...state.cards, [id]: { ...state.cards[id], ...patch } } }
    emit()
  },
  deleteCard(id) {
    const { [id]: _, ...rest } = state.cards
    state = {
      ...state,
      cards: rest,
      columns: state.columns.map(c => ({ ...c, cardIds: c.cardIds.filter(x => x !== id) })),
    }
    emit()
  },
  addColumn(title) {
    const id = uid()
    state = { ...state, columns: [...state.columns, { id, title, cardIds: [] }] }
    emit()
  },
  renameColumn(id, title) {
    state = { ...state, columns: state.columns.map(c => c.id === id ? { ...c, title } : c) }
    emit()
  },
  deleteColumn(id) {
    const col = state.columns.find(c => c.id === id)
    if (!col) return
    const { ...rest } = state.cards
    col.cardIds.forEach(cid => delete rest[cid])
    state = { cards: rest, columns: state.columns.filter(c => c.id !== id) }
    emit()
  },
  moveCard(cardId, toColumnId, toIndex) {
    const columns = state.columns.map(c => ({ ...c, cardIds: c.cardIds.filter(x => x !== cardId) }))
    const target = columns.find(c => c.id === toColumnId)
    if (!target) return
    target.cardIds.splice(toIndex, 0, cardId)
    state = { ...state, columns }
    emit()
  },
  reset() {
    state = seed()
    emit()
  },
}
