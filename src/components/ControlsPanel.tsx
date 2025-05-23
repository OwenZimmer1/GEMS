// src/components/ControlsPanel.tsx
import React from 'react';

type Props = {
  onCompute: () => void;
  onReset?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
};

export function ControlsPanel({ onCompute, onReset, onSave, onLoad }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={onCompute}>Compute Dominating Set</button>

      {onReset && (
        <button onClick={onReset} style={{ marginLeft: 10 }}>
          Reset Dominating Set
        </button>
      )}

      {onSave && (
        <button onClick={onSave} style={{ marginLeft: 10 }}>
          Save Graph
        </button>
      )}

      {onLoad && (
        <button onClick={onLoad} style={{ marginLeft: 10 }}>
          Load Graph
        </button>
      )}
    </div>
  );
}
