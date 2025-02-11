'use client'

import { useEffect } from 'react'

export default function BackgroundWrapper({
  backgroundImage,
  children,
}: {
  backgroundImage: string
  children: React.ReactNode
}) {
  useEffect(() => {
    const setBackgroundVH = () => {
      document.documentElement.style.setProperty('--background-image', `url("${backgroundImage}")`)
      document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
    };

    setBackgroundVH();
    window.addEventListener('resize', setBackgroundVH);

    return () => window.removeEventListener('resize', setBackgroundVH);
  }, []);

  return <div className={'background-wrapper'}>{children}</div>
}
