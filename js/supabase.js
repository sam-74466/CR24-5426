// CarRescue24 - Supabase connection
// IMPORTANT: use only the Supabase Publishable key here. Never put the Secret key in browser code.

const SUPABASE_URL = "https://rdfmdsbhpijaqsqgqetf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_8PVrsjaMnJeznTLBlBwG_A_97pR_OpH";

if (!window.supabase) {
  console.error("Supabase library was not loaded.");
} else {
  window.carRescueDB = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
}
