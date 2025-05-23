// Sidebar.tsx
import React from 'react';

const nodeTypes = [
  { type: 'default', label: 'Default Node' },
  // Add more custom node types here
];

type Props = {
  onAddNode: (nodeType: string) => void;
};

export function Sidebar({ onAddNode }: Props) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside
      style={{
        padding: 10,
        borderRight: '1px solid #ddd',
        width: 180,
        userSelect: 'none',
      }}
    >
      <h4>Nodes</h4>
      {nodeTypes.map(({ type, label }) => (
        <div key={type} style={{ marginBottom: 12 }}>
          {/* 1️⃣ Drag handle */}
          <div
            role="button"
            tabIndex={0}
            draggable
            onDragStart={(e) => onDragStart(e, type)}
            style={{
              padding: 6,
              border: '1px solid #ccc',
              borderRadius: 4,
              cursor: 'grab',
              background: '#fff',
              textAlign: 'center',
            }}
          >
            Drag {label}
          </div>

          {/* 2️⃣ Add button */}
          <button
            onClick={() => onAddNode(type)}
            style={{
              marginTop: 4,
              width: '100%',
              padding: '6px 0',
              borderRadius: 4,
              border: '1px solid #666',
              background: '#f0f0f0',
              cursor: 'pointer',
            }}
          >
            + Add {label}
          </button>
        </div>
      ))}
    </aside>
  );
}
