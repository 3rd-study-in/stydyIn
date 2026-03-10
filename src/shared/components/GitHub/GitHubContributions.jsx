import { useState, useEffect, useRef } from 'react';

const COLORS = {
  0: '#ebedf0',
  1: '#9be9a8',
  2: '#40c463',
  3: '#30a14e',
  4: '#216e39',
};

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DAY_LABEL = { 1: 'M', 3: 'W', 5: 'F' };
const LABEL_W = 22;

function GitHubContributions({ username }) {
  const [weeks, setWeeks] = useState([]);
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cell, setCell] = useState(10);
  const [gap, setGap] = useState(2);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || weeks.length === 0) return;
    const compute = () => {
      const totalW = containerRef.current.clientWidth - 16;
      const gridW = totalW - LABEL_W - 4;
      const step = Math.floor(gridW / weeks.length);
      const newGap = Math.max(1, Math.round(step * 0.17));
      setCell(Math.max(6, step - newGap));
      setGap(newGap);
    };
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [weeks]);

  useEffect(() => {
    if (!username) {
      setWeeks([]);
      setMonths([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');

    const year = new Date().getFullYear();
    fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`,
    )
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(({ contributions }) => {
        const weeksArr = [];
        let week = [];
        contributions.forEach((day, i) => {
          const dow = new Date(day.date + 'T00:00:00').getDay();
          if (i === 0 && dow > 0) {
            for (let p = 0; p < dow; p++) week.push(null);
          }
          week.push(day);
          if (dow === 6) {
            weeksArr.push(week);
            week = [];
          }
        });
        if (week.length) {
          while (week.length < 7) week.push(null);
          weeksArr.push(week);
        }
        setWeeks(weeksArr);
      })
      .catch(() => setError('GitHub 사용자를 찾을 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    if (weeks.length === 0) return;
    const step = cell + gap;
    const seen = new Set();
    const monthArr = [];
    weeks.forEach((w, wi) => {
      for (const day of w) {
        if (!day) continue;
        const d = new Date(day.date + 'T00:00:00');
        const m = d.getMonth();
        if (d.getDate() <= 7 && !seen.has(m)) {
          seen.add(m);
          monthArr.push({ label: MONTH_NAMES[m], x: wi * step });
          break;
        }
      }
    });
    setMonths(monthArr);
  }, [cell, gap, weeks]);

  const baseClass =
    'w-full min-h-40 border border-border rounded-md bg-white p-2 box-border overflow-hidden flex items-center justify-center';

  if (loading) {
    return (
      <div ref={containerRef} className={baseClass}>
        <span className="text-sm text-secondary">잔디를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={containerRef} className={baseClass}>
        <span className="text-sm text-error">{error}</span>
      </div>
    );
  }

  if (!username) {
    return (
      <div
        ref={containerRef}
        className="w-full min-h-40 border border-border rounded-md bg-white box-border"
      />
    );
  }

  const step = cell + gap;
  const gridW = weeks.length * step;

  return (
    <div
      ref={containerRef}
      className="w-full min-h-40 border border-border rounded-md bg-white p-2 box-border overflow-hidden flex"
    >
      <div style={{ width: LABEL_W + 4 + gridW }}>
        {/* 월 레이블 */}
        <div className="relative h-3.75" style={{ marginLeft: LABEL_W + 4 }}>
          {months.map(({ label, x }) => (
            <span
              key={label}
              className="absolute text-[10px] text-secondary leading-none"
              style={{ left: x }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* 요일 레이블 + 셀 그리드 */}
        <div className="flex gap-1">
          <div className="shrink-0" style={{ width: LABEL_W }}>
            {Array.from({ length: 7 }, (_, dow) => (
              <div
                key={dow}
                className="flex items-center justify-end pr-1 text-[9px] text-secondary leading-none"
                style={{ height: cell, marginBottom: dow < 6 ? gap : 0 }}
              >
                {DAY_LABEL[dow] ?? ''}
              </div>
            ))}
          </div>

          <div className="flex" style={{ gap }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap }}>
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={
                      day
                        ? `${day.count === 0 ? 'No' : day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}`
                        : undefined
                    }
                    style={{
                      width: cell,
                      height: cell,
                      borderRadius: Math.max(1, Math.floor(cell * 0.2)),
                      backgroundColor: day
                        ? (COLORS[day.level] ?? COLORS[0])
                        : 'transparent',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 푸터 */}
        <div
          className="flex justify-between items-center mt-2.5"
          style={{ marginLeft: LABEL_W + 4 }}
        >
          <span className="text-[11px] text-secondary leading-none">
            Summary of pull requests, issues opened, and commits.{' '}
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noreferrer"
              className="text-info no-underline"
            >
              Learn how we count contributions.
            </a>
          </span>
          <div className="flex items-center gap-0.75 shrink-0 ml-3">
            <span className="text-[11px] text-secondary leading-none">
              Less
            </span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                style={{
                  width: cell,
                  height: cell,
                  borderRadius: Math.max(1, Math.floor(cell * 0.2)),
                  backgroundColor: COLORS[level],
                }}
              />
            ))}
            <span className="text-[11px] text-secondary leading-none">
              More
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GitHubContributions;
