import { commodityData } from '@/app/dashboard/(routes)/master-data/commodity/_components/data';
import { wilayahData } from '@/app/dashboard/(routes)/master-data/wilayah/_components/data';
import { usersData } from '@/app/dashboard/(routes)/users/_components/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { LineChart, MapPin, Tag, TrendingDown, TrendingUp, Users } from 'lucide-react';

export function SectionCards() {
    const totalWilayah = wilayahData.length;
    const totalKomoditas = commodityData.length;
    const totalUsers = usersData.length;
    const totalEntriHarga = 14;

    return (
        <div className='grid auto-rows-min gap-4 lg:grid-cols-2 xl:grid-cols-4'>
            {/* Total Wilayah */}
            <Card className='@container/card'>
                <CardHeader>
                    <CardDescription>Total Wilayah</CardDescription>
                    <CardTitle className='flex items-center gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                        <MapPin className='text-muted-foreground size-5' />
                        {totalWilayah}
                    </CardTitle>
                    <CardAction>
                        <Badge variant='outline'>
                            <TrendingUp className='mr-1 size-4' />
                            Stabil
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                    <div className='line-clamp-1 flex gap-2 font-medium'>Jumlah kabupaten/kota yang dimonitor</div>
                    <div className='text-muted-foreground'>Data master wilayah untuk visualisasi peta & neraca.</div>
                </CardFooter>
            </Card>

            {/* Total Komoditas */}
            <Card className='@container/card'>
                <CardHeader>
                    <CardDescription>Total Komoditas</CardDescription>
                    <CardTitle className='flex items-center gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                        <Tag className='text-muted-foreground size-5' />
                        {totalKomoditas}
                    </CardTitle>
                    <CardAction>
                        <Badge variant='outline'>
                            <TrendingUp className='mr-1 size-4' />
                            +2 komoditas baru
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                    <div className='line-clamp-1 flex gap-2 font-medium'>Komoditas strategis yang dipantau</div>
                    <div className='text-muted-foreground'>Digunakan di modul neraca & harga pasar.</div>
                </CardFooter>
            </Card>

            {/* Total Pengguna */}
            <Card className='@container/card'>
                <CardHeader>
                    <CardDescription>Total Pengguna</CardDescription>
                    <CardTitle className='flex items-center gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                        <Users className='text-muted-foreground size-5' />
                        {totalUsers}
                    </CardTitle>
                    <CardAction>
                        <Badge variant='outline'>
                            <TrendingUp className='mr-1 size-4' />
                            +1 admin baru
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                    <div className='line-clamp-1 flex gap-2 font-medium'>Akun aktif dalam sistem</div>
                    <div className='text-muted-foreground'>Berisi admin & user yang mengelola data komoditas.</div>
                </CardFooter>
            </Card>

            {/* Total Entri Harga / Neraca */}
            <Card className='@container/card'>
                <CardHeader>
                    <CardDescription>Total Entri Harga</CardDescription>
                    <CardTitle className='flex items-center gap-2 text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                        <LineChart className='text-muted-foreground size-5' />
                        {totalEntriHarga}
                    </CardTitle>
                    <CardAction>
                        <Badge variant='outline'>
                            <TrendingDown className='mr-1 size-4' />
                            -5% missing data
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className='flex-col items-start gap-1.5 text-sm'>
                    <div className='line-clamp-1 flex gap-2 font-medium'>Rekaman harga harian / periodik</div>
                    <div className='text-muted-foreground'>Dipakai untuk grafik tren & korelasi neraca–harga.</div>
                </CardFooter>
            </Card>
        </div>
    );
}
