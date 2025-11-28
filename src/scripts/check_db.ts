import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env vars manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('Checking Categories...');
    const { count: catCount, error: catError } = await supabase.from('categories').select('*', { count: 'exact', head: true });
    if (catError) console.error('Error fetching categories:', catError);
    else console.log('Categories count:', catCount);

    console.log('Checking Attributes...');
    const { count: attrCount, error: attrError } = await supabase.from('attributes').select('*', { count: 'exact', head: true });
    if (attrError) console.error('Error fetching attributes:', attrError);
    else console.log('Attributes count:', attrCount);
}

checkData();
