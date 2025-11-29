import bcrypt from 'bcrypt';

// Generar hash para la contraseña 'admin123'
const password = 'admin123';
const hash = await bcrypt.hash(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nEjecuta este SQL en MySQL:');
console.log(`UPDATE usuario SET password = '${hash}' WHERE correo = 'admin@dutchroots.com';`);
