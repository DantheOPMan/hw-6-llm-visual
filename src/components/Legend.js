import React from 'react';

function Legend() {
  const models = ["GPT-4", "Gemini", "PaLM-2", "Claude", "LLaMA-3.1"];
  const colors = ["#ff7f00", "#984ea3", "#4daf4a", "#377eb8", "#e41a1c"];
  
  return (
    <div style={{ marginLeft: 20 }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {models.map((model, index) => (
          <li key={model} style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
            <div style={{ width: 20, height: 20, backgroundColor: colors[index], marginRight: 10 }}></div>
            <span>{model}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Legend;
