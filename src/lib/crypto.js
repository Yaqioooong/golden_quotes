import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_AES_KEY || 'your-fallback-secret-key';

export const encryptAES = (text) => {
    // 使用与后端相同的加密配置
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const srcs = CryptoJS.enc.Utf8.parse(text);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};

export const decryptAES = (ciphertext) => {
    try {
        const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
        ciphertext = CryptoJS.format.Base64.parse(ciphertext);
        const bytes = CryptoJS.AES.decrypt(ciphertext, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('解密失败:', error);
        return '';
    }
};