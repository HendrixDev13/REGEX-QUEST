
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  Code2,
  Crosshair,
  RotateCcw,
  Shield,
  Terminal,
  Trophy,
  Zap,
} from "lucide-react";
import {missions} from ".//assets/data/missions.js";

import "./index.css";

function evaluatePattern(pattern, flags, input) {
  try {
    // No permitir banderas globales o sticky para evitar resultados
    // variables por lastIndex al validar casos de prueba.
    const safeFlags = [...new Set(flags.replace(/[gy]/g, ""))].join("");
    const regex = new RegExp(pattern, safeFlags);
    return { valid: true, passed: regex.test(input), error: "" };
  } catch (error) {
    return { valid: false, passed: false, error: error.message };
  }
}

function Header({ score, streak, completed }) {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Regex Quest inicio">
        <span className="brand-icon"><Code2 size={23} /></span>
        <span>REGEX<span className="accent">QUEST</span>
          <small>THE PATTERN HUNTER</small>
        </span>
      </a>

      <div className="top-stats">
        <div className="stat">
          <Zap size={17} />
          <span><b>{score}</b><small>XP</small></span>
        </div>
        <div className="stat">
          <Activity size={17} />
          <span><b>{streak}</b><small>RACHA</small></span>
        </div>
        <div className="stat">
          <Trophy size={17} />
          <span><b>{completed}/3</b><small>MISIONES</small></span>
        </div>
      </div>
    </header>
  );
}

function MissionNav({ current, completed, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="section-label">CAMPAÑA PRINCIPAL</div>
      <h3>Misiones</h3>

      <nav className="mission-list" aria-label="Misiones">
        {missions.map((mission) => {
          const done = completed.includes(mission.id);
          const active = current === mission.id;

          return (
            <button
              key={mission.id}
              className={`mission-link ${active ? "active" : ""}`}
              onClick={() => onSelect(mission.id)}
              aria-current={active ? "step" : undefined}
            >
              <span className="mission-number">
                {done ? <Check size={17} /> : String(mission.id).padStart(2, "0")}
              </span>
              <span className="mission-name">
                <b>{mission.title}</b>
                <small>{mission.subtitle}</small>
              </span>
              {active && <span className="active-dot" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-tip">
        <Shield size={19} />
        <b>PROTOCOLO ACTIVO</b>
        <p>Una misión solo se completa cuando todos los casos pasan.</p>
      </div>

      <div className="sidebar-footer">SYSTEM v1.0.0 ·</div>
    </aside>
  );
}

function MissionPanel({ mission, solved, onHint, showHint }) {
  return (
    <section className="mission-panel">
      <div className="panel-topline">
        <span className="eyebrow"><Crosshair size={14} /> OBJETIVO ACTIVO</span>
        <span className="level-tag">NIVEL {String(mission.id).padStart(2, "0")}</span>
      </div>

      <h1>{mission.title}</h1>
      <p className="mission-description">{mission.description}</p>

      <div className="objective-row">
        <div className="objective-icon"><Terminal size={19} /></div>
        <div>
          <small>OBJETIVO DE MISIÓN</small>
          <p>Diseña el patrón. Supera las pruebas. Desbloquea el siguiente nivel.</p>
        </div>
      </div>

      <button className="hint-button" onClick={onHint}>
        <Zap size={15} /> {showHint ? "Ocultar pista" : "Consultar pista"}
      </button>
      {showHint && <p className="hint-text">{mission.hint}</p>}

      {solved && (
        <div className="mission-success">
          <CheckCircle2 size={19} />
          ¡Misión completada! Has superado todos los casos.
        </div>
      )}
    </section>
  );
}

function RegexEditor({
  pattern,
  setPattern,
  flags,
  setFlags,
  syntaxError,
  reference,
  onReset,
}) {
  return (
    <section className="editor-panel">
      <div className="panel-heading">
        <div className="heading-title">
          <Code2 size={18} />
          <h2>Regex Lab</h2>
        </div>
        <span className="live-tag"><span /> LIVE EDITOR</span>
      </div>

      <div className="editor-window">
        <div className="editor-toolbar">
          <span><i /> <i /> <i /></span>
          <span>pattern.js</span>
          <button className="icon-button" onClick={onReset} title="Restablecer patrón">
            <RotateCcw size={15} />
          </button>
        </div>

        <label className="regex-input-wrap">
          <span className="regex-slash">/</span>
          <input
            aria-label="Expresión regular"
            spellCheck={false}
            autoComplete="off"
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            placeholder="Escribe tu expresión regular..."
          />
          <span className="regex-slash">/</span>
          <input
            className="flags-input"
            aria-label="Banderas de expresión regular"
            value={flags}
            maxLength={6}
            onChange={(event) =>
              setFlags(event.target.value.replace(/[^dgimsuvy]/g, ""))
            }
            title="Banderas regex"
          />
        </label>

        <div className={`syntax-status ${syntaxError ? "error" : "ok"}`}>
          {syntaxError
            ? `ERROR DE SINTAXIS: ${syntaxError}`
            : "✓ Sintaxis válida · Patrón compilado"}
        </div>
      </div>

      <div className="editor-footnote">
        <span>JAVASCRIPT REGEXP</span>
        <span>ANÁLISIS EN TIEMPO REAL</span>
      </div>

      <details className="reference-details">
        <summary>Ver patrón de referencia</summary>
        <code>{reference}</code>
      </details>
    </section>
  );
}

function TestCaseCard({ test, index, result, locked }) {
  const passed = result.valid && result.passed === test.expected;

  return (
    <article
      className={`test-card ${passed ? "test-passed" : ""} ${
        !result.valid ? "test-invalid" : ""
      }`}
    >
      <div className="test-index">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="test-content">
        <code>{test.input}</code>
        <small>
          ESPERA: {test.expected ? "COINCIDENCIA" : "SIN COINCIDENCIA"}
        </small>
      </div>
      <span className={`test-result ${passed ? "good" : "bad"}`}>
        {locked ? "PENDIENTE" : passed ? "CORRECTO" : "FALLIDO"}
      </span>
      <span className={`result-icon ${passed && !locked ? "good" : ""}`}>
        {passed && !locked ? <CheckCircle2 size={19} /> : <Crosshair size={18} />}
      </span>
    </article>
  );
}

export default function App() {
  const [currentId, setCurrentId] = useState(1);
  const [patterns, setPatterns] = useState(() =>
    Object.fromEntries(missions.map((m) => [m.id, ""]))
  );
  const [flagsByMission, setFlagsByMission] = useState(
    Object.fromEntries(missions.map((m) => [m.id, m.flags || ""]))
  );
  const [completed, setCompleted] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [awardedCases, setAwardedCases] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState({});

  const mission = missions.find((item) => item.id === currentId);
  const pattern = patterns[currentId];
  const flags = flagsByMission[currentId];

  const setPattern = (value) =>
    setPatterns((previous) => ({ ...previous, [currentId]: value }));

  const setFlags = (value) =>
    setFlagsByMission((previous) => ({ ...previous, [currentId]: value }));

  const syntaxError = useMemo(() => {
    try {
      const safeFlags = [...new Set(flags.replace(/[gy]/g, ""))].join("");
      new RegExp(pattern, safeFlags);
      return "";
    } catch (error) {
      return error.message;
    }
  }, [pattern, flags]);

  const results = useMemo(
    () => mission.tests.map((test) =>
      evaluatePattern(pattern, flags, test.input)
    ),
    [mission, pattern, flags]
  );

  const passedCount = results.filter(
    (result, index) =>
      result.valid && result.passed === mission.tests[index].expected
  ).length;

  const allPassed =
    !syntaxError && passedCount === mission.tests.length;

  const wasSubmitted = Boolean(submitted[currentId]);
  const progress = Math.round((passedCount / mission.tests.length) * 100);

  function registerEvaluation() {
    if (!allPassed) {
      setStreak(0);
      setSubmitted((previous) => ({ ...previous, [currentId]: true }));
      return;
    }

    let newlyAwarded = 0;
    const newKeys = [];

    mission.tests.forEach((test, index) => {
      const key = `${currentId}-${index}`;
      if (!awardedCases.includes(key)) {
        newKeys.push(key);
        newlyAwarded += 10;
      }
    });

    const firstCompletion = !completed.includes(currentId);
    setAwardedCases((previous) => [...previous, ...newKeys]);
    setScore((previous) => previous + newlyAwarded + (firstCompletion ? 50 : 0));
    setStreak((previous) => previous + mission.tests.length);
    setCompleted((previous) =>
      firstCompletion ? [...previous, currentId] : previous
    );
    setSubmitted((previous) => ({ ...previous, [currentId]: true }));
  }

  function resetPattern() {
    setPattern("");
    setSubmitted((previous) => ({ ...previous, [currentId]: false }));
  }

  return (
    <main className="app-shell" id="top">
      <Header score={score} streak={streak} completed={completed.length} />

      <div className="app-layout">
        <MissionNav
          current={currentId}
          completed={completed}
          onSelect={(id) => {
            setCurrentId(id);
            setShowHint(false);
          }}
        />

        <div className="workspace">
          <div className="breadcrumb">
            <span>CAMPAÑA</span><span>/</span>
            <span>LABORATORIO</span><span>/</span>
            <b>{mission.title.toUpperCase()}</b>
          </div>

          <MissionPanel
            mission={mission}
            solved={completed.includes(currentId)}
            showHint={showHint}
            onHint={() => setShowHint((value) => !value)}
          />

          <RegexEditor
            pattern={pattern}
            setPattern={setPattern}
            flags={flags}
            setFlags={setFlags}
            syntaxError={syntaxError}
            reference={mission.reference}
            onReset={resetPattern}
          />

          <section className="tests-section">
            <div className="tests-heading">
              <div>
                <div className="heading-title">
                  <Crosshair size={18} />
                  <h2>Campo de pruebas</h2>
                </div>
                <p>Casos positivos y negativos · Validación instantánea</p>
              </div>
              <span className="test-counter">
                {passedCount}/{mission.tests.length} PASS
              </span>
            </div>

            <div className="progress-track">
              <div style={{ width: `${progress}%` }} />
            </div>

            <div className="test-list">
              {mission.tests.map((test, index) => (
                <TestCaseCard
                  key={`${currentId}-${index}`}
                  test={test}
                  index={index}
                  result={results[index]}
                  locked={!wasSubmitted}
                />
              ))}
            </div>

            {wasSubmitted && !allPassed && (
              <p className="feedback error-feedback">
                Todavía hay casos por corregir. Ajusta tu patrón y vuelve a evaluar.
              </p>
            )}

            {wasSubmitted && allPassed && (
              <p className="feedback success-feedback">
                ¡Excelente! Todos los casos de esta misión pasan.
              </p>
            )}

            <div className="action-row">
              <span className="helper-text">
                {allPassed
                  ? "Todos los casos están listos para evaluarse."
                  : "Corrige los casos fallidos para superar la misión."}
              </span>
              <button
                className="primary-button"
                onClick={registerEvaluation}
              >
                Evaluar misión <ArrowRight size={17} />
              </button>
            </div>

            {completed.includes(currentId) && currentId < missions.length && (
              <button
                className="next-button"
                onClick={() => {
                  setCurrentId(currentId + 1);
                  setShowHint(false);
                }}
              >
                Siguiente misión <ArrowRight size={17} />
              </button>
            )}
          </section>

          <footer className="workspace-footer">
            <span><span className="online-dot" /> SISTEMA OPERATIVO</span>
            <span>REGEX QUEST © 2026</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
