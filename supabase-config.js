// ══════════════════════════════════════════════════
//  AttendSync — Supabase Configuration
//  Replace the values below with your project credentials
//  from: https://supabase.com/dashboard → Project Settings → API
// ══════════════════════════════════════════════════

const SUPABASE_URL  = 'https://ofryzdzwexwiefwaerua.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mcnl6ZHp3ZXh3aWVmd2FlcnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NTE5NTgsImV4cCI6MjA5MDMyNzk1OH0.CD-JOcid0l1RKqXsiR7isQyhZRC_vIXjSl9IFqpjpz4';

// ── Client (loaded via CDN in each HTML file)
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

// We expose these globally so every page can pick them up
window.__SUPA_URL  = SUPABASE_URL;
window.__SUPA_ANON = SUPABASE_ANON;
