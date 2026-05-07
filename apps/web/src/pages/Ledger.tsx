import { useEffect, useState } from 'react';
import { Panel } from '../components/Panel.js';
import { api } from '../api.js';
import type { LedgerResponse } from '@rpow/shared';

export function LedgerPage() {
  const [d, setD] = useState<LedgerResponse | null>(null);
  useEffect(() => { api.ledger().then(setD); }, []);
  if (!d) return <Panel title="PUBLIC LEDGER"><div>loading...</div></Panel>;
  return (
    <Panel title="PUBLIC LEDGER">
      <pre style={{ margin: 0 }}>
{`  TOTAL MINTED        : ${d.total_minted}
  TOTAL TRANSFERRED   : ${d.total_transferred}
  CIRCULATING SUPPLY  : ${d.circulating_supply}
  CURRENT DIFFICULTY  : ${d.current_difficulty_bits} trailing zero bits
  USER COUNT          : ${d.user_count}
`}
      </pre>
      <div style={{ marginTop: 12 }} className="tagline">
        a tribute to the original rpow by hal finney —
        <a href="https://nakamotoinstitute.org/finney/rpow/" target="_blank" rel="noreferrer"> finney's announcement</a>
      </div>
    </Panel>
  );
}
