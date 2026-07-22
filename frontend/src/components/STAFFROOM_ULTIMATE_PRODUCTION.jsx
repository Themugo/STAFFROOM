import { useState, useMemo, useCallback, useReducer } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTION-GRADE DATA LAYER
// ═══════════════════════════════════════════════════════════════════════════

const EMPLOYEES = [
  { id:"e1", name:"Amara Mbeki", email:"amara@staff.io", dept:"HR", title:"HR Director", salary:57600, perf:92, eng:85, abs:2, tenure:3, status:"Active", skills:["leadership","strategy"], next:"VP People", ready:75, risk:15, manager_id:null, reports:["e8"] },
  { id:"e2", name:"James Kamau", email:"james@staff.io", dept:"Eng", title:"Senior Dev", salary:74400, perf:79, eng:62, abs:8, tenure:4, status:"Active", skills:["backend","design"], next:"Tech Lead", ready:45, risk:62, manager_id:null, reports:["e6","e7"] },
  { id:"e3", name:"Fatima Njoroge", email:"fatima@staff.io", dept:"Design", title:"UI Designer", salary:49200, perf:85, eng:88, abs:3, tenure:2.5, status:"Active", skills:["ux","figma"], next:"Design Lead", ready:70, risk:18, manager_id:null, reports:[] },
  { id:"e4", name:"Brian Omondi", email:"brian@staff.io", dept:"Finance", title:"Senior Analyst", salary:60000, perf:88, eng:79, abs:4, tenure:5, status:"Active", skills:["analysis","excel"], next:"Mgr", ready:82, risk:22, manager_id:null, reports:["e8"] },
  { id:"e5", name:"Amina Wanjiru", email:"amina@staff.io", dept:"Marketing", title:"Marketing Mgr", salary:54000, perf:76, eng:71, abs:6, tenure:0.3, status:"Active", skills:["digital","analytics"], next:"Senior", ready:35, risk:45, manager_id:null, reports:[] },
  { id:"e6", name:"Peter Otieno", email:"peter@staff.io", dept:"Eng", title:"Backend Dev", salary:66000, perf:91, eng:84, abs:2, tenure:3.5, status:"Active", skills:["backend","db"], next:"Senior Dev", ready:88, risk:12, manager_id:"e2", reports:[] },
  { id:"e7", name:"Mary Nduta", email:"mary@staff.io", dept:"Eng", title:"Frontend Dev", salary:58800, perf:83, eng:75, abs:5, tenure:2, status:"Active", skills:["react","frontend"], next:"Senior", ready:60, risk:35, manager_id:"e2", reports:[] },
  { id:"e8", name:"Eli Kiprop", email:"eli@staff.io", dept:"Finance", title:"Accountant", salary:48000, perf:77, eng:68, abs:7, tenure:1.5, status:"Active", skills:["accounting","audit"], next:"Senior", ready:50, risk:58, manager_id:"e4", reports:[] },
];

const MARKET = {"HR Director":{mid:62000},"Senior Dev":{mid:85000},"UI Designer":{mid:55000},"Senior Analyst":{mid:70000},"Marketing Mgr":{mid:65000},"Backend Dev":{mid:80000},"Frontend Dev":{mid:70000},"Accountant":{mid:52000}};
const COST = {"HR Director":150000,"Senior Dev":180000,"UI Designer":90000,"Senior Analyst":120000,"Marketing Mgr":100000,"Backend Dev":160000,"Frontend Dev":130000,"Accountant":85000};
const DEPTS = {HR:{head:"e1",budget:80000},Eng:{head:"e2",budget:300000},Design:{head:"e3",budget:100000},Finance:{head:"e4",budget:150000},Marketing:{head:"e5",budget:90000}};

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTION STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

const initialState = {
  employees: EMPLOYEES,
  filters: {search:"",dept:"All",status:"Active",riskMin:0},
  sort: {by:"name",dir:"asc"},
  selected: null,
  modal: {open:false,type:null,data:null},
  loading: false,
  error: null,
  lastAction: null,
  auditLog: [],
};

function appReducer(state, action) {
  switch(action.type) {
    case "SET_FILTER":
      return {...state, filters:{...state.filters,...action.payload}};
    case "SET_SORT":
      return {...state, sort:action.payload};
    case "SELECT_EMPLOYEE":
      return {...state, selected:action.payload};
    case "OPEN_MODAL":
      return {...state, modal:{open:true,type:action.payload.type,data:action.payload.data}};
    case "CLOSE_MODAL":
      return {...state, modal:{open:false,type:null,data:null}};
    case "UPDATE_EMPLOYEE":
      return {
        ...state,
        employees: state.employees.map(e => e.id===action.payload.id?{...e,...action.payload.data}:e),
        auditLog: [...state.auditLog,{ts:new Date().toISOString(),action:"update_employee",id:action.payload.id,user:"system"}]
      };
    case "SET_ERROR":
      return {...state, error:action.payload};
    case "CLEAR_ERROR":
      return {...state, error:null};
    case "SET_LOADING":
      return {...state, loading:action.payload};
    default:
      return state;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES & DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

const S = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital@0;1&family=Sora:wght@400;500;600&family=Fira+Code&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--cor:#e8512a;--sg:#5a8a6a;--sky:#3a7bd5;--amb:#c4852a;--ros:#d45a6a;--sl:#1e2533;--cr:#faf7f2;--t1:#1e2533;--t3:#8090a8;--bd:rgba(30,37,51,.09);--ff:'Sora';--fd:'Fraunces';--fm:'Fira Code';}
body{font-family:var(--ff);background:var(--cr);color:var(--t1);}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
.page-enter{animation:fadeUp .2s ease;}
.loading{animation:spin 1s linear infinite;}
.error{background:rgba(212,90,106,.12);border:1px solid var(--ros);color:var(--ros);padding:12px;border-radius:6px;margin-bottom:12px;font-size:11px;}
`;

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

const fmt = n => `$${Number(n).toLocaleString()}`;
const pct = (n,d) => ((n/d)*100).toFixed(1);
const init = name => name?.split(" ").map(w=>w[0]).join("").slice(0,2) || "?";
const rank = (arr,key,dir="desc") => [...arr].sort((a,b) => dir==="asc"?a[key]-b[key]:b[key]-a[key]);

const getHealth = e => {let s=100;if(e.perf<70)s-=20;if(e.eng<60)s-=25;if(e.abs>6)s-=15;if(e.risk>50)s-=20;return Math.max(0,s)};
const getRiskColor = s => s>=70?{c:"var(--ros)",bg:"rgba(212,90,106,.12)"}:s>=50?{c:"var(--amb)",bg:"rgba(196,133,42,.12)"}:s>=30?{c:"var(--cor)",bg:"rgba(232,81,42,.1)"}:{c:"var(--sg)",bg:"rgba(90,138,106,.12)"};

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function Header({page,stats}) {
  return <div style={{height:56,background:"var(--sl)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 18px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
    <div style={{fontFamily:"var(--fd)",fontSize:16,fontWeight:500,color:"#fff",fontStyle:"italic"}}>{page}</div>
    <div style={{display:"flex",gap:16,fontSize:10,color:"rgba(255,255,255,.4)",fontFamily:"var(--fm)"}}>
      {stats?.map((s,i)=><div key={i}><div style={{color:"rgba(255,255,255,.6)",fontWeight:600}}>{s.v}</div><div style={{marginTop:2}}>{s.l}</div></div>)}
    </div>
  </div>;
}

function Card({children,style={}}) {
  return <div style={{background:"#fff",border:"1px solid var(--bd)",borderRadius:8,padding:"14px 16px",...style}}>{children}</div>;
}

function Btn({children,onClick,variant="outline",size="sm",disabled=false}) {
  const v={outline:{bg:"transparent",c:"var(--t3)",b:"1px solid var(--bd)"},coral:{bg:"var(--cor)",c:"#fff",b:"none"},sage:{bg:"rgba(90,138,106,.12)",c:"var(--sg)",b:"none"},rose:{bg:"rgba(212,90,106,.12)",c:"var(--ros)",b:"none"}};
  const st=v[variant]||v.outline;
  return <button onClick={onClick} disabled={disabled} style={{borderRadius:6,cursor:disabled?"not-allowed":"pointer",padding:size==="sm"?"5px 10px":"7px 12px",fontSize:size==="sm"?10:11,fontFamily:"var(--ff)",fontWeight:500,background:st.bg,color:st.c,border:st.b,opacity:disabled?0.6:1}}>{children}</button>;
}

function Av({name,size=28}) {
  return <div style={{width:size,height:size,borderRadius:"50%",background:"var(--cor)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size>30?13:9,fontWeight:600,fontFamily:"var(--fm)",flexShrink:0}}>{init(name)}</div>;
}

function Progress({pct:p,color="var(--cor)"}) {
  return <div style={{height:4,background:"var(--cr2)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,p)}%`,background:color}}/></div>;
}

function Badge({text,color="var(--t3)"}) {
  return <span style={{display:"inline-flex",alignItems:"center",padding:"2px 7px",borderRadius:4,fontSize:9,fontWeight:600,background:"rgba(30,37,51,.08)",color:color,fontFamily:"var(--fm)"}}>{text}</span>;
}

function Input({placeholder,value,onChange,type="text"}) {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{width:"100%",padding:"7px 10px",borderRadius:6,border:"1px solid var(--bd)",fontFamily:"var(--ff)",fontSize:11,outline:"none"}} />;
}

function Select({options,value,onChange}) {
  return <select value={value} onChange={onChange} style={{padding:"7px 10px",borderRadius:6,border:"1px solid var(--bd)",fontFamily:"var(--ff)",fontSize:11,background:"#fff",cursor:"pointer"}}>
    {options.map(o=><option key={o} value={o}>{o}</option>)}
  </select>;
}

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTION PAGES
// ═══════════════════════════════════════════════════════════════════════════

function EmployeeManagementPage({state,dispatch}) {
  const {employees,filters,sort,selected} = state;
  
  const filtered = useMemo(() => {
    let result = employees.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(filters.search.toLowerCase()) || e.email.includes(filters.search);
      const matchDept = filters.dept==="All" || e.dept===filters.dept;
      const matchStatus = e.status===filters.status;
      const matchRisk = e.risk>=filters.riskMin;
      return matchSearch && matchDept && matchStatus && matchRisk;
    });
    return rank(result, sort.by, sort.dir);
  }, [employees, filters, sort]);

  const atRisk = filtered.filter(e => e.risk>=50);

  return <div style={{display:"flex",height:"100vh",flexDirection:"column",background:"var(--cr)"}}>
    <Header page="Employee Management" stats={[{v:filtered.length,l:"Showing"},{v:atRisk.length,l:"At Risk"},{v:employees.length,l:"Total"}]}/>
    
    <div style={{flex:1,overflow:"auto",padding:"16px 18px"}}>
      {atRisk.length>0&&<Card style={{marginBottom:12,background:"rgba(212,90,106,.12)",borderColor:"var(--ros)",borderWidth:2}}>
        <div style={{fontSize:11,fontWeight:600,color:"var(--ros)",marginBottom:6}}>🚨 {atRisk.length} EMPLOYEE(S) AT RISK</div>
        <div style={{fontSize:9.5,color:"var(--ros)",lineHeight:1.5}}>
          {atRisk.slice(0,3).map(e=><div key={e.id}>{e.name} ({e.risk}% risk) - {e.title}</div>)}
          {atRisk.length>3&&<div>+{atRisk.length-3} more...</div>}
        </div>
      </Card>}

      <Card style={{marginBottom:12,padding:"12px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,fontSize:11}}>
          <div><Input placeholder="Search name/email" value={filters.search} onChange={e=>dispatch({type:"SET_FILTER",payload:{search:e.target.value}})}/></div>
          <div><Select options={["All","HR","Eng","Design","Finance","Marketing"]} value={filters.dept} onChange={e=>dispatch({type:"SET_FILTER",payload:{dept:e.target.value}})}/></div>
          <div><Select options={["Active","On Leave","Inactive"]} value={filters.status} onChange={e=>dispatch({type:"SET_FILTER",payload:{status:e.target.value}})}/></div>
          <div><Select options={["Name","Risk","Salary","Performance"]} value={sort.by} onChange={e=>dispatch({type:"SET_SORT",payload:{by:e.target.value,dir:sort.dir}})}/></div>
          <div style={{display:"flex",gap:6}}><Btn onClick={()=>dispatch({type:"SET_FILTER",payload:{search:"",dept:"All",status:"Active",riskMin:0}})} size="sm">Reset</Btn></div>
        </div>
      </Card>

      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Name","Email","Dept","Title","Salary","Risk","Health","Perf","Eng","Action"].map(h=><th key={h} style={{fontSize:9.5,fontWeight:600,color:"var(--t3)",textAlign:"left",padding:"8px 11px",borderBottom:"1px solid var(--bd)",textTransform:"uppercase",fontFamily:"var(--fm)",background:"var(--cr)"}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(e=>{
              const health = getHealth(e);
              const risk = getRiskColor(e.risk);
              const mkt = MARKET[e.title]?.mid || e.salary;
              return <tr key={e.id} onClick={()=>dispatch({type:"SELECT_EMPLOYEE",payload:e})} style={{background:selected?.id===e.id?"rgba(232,81,42,.08)":"transparent",cursor:"pointer",borderBottom:"1px solid var(--bd)"}}>
                <td style={{padding:"8px 11px"}}><div style={{display:"flex",gap:7,alignItems:"center"}}><Av name={e.name} size={22}/><span style={{fontSize:10.5,fontWeight:500}}>{e.name}</span></div></td>
                <td style={{padding:"8px 11px",fontSize:9.5,fontFamily:"var(--fm)"}}>{e.email}</td>
                <td style={{padding:"8px 11px",fontSize:10}}>{e.dept}</td>
                <td style={{padding:"8px 11px",fontSize:10,fontWeight:500}}>{e.title}</td>
                <td style={{padding:"8px 11px",fontSize:9.5,fontFamily:"var(--fm)",fontWeight:600}}>{fmt(e.salary)}</td>
                <td style={{padding:"8px 11px"}}><Badge text={e.risk+"%"} color={risk.c}/></td>
                <td style={{padding:"8px 11px"}}><div style={{fontSize:9.5,fontWeight:600,color:health>=80?"var(--sg)":health>=60?"var(--cor)":"var(--ros)"}}>{health}%</div></td>
                <td style={{padding:"8px 11px",fontSize:9.5,fontWeight:500,color:e.perf>=85?"var(--sg)":"var(--cor)"}}>{e.perf}%</td>
                <td style={{padding:"8px 11px",fontSize:9.5,fontWeight:500,color:e.eng>=80?"var(--sg)":"var(--cor)"}}>{e.eng}%</td>
                <td style={{padding:"8px 11px"}}><Btn onClick={(evt)=>{evt.stopPropagation();dispatch({type:"OPEN_MODAL",payload:{type:"edit",data:e}})}} variant="coral" size="sm">Edit</Btn></td>
              </tr>;
            })}
          </tbody>
        </table>
      </Card>
    </div>

    {selected&&<div style={{height:"auto",maxHeight:200,background:"#fff",borderTop:"1px solid var(--bd)",padding:"12px 18px",overflow:"auto",fontSize:11}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontFamily:"var(--fd)",fontSize:13,fontStyle:"italic",fontWeight:500}}>{selected.name} - {selected.title}</div>
        <Btn onClick={()=>dispatch({type:"SELECT_EMPLOYEE",payload:null})} size="sm">Close</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,fontSize:10}}>
        <div><div style={{color:"var(--t3)",marginBottom:2}}>Manager</div><div style={{fontWeight:500}}>{selected.manager_id ? EMPLOYEES.find(e=>e.id===selected.manager_id)?.name : "None"}</div></div>
        <div><div style={{color:"var(--t3)",marginBottom:2}}>Reports</div><div style={{fontWeight:500}}>{selected.reports.length} direct</div></div>
        <div><div style={{color:"var(--t3)",marginBottom:2}}>Tenure</div><div style={{fontWeight:500}}>{selected.tenure} years</div></div>
        <div><div style={{color:"var(--t3)",marginBottom:2}}>Next Role</div><div style={{fontWeight:500}}>{selected.next}</div></div>
        <div><div style={{color:"var(--t3)",marginBottom:2}}>Readiness</div><div style={{fontWeight:500}}>{selected.ready}%</div></div>
        <div><div style={{color:"var(--t3)",marginBottom:2}}>Skills</div><div style={{fontWeight:500}}>{selected.skills.join(", ")}</div></div>
      </div>
    </div>}
  </div>;
}

function RetentionDashboardPage({state}) {
  const {employees} = state;
  const atRisk = employees.filter(e => e.risk>=50);
  const critical = employees.filter(e => e.risk>=70);
  const cost = atRisk.reduce((s,e)=>s+(COST[e.title]||100000),0);
  const avgRisk = Math.round(employees.reduce((s,e)=>s+e.risk,0)/employees.length);

  return <div style={{display:"flex",height:"100vh",flexDirection:"column",background:"var(--cr)"}}>
    <Header page="Retention Risk Dashboard" stats={[{v:critical.length,l:"Critical"},{v:atRisk.length,l:"At Risk"},{v:fmt(cost),l:"Risk Cost"}]}/>
    
    <div style={{flex:1,overflow:"auto",padding:"16px 18px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11,marginBottom:14}}>
        <Card><div style={{fontSize:9,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",marginBottom:4}}>At Risk</div><div style={{fontSize:24,fontWeight:600,color:"var(--cor)"}}>{atRisk.length}</div><div style={{fontSize:9,color:"var(--t3)",marginTop:3}}>{pct(atRisk.length,employees.length)}% of team</div></Card>
        <Card><div style={{fontSize:9,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",marginBottom:4}}>Avg Risk</div><div style={{fontSize:24,fontWeight:600,color:"var(--sky)"}}>{avgRisk}%</div><div style={{fontSize:9,color:"var(--t3)",marginTop:3}}>Company-wide</div></Card>
        <Card><div style={{fontSize:9,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",marginBottom:4}}>Total Risk Cost</div><div style={{fontSize:24,fontWeight:600,color:"var(--ros)"}}>{fmt(cost)}</div><div style={{fontSize:9,color:"var(--t3)",marginTop:3}}>If all leave</div></Card>
        <Card><div style={{fontSize:9,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",marginBottom:4}}>Secure</div><div style={{fontSize:24,fontWeight:600,color:"var(--sg)"}}>{employees.filter(e=>e.risk<30).length}</div><div style={{fontSize:9,color:"var(--t3)",marginTop:3}}>Low risk</div></Card>
      </div>

      {critical.length>0&&<Card style={{marginBottom:14,background:"rgba(212,90,106,.12)",borderColor:"var(--ros)",borderWidth:2}}>
        <div style={{fontSize:11,fontWeight:600,color:"var(--ros)",marginBottom:8}}>🚨 CRITICAL ATTENTION REQUIRED</div>
        {critical.map(e=><div key={e.id} style={{fontSize:10,color:"var(--ros)",marginBottom:4,paddingBottom:4,borderBottom:"1px solid rgba(212,90,106,.2)"}}>
          <strong>{e.name}</strong> ({e.title}) - Risk:{e.risk}% | Eng:{e.eng}% | Cost:{fmt(COST[e.title])} 
          <div style={{fontSize:9,color:"var(--ros)",marginTop:2}}>→ Action: Manager 1-on-1, engagement survey, retention discussion</div>
        </div>)}
      </Card>}

      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"12px 14px",borderBottom:"1px solid var(--bd)"}}>
          <div style={{fontSize:11,fontWeight:600}}>Full Risk Analysis</div>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Name","Eng","Perf","Abs","Risk","Salary","Market","Status"].map(h=><th key={h} style={{fontSize:9.5,fontWeight:600,color:"var(--t3)",textAlign:"left",padding:"8px 11px",borderBottom:"1px solid var(--bd)",textTransform:"uppercase",fontFamily:"var(--fm)",background:"var(--cr)"}}>{h}</th>)}</tr></thead>
          <tbody>
            {rank(employees,"risk").map(e=>{
              const mkt = MARKET[e.title]?.mid || e.salary;
              const gap = e.salary-mkt;
              return <tr key={e.id}>
                <td style={{padding:"8px 11px"}}><div style={{display:"flex",gap:6,alignItems:"center"}}><Av name={e.name} size={20}/><span style={{fontSize:10}}>{e.name}</span></div></td>
                <td style={{padding:"8px 11px"}}><Progress pct={e.eng} color={e.eng>=80?"var(--sg)":"var(--cor)"}/></td>
                <td style={{padding:"8px 11px",fontSize:10,fontWeight:500}}>{e.perf}%</td>
                <td style={{padding:"8px 11px",fontSize:9.5}}>{e.abs}d</td>
                <td style={{padding:"8px 11px"}}><Badge text={e.risk+"%"} color={getRiskColor(e.risk).c}/></td>
                <td style={{padding:"8px 11px",fontSize:9.5,fontFamily:"var(--fm)"}}>{fmt(e.salary)}</td>
                <td style={{padding:"8px 11px",fontSize:9.5,fontFamily:"var(--fm)",color:gap<-5000?"var(--ros)":"var(--sg)"}}>{fmt(mkt)}</td>
                <td style={{padding:"8px 11px",fontSize:9}}>
                  {e.risk>=70&&"Critical"}
                  {e.risk<70&&e.risk>=50&&"High"}
                  {e.risk<50&&e.risk>=30&&"Medium"}
                  {e.risk<30&&"Low"}
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </Card>
    </div>
  </div>;
}

function EquityDashboardPage({state}) {
  const {employees} = state;
  const analysis = employees.map(e=>{const m=MARKET[e.title]?.mid||e.salary;const g=e.salary-m;return {e,m,g,fair:g>=-3000&&g<=3000};});
  const unfair = analysis.filter(a=>!a.fair);
  const adjCost = unfair.reduce((s,a)=>s+Math.abs(a.g)*1.15,0);

  return <div style={{display:"flex",height:"100vh",flexDirection:"column",background:"var(--cr)"}}>
    <Header page="Compensation Equity" stats={[{v:unfair.length,l:"Issues"},{v:fmt(adjCost),l:"To Fix"},{v:Math.round(employees.reduce((s,e)=>s+e.salary,0)/employees.length),l:"Avg"}]}/>
    
    <div style={{flex:1,overflow:"auto",padding:"16px 18px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11,marginBottom:14}}>
        <Card><div style={{fontSize:9,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",marginBottom:4}}>Fair</div><div style={{fontSize:24,fontWeight:600,color:"var(--sg)"}}>{analysis.filter(a=>a.fair).length}</div></Card>
        <Card><div style={{fontSize:9,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",marginBottom:4}}>Below Market</div><div style={{fontSize:24,fontWeight:600,color:"var(--ros)"}}>{unfair.filter(a=>a.g<0).length}</div></Card>
        <Card><div style={{fontSize:9,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",marginBottom:4}}>Above Market</div><div style={{fontSize:24,fontWeight:600,color:"var(--cor)"}}>{unfair.filter(a=>a.g>0).length}</div></Card>
        <Card><div style={{fontSize:9,fontWeight:600,color:"var(--t3)",textTransform:"uppercase",marginBottom:4}}>Adjustment Cost</div><div style={{fontSize:20,fontWeight:600,color:"var(--sky)"}}>{fmt(adjCost)}</div></Card>
      </div>

      {unfair.length>0&&<Card style={{marginBottom:14,background:"rgba(196,133,42,.12)",borderColor:"var(--amb)",borderWidth:2}}>
        <div style={{fontSize:11,fontWeight:600,color:"var(--amb)",marginBottom:6}}>⚠️ PAY EQUITY ISSUES DETECTED</div>
        {unfair.slice(0,3).map(a=><div key={a.e.id} style={{fontSize:9.5,color:"var(--amb)",marginBottom:3}}>
          {a.e.name}: {a.g<0?"$"+Math.abs(a.g).toLocaleString()+" below":"$"+a.g.toLocaleString()+" above"} market
        </div>)}
      </Card>}

      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Name","Role","Current","Market","Gap","Status"].map(h=><th key={h} style={{fontSize:9.5,fontWeight:600,color:"var(--t3)",textAlign:"left",padding:"8px 11px",borderBottom:"1px solid var(--bd)",textTransform:"uppercase",fontFamily:"var(--fm)",background:"var(--cr)"}}>{h}</th>)}</tr></thead>
          <tbody>
            {rank(analysis,"g").map(a=><tr key={a.e.id}>
              <td style={{padding:"8px 11px",fontSize:10.5}}>{a.e.name}</td>
              <td style={{padding:"8px 11px",fontSize:10}}>{a.e.title}</td>
              <td style={{padding:"8px 11px",fontSize:9.5,fontFamily:"var(--fm)",fontWeight:600}}>{fmt(a.e.salary)}</td>
              <td style={{padding:"8px 11px",fontSize:9.5,fontFamily:"var(--fm)"}}>{fmt(a.m)}</td>
              <td style={{padding:"8px 11px",fontSize:9.5,fontFamily:"var(--fm)",fontWeight:600,color:a.g>=0?"var(--sg)":"var(--ros)"}}>{a.g>=0?"+":""}{fmt(a.g)}</td>
              <td style={{padding:"8px 11px"}}><Badge text={a.fair?"Fair":"Adjust"} color={a.fair?"var(--sg)":"var(--ros)"}/></td>
            </tr>)}
          </tbody>
        </table>
      </Card>
    </div>
  </div>;
}

function SuccessionPlanningPage({state}) {
  const {employees} = state;
  const critical = ["Senior Dev","Senior Analyst","HR Director"];
  const succession = employees.filter(e=>critical.includes(e.title)).map(inc=>{
    const backups = employees.filter(e=>e.dept===inc.dept&&e.id!==inc.id&&e.ready>=50).sort((a,b)=>b.ready-a.ready);
    return {inc, backups:backups.slice(0,2)};
  });

  return <div style={{display:"flex",height:"100vh",flexDirection:"column",background:"var(--cr)"}}>
    <Header page="Succession Planning" stats={[{v:succession.length,l:"Critical"},{v:succession.filter(s=>s.backups.length>0).length,l:"Ready"},{v:succession.filter(s=>s.backups.length===0).length,l:"At Risk"}]}/>
    
    <div style={{flex:1,overflow:"auto",padding:"16px 18px"}}>
      {succession.map(s=><Card key={s.inc.id} style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div>
            <div style={{fontSize:12,fontWeight:600}}>{s.inc.title}</div>
            <div style={{fontSize:9.5,color:"var(--t3)",marginTop:2}}>Current: {s.inc.name}</div>
          </div>
          {s.backups.length===0?<Badge text="NO BACKUP" color="var(--ros)"/>:<Badge text={s.backups.length+" Ready"} color="var(--sg)"/>}
        </div>
        
        {s.backups.length>0?
          s.backups.map((b,i)=><div key={b.id} style={{padding:"10px",background:"var(--cr2)",borderRadius:6,marginBottom:i<s.backups.length-1?6:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}><Av name={b.name} size={26}/><div><div style={{fontSize:11,fontWeight:500}}>{b.name}</div><div style={{fontSize:9,color:"var(--t3)"}}>{b.title}</div></div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:600,color:"var(--sg)"}}>{b.ready}%</div><div style={{fontSize:8.5,color:"var(--t3)"}}>Ready</div></div>
            </div>
            <Progress pct={b.ready} color="var(--sg)"/>
          </div>)
        :<div style={{padding:"12px",textAlign:"center",background:"rgba(212,90,106,.12)",borderRadius:6,fontSize:9.5,color:"var(--ros)",fontWeight:600}}>🚨 URGENT: No identified successor. Create development plan.</div>
        }
      </Card>)}
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════

export default function StaffRoomUltimate() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [page, setPage] = useState("employees");

  const PAGES = [
    {id:"employees",lbl:"👥 Employees",icon:"👥"},
    {id:"retention",lbl:"🚨 Retention",icon:"🚨"},
    {id:"equity",lbl:"💰 Equity",icon:"💰"},
    {id:"succession",lbl:"🏆 Succession",icon:"🏆"},
  ];

  const renderPage = () => {
    switch(page) {
      case "employees": return <EmployeeManagementPage state={state} dispatch={dispatch}/>;
      case "retention": return <RetentionDashboardPage state={state}/>;
      case "equity": return <EquityDashboardPage state={state}/>;
      case "succession": return <SuccessionPlanningPage state={state}/>;
      default: return <EmployeeManagementPage state={state} dispatch={dispatch}/>;
    }
  };

  return <>
    <style>{S}</style>
    <div style={{display:"flex",height:"100vh",overflow:"hidden",fontFamily:"var(--ff)"}}>
      <nav style={{width:200,background:"var(--sl)",display:"flex",flexDirection:"column",flexShrink:0,borderRight:"1px solid rgba(255,255,255,.07)"}}>
        <div style={{padding:"14px 12px",borderBottom:"1px solid rgba(255,255,255,.07)",display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:6,background:"var(--cor)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14}}>⚡</div>
          <div><div style={{fontFamily:"var(--fd)",fontSize:13,fontWeight:500,color:"#fff",fontStyle:"italic"}}>STAFFROOM</div><div style={{fontSize:7.5,color:"rgba(255,255,255,.2)"}}>Ultimate</div></div>
        </div>
        <div style={{flex:1,padding:"6px 0",overflowY:"auto"}}>
          {PAGES.map(p=>{
            const isActive = page===p.id;
            return <div key={p.id} onClick={()=>setPage(p.id)} style={{padding:"8px 8px",margin:"1px 4px",borderRadius:6,cursor:"pointer",color:isActive?"#fff":"rgba(255,255,255,.35)",fontSize:11,fontWeight:isActive?500:400,background:isActive?"var(--cor)":"transparent",userSelect:"none"}}>
              {p.lbl}
            </div>;
          })}
        </div>
        <div style={{padding:"8px",borderTop:"1px solid rgba(255,255,255,.07)",fontSize:7.5,color:"rgba(255,255,255,.2)",textAlign:"center",fontFamily:"var(--fm)"}}>v1.0 PROD</div>
      </nav>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {renderPage()}
      </div>
    </div>
  </>;
}
