const { useState, useEffect, useRef } = React;

/* ---------- ambient floating water layer ---------- */
function Ambient() {
  const ripples = [
    { top: "22%", left: "8%", size: 140, dur: "10s", delay: "0s" },
    { top: "68%", left: "78%", size: 200, dur: "13s", delay: "2s" },
    { top: "40%", left: "60%", size: 90, dur: "8s", delay: "4s" },
    { top: "82%", left: "20%", size: 120, dur: "11s", delay: "1s" },
    { top: "12%", left: "84%", size: 160, dur: "12s", delay: "3s" },
  ];

  const lilies = [
    { top: "11%", left: "3%", e: "🪷", s: "34px", rot: "-8deg", dur: "9s" },
    { top: "80%", left: "94%", e: "🪷", s: "28px", rot: "12deg", dur: "11s" },
    { top: "60%", left: "96%", e: "🍃", s: "24px", rot: "20deg", dur: "8s" },
    { top: "34%", left: "2%", e: "🍃", s: "20px", rot: "-15deg", dur: "10s" },
  ];

  return (
    <div className="ambient" aria-hidden="true">
      {ripples.map((r, i) =>
        <span key={i} className="ripple" style={{
          top: r.top, left: r.left, width: r.size, height: r.size,
          marginLeft: -r.size / 2, marginTop: -r.size / 2,
          "--dur": r.dur, animationDelay: r.delay
        }} />
      )}
      {lilies.map((l, i) =>
        <span key={i} className="lily" style={{
          top: l.top, left: l.left, "--s": l.s, "--rot": l.rot, "--dur": l.dur,
          fontSize: l.s, animationDelay: i * 0.7 + "s"
        }}>{l.e}</span>
      )}
    </div>
  );
}

/* ---------- duck easter-egg that swims across now and then ---------- */
function Duck() {
  const [trips, setTrips] = useState([{ id: 0, bottom: "16%", dur: "30s" }]);
  useEffect(() => {
    let n = 1;
    const id = setInterval(() => {
      const bottom = (8 + Math.random() * 30).toFixed(0) + "%";
      const dur = (24 + Math.random() * 14).toFixed(0) + "s";
      setTrips((t) => [...t.slice(-2), { id: n++, bottom, dur }]);
    }, 17000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      {trips.map((t) =>
        <span key={t.id} className="duck" style={{ "--bottom": t.bottom, "--swim": t.dur }} aria-hidden="true">🦆</span>
      )}
    </>
  );
}

const Check = () =>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>;

/* ---------- INTRO ---------- */
function Intro({ onStart }) {
  return (
    <section className="screen intro">
      <div className="intro-inner">
        <p className="eyebrow">Une invitation · Cette semaine</p>
        <h1>
          <span className="name">Ysaline<em>,</em></span>
        </h1>
        <p className="sub">Voici ce que <strong>Martin</strong> te propose cette semaine. Choisis tout ce qui te tente — il s'occupe du reste.</p>
        <div className="cta">
          <button className="btn" onClick={onStart}>
            Découvrir la carte <span className="arrow">→</span>
          </button>
        </div>
        <p className="scrollhint">PLUSIEURS PROPOSITIONS · SÉLECTION MULTIPLE AUTORISÉE</p>
      </div>
    </section>
  );
}

/* ---------- CARD ---------- */
function Card({ d, index, selected, onToggle }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), 120 + index * 90);
    return () => clearTimeout(t);
  }, [index]);

  const cls = ["card"];
  if (vis) cls.push("in");
  if (selected) cls.push("selected");
  if (d.locked) cls.push("full");

  return (
    <article
      ref={ref}
      className={cls.join(" ")}
      onClick={() => !d.locked && onToggle(d.id)}>

      {d.locked && <div className={"stamp " + (d.stampClass || "")}>{d.stamp}</div>}
      <div className="card-top">
        <span className="num">{d.num}</span>
        <span className={"tag " + d.tagClass}>{d.tag}</span>
      </div>
      <h3>{d.title}</h3>
      <p className="desc">{d.desc}</p>
      <div className="meta">
        {d.meta.map((m, i) =>
          <React.Fragment key={i}>
            {i > 0 && <span className="dot">·</span>}
            <span className="m">
              {m.rating ?
                <><span className="stars">{m.stars}</span> {m.text}</> :
                <>{m.icon && <span>{m.icon}</span>} {m.text}</>}
            </span>
          </React.Fragment>
        )}
      </div>
      <div className="card-foot">
        {d.locked ?
          <span className="pick disabled">{d.lockText}</span> :
          <span className="pick">
            <span className="box"><Check /></span>
            {selected ? "Dans ta sélection" : "Ça me tente"}
          </span>
        }
        {d.link &&
          <a className="evlink" href={d.link.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            {d.link.label} ↗
          </a>
        }
      </div>
    </article>
  );
}

/* ---------- CATALOG ---------- */
function Catalog({ selected, onToggle, onNext, onBack }) {
  const count = selected.length;
  return (
    <section className="screen">
      <button className="topback" onClick={onBack}>← Accueil</button>
      <div className="catalog">
        <div className="cat-head">
          <p className="cat-kicker">La carte de Martin</p>
          <h2>Qu'est-ce qui te <em>tente</em> ?</h2>
          <p>Coche tout ce qui te plaît — une, deux, ou tout (pourquoi se priver).</p>
        </div>
        <div className="grid">
          {window.DATES.map((d, i) =>
            <Card key={d.id} d={d} index={i} selected={selected.includes(d.id)} onToggle={onToggle} />
          )}
        </div>
      </div>

      <div className={"selbar" + (count > 0 ? " show" : "")}>
        <div className="count">
          <b>{count}</b> {count > 1 ? "envies sélectionnées" : "envie sélectionnée"}
          <span>{count > 1 ? "joueuse, j'aime ça 🐸" : "et si on en ajoutait une autre ?"}</span>
        </div>
        <button className="btn" onClick={onNext}>
          Suite <span className="arrow">→</span>
        </button>
      </div>
    </section>
  );
}

/* ---------- RECAP ---------- */
function Recap({ selected, onBack }) {
  const [copied, setCopied] = useState(false);
  const items = window.DATES.filter((d) => selected.includes(d.id) && d.copyLine);

  const message =
    "Hello Martin 🐸\n\nJ'ai fait mon choix :\n" +
    items.map((d) => "• " + d.copyLine).join("\n") +
    "\n\nOrganise-moi ça. 🦆";

  const copy = () => {
    const done = () => { setCopied(true); setTimeout(() => setCopied(false), 2200); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message).then(done).catch(() => fallbackCopy(message, done));
    } else {
      fallbackCopy(message, done);
    }
  };

  const fallbackCopy = (text, cb) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      cb();
    } catch (e) { /* user can select the text manually */ }
  };

  const confetti = Array.from({ length: 16 }, (_, i) => ({
    e: ["🐸", "🦆", "🪷", "🍃"][i % 4],
    left: (Math.random() * 100).toFixed(1) + "%",
    d: (2.4 + Math.random() * 2).toFixed(1) + "s",
    delay: (Math.random() * 1.2).toFixed(2) + "s"
  }));

  return (
    <section className="screen recap">
      <button className="topback" onClick={onBack}>← Retour à la carte</button>
      <div className="celebrate" aria-hidden="true">
        {confetti.map((c, i) =>
          <span key={i} className="confetti" style={{ left: c.left, "--d": c.d, "--delay": c.delay }}>{c.e}</span>
        )}
      </div>

      <div className="recap-inner">
        <p className="badge">Dernière étape</p>
        <h2>Envoie ton choix à <em>Martin</em></h2>
        <p className="lead">Il se fera un plaisir d'organiser tout ça. Copie le message ci-dessous et envoie-le lui — il connaît la suite.</p>

        {items.length > 0 ?
          <>
            <div className="chosen">
              {items.map((d, i) =>
                <div key={d.id} className="chosen-item" style={{ animationDelay: i * 0.08 + "s" }}>
                  <span className="ci-num">{d.num}</span>
                  <div>
                    <div className="ci-title">{d.title}</div>
                    <div className="ci-tag">{d.tag}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="copybox">
              <p className="cb-label">Message prêt à copier</p>
              <pre>{message}</pre>
              <button className="btn" onClick={copy}>
                {copied ? "Copié ! 🐸" : "Copier le message"}
              </button>
            </div>
          </> :
          <p className="empty-note">Hmm, tu n'as rien gardé… Reviens en arrière et fais-toi plaisir, la carte t'attend 🦆</p>
        }

        <div className="recap-actions">
          <button className="btn btn-ghost" onClick={onBack}>← Modifier mon choix</button>
        </div>

        <p className="foot">Fait avec amour (et un peu trop de canards) par Martin · Aucune foulque n'a été dérangée.</p>
      </div>
    </section>
  );
}

/* ---------- APP ---------- */
function App() {
  const [screen, setScreen] = useState("intro");
  const [selected, setSelected] = useState([]);

  const toggle = (id) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  return (
    <>
      <Ambient />
      <Duck />
      {screen === "intro" && <Intro onStart={() => setScreen("catalog")} />}
      {screen === "catalog" &&
        <Catalog
          selected={selected}
          onToggle={toggle}
          onNext={() => setScreen("recap")}
          onBack={() => setScreen("intro")} />
      }
      {screen === "recap" && <Recap selected={selected} onBack={() => setScreen("catalog")} />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
