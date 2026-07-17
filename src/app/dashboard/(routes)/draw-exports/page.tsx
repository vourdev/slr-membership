import { handleApiAuthError } from '@/lib/api/guard';
import { type DrawCsvHistoryItem, getDrawCsvHistory } from '@/lib/api/resources/admin';
import { getAccessToken } from '@/lib/api/server';

import { DrawExportsClient } from './draw-exports-client';

export default async function DrawExportsPage() {
    const token = await getAccessToken();

    let history: DrawCsvHistoryItem[] = [];
    let failed = false;

    try {
        history = token ? await getDrawCsvHistory(token) : [];
    } catch (error) {
        handleApiAuthError(error); // 401 only → force logout; others fall through
        failed = true;
    }

    return <DrawExportsClient initialHistory={history} failed={failed} />;
}
