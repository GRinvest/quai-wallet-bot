import crypto from 'crypto';

// Старые ключи
const OLD_ENCRYPTION_KEY = Buffer.from(process.env.OLD_ENCRYPTION_KEY, 'hex');
const OLD_IV = Buffer.from(process.env.OLD_IV, 'hex');

// Новые ключи
const NEW_ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const NEW_IV = Buffer.from(process.env.IV, 'hex');

// Функции для работы с ключами
function decryptWithOldKey(encryptedText) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', OLD_ENCRYPTION_KEY, OLD_IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function encryptWithNewKey(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', NEW_ENCRYPTION_KEY, NEW_IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Перепроинициализация данных
async function reinitializeKeys(redis) {
    const keys = await redis.keys('user:*:privkey');
    for (const key of keys) {
        const encryptedPrivKey = await redis.get(key);
        const decryptedPrivKey = decryptWithOldKey(encryptedPrivKey); // Расшифровка старым ключом
        const newEncryptedPrivKey = encryptWithNewKey(decryptedPrivKey); // Шифрование новым ключом
        await redis.set(key, newEncryptedPrivKey);
    }
    console.log('Все данные успешно перепроинициализированы.');
}
