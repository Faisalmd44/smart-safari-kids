import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://knbfuaxfhfogploaytsf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuYmZ1YXhmaGZvZ3Bsb2F5dHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMDk4MjIsImV4cCI6MjA5OTg4NTgyMn0.KdkEbNTPa2OFp6B-YyKef4tYcqjxiRWiD1Zuva5yJhQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

const DEVICE_ID_KEY = 'smart_safari_device_id';

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = 'dev-' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}
