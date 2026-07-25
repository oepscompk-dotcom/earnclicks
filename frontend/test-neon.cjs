const { neon } = require('@neondatabase/serverless');
const sql = neon('postgresql://neondb_owner:npg_UEw9I3HWAqSJ@ep-damp-leaf-ax2hznj7-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require');
sql`SELECT 1 as test`.then(r => { console.log('SUCCESS:', JSON.stringify(r)); process.exit(0); }).catch(e => { console.log('ERROR:', e.message); process.exit(1); });