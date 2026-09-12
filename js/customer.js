// CarRescue24 - customer rescue request UI + database submission
(function () {
  const db = window.carRescueDB;

  const style = document.createElement("style");
  style.textContent = `
    #cr24-request-btn{position:fixed;left:24px;bottom:24px;z-index:201;background:#FFD600;color:#0a0a0a;border:0;border-radius:50px;padding:14px 20px;font:700 15px Barlow,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,.5);cursor:pointer}
    #cr24-request-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.78);backdrop-filter:blur(7px);display:none;align-items:center;justify-content:center;padding:20px}
    #cr24-request-modal{width:min(620px,100%);max-height:90vh;overflow:auto;background:#111;border:1px solid #333;border-radius:12px;padding:28px;color:#f5f5f0;font-family:Barlow,sans-serif;box-shadow:0 20px 80px rgba(0,0,0,.7)}
    #cr24-request-modal h2{font-family:Bebas Neue,sans-serif;font-size:42px;color:#FFD600;margin-bottom:5px}
    .cr24-sub{color:#888;margin-bottom:20px}
    .cr24-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .cr24-field{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}.cr24-field.full{grid-column:1/-1}
    .cr24-field label{font-size:12px;color:#aaa;text-transform:uppercase;letter-spacing:.08em}.cr24-field input,.cr24-field select,.cr24-field textarea{width:100%;background:#1a1a1a;border:1px solid #333;color:#fff;border-radius:6px;padding:11px;font:inherit;outline:none}.cr24-field textarea{min-height:90px;resize:vertical}.cr24-field input:focus,.cr24-field select:focus,.cr24-field textarea:focus{border-color:#FFD600}
    .cr24-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:8px}.cr24-actions button{padding:11px 18px;border-radius:6px;border:0;font-weight:700;cursor:pointer}.cr24-close{background:#222;color:#fff}.cr24-submit{background:#FFD600;color:#0a0a0a}.cr24-msg{margin-top:12px;font-size:14px}.cr24-ok{color:#25D366}.cr24-err{color:#ff5b5b}
    @media(max-width:620px){#cr24-request-btn{left:14px;bottom:14px;padding:12px 15px}.cr24-grid{grid-template-columns:1fr}.cr24-field.full{grid-column:auto}}
  `; document.head.appendChild(style);

  const btn=document.createElement("button"); btn.id="cr24-request-btn"; btn.type="button"; btn.textContent="🚨 Request Assistance"; document.body.appendChild(btn);
  const overlay=document.createElement("div"); overlay.id="cr24-request-overlay";
  overlay.innerHTML=`<div id="cr24-request-modal" role="dialog" aria-modal="true" aria-labelledby="cr24-title">
    <h2 id="cr24-title">REQUEST ASSISTANCE</h2><div class="cr24-sub">Tell us what happened. We will contact you and arrange assistance.</div>
    <form id="cr24-form"><div class="cr24-grid">
      <div class="cr24-field"><label>Name *</label><input name="name" required maxlength="100"></div>
      <div class="cr24-field"><label>Mobile *</label><input name="mobile" required type="tel" maxlength="20"></div>
      <div class="cr24-field"><label>Email</label><input name="email" type="email" maxlength="150"></div>
      <div class="cr24-field"><label>Vehicle Number</label><input name="vehicle_number" maxlength="30" placeholder="MH12AB1234"></div>
      <div class="cr24-field"><label>Vehicle Type</label><select name="vehicle_type"><option value="">Select</option><option>Hatchback</option><option>Sedan</option><option>SUV</option><option>Luxury</option><option>Other</option></select></div>
      <div class="cr24-field"><label>Problem</label><select name="problem"><option value="">Select</option><option>Puncture Repair</option><option>Jump Start</option><option>Steam Wash</option><option>Car Wash</option><option>Other Roadside Problem</option></select></div>
      <div class="cr24-field full"><label>Location *</label><input name="location" required maxlength="300" placeholder="Current location / landmark"></div>
      <div class="cr24-field full"><label>Additional Details</label><textarea name="additional_details" maxlength="1000" placeholder="Any extra information..."></textarea></div>
    </div><div class="cr24-actions"><button type="button" class="cr24-close" id="cr24-close">Close</button><button class="cr24-submit" type="submit">Submit Request</button></div><div id="cr24-msg" class="cr24-msg"></div></form>
  </div>`; document.body.appendChild(overlay);
  const form=document.getElementById("cr24-form"), msg=document.getElementById("cr24-msg");
  function open(){overlay.style.display="flex"} function close(){overlay.style.display="none";msg.textContent="";msg.className="cr24-msg"}
  btn.onclick=open; document.getElementById("cr24-close").onclick=close; overlay.addEventListener("click",e=>{if(e.target===overlay)close()});

  form.addEventListener("submit",async function(e){
    e.preventDefault(); msg.textContent="Submitting..."; msg.className="cr24-msg";
    if(!db || SUPABASE_URL.startsWith("YOUR_")){msg.textContent="Supabase is not configured yet. Add your Project URL and Publishable key in js/supabase.js.";msg.className="cr24-msg cr24-err";return;}
    const data=Object.fromEntries(new FormData(form).entries());
    const payload={name:data.name.trim(),mobile:data.mobile.trim(),email:data.email.trim()||null,vehicle_number:data.vehicle_number.trim()||null,vehicle_type:data.vehicle_type||null,problem:data.problem||null,location:data.location.trim(),additional_details:data.additional_details.trim()||null,status:"Pending"};
    const {error}=await db.from("rescue_requests").insert(payload);
    if(error){console.error(error);msg.textContent="Unable to submit request. Please call 8805188105.";msg.className="cr24-msg cr24-err";return;}
    msg.textContent="Request submitted successfully. We will contact you shortly.";msg.className="cr24-msg cr24-ok"; form.reset();
  });
})();
