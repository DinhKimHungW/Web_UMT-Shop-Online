require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedUsers() {
    console.log('Starting user seed...');

    // 1. Get Roles
    const { data: roles, error: roleError } = await supabase
        .from('roles')
        .select('*');

    if (roleError) {
        console.error('Error fetching roles:', roleError);
        return;
    }

    const roleMap = {};
    roles.forEach(r => roleMap[r.name] = r.id);
    console.log('Roles found:', roleMap);

    // 2. Prepare Users
    const passwordHash = await bcrypt.hash('123456', 10);
    const users = [];

    // Super Admin
    users.push({
        email: 'superadmin@umt.edu.vn',
        password_hash: passwordHash,
        name: 'Super Admin',
        phone: '0900000000',
        role_id: roleMap['super_admin'],
        address: 'UMT Campus'
    });

    // 5 Admins
    for (let i = 1; i <= 5; i++) {
        users.push({
            email: `admin${i}@umt.edu.vn`,
            password_hash: passwordHash,
            name: `Admin User ${i}`,
            phone: `090000000${i}`,
            role_id: roleMap['admin_canteen'],
            address: `Canteen ${i}`
        });
    }

    // 10 Users
    for (let i = 1; i <= 10; i++) {
        users.push({
            email: `user${i}@umt.edu.vn`,
            password_hash: passwordHash,
            name: `Student User ${i}`,
            phone: `09100000${i < 10 ? '0' + i : i}`,
            role_id: roleMap['user'],
            address: `Dormitory Room ${i}`
        });
    }

    console.log(`Prepared ${users.length} users to insert.`);

    // 3. Insert Users
    // We insert one by one or in batches to handle potential email conflicts gracefully if needed,
    // but since we cleared data, we can try batch insert.
    // However, Supabase/Postgres might throw error on duplicate email if we run this twice.
    // We'll use upsert or just insert and catch error.
    
    const { data, error } = await supabase
        .from('users')
        .upsert(users, { onConflict: 'email' })
        .select();

    if (error) {
        console.error('Error inserting users:', error);
    } else {
        console.log(`Successfully inserted/updated ${data.length} users.`);
        console.log('Default password for all accounts is: 123456');
    }
}

seedUsers();
