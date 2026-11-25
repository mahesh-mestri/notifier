import api from '../api';
import type {
    CreateReminderRequest,
} from '../../types/reminder.types';

export const createReminderApi = async (payload: CreateReminderRequest): Promise<any> => {
    if (__DEV__) console.warn('create reminder: ', payload);
    const response = await api.post<any>(
        '/v1/reminder',
        payload,
    );

    return response.data;
};