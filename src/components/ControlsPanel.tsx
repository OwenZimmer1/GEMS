import React from 'react';

type Props = {
  onCompute: () => void;
  onSave?: () => void;  // optional save callback
  onLoad?: () => void;  // optional load callback
};

 

export function ControlsPanel({ onCompute, onSave, onLoad }: Props) {
  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={onCompute}>Compute Dominating Set</button>

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
