import '../styles/globals.scss'
import '@fontsource/comfortaa'
import '@fontsource/zilla-slab'
import '@fontsource/fira-code'
import '@fontsource/noto-sans-sc'
import 'katex/dist/katex.min.css'
import 'react-toastify/dist/ReactToastify.min.css'
import { ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'

function MyApp({ Component, pageProps, router }) {
    return (
        <>
            <motion.div
                key={router.route}
                initial='pageInitial'
                animate='pageAnimate'
                variants={{
                    pageInitial: {
                        opacity: 0,
                    },
                    pageAnimate: {
                        opacity: 1,
                    },
                }}>
                <Component {...pageProps} />
            </motion.div>

            <ToastContainer />
        </>
    )
}

export default MyApp
