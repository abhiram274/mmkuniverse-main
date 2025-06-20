import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);


// import React from 'react'; 
// import { createRoot } from 'react-dom/client';
// import App from './App.tsx';
// import './index.css';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// const CLIENT_ID = '715736192011-07ol75qt1qse82hqtq8rhsije9qf8pjk.apps.googleusercontent.com';

// createRoot(document.getElementById('root')!).render( 
//      <React.StrictMode>
//   <GoogleOAuthProvider clientId={CLIENT_ID}>
//     <App />
//   </GoogleOAuthProvider>
//   </React.StrictMode>
// );
