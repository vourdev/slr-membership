'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { goldButtonStyle } from '@/lib/styles';

import { type EbookLibraryItem, ebookLibrary } from './data';
import { Download, Eye } from 'lucide-react';

function EbookCard({ item, onView }: { item: EbookLibraryItem; onView: (item: EbookLibraryItem) => void }) {
    return (
        <div className='flex flex-col'>
            <button
                type='button'
                onClick={() => onView(item)}
                aria-label={`View ${item.title}`}
                className='cursor-pointer overflow-hidden rounded-2xl transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[#FFDC75] focus-visible:outline-none'>
                <Image
                    src={item.image}
                    alt={`${item.title} — ${item.subtitle}`}
                    width={1122}
                    height={1402}
                    className='h-auto w-full'
                />
            </button>

            <h3 className='font-bebas-neue mt-4 text-center text-2xl tracking-wider text-white uppercase'>
                {item.title}
            </h3>

            <div className='mt-3 flex gap-3'>
                <Button
                    type='button'
                    onClick={() => onView(item)}
                    style={goldButtonStyle}
                    className='h-11 flex-1 rounded-xl font-bold uppercase'>
                    <Eye className='h-4 w-4' />
                    View
                </Button>
                <Button
                    asChild
                    className='h-11 flex-1 rounded-xl bg-white font-bold text-[#0C1132] uppercase hover:bg-white/90'>
                    <a href={item.pdf_url} download={`${item.id}.pdf`}>
                        <Download className='h-4 w-4' />
                        Download
                    </a>
                </Button>
            </div>
        </div>
    );
}

export function EbookLibraryGrid() {
    const [active, setActive] = useState<EbookLibraryItem | null>(null);

    return (
        <>
            <div className='mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-10 lg:grid-cols-3'>
                {ebookLibrary.map((item) => (
                    <EbookCard key={item.id} item={item} onView={setActive} />
                ))}
            </div>

            <Dialog open={!!active} onOpenChange={(open) => (open ? null : setActive(null))}>
                <DialogContent className='dark max-w-4xl'>
                    <DialogHeader>
                        <DialogTitle className='font-bebas-neue text-2xl tracking-wider uppercase'>
                            {active?.title}
                        </DialogTitle>
                    </DialogHeader>
                    {active ? (
                        <iframe
                            src={active.pdf_url}
                            title={active.title}
                            className='h-[75vh] w-full rounded-md border-0 bg-white'
                        />
                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    );
}
