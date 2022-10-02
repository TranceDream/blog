import '../styles/globals.scss'
import '@fontsource/zilla-slab'
import '@fontsource/roboto'
import 'katex/dist/katex.min.css'
import 'react-toastify/dist/ReactToastify.min.css'
import { ToastContainer } from 'react-toastify'
import nprogress from 'nprogress'
import Header from '../components/Header'
import { Router } from 'next/router'

Router.events.on('routeChangeStart', nprogress.start)
Router.events.on('routeChangeError', nprogress.done)
Router.events.on('routeChangeComplete', nprogress.done)

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Header logo={pageProps.logo} />
            <Component {...pageProps} />
            <ToastContainer />
        </>
    )
}

export default MyApp
