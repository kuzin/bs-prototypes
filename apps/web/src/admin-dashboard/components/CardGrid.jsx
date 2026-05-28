import { useState, Fragment } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  pointerWithin,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Row-based, flexbox layout. The dashboard is a stack of rows; each row holds
// 1–2 cards that split the width equally (flex: 1). Width is therefore pure
// CSS — no JS derivation — so it never flashes. Drag (dnd-kit):
//   • drop a card onto another card  → join that card's row (side by side)
//   • drop a card on an insert zone  → start a new full-width row
// Full-bleed widgets (fixedWidth) always sit alone in their own row.

// Rows hold at most two cards — full width (1) or two columns (2). No thirds.
const MAX_PER_ROW = 2;

const SplitIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="7" height="14" rx="1.5" />
    <rect x="14" y="5" width="7" height="14" rx="1.5" />
  </svg>
);
// Two stacked rows with a downward arrow — signals that dropping here will
// push the dragged card onto a new row underneath, instead of pairing.
const NewRowIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="16" height="6" rx="1.5" />
    <path d="M12 13v6" />
    <polyline points="9,16 12,19 15,16" />
  </svg>
);
// Hover hint shown on the card under the cursor: whether dropping will pair the
// two side-by-side (split) or push the dragged card to a new row below
// (locked — happens when the target's row is full or contains a full-bleed widget).
function DropBadge({ mode }) {
  if (mode !== "split" && mode !== "locked") return null;
  return (
    <div className={`adm-drop-badge adm-drop-badge--${mode}`}>
      {mode === "split" ? <SplitIcon /> : <NewRowIcon />}
      <span>{mode === "split" ? "Drop beside this" : "Drop onto a new row below"}</span>
    </div>
  );
}

function GridCard({ id, editing, dropModeFor, children }) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging, isOver } =
    useSortable({ id, disabled: !editing });
  const mode = isOver && !isDragging ? dropModeFor(id) : null;
  // Only the dynamic dnd-kit transform/transition stay inline; flex sizing lives
  // in CSS (.adm-grid-card) so the mobile breakpoint can override it.
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "adm-grid-card",
        editing && "is-draggable",
        isDragging && "is-dragging-source",
        isOver && !isDragging && "is-drop-target",
        mode && `is-drop-${mode}`,
      ].filter(Boolean).join(" ")}
      {...(editing ? attributes : {})}
      {...(editing ? listeners : {})}
    >
      {children}
      <DropBadge mode={mode} />
    </div>
  );
}

// Drop target between rows (for making a new row). Always rendered in edit mode
// so it doubles as the row gap — that way the spacing doesn't jump when a drag
// starts; the zone just becomes visible.
function InsertZone({ index }) {
  const { setNodeRef, isOver } = useDroppable({ id: `insert:${index}` });
  return <div ref={setNodeRef} className={`adm-insert-zone ${isOver ? "is-over" : ""}`} />;
}

export function CardGrid({ rows, editing, renderCard, onRowsChange, isFullBleed }) {
  const [activeId, setActiveId] = useState(null);
  const [activeWidth, setActiveWidth] = useState(null);
  const sensors = useSensors(
    // Distance constraint so clicks on inner controls (settings, remove,
    // toggles) still register — a drag only starts after moving 6px.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const findPos = (grid, id) => {
    for (let r = 0; r < grid.length; r++) {
      const c = grid[r].indexOf(id);
      if (c !== -1) return [r, c];
    }
    return [-1, -1];
  };

  // What happens if the dragged card is dropped on `targetId`:
  //   reorder → same row, cards just swap (no badge)
  //   split   → joins the target's row as a 2nd column
  //   locked  → can't pair (full-bleed card or row already full) → own row
  const dropModeFor = (targetId) => {
    if (!activeId || targetId === activeId) return null;
    const [fr] = findPos(rows, activeId);
    const [tr] = findPos(rows, targetId);
    if (fr === -1 || tr === -1) return null;
    if (fr === tr) return "reorder";
    const target = rows[tr];
    if (isFullBleed(activeId) || target.some((x) => isFullBleed(x)) || target.length >= MAX_PER_ROW) {
      return "locked";
    }
    return "split";
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    setActiveWidth(null);
    if (!over) return;
    const id = active.id;
    const overId = String(over.id);
    if (overId === id) return;

    const [fr, fc] = findPos(rows, id);
    if (fr === -1) return;

    // Drop into a gap → new full-width row.
    if (overId.startsWith("insert:")) {
      const insertIdx = parseInt(overId.slice(7), 10);
      const next = rows.map((r) => [...r]);
      next[fr].splice(fc, 1);
      // If the source row sat above the target and just emptied, it'll be
      // filtered out, so shift the insert index up to compensate.
      const adjusted = fr < insertIdx && next[fr].length === 0 ? insertIdx - 1 : insertIdx;
      next.splice(Math.max(0, Math.min(adjusted, next.length)), 0, [id]);
      onRowsChange(next.filter((r) => r.length > 0));
      return;
    }

    const [tr, tc] = findPos(rows, overId);
    if (tr === -1) return;

    // Same row → reorder. arrayMove swaps correctly in both directions.
    if (fr === tr) {
      const next = rows.map((r) => [...r]);
      next[fr] = arrayMove(next[fr], fc, tc);
      onRowsChange(next);
      return;
    }

    // Cross row → move into the target row, unless that would break the rules
    // (full-bleed card, or row already full), in which case make a new row.
    const next = rows.map((r) => [...r]);
    next[fr].splice(fc, 1);
    const target = next[tr];
    if (isFullBleed(id) || target.some((x) => isFullBleed(x)) || target.length >= MAX_PER_ROW) {
      next.splice(tr + 1, 0, [id]);
    } else {
      target.splice(Math.min(tc + 1, target.length), 0, id);
    }
    onRowsChange(next.filter((r) => r.length > 0));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={({ active }) => {
        setActiveId(active.id);
        const el = document.querySelector(`[data-widget-id="${active.id}"]`)?.closest(".adm-grid-card");
        setActiveWidth(el ? Math.round(el.getBoundingClientRect().width) : null);
      }}
      onDragCancel={() => { setActiveId(null); setActiveWidth(null); }}
      onDragEnd={handleDragEnd}
    >
      <div className={`adm-rows ${editing ? "is-editing" : ""} ${activeId ? "is-dragging" : ""}`}>
        {/* Insert zones only exist during a drag, so they reserve no space at
            rest. The leading zone lets you drop above the first row (new top
            row); the per-row zones drop below each row. */}
        {activeId && <InsertZone index={0} />}
        {rows.map((row, ri) => (
          <Fragment key={ri}>
            <SortableContext items={row} strategy={horizontalListSortingStrategy}>
              <div className="adm-row">
                {row.map((id) => (
                  <GridCard key={id} id={id} editing={editing} dropModeFor={dropModeFor}>
                    {renderCard(id)}
                  </GridCard>
                ))}
              </div>
            </SortableContext>
            {activeId && <InsertZone index={ri + 1} />}
          </Fragment>
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <div
            className="adm-grid-card adm-grid-card--overlay"
            style={activeWidth ? { width: activeWidth } : undefined}
          >
            {renderCard(activeId)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
