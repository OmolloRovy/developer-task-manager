import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import {useState, useEffect} from 'react';  

export default function ThemeToggle() {
    const [dark, setDark] = useState(
    () => localStorage.getItem('theme') === 'dark' );

    useEffect(() => {
        const root = window.document.documentElement;
        if (dark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    } , [dark]);

    return (
        <Button variant="ghost" size="icon" label="Toggle theme" onClick={() => setDark(!dark)}>
            {dark ? <SunIcon className='w-5 h-5'/> : <MoonIcon className='w-5 h-5' />}
        </Button>
    );
}
