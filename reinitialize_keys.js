import dotenv from 'dotenv';
import Redis from 'ioredis';
import { reinitializeKeys } from './reinitialize'; // Скрипт с перепроинициализацией

dotenv.config();
const redis = new Redis();

(async () => {
    try {
        console.log('Перепроинициализация данных...');
        await reinitializeKeys(redis);
        console.log('Обновление ключей завершено.');
    } catch (error) {
        console.error('Ошибка при обновлении ключей:', error);
    } finally {
        redis.quit();
    }
})();
