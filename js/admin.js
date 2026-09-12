// CarRescue24 - admin dashboard
const ADMIN_EMAIL = "carrescuehelp24@gmail.com";
let allRequests=[]; let currentRequest=null;
const db=window.carRescueDB;
const $=id=>document.getElementById(id);

function showLogin(){ $("login").hidden=false; $("app").hidden=true; }
function showApp(){ $("login").hidden=true; $("app").hidden=false; $("admin-email").textContent=window.currentAdminEmail||""; }

async function init(){
  if(!db){$("login-msg").textContent="Supabase is not configured.";return;}
  const {data:{session}}=await db.auth.getSession();
  if(session){ if(ADMIN_EMAIL!=="'carrescuehelp24@gmail.com'" && session.user.email!==ADMIN_EMAIL){await db.auth.signOut();showLogin();}else{window.currentAdminEmail=session.user.email;showApp();loadAll();}} else showLogin();
}
$("login-form").addEventListener("submit",async e=>{e.preventDefault();$("login-msg").textContent="Logging in...";if(!db)return;const {data,error}=await db.auth.signInWithPassword({email:$("login-email").value.trim(),password:$("login-password").value});if(error){$("login-msg").textContent=error.message;return;}if(ADMIN_EMAIL!=="'carrescuehelp24@gmail.com'" && data.user.email!==ADMIN_EMAIL){await db.auth.signOut();$("login-msg").textContent="This account is not authorized as admin.";return;}window.currentAdminEmail=data.user.email;showApp();loadAll();});
$("logout").onclick=async()=>{await db.auth.signOut();showLogin();};

document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-view]").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".view").forEach(v=>v.hidden=true);$(b.dataset.view+"-view").hidden=false;$("view-title").textContent=b.textContent.replace(/^\S+\s/,"");if(b.dataset.view==="requests")renderRequests();if(b.dataset.view==="enquiries")loadEnquiries();});
$("refresh").onclick=loadAll;$("refresh2").onclick=loadAll;$("search").addEventListener("input",renderRequests);$("status-filter").addEventListener("change",renderRequests);

async function loadAll(){if(!db)return;const r=await db.from("rescue_requests").select("*").order("created_at",{ascending:false});if(r.error){console.error(r.error);return;}allRequests=r.data||[];updateStats();renderDashboard();renderRequests();}
function updateStats(){const n=allRequests.length;$("total").textContent=n;$("pending").textContent=allRequests.filter(x=>x.status==="Pending").length;$("active").textContent=allRequests.filter(x=>["Contacted","Arranged","On The Way"].includes(x.status)).length;$("completed").textContent=allRequests.filter(x=>x.status==="Completed").length;}
function fmt(d){return d?new Date(d).toLocaleString("en-IN"):"-"}
function status(s){return `<span class="status ${String(s).replaceAll(" ","")}">${s||"Pending"}</span>`}
function renderDashboard(){const rows=allRequests.slice(0,10);$("dashboard-table").innerHTML=rows.map(x=>`<tr><td>#${x.id}</td><td>${esc(x.name)}</td><td>${esc(x.mobile)}</td><td>${esc(x.problem||"-")}</td><td>${esc(x.location)}</td><td>${status(x.status)}</td><td>${fmt(x.created_at)}</td></tr>`).join("")||emptyRow(7);}
function renderRequests(){let q=$("search").value.toLowerCase(), f=$("status-filter").value;let rows=allRequests.filter(x=>(!f||x.status===f)&&(!q||[x.name,x.mobile,x.location,x.vehicle_number,x.problem].some(v=>String(v||"").toLowerCase().includes(q))));$("requests-table").innerHTML=rows.map(x=>`<tr><td>#${x.id}</td><td>${esc(x.name)}</td><td><a href="tel:${esc(x.mobile)}" style="color:#FFD600">${esc(x.mobile)}</a></td><td>${esc(x.vehicle_number||"-")}<br>${esc(x.vehicle_type||"")}</td><td>${esc(x.problem||"-")}</td><td>${esc(x.location)}</td><td>${status(x.status)}</td><td>${fmt(x.created_at)}</td><td><button class="view-btn" onclick="openRequest(${x.id})">View</button></td></tr>`).join("")||emptyRow(9);}
function emptyRow(n){return `<tr><td colspan="${n}" style="text-align:center;color:#666;padding:30px">No records found</td></tr>`}
function esc(v){return String(v??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]));}
window.openRequest=id=>{currentRequest=allRequests.find(x=>x.id==id);if(!currentRequest)return;$("details").innerHTML=[["Name",currentRequest.name],["Mobile",currentRequest.mobile],["Email",currentRequest.email],["Vehicle",(currentRequest.vehicle_number||"-")+" / "+(currentRequest.vehicle_type||"-")],["Problem",currentRequest.problem],["Location",currentRequest.location],["Additional Details",currentRequest.additional_details],["Created",fmt(currentRequest.created_at)]].map(([a,b])=>`<div><strong>${a}</strong>${esc(b||"-")}</div>`).join("");$("detail-status").value=currentRequest.status||"Pending";$("admin-note").value=currentRequest.admin_note||"";$("call-link").href="tel:"+currentRequest.mobile;$("map-link").href="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(currentRequest.location||"");$("save-msg").textContent="";$("modal").hidden=false;};
$("modal-close").onclick=()=>$("modal").hidden=true;$("modal").addEventListener("click",e=>{if(e.target===$("modal"))$("modal").hidden=true});
$("save-detail").onclick=async()=>{if(!currentRequest||!db)return;$("save-msg").textContent="Saving...";const {error}=await db.from("rescue_requests").update({status:$("detail-status").value,admin_note:$("admin-note").value,updated_at:new Date().toISOString()}).eq("id",currentRequest.id);if(error){$("save-msg").textContent=error.message;return;}$("save-msg").textContent="Saved.";await loadAll();setTimeout(()=>$("modal").hidden=true,500);};
async function loadEnquiries(){const {data,error}=await db.from("enquiries").select("*").order("created_at",{ascending:false});if(error){console.error(error);return;}$("enquiries-table").innerHTML=(data||[]).map(x=>`<tr><td>#${x.id}</td><td>${esc(x.name)}</td><td>${esc(x.mobile)}</td><td>${esc(x.email)}</td><td>${esc(x.message)}</td><td>${fmt(x.created_at)}</td></tr>`).join("")||emptyRow(6);}
init();
