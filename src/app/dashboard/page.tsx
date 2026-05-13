import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getServerApi } from '@/lib/server-api';

// import { CommodityApiResponse } from './(routes)/master-data/commodity/page';
// import { WilayahApiResponse } from './(routes)/master-data/wilayah/page';
import { UsersApiResponse } from './(routes)/users/page';
import { Boxes, MapPinned, UserCog, Users } from 'lucide-react';

export default async function AdminPage() {
    const page = 1;
    const limit = 10;
    const search = '';
    const sort = 'created_at';
    const order = 'desc';

    const api = await getServerApi();

    // const users = await api.get<UsersApiResponse>('/api/users', {
    //     params: {
    //         page,
    //         limit,
    //         search: search || undefined,
    //         sort,
    //         order
    //     }
    // });

    // const wilayah = await api.get<WilayahApiResponse>('/api/regions', {
    //     params: {
    //         page,
    //         limit,
    //         search: search || undefined,
    //         sort,
    //         order
    //     }
    // });

    // const commodities = await api.get<CommodityApiResponse>('/api/commodities', {
    //     params: {
    //         page,
    //         limit,
    //         search: search || undefined,
    //         sort,
    //         order
    //     }
    // });

    // const usersSPV = users.data.data.filter((u) => {
    //     const currentUserRole = u.roles[0]?.name;
    //     return currentUserRole === 'ROLE_SPV';
    // });

    // const wilayahFilter = wilayah.data.data.filter((r) => {
    //     const currentRegion = r.code;
    //     return currentRegion !== 'PROV_KALTARA';
    // });

    return (
        <div className='flex flex-col'>
            <div className='flex-1 space-y-4 px-4 py-8 pt-6'>
                <div className='space-y-2'>
                    <div>
                        <h2 className='text-3xl font-bold tracking-tight'>Dashboard Admin SLR</h2>
                        <div className='text-base'>Pusat pengelolaan data SLR.</div>
                    </div>
                    <p>
                        Dashboard ini digunakan untuk mengelola, memperbarui, dan memvalidasi data ketersediaan,
                        kebutuhan, serta neraca pangan secara terintegrasi dan berkelanjutan.
                    </p>
                    {/* <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between'>
                                <CardDescription>Total Users</CardDescription>
                                <Users className='text-muted-foreground h-5 w-5' />
                            </CardHeader>
                            <CardContent>
                                <CardTitle className='text-4xl font-semibold tabular-nums'>
                                    {users?.data.data.length > 0 ? users?.data.pagination.total : 0}
                                </CardTitle>
                            </CardContent>
                            <CardFooter className='text-muted-foreground text-sm'>
                                Seluruh pengguna terdaftar
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between'>
                                <CardDescription>Supervisor (SPV)</CardDescription>
                                <UserCog className='text-muted-foreground h-5 w-5' />
                            </CardHeader>
                            <CardContent>
                                <CardTitle className='text-4xl font-semibold tabular-nums'>
                                    {usersSPV?.length > 0 ? usersSPV?.length : 0}
                                </CardTitle>
                            </CardContent>
                            <CardFooter className='text-muted-foreground text-sm'>Users dengan role SPV</CardFooter>
                        </Card>

                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between'>
                                <CardDescription>Wilayah</CardDescription>
                                <MapPinned className='text-muted-foreground h-5 w-5' />
                            </CardHeader>
                            <CardContent>
                                <CardTitle className='text-4xl font-semibold tabular-nums'>
                                    {wilayahFilter?.length > 0 ? wilayahFilter?.length : 0}
                                </CardTitle>
                            </CardContent>
                            <CardFooter className='text-muted-foreground text-sm'>Total wilayah terdaftar</CardFooter>
                        </Card>

                        <Card>
                            <CardHeader className='flex flex-row items-center justify-between'>
                                <CardDescription>Commodity</CardDescription>
                                <Boxes className='text-muted-foreground h-5 w-5' />
                            </CardHeader>
                            <CardContent>
                                <CardTitle className='text-4xl font-semibold tabular-nums'>
                                    {commodities?.data.data.length > 0 ? commodities?.data.pagination.total : 0}
                                </CardTitle>
                            </CardContent>
                            <CardFooter className='text-muted-foreground text-sm'>Jenis komoditas aktif</CardFooter>
                        </Card>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
