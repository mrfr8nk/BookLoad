import { useState, useRef, useEffect } from 'react';
import { School } from 'lucide-react';
import { searchSchools } from '../data/zimbabweSchools.js';

export default function SchoolAutocomplete({ value, onChange, placeholder = 'School / Institution' }) {
  const [open, setOpen] = useState(false);
  const [matches, setMatches] = useState([]);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleChange(v) {
    onChange(v);
    const results = searchSchools(v, 10);
    setMatches(results);
    setHighlight(-1);
    setOpen(results.length > 0);
  }

  function pick(school) {
    onChange(school);
    setOpen(false);
    setMatches([]);
  }

  function onKeyDown(e) {
    if (!open || matches.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(h + 1, matches.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' && highlight >= 0) { e.preventDefault(); pick(matches[highlight]); }
    else if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div className="f-input-wrap">
        <School size={15} className="f-input-icon" />
        <input
          type="text"
          className="f-input"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onChange={e => handleChange(e.target.value)}
          onFocus={() => { if (matches.length) setOpen(true); }}
          onKeyDown={onKeyDown}
        />
      </div>
      {open && matches.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
          background: '#fff', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 12,
          boxShadow: '0 12px 28px rgba(17,17,26,0.14)', overflow: 'hidden', maxHeight: 260, overflowY: 'auto',
        }}>
          {matches.map((school, i) => (
            <div
              key={school}
              onMouseDown={e => { e.preventDefault(); pick(school); }}
              onMouseEnter={() => setHighlight(i)}
              style={{
                padding: '10px 14px', fontSize: 13.5, cursor: 'pointer',
                background: highlight === i ? 'rgba(124,58,237,0.08)' : 'transparent',
                color: '#27202f', borderBottom: i < matches.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {school}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
