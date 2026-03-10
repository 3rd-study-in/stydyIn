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
const CELL = 13;
const GAP = 2;
const STEP = CELL + GAP;

function GitHubContributions({ username }) {
  const [weeks, setWeeks] = useState([]);
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

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

        const seen = new Set();
        const monthArr = [];
        weeksArr.forEach((w, wi) => {
          for (const day of w) {
            if (!day) continue;
            const d = new Date(day.date + 'T00:00:00');
            const m = d.getMonth();
            if (d.getDate() <= 7 && !seen.has(m)) {
              seen.add(m);
              monthArr.push({ label: MONTH_NAMES[m], x: wi * STEP });
              break;
            }
          }
        });

        setWeeks(weeksArr);
        setMonths(monthArr);
      })
      .catch(() => setError('GitHub 사용자를 찾을 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [username]);

  const baseClass =
    'w-full min-h-40 border border-border rounded-md bg-white p-2 box-border flex items-center justify-center';

  if (loading) {
    const SKELETON_WEEKS = 26;
    return (
      <div className="w-full min-h-40 border border-border rounded-md bg-white p-2 box-border overflow-x-auto">
        <div style={{ width: LABEL_W + 4 + SKELETON_WEEKS * STEP }}>
          {/* 월 레이블 skeleton */}
          <div className="flex gap-6 mb-1" style={{ marginLeft: LABEL_W + 4 }}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton h-2.5 w-6" />
            ))}
          </div>

          {/* 요일 + 셀 그리드 skeleton */}
          <div className="flex gap-1">
            <div
              className="shrink-0 flex flex-col"
              style={{ width: LABEL_W, gap: GAP }}
            >
              {Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  style={{ width: 10, height: CELL }}
                  className={i % 2 === 1 ? 'skeleton' : ''}
                />
              ))}
            </div>
            <div className="flex" style={{ gap: GAP }}>
              {Array.from({ length: SKELETON_WEEKS }, (_, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                  {Array.from({ length: 7 }, (_, di) => (
                    <div
                      key={di}
                      className="skeleton"
                      style={{ width: CELL, height: CELL, borderRadius: 2 }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 푸터 skeleton */}
          <div
            className="flex justify-between items-center mt-2.5"
            style={{ marginLeft: LABEL_W + 4 }}
          >
            <div className="skeleton h-2.5 w-48" />
            <div className="flex items-center gap-1">
              <div className="skeleton h-2.5 w-6" />
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ width: CELL, height: CELL, borderRadius: 2 }}
                />
              ))}
              <div className="skeleton h-2.5 w-6" />
            </div>
          </div>
        </div>
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
      <div className="w-full min-h-40 border border-border rounded-md bg-bg-muted box-border" />
    );
  }

  const gridW = weeks.length * STEP;

  return (
    <div
      ref={containerRef}
      className="w-full min-h-40 border border-border rounded-md bg-white p-2 box-border overflow-x-auto"
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
                style={{ height: CELL, marginBottom: dow < 6 ? GAP : 0 }}
              >
                {DAY_LABEL[dow] ?? ''}
              </div>
            ))}
          </div>

          <div className="flex" style={{ gap: GAP }}>
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={
                      day
                        ? `${day.count === 0 ? 'No' : day.count} contribution${day.count !== 1 ? 's' : ''} on ${day.date}`
                        : undefined
                    }
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 2,
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
                  width: CELL,
                  height: CELL,
                  borderRadius: 2,
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
