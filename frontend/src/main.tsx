// import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'

// createRoot(document.getElementById("root")!).render(<App />);


//715736192011-07ol75qt1qse82hqtq8rhsije9qf8pjk.apps.googleusercontent.com

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "715736192011-07ol75qt1qse82hqtq8rhsije9qf8pjk.apps.googleusercontent.com"; // Replace with actual client ID

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);