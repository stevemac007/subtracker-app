import { useTheme } from "./ThemeContext.jsx";

const GlobalStyles = () => {
  const { vars } = useTheme();

  const varBlock = Object.entries(vars).map(([k, v]) => `${k}: ${v};`).join("\n      ");

  return (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      ${varBlock}
    }
    html,body { height:100dvh; overflow:hidden; }
    body {
      background: var(--court); color: var(--text); font-family:'Inter',sans-serif;
      background-image: var(--body-bg-image);
      background-repeat: repeat, repeat;
      background-size: var(--body-bg-size);
    }
    #root { height:100dvh; display:flex; flex-direction:column; }
    .app { display:flex; flex-direction:column; height:100dvh; max-width:1000px; margin:0 auto; width:100%; overflow:hidden; position:relative; }
    .app::before { content:''; position:absolute; inset:0; background:url('/court-bg.svg') center top / 100% auto no-repeat; opacity:.14; pointer-events:none; z-index:0; }
    .app > * { position:relative; z-index:1; }

    /* Header */
    .hdr { flex-shrink:0; background:var(--hdr-bg); background-image:var(--hdr-bg-image); background-size:var(--hdr-bg-size); border-bottom:2px solid var(--amber-dim); padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:8px; }
    .hdr-title { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:3px; color:var(--amber); text-shadow:0 0 16px rgba(245,166,35,.5); white-space:nowrap; }
    .hdr-team  { font-family:'Bebas Neue',sans-serif; font-size:13px; letter-spacing:2px; color:var(--text-mid); flex:1; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .hdr-acts  { display:flex; gap:5px; flex:1; justify-content:flex-end; }
    .hbtn { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.18); color:var(--text); border-radius:5px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; font-size:13px; padding:10px 12px; transition:all .15s; white-space:nowrap; text-align:center; }
    .hdr-acts .hbtn { flex:1; }
    .hbtn:hover { border-color:var(--amber-dim); color:var(--amber); }
    .hbtn.active { background:var(--amber); color:#1a0e00; border-color:var(--amber); }
    .hbtn-lg { font-size:15px; padding:12px 18px; }

    /* Clock bar */
    .clock-bar { flex-shrink:0; background:var(--panel); background-image:var(--clock-bg-image); background-size:var(--clock-bg-size); border-bottom:1px solid var(--panel-border); padding:8px 14px; display:flex; align-items:center; gap:10px; }
    .clock-disp { font-family:'DM Mono',monospace; font-size:48px; font-weight:500; line-height:1; color:var(--amber); letter-spacing:3px; text-shadow:0 0 20px rgba(245,166,35,.5); min-width:100px; transition:color .2s; }
    .clock-disp.paused { color:var(--text-dim); text-shadow:none; }
    .clock-mid { display:flex; flex-direction:column; gap:4px; flex:1; }
    .qbtns { display:flex; gap:4px; }
    .qbtn { flex:1; background:rgba(255,255,255,.06); color:var(--text); border:1px solid rgba(255,255,255,.18); padding:12px 14px; font-size:15px; border-radius:3px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; transition:all .12s; text-align:center; }
    .qbtn.active { background:var(--amber); color:#1a0e00; border-color:var(--amber); }
    .qbtn:hover:not(.active) { border-color:var(--text-mid); color:var(--text); }
    .cbtns { display:flex; gap:5px; flex:1; }
    .cbtn { flex:1; border:none; cursor:pointer; border-radius:5px; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; font-size:18px; padding:12px 18px; transition:all .12s; text-align:center; }
    .cbtn:active { transform:scale(.95); }
    .cbtn-play { background:var(--amber); color:#1a0e00; }
    .cbtn-play:hover { background:#ffc04a; }
    .cbtn-zero { background:rgba(255,255,255,.06); color:var(--text); border:1px solid rgba(255,255,255,.18); }
    .cbtn-zero:hover { border-color:var(--text-mid); color:var(--text); }
    .period-pill { font-family:'Bebas Neue',sans-serif; font-size:12px; letter-spacing:1.5px; color:var(--text-dim); }

    /* Court columns */
    .court-area { flex:1; min-height:0; display:grid; grid-template-columns:1fr 1fr; overflow:hidden; }
    .zone { display:flex; flex-direction:column; overflow:hidden; padding:5px 5px 3px; }
    .zone:first-child { border-right:1px solid var(--panel-border); }
    .zone-hdr { display:flex; align-items:center; justify-content:space-between; padding:2px 4px 5px; flex-shrink:0; }
    .zone-title { font-family:'Bebas Neue',sans-serif; font-size:15px; letter-spacing:2.5px; display:flex; align-items:center; gap:5px; }
    .dot { width:7px; height:7px; border-radius:50%; display:inline-block; }
    .dot-g { background:var(--green); box-shadow:0 0 5px var(--green); }
    .dot-b { background:var(--blue);  box-shadow:0 0 5px var(--blue);  }
    .zone-cnt { font-family:'DM Mono',monospace; font-size:12px; color:var(--text-dim); background:rgba(255,255,255,.04); padding:2px 7px; border-radius:3px; }
    .pgrid { flex:1; min-height:0; display:flex; flex-direction:column; gap:4px; overflow-y:auto; }
    .pcard { flex:1; display:flex; flex-direction:row; align-items:center; background:rgba(255,255,255,.025); border:1px solid var(--panel-border); border-radius:6px; padding:6px 10px; gap:10px; cursor:pointer; transition:border-color .12s,background .12s,box-shadow .12s; position:relative; overflow:hidden; -webkit-tap-highlight-color:transparent; user-select:none; }
    .pcard::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; border-radius:6px 0 0 6px; }
    .pcard.on-c::before { background:var(--green); }
    .pcard.bnch::before { background:var(--blue);  }
    .pcard.sel-out { border-color:var(--red);   background:var(--red-bg);   box-shadow:0 0 8px rgba(239,68,68,.2);  }
    .pcard.sel-in  { border-color:var(--green); background:var(--green-bg); box-shadow:0 0 8px rgba(34,197,94,.2); }
    .pcard.on-c:not(.sel-out):hover { border-color:var(--red-bd);   }
    .pcard.bnch:not(.sel-in):hover  { border-color:var(--green-bd); }
    .pnum { font-family:'Bebas Neue',sans-serif; font-size:36px; color:var(--amber); min-width:36px; text-align:center; line-height:1; flex-shrink:0; }
    .pcard.bnch .pnum    { color:var(--text-mid); }
    .pcard.sel-out .pnum { color:var(--red);   }
    .pcard.sel-in  .pnum { color:var(--green); }
    .pinfo { flex:1; min-width:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1px; }
    .pinfo-top { display:flex; align-items:center; gap:6px; }
    .pinfo-bot { display:flex; align-items:baseline; gap:6px; }
    .pname { font-family:'Inter',sans-serif; font-weight:700; line-height:1; white-space:nowrap; overflow:hidden; font-size:32px; color:var(--text); }
    .pname-fit { display:inline-block; transform-origin:left center; white-space:nowrap; }
    .ptime { font-family:'DM Mono',monospace; font-size:22px; font-weight:500; color:var(--amber); line-height:1; letter-spacing:1px; text-shadow:0 0 10px rgba(245,166,35,.3); }
    .pstint { font-family:'DM Mono',monospace; font-size:14px; font-weight:400; line-height:1; letter-spacing:0.5px; opacity:0.7; }
    .pbadge { font-family:'Bebas Neue',sans-serif; font-size:10px; letter-spacing:1px; padding:2px 5px; border-radius:3px; white-space:nowrap; flex-shrink:0; }
    .b-on    { color:var(--green); background:rgba(34,197,94,.1);  }
    .b-bnch  { color:var(--blue);  background:rgba(96,165,250,.1); }
    .b-out   { color:var(--red);   background:var(--red-bg);       }
    .b-in    { color:var(--green); background:var(--green-bg);     }

    /* Sub panel */
    .sub-panel { flex-shrink:0; background:var(--panel); border-top:1px solid var(--amber-dim); padding:7px 10px calc(8px + env(safe-area-inset-bottom, 0px)); }
    .sub-title { font-family:'Bebas Neue',sans-serif; font-size:13px; letter-spacing:2px; color:var(--amber); text-align:center; margin-bottom:5px; }
    .sub-pairs { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:6px; }
    .spair { display:flex; align-items:center; gap:4px; background:rgba(255,255,255,.04); border-radius:4px; padding:4px 8px; font-size:13px; }
    .sp-out { color:var(--red);   font-weight:600; }
    .sp-arr { color:var(--text-dim); }
    .sp-in  { color:var(--green); font-weight:600; }
    .sp-um  { color:var(--text-dim); font-style:italic; font-size:10px; }
    .sub-acts { display:flex; gap:6px; }
    .sbtn { flex:1; border:none; cursor:pointer; border-radius:5px; font-family:'Bebas Neue',sans-serif; letter-spacing:1.5px; font-size:17px; padding:8px; transition:all .12s; }
    .sbtn:active { transform:scale(.97); }
    .sbtn-ok  { background:var(--green); color:#001a09; }
    .sbtn-ok:hover { background:#4ade80; }
    .sbtn-ok:disabled { opacity:.35; cursor:not-allowed; transform:none; }
    .sbtn-cl  { background:transparent; color:var(--text-dim); border:1px solid var(--panel-border); }
    .sbtn-cl:hover { border-color:var(--text-mid); color:var(--text); }

    /* Scrollable panels */
    .scroll-area { flex:1; overflow-y:auto; padding:14px; }
    .scroll-area::-webkit-scrollbar { width:4px; }
    .scroll-area::-webkit-scrollbar-thumb { background:var(--panel-border); border-radius:2px; }

    /* Section heading */
    .sec-hd { font-family:'Bebas Neue',sans-serif; font-size:16px; letter-spacing:3px; color:var(--amber); margin-bottom:12px; display:flex; align-items:center; gap:10px; }
    .sec-hd-sub { font-size:11px; letter-spacing:1px; color:var(--text-dim); font-family:'Inter',sans-serif; font-weight:400; }

    /* Forms */
    .field-row { display:flex; gap:8px; align-items:center; margin-bottom:8px; }
    .inp { background:rgba(255,255,255,.04); border:1px solid var(--panel-border); color:var(--text); border-radius:5px; padding:8px 10px; font-size:13px; outline:none; font-family:'Inter',sans-serif; }
    .inp:focus { border-color:var(--amber-dim); }
    .inp-num { width:52px; text-align:center; color:var(--amber); font-family:'Bebas Neue',sans-serif; font-size:16px; padding:7px 4px; }
    .inp-num:focus { border-color:var(--amber); }
    .inp-full { flex:1; }
    .inp-team { font-size:16px; font-weight:600; width:100%; margin-bottom:16px; }

    /* Buttons */
    .btn-primary { background:var(--amber); color:#1a0e00; border:none; border-radius:6px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:2px; font-size:18px; padding:11px; transition:all .15s; }
    .btn-primary:hover { background:#ffc04a; }
    .btn-primary:disabled { opacity:.35; cursor:not-allowed; }
    .btn-ghost { background:transparent; border:1px solid var(--panel-border); color:var(--text-dim); border-radius:5px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; font-size:13px; padding:7px 14px; transition:all .15s; }
    .btn-ghost:hover { border-color:var(--text-mid); color:var(--text); }
    .btn-danger { background:transparent; border:1px solid var(--red-bd); color:var(--red); border-radius:5px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; font-size:11px; padding:5px 10px; transition:all .15s; }
    .btn-danger:hover { background:var(--red-bg); }
    .btn-sm { font-size:12px; padding:5px 10px; }

    /* Game card */
    .game-card { background:rgba(255,255,255,.03); border:1px solid var(--panel-border); border-radius:8px; padding:12px 14px; margin-bottom:8px; cursor:pointer; transition:border-color .15s; }
    .game-card:hover { border-color:var(--text-mid); }
    .game-card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; }
    .game-opp { font-size:14px; font-weight:600; }
    .game-date { font-family:'DM Mono',monospace; font-size:10px; color:var(--text-dim); }
    .game-meta { font-size:11px; color:var(--text-dim); display:flex; gap:12px; }
    .game-badge { font-family:'Bebas Neue',sans-serif; font-size:10px; letter-spacing:1px; padding:2px 7px; border-radius:3px; }
    .gbadge-live { background:rgba(239,68,68,.15); color:var(--red); }
    .gbadge-done { background:rgba(255,255,255,.05); color:var(--text-dim); }

    /* Player row in setup */
    .player-setup-list { display:grid; grid-template-columns:1fr; gap:4px; }
    @media (min-width: 520px) { .player-setup-list { grid-template-columns:1fr 1fr; gap:6px; } }
    @media (min-width: 800px) { .player-setup-list { grid-template-columns:1fr 1fr 1fr; gap:6px; } }
    .player-setup-row { display:grid; grid-template-columns:32px 1fr auto auto; gap:6px; align-items:center; padding:5px 8px; background:rgba(255,255,255,.02); border-radius:6px; }
    .tog { padding:5px 10px; border-radius:4px; font-size:11px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; border:1px solid rgba(255,255,255,.18); transition:all .12s; color:var(--text); background:rgba(255,255,255,.06); white-space:nowrap; }
    .tog.on  { background:var(--green-bg); color:var(--green); border-color:var(--green-bd); }
    .tog.start-on { background:rgba(245,166,35,.12); color:var(--amber); border-color:rgba(245,166,35,.4); }

    /* Overlay */
    .overlay { position:fixed; inset:0; background:rgba(0,0,0,.88); z-index:200; display:flex; align-items:center; justify-content:center; padding:16px; }
    .modal { background:var(--panel); border:1px solid var(--amber-dim); border-radius:10px; width:100%; max-width:420px; max-height:90vh; overflow-y:auto; padding:18px; }
    .modal-title { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:3px; color:var(--amber); margin-bottom:14px; text-align:center; }

    /* Stats rows */
    .srow { display:flex; justify-content:space-between; align-items:center; padding:7px 0; border-bottom:1px solid var(--panel-border); font-size:13px; }
    .srow:last-child { border-bottom:none; }
    .srow-num { color:var(--amber); font-family:'Bebas Neue',sans-serif; margin-right:6px; }
    .srow-time { font-family:'DM Mono',monospace; color:var(--amber); font-size:18px; }
    .srow-pct  { font-size:15px; color:var(--text-dim); }

    /* Log entry */
    .log-entry { display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid var(--panel-border); font-size:12px; color:var(--text-dim); }
    .log-entry:last-child { border-bottom:none; }
    .log-t { font-family:'DM Mono',monospace; font-size:10px; color:var(--amber-dim); min-width:58px; }

    /* Empty state */
    .empty { padding:24px; text-align:center; font-size:13px; color:var(--text-dim); font-style:italic; }

    /* Note label */
    .note { font-size:11px; color:var(--text-dim); text-align:center; margin:8px 0; }
    .note span { font-family:'DM Mono',monospace; color:var(--amber); }

    /* Mobile sizing fixes for clock bar */
    @media (max-width: 520px) {
      .clock-bar { padding:6px 8px; gap:6px; flex-wrap:wrap; }
      .clock-disp { font-size:32px; min-width:auto; letter-spacing:1px; }
      .qbtn { padding:6px 4px; font-size:12px; }
      .cbtn { padding:8px 6px; font-size:14px; }
      .hbtn-lg { font-size:13px; padding:8px 6px; }
      .hdr { padding:8px 10px; gap:6px; }
      .period-pill { font-size:10px; }
    }

    @media (max-width: 380px) {
      .clock-disp { font-size:26px; }
      .qbtn { padding:5px 3px; font-size:11px; }
      .cbtn { padding:6px 4px; font-size:12px; }
      .hbtn-lg { font-size:11px; padding:6px 4px; }
    }
  `}</style>
  );
};

export default GlobalStyles;