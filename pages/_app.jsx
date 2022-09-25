import '../styles/globals.scss'
import '@fontsource/zilla-slab'
import '@fontsource/roboto'
import 'katex/dist/katex.min.css'
import 'react-toastify/dist/ReactToastify.min.css'
import { ToastContainer } from 'react-toastify'
import { AnimatePresence, motion } from 'framer-motion'
import Header from '../components/Header'

function MyApp({ Component, pageProps, router }) {
    return (
        <AnimatePresence initial>
            <Header logo={pageProps.logo} />
            <motion.div
                key={router.route}
                initial='hidden'
                animate='enter'
                exit='exit'
                transition={{ type: 'linear' }}
                variants={{
                    hidden: { opacity: 0 },
                    enter: { opacity: 1 },
                    exit: { opacity: 0 },
                }}>
                <Component {...pageProps} />
            </motion.div>
            <ToastContainer />
        </AnimatePresence>
    )
}

export default MyApp
