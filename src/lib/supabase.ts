import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://spfuxsnagcblqsjyeccu.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZnV4c25hZ2NibHFzanllY2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4OTQ0NTEsImV4cCI6MjA5NjQ3MDQ1MX0.AfOA7GJGtVN32AM-fMEKwLb_F17uGLip122SBySYy64";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
