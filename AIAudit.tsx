import React, { useState } from 'react';
import { generateMarketingAudit } from '../services/geminiService';
import type { AuditResult } from '../types';

const AIAudit: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    goals: ''
  });
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const audit = await generateMarketingAudit(
        formData.name,
        formData.niche,
        formData.goals
      );
      setResult(audit);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      {!result ? (
        <form onSubmit={handleSubmit}>
          <input
            required
            placeholder="Brand name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <button disabled={loading} type="submit">
            {loading ? 'Analyzing...' : 'Generate'}
          </button>
        </form>
      ) : (
        <div>
          <h3>{result.headline}</h3>
          <p>{result.summary}</p>

          {result.recommendations.map((rec, i) => (
            <p key={i}>{rec}</p>
          ))}

          <strong>{result.projectedGrowth}</strong>
        </div>
      )}
    </section>
  );
};

export default AIAudit;
