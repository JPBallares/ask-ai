import { ChatContext } from '@/contexts/ChatContext';
import { IModel, gptModelsKeys } from '@/utils/openai';
import React, { useContext } from 'react';
import RangeSlider from '../RangeSlider';

const ConfigurationBar: React.FC = () => {
  const {
    model,
    system,
    temperature,
    maxTokens,
    topP,
    frequencyPenalty,
    presencePenalty,
    setModel,
    setSystem,
    setTemperature,
    setMaxTokens,
    setTopP,
    setFrequencyPenalty,
    setPresencePenalty,
  } = useContext(ChatContext);
  return (
    <div className="flex flex-col w-64 p-2">
      <div className="flex-1 flex flex-col">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value as IModel)}
          className="w-full border rounded-md p-2 mb-2 dark:text-slate-300 max-h-32 bg-slate-900 border-slate-600"
        >
          {gptModelsKeys.map((modelKey) => (
            <option key={modelKey} value={modelKey}>
              {modelKey}
            </option>
          ))}
        </select>
        <textarea
          value={system}
          onChange={(e) => setSystem(e.target.value)}
          className="flex-1 w-full border rounded-md p-2 resize-none dark:text-slate-300 bg-slate-900 border-slate-600 mb-2"
        />

        <RangeSlider
          id="temperature-range"
          label="Temperature"
          value={temperature}
          min={0}
          max={1}
          step={0.01}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
        />
        <RangeSlider
          id="max-tokens-range"
          label="Max tokens"
          value={maxTokens}
          min={1}
          max={4095}
          step={1}
          onChange={(e) => setMaxTokens(parseInt(e.target.value))}
        />
        <RangeSlider
          id="top-p-range"
          label="Top P"
          value={topP}
          min={0}
          max={1}
          step={0.01}
          onChange={(e) => setTopP(parseFloat(e.target.value))}
        />
        <RangeSlider
          id="frequency-penalty-range"
          label="Frequency penalty"
          value={frequencyPenalty}
          min={0}
          max={2}
          step={0.01}
          onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
        />
        <RangeSlider
          id="presence-penalty-range"
          label="Presence penalty"
          value={presencePenalty}
          min={0}
          max={2}
          step={0.01}
          onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};

export default ConfigurationBar;
