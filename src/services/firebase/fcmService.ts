import api from '../api';
import type { RegisterFcmTokenPayload } from '../../types/fcm.types';
import { isIOS } from '../../utils/os';

export const saveFcmTokenApi = async (token: string): Promise<void> => {
    const payload: RegisterFcmTokenPayload = {
        fcmToken: token,
        platform: isIOS ? 'IOS' : 'ANDROID',
    };

    await api.post('/v1/devices/register', payload);
};

export const removeFcmTokenApi = async (token: string): Promise<void> => {
    await api.delete(`/v1/devices/${token}`, {
    });
};