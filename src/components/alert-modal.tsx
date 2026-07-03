'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

import { Modal } from './modal';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    className?: string;
}

export const AlertModal = ({ isOpen, onClose, onConfirm, loading, className }: AlertModalProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [isMounted]);

    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            title='Are you sure?'
            description='This action cannot be undone.'
            isOpen={isOpen}
            onClose={onClose}
            className={className}>
            <div className='flex w-full items-center justify-end space-x-2'>
                <Button disabled={loading} variant='outline' onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} variant='destructive' onClick={onConfirm}>
                    Continue
                </Button>
            </div>
        </Modal>
    );
};
