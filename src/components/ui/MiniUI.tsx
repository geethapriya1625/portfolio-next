/** Small CSS-only mock screens, one per project. Decorative and labelled "Illustrative UI". */

export const miniCss = `
.mui{height:100%;display:flex;flex-direction:column;border-radius:18px;background:var(--paper);box-shadow:var(--hair);overflow:hidden;font-size:12px}
.mui-bar{display:flex;align-items:center;gap:6px;padding:10px 12px;border-bottom:1px solid var(--line)}
.mui-bar i{width:8px;height:8px;border-radius:50%;background:#cfccc6}
.mui-bar span{margin-left:8px;font-family:var(--font-mono);font-size:10.5px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mui-body{flex:1;padding:14px;display:flex;flex-direction:column;gap:8px;min-height:0;overflow:hidden}
.mui-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 11px;border-radius:10px;background:#fff;box-shadow:var(--hair)}
.mui-row b{font-weight:600}
.mui-mono{font-family:var(--font-mono);font-size:10.5px;color:var(--ink-2)}
.mui-tag{flex:none;font-family:var(--font-mono);font-size:10px;padding:3px 7px;border-radius:99px;box-shadow:var(--hair);color:var(--ink-2)}
.mui-tag.solid{background:var(--ink);color:#fff;box-shadow:none}
.mui-tag.ghost{color:var(--mute);border:1px dashed var(--faint);box-shadow:none}
.mui-label{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin-top:4px}
.mui-log{font-family:var(--font-mono);font-size:10.5px;line-height:1.7;color:var(--ink-2);background:#fff;border-radius:10px;box-shadow:var(--hair);padding:10px 12px}
.mui-log s{text-decoration:none;color:var(--mute)}
.mui-btn{align-self:flex-start;margin-top:auto;padding:8px 14px;border-radius:99px;background:var(--ink);color:#fff;font-weight:600;font-size:11.5px}
.mui-steps{display:grid;gap:0;padding-left:6px}
.mui-step{position:relative;display:flex;align-items:center;gap:12px;padding:9px 0}
.mui-step::before{content:"";position:absolute;left:6px;top:26px;bottom:-8px;width:1px;background:var(--line)}
.mui-step:last-child::before{display:none}
.mui-step i{width:13px;height:13px;flex:none;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--ink)}
.mui-step.done i{background:var(--ink)}
.mui-step.wait i{box-shadow:inset 0 0 0 1.5px var(--faint)}
.mui-bucket{display:flex;gap:4px}
.mui-bucket i{flex:1;height:18px;border-radius:4px;background:var(--ink)}
.mui-bucket i.e{background:#fff;box-shadow:var(--hair)}
.mui-table{width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:var(--hair)}
.mui-table th,.mui-table td{padding:8px 10px;text-align:left;border-bottom:1px solid var(--line)}
.mui-table th{font-family:var(--font-mono);font-size:10px;font-weight:400;color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
.mui-table tr:last-child td{border-bottom:0}
.mui-spark{background:#fff;border-radius:10px;box-shadow:var(--hair);padding:10px}
.mui-spark svg{width:100%;height:110px}
`;

const Bar = ({ title }: { title: string }) => (
  <div className="mui-bar">
    <i />
    <i />
    <i />
    <span>{title}</span>
  </div>
);

function Soc() {
  return (
    <>
      <Bar title="triage / incident queue" />
      <div className="mui-body">
        <div className="mui-log">
          <s>02:14:07</s> auth.fail user=svc-backup x12
          <br />
          <s>02:14:09</s> proc.spawn powershell -enc …
          <br />
          <s>02:14:11</s> net.out 443 → unknown host
        </div>
        <p className="mui-label">Prioritized directives</p>
        <div className="mui-row">
          <span>Isolate host and capture memory</span>
          <span className="mui-tag solid">P1</span>
        </div>
        <div className="mui-row">
          <span>Reset service account credentials</span>
          <span className="mui-tag">P2</span>
        </div>
        <div className="mui-row">
          <span>Review outbound destination</span>
          <span className="mui-tag">P3</span>
        </div>
        <span className="mui-btn">Awaiting analyst approval</span>
      </div>
    </>
  );
}

function Approval() {
  return (
    <>
      <Bar title="POST /requests/{id}/approve" />
      <div className="mui-body">
        <div className="mui-row">
          <b>Request #1042</b>
          <span className="mui-mono">version 3</span>
        </div>
        <div className="mui-steps">
          <div className="mui-step done">
            <i /> Submitted by requester
          </div>
          <div className="mui-step done">
            <i /> Approved by manager
          </div>
          <div className="mui-step">
            <i /> Finance review
          </div>
          <div className="mui-step wait">
            <i /> Completed
          </div>
        </div>
        <div className="mui-log">
          Idempotency-Key: 7f3c…a91
          <br />
          <s>retry →</s> same response, no double approval
          <br />
          <s>outbox →</s> request.approved published
        </div>
      </div>
    </>
  );
}

function Rate() {
  return (
    <>
      <Bar title="token bucket · user:42" />
      <div className="mui-body">
        <p className="mui-label">Tokens left</p>
        <div className="mui-bucket" aria-hidden="true">
          <i />
          <i />
          <i className="e" />
          <i className="e" />
          <i className="e" />
          <i className="e" />
        </div>
        <div className="mui-log">
          GET /api/orders <b>200</b> <s>RateLimit-Remaining: 2</s>
          <br />
          GET /api/orders <b>200</b> <s>RateLimit-Remaining: 1</s>
          <br />
          GET /api/orders <b>200</b> <s>RateLimit-Remaining: 0</s>
          <br />
          GET /api/orders <b>429</b> <s>Retry-After: 1</s>
        </div>
        <div className="mui-row">
          <span>Redis down</span>
          <span className="mui-tag">fail-open</span>
        </div>
      </div>
    </>
  );
}

function Eval() {
  return (
    <>
      <Bar title="eval run vs baseline" />
      <div className="mui-body">
        <table className="mui-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Schema</th>
              <th>Match</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>category</td>
              <td>✓</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>priority</td>
              <td>✓</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>due_date</td>
              <td>repaired</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>owner</td>
              <td>✓</td>
              <td>✗</td>
            </tr>
          </tbody>
        </table>
        <div className="mui-row">
          <span>Regression check</span>
          <span className="mui-tag solid">CI gate</span>
        </div>
      </div>
    </>
  );
}

function Sql() {
  return (
    <>
      <Bar title="mcp · run_query" />
      <div className="mui-body">
        <div className="mui-row">
          <span className="mui-mono">SELECT name, city FROM customers</span>
          <span className="mui-tag solid">allowed</span>
        </div>
        <div className="mui-row">
          <span className="mui-mono">DELETE FROM customers</span>
          <span className="mui-tag ghost">rejected</span>
        </div>
        <div className="mui-row">
          <span className="mui-mono">SELECT email FROM customers</span>
          <span className="mui-tag">masked</span>
        </div>
        <div className="mui-log">
          <s>guard</s> AST parse → read-only ✓
          <br />
          <s>db</s> statement timeout, row cap
          <br />
          <s>audit</s> query logged
        </div>
      </div>
    </>
  );
}

function Btc() {
  const pts = [38, 42, 40, 47, 45, 52, 49, 55, 60, 57, 63, 61, 68, 66, 72];
  const w = 300;
  const h = 100;
  const d = pts.map((p, i) => `${i ? "L" : "M"}${((i / (pts.length - 1)) * w).toFixed(1)},${(h - p).toFixed(1)}`).join(" ");
  return (
    <>
      <Bar title="signals → movement" />
      <div className="mui-body">
        <div className="mui-spark">
          <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={`${d} L${w},${h} L0,${h} Z`} fill="rgba(13,13,13,.06)" />
            <path d={d} fill="none" stroke="#0d0d0d" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="mui-row">
          <span>Tweet engagement</span>
          <span className="mui-mono">likes · retweets · replies</span>
        </div>
        <div className="mui-row">
          <span>Q-learning agent</span>
          <span className="mui-tag solid">predicts ↑ / ↓</span>
        </div>
      </div>
    </>
  );
}

const MAP: Record<string, () => React.JSX.Element> = {
  "soc-agent": Soc,
  "approval-workflow": Approval,
  "rate-limiter": Rate,
  "eval-harness": Eval,
  "sql-guard": Sql,
  bitcoin: Btc,
};

export default function MiniUI({ id }: { id: string }) {
  const C = MAP[id];
  if (!C) return null;
  return (
    <div className="mui" aria-hidden="true">
      <C />
    </div>
  );
}
