import DashboardEmptyState from '@/app/dashboard/_components/dashboard-empty-state';
import { handleApiAuthError } from '@/lib/api/guard';
import { getGiveawayWinners } from '@/lib/api/resources/giveaways';
import { getAccessToken } from '@/lib/api/server';

import { type WinnerRow, WinnersClient } from './winners-client';
import { Trophy } from 'lucide-react';

export default async function WinnersPage() {
    const token = await getAccessToken();

    let rows: WinnerRow[] = [];
    let failed = false;

    try {
        const winners = token ? await getGiveawayWinners(token) : [];
        rows = winners.map((w) => ({
            id: w.winner_id,
            prize: w.prize || '-',
            giveaway: w.giveaway?.name || '-',
            tier: w.giveaway?.tier || '-',
            winner: w.full_name || '-',
            state: w.state || '-',
            recorded_at: w.recorded_at ? w.recorded_at.slice(0, 10) : '-'
        }));
    } catch (error) {
        handleApiAuthError(error); // expired session → force logout
        failed = true;
    }

    if (failed || rows.length === 0) {
        return (
            <div className='p-4'>
                <DashboardEmptyState
                    icon={Trophy}
                    title={failed ? 'Could not load winners' : 'No winners yet'}
                    description={
                        failed
                            ? 'The winners list is unavailable right now. Please try again shortly.'
                            : 'Giveaway winners will appear here once draws are recorded.'
                    }
                />
            </div>
        );
    }

    return <WinnersClient data={rows} />;
}
