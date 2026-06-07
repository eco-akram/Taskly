import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useBoard, boardActions } from '../lib/board-store'
import { cn } from '../lib/utils'

const TAG_STYLES = {
  design: 'bg-violet/15 text-violet',
  build:  'bg-ember/15 text-ember',
  copy:   'bg-mint/40 text-foreground',
  launch: 'bg-red-100 text-red-700',
  ops:    'bg-blue-100 text-blue-700',
}

function CardSurface({ card, colId, dragging }) {
  const [editing, setEditing] = useState(false)
  const textRef = useRef(null)

  function handleTitleBlur() {
    setEditing(false)
    const val = textRef.current?.innerText.trim()
    if (val && val !== card.title) boardActions.updateCard(card.id, { title: val })
  }

  return (
    <div className={cn(
      'group relative rounded-xl border border-border bg-background p-3 text-sm shadow-sm transition',
      dragging ? 'shadow-2xl rotate-2' : 'hover:border-foreground/30 cursor-grab active:cursor-grabbing'
    )}>
      {/* Delete btn */}
      <button
        onPointerDown={e => e.stopPropagation()}
        onClick={() => boardActions.deleteCard(card.id)}
        className="absolute right-2 top-2 rounded-md p-0.5 text-muted-foreground opacity-0 transition hover:text-foreground group-hover:opacity-100">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      {/* Title */}
      <p
        ref={textRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setEditing(true)}
        onBlur={handleTitleBlur}
        onPointerDown={e => e.stopPropagation()}
        className="w-full bg-transparent outline-none leading-snug pr-5"
      >
        {card.title}
      </p>

      {/* Note */}
      {card.note && (
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{card.note}</p>
      )}

      {/* Tag */}
      {card.tag && (
        <span className={cn(
          'mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
          TAG_STYLES[card.tag] ?? 'bg-muted text-muted-foreground'
        )}>
          {card.tag}
        </span>
      )}
    </div>
  )
}

function SortableCard({ card, colId }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id, data: { colId },
  })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardSurface card={card} colId={colId} />
    </div>
  )
}

function AddCardForm({ colId, onClose }) {
  const [title, setTitle] = useState('')
  function submit() {
    if (title.trim()) { boardActions.addCard(colId, title.trim()); onClose() }
  }
  return (
    <div className="mt-2 rounded-xl border border-border bg-background p-2">
      <textarea
        autoFocus
        rows={2}
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } if (e.key === 'Escape') onClose() }}
        placeholder="Card title…"
        className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <div className="mt-2 flex gap-2">
        <button onClick={submit} className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition hover:opacity-90">
          Add card
        </button>
        <button onClick={onClose} className="rounded-lg px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted">
          Cancel
        </button>
      </div>
    </div>
  )
}

function ColumnView({ col, cards, isOver }) {
  const [adding, setAdding] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const titleRef = useRef(null)

  const { setNodeRef } = useSortable({ id: col.id, data: { isColumn: true } })

  function handleTitleBlur() {
    setEditingTitle(false)
    const val = titleRef.current?.innerText.trim()
    if (val && val !== col.title) boardActions.renameColumn(col.id, val)
  }

  return (
    <div ref={setNodeRef} className={cn(
      'flex w-80 shrink-0 flex-col rounded-2xl border bg-card/60 p-3 backdrop-blur transition',
      isOver ? 'border-foreground/30 bg-card' : 'border-border'
    )}>
      {/* Column header */}
      <div className="flex items-center justify-between px-1 pb-2">
        <div className="flex items-center gap-2">
          <span
            ref={titleRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={() => setEditingTitle(true)}
            onBlur={handleTitleBlur}
            className="font-serif text-xl outline-none"
          >
            {col.title}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {cards.length}
          </span>
        </div>
        <button
          onClick={() => boardActions.deleteColumn(col.id)}
          className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Cards */}
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {cards.map(card => <SortableCard key={card.id} card={card} colId={col.id} />)}
        </div>
      </SortableContext>

      {/* Add card */}
      {adding
        ? <AddCardForm colId={col.id} onClose={() => setAdding(false)} />
        : <button
            onClick={() => setAdding(true)}
            className="mt-2 rounded-xl px-2 py-2 text-left text-sm text-muted-foreground transition hover:bg-muted/60">
            + Add a card
          </button>
      }
    </div>
  )
}

function AddColumnBtn() {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  function submit() {
    if (title.trim()) { boardActions.addColumn(title.trim()); setTitle(''); setAdding(false) }
  }
  if (adding) return (
    <div className="h-fit w-72 shrink-0 rounded-2xl border border-border bg-card/60 p-4">
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setAdding(false) }}
        placeholder="Column title…"
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <div className="mt-3 flex gap-2">
        <button onClick={submit} className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition hover:opacity-90">
          Add column
        </button>
        <button onClick={() => setAdding(false)} className="rounded-lg px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted">
          Cancel
        </button>
      </div>
    </div>
  )
  return (
    <button
      onClick={() => setAdding(true)}
      className="h-fit w-72 shrink-0 rounded-2xl border border-dashed border-border bg-card/30 p-4 text-left text-sm text-muted-foreground transition hover:border-foreground/30 hover:text-foreground">
      + Add column
    </button>
  )
}

export default function BoardPage() {
  const navigate = useNavigate()
  const board = useBoard()
  const [activeCardId, setActiveCardId] = useState(null)
  const [overColId, setOverColId] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const activeCard = activeCardId ? board.cards[activeCardId] : null

  function findColId(id) {
    if (board.columns.find(c => c.id === id)) return id
    return board.columns.find(c => c.cardIds.includes(id))?.id
  }

  function onDragStart({ active }) { setActiveCardId(active.id) }
  function onDragOver({ over }) { setOverColId(over ? findColId(over.id) : null) }
  function onDragEnd({ active, over }) {
    setActiveCardId(null); setOverColId(null)
    if (!over) return
    const fromCol = findColId(active.id)
    const toCol = findColId(over.id)
    if (!fromCol || !toCol) return
    const toColObj = board.columns.find(c => c.id === toCol)
    const toIndex = toColObj.cardIds.includes(over.id)
      ? toColObj.cardIds.indexOf(over.id)
      : toColObj.cardIds.length
    boardActions.moveCard(active.id, toCol, toIndex)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background bg-dotted">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-5">
        <button onClick={() => navigate('/')} className="font-serif text-xl font-bold text-foreground">
          Taskly
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (confirm('Reset board to defaults?')) boardActions.reset() }}
            className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium transition hover:bg-muted">
            Reset
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
            ← Home
          </button>
        </div>
      </header>

      {/* PAGE TITLE */}
      <div className="px-8 pb-6">
        <h1 className="font-serif text-4xl font-bold">
          Your <em>board</em>
        </h1>
        <p className="mt-1.5 text-sm text-violet">
          Drag cards between columns. Everything is saved locally to your browser.
        </p>
      </div>

      {/* BOARD */}
      <div className="flex-1 overflow-x-auto px-8 pb-24">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
          <div className="flex gap-4 items-start w-max">
            {board.columns.map(col => {
              const cards = col.cardIds.map(id => board.cards[id]).filter(Boolean)
              return <ColumnView key={col.id} col={col} cards={cards} isOver={overColId === col.id} />
            })}
            <AddColumnBtn />
          </div>
          <DragOverlay>
            {activeCard && <CardSurface card={activeCard} dragging />}
          </DragOverlay>
        </DndContext>
      </div>

      {/* BOTTOM TOOLBAR */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-4 rounded-full border bg-card px-5 py-2.5 shadow-lg">
          {[
            <><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/><path d="M8 6h13M8 12h13M8 18h13"/></>,
            <><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></>,
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>,
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>,
          ].map((icon, i) => (
            <svg key={i} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground transition hover:text-foreground cursor-pointer">
              {icon}
            </svg>
          ))}
        </div>
      </div>
    </div>
  )
}
