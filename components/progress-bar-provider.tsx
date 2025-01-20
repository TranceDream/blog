'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import NavBar from './nav-bar'

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavBar />
      {children}
      <ProgressBar
        height='4px'
        color='burlywood'
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  )
}

export default ProgressBarProvider
