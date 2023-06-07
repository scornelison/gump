import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "./config/supabaseClients";

// pages
import Home from "./pages/Home";
import Create from "./pages/Create";
import Update from "./pages/Update";

//function App() {
// return (
//   <BrowserRouter>
//     <nav>
//       <h1>Notes</h1>
//       <Link to="/">Home</Link>
//       <Link to="/create">Create New Note</Link>
//     </nav>
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/create" element={<Create />} />
//       <Route path="/:id" element={<Update />} />
//     </Routes>
//   </BrowserRouter>
// );
//}

//Supabase
export default function App() {
  const [session, setSession] = useState(null);
  console.log({ session });
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        redirectTo={window.location.href}
        // redirectTo="http://example.com/"
        magicLink
      />
    );
  } else {
    return (
      <BrowserRouter basename="/gump">
        <nav>
          <h1>Notes</h1>
          <Link to="/">Home</Link>
          <Link to="/create">Create New Note</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create session={session} />} />
          <Route path="/:id" element={<Update />} />
        </Routes>
      </BrowserRouter>
    );
  }
}
