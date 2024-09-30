import '../styles/globals.css'
import { AuthProvider } from './context/AuthContext'
<<<<<<< HEAD

=======
>>>>>>> a404b0409fce8ea0122ff6135315fa97f163eb38

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
