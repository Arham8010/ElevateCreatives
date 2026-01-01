import React, { useState } from 'react';
import { generateMarketingAudit } from './services/geminiService';
import type { AuditResult } from './types';

const AIAudit: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    goals: ''
  });
  const [result, setResult] = useState<AuditResult | null>(null);

  const captureLead = async (
    brand: string,
    niche: string,
    goals: string
  ): Promise<void> => {
    try {
      const leadData = new FormData();
      leadData.append('Audit Brand', brand);
      leadData.append('Audit Niche', niche);
      leadData.append('Audit Goal', goals);
      leadData.append('_subject', `🔥 NEW AUDIT LEAD: ${brand}`);
      leadData.append('_captcha', 'false');

      await fetch('https://formsubmit.co/ajax/bajiwu', {
        method: 'POST',
        body: leadData,
        headers: { Accept: 'application/json' }
      });
    } catch {
      console.warn('Lead capture skipped but audit continuing.');
    }
  };

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
      await captureLead(formData.name, formData.niche, formData.goals);
    } catch {
      alert('AI Agents are currently under high load. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="audit" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4">
        {!result ? (
          <form onSubmit={handleSubmit}>
            <input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Analyzing...' : 'Generate'}
            </button>
          </form>
        ) : (
          <div>
            <h4>{result.headline}</h4>
            <p>{result.summary}</p>

            {result.recommendations.map((rec: string, i: number) => (
              <p key={i}>{rec}</p>
            ))}

            <strong>{result.projectedGrowth}</strong>
          </div>
        )}
      </div>
    </section>
  );
};

export default AIAudit;
