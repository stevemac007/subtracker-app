const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --court: #131009; --panel: #1c1508; --panel-border: #332310;
      --amber: #f5a623; --amber-dim: #a06b10;
      --green: #22c55e; --green-bg: rgba(34,197,94,.10); --green-bd: rgba(34,197,94,.40);
      --red: #ef4444;   --red-bg: rgba(239,68,68,.10);   --red-bd: rgba(239,68,68,.40);
      --blue: #60a5fa;  --text: #ede0cc; --text-dim: #7a6548; --text-mid: #a8906c;
    }
    html,body { height:100dvh; overflow:hidden; }
    body {
      background: var(--court); color: var(--text); font-family:'Inter',sans-serif;
      background-image: url('/woodgrain.svg'), repeating-linear-gradient(90deg,transparent 0,transparent 44px,rgba(255,255,255,.012) 44px,rgba(255,255,255,.012) 46px);
      background-repeat: repeat, repeat;
      background-size: 200px 200px, auto;
    }
    #root { height:100dvh; display:flex; flex-direction:column; }
    .app { display:flex; flex-direction:column; height:100dvh; max-width:520px; margin:0 auto; width:100%; overflow:hidden; position:relative; }
    .app::before { content:''; position:absolute; inset:0; background:url('/court-bg.svg') center top / 520px auto no-repeat; opacity:.14; pointer-events:none; z-index:0; }
    .app > * { position:relative; z-index:1; }

    /* Header */
    .hdr { flex-shrink:0; background:linear-gradient(180deg,#0a0704,var(--panel)); background-image:url('/scoreboard-texture.svg'), linear-gradient(180deg,#0a0704,var(--panel)); background-size:20px 20px, auto; border-bottom:2px solid var(--amber-dim); padding:8px 14px; display:flex; align-items:center; justify-content:space-between; gap:8px; }
    .hdr-title { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:3px; color:var(--amber); text-shadow:0 0 16px rgba(245,166,35,.5); white-space:nowrap; }
    .hdr-team  { font-family:'Bebas Neue',sans-serif; font-size:13px; letter-spacing:2px; color:var(--text-mid); flex:1; text-align:center; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .hdr-acts  { display:flex; gap:5px; }
    .hbtn { background:transparent; border:1px solid var(--panel-border); color:var(--text-dim); border-radius:5px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; font-size:11px; padding:5px 9px; transition:all .15s; white-space:nowrap; }
    .hbtn:hover { border-color:var(--text-mid); color:var(--text); }
    .hbtn.active { background:var(--amber); color:#1a0e00; border-color:var(--amber); }

    /* Clock bar */
    .clock-bar { flex-shrink:0; background:var(--panel); background-image:url('/scoreboard-texture.svg'); background-size:20px 20px; border-bottom:1px solid var(--panel-border); padding:6px 14px; display:flex; align-items:center; gap:10px; }
    .clock-disp { font-family:'DM Mono',monospace; font-size:36px; font-weight:500; line-height:1; color:var(--amber); letter-spacing:3px; text-shadow:0 0 20px rgba(245,166,35,.5); min-width:100px; transition:color .2s; }
    .clock-disp.paused { color:var(--text-dim); text-shadow:none; }
    .clock-mid { display:flex; flex-direction:column; gap:4px; flex:1; }
    .qbtns { display:flex; gap:4px; }
    .qbtn { background:transparent; color:var(--text-dim); border:1px solid var(--panel-border); padding:4px 10px; font-size:14px; border-radius:3px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; transition:all .12s; }
    .qbtn.active { background:var(--amber); color:#1a0e00; border-color:var(--amber); }
    .qbtn:hover:not(.active) { border-color:var(--text-mid); color:var(--text); }
    .cbtns { display:flex; gap:5px; }
    .cbtn { border:none; cursor:pointer; border-radius:5px; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; font-size:16px; padding:6px 14px; transition:all .12s; }
    .cbtn:active { transform:scale(.95); }
    .cbtn-play { background:var(--amber); color:#1a0e00; }
    .cbtn-play:hover { background:#ffc04a; }
    .cbtn-zero { background:transparent; color:var(--text-dim); border:1px solid var(--panel-border); }
    .cbtn-zero:hover { border-color:var(--text-mid); color:var(--text); }
    .period-pill { font-family:'Bebas Neue',sans-serif; font-size:12px; letter-spacing:1.5px; color:var(--text-dim); align-self:flex-end; }

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
    .pgrid { flex:1; min-height:0; display:flex; flex-direction:column; gap:3px; }
    .pcard { flex:1; min-height:0; display:flex; align-items:center; background:rgba(255,255,255,.025); border:1px solid var(--panel-border); border-radius:6px; padding:4px 8px; gap:4px; cursor:pointer; transition:border-color .12s,background .12s,box-shadow .12s; position:relative; overflow:hidden; -webkit-tap-highlight-color:transparent; user-select:none; }
    .pcard::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; border-radius:6px 0 0 6px; }
    .pcard.on-c::before { background:var(--green); }
    .pcard.bnch::before { background:var(--blue);  }
    .pcard.sel-out { border-color:var(--red);   background:var(--red-bg);   box-shadow:0 0 8px rgba(239,68,68,.2);  }
    .pcard.sel-in  { border-color:var(--green); background:var(--green-bg); box-shadow:0 0 8px rgba(34,197,94,.2); }
    .pcard.on-c:not(.sel-out):hover { border-color:var(--red-bd);   }
    .pcard.bnch:not(.sel-in):hover  { border-color:var(--green-bd); }
    .pnum { font-family:'Bebas Neue',sans-serif; font-size:18px; color:var(--amber); min-width:26px; text-align:center; line-height:1; flex-shrink:0; }
    .pcard.bnch .pnum    { color:var(--text-mid); }
    .pcard.sel-out .pnum { color:var(--red);   }
    .pcard.sel-in  .pnum { color:var(--green); }
    .pinfo { flex:1; min-width:0; display:flex; flex-direction:column; justify-content:center; }
    .pname { font-weight:600; line-height:1; white-space:nowrap; overflow:hidden; font-size:11px; color:var(--text-mid); }
    .pname-fit { display:inline-block; transform-origin:left center; white-space:nowrap; }
    .ptime { font-family:'DM Mono',monospace; font-size:22px; font-weight:500; color:var(--amber); line-height:1; letter-spacing:1px; text-shadow:0 0 10px rgba(245,166,35,.3); }
    .pstint { font-family:'DM Mono',monospace; font-size:11px; font-weight:400; line-height:1; letter-spacing:0.5px; opacity:0.7; margin-top:1px; }
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
    .player-setup-row { display:flex; gap:6px; align-items:center; margin-bottom:6px; }
    .tog { padding:5px 9px; border-radius:4px; font-size:11px; cursor:pointer; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; border:1px solid var(--panel-border); transition:all .12s; color:var(--text-dim); background:transparent; white-space:nowrap; }
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
  `}</style>
);

export default GlobalStyles;
