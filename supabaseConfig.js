const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nkhexyljsfxmhhpfusko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5raGV4eWxqc2Z4bWhocGZ1c2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNDg5MTksImV4cCI6MjA1NTYyNDkxOX0.Pg_9Hrzsb6fSpiP0ft8R9XxWptvWJ-RIzVaTYucRESk';

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    }
});

module.exports = { supabase }; 