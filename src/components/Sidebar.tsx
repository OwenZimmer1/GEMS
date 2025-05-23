import React from 'react';

const nodeTypes = [
  { type: 'default', label: 'Default Node' },
  // Add more custom node types here
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onKeyDown = (event: React.KeyboardEvent, nodeType: string) => {
    // Optional: trigger dragstart on Enter or Space for accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // Since we can't do real dragstart via keyboard,
      // you might want to handle this differently (like a button that creates node)
    }
  };

  return (
    <aside
      style={{
        padding: 10,
        borderRight: '1px solid #ddd',
        width: 150,
        userSelect: 'none',
      }}
    >
      <h4>Drag Nodes</h4>
      {nodeTypes.map(({ type, label }) => (
        <div
          key={type}
          role="button"
          tabIndex={0}
          draggable={true}
          onDragStart={(e) => onDragStart(e, type)}
          onKeyDown={(e) => onKeyDown(e, type)}
          style={{
            padding: 8,
            marginBottom: 8,
            border: '1px solid #ccc',
            borderRadius: 3,
            cursor: 'grab',
            background: '#fff',
            textAlign: 'center',
          }}
          aria-grabbed="false"
        >
          {label}
        </div>
      ))}
    </aside>
  );
}
