import { useState } from 'react'

const DEFAULT = {
  columns: [
    {
      id: 'col-1', title: 'To do',
      cards: [
        { id: 'c1', title: 'Sketch the new landing hero', desc: 'Try a collage layout with floating chips.', tag: 'DESIGN' },
        { id: 'c2', title: 'Write the warning-label headline', desc: '', tag: 'COPY' },
        { id: 'c3', title: 'Pick a serif for display type', desc: 'Instrument Serif vs Cormorant.', tag: 'DESIGN' },
      ],
    },
    {
      id: 'col-2', title: 'In progress',
      cards: [
        { id: 'c4', title: 'Wire drag-and-drop on the board', desc: '', tag: 'BUILD' },
      ],
    },
    {
      id: 'col-3', title: 'Done',
      cards: [
        { id: 'c5', title: 'Ship to-do list to friends for feedback', desc: '', tag: 'LAUNCH' },
        { id: 'c6', title: 'Buy domain taskly.so', desc: '', tag: 'OPS' },
      ],
    },
  ],
}

function load() {
  try {
    const s = localStorage.getItem('taskly-board')
    return s ? JSON.parse(s) : structuredClone(DEFAULT)
  } catch { return structuredClone(DEFAULT) }
}

function uid() { return Math.random().toString(36).slice(2, 9) }

export function useBoard() {
  const [data, setData] = useState(load)

  function save(next) {
    setData(next)
    localStorage.setItem('taskly-board', JSON.stringify(next))
  }

  function moveCard(cardId, fromColId, toColId) {
    if (fromColId === toColId) return
    const next = structuredClone(data)
    const from = next.columns.find(c => c.id === fromColId)
    const to = next.columns.find(c => c.id === toColId)
    const idx = from.cards.findIndex(c => c.id === cardId)
    const [card] = from.cards.splice(idx, 1)
    to.cards.push(card)
    save(next)
  }

  function addCard(colId, title, desc, tag) {
    const next = structuredClone(data)
    next.columns.find(c => c.id === colId).cards.push({ id: uid(), title, desc, tag })
    save(next)
  }

  function deleteCard(colId, cardId) {
    const next = structuredClone(data)
    const col = next.columns.find(c => c.id === colId)
    col.cards = col.cards.filter(c => c.id !== cardId)
    save(next)
  }

  function addColumn(title) {
    const next = structuredClone(data)
    next.columns.push({ id: 'col-' + uid(), title, cards: [] })
    save(next)
  }

  function deleteColumn(colId) {
    const next = structuredClone(data)
    next.columns = next.columns.filter(c => c.id !== colId)
    save(next)
  }

  function reset() {
    save(structuredClone(DEFAULT))
  }

  return { data, moveCard, addCard, deleteCard, addColumn, deleteColumn, reset }
}
