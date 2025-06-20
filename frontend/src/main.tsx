import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'
// import { GoogleOAuthProvider } from '@react-oauth/google';

// createRoot(document.getElementById("root")!).render(
//   <GoogleOAuthProvider clientId="715736192011-07ol75qt1qse82hqtq8rhsije9qf8pjk.apps.googleusercontent.com">
//     <App />
//   </GoogleOAuthProvider>
// );
