import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dhqttxlrehmhrlppxknf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRocXR0eGxyZWhtaHJscHB4a25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTY5NzgsImV4cCI6MjA2MjM5Mjk3OH0.Yt4YrHnQhkJ20Gx7NI5DDBDJifZ3ODGyTHYTGQ--CS4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
