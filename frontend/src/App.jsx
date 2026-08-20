import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Assistant from "./pages/Assistant";

function App() {
  const hostname = window.location.hostname;

  if (hostname === "app.qumly.me") {
    return <Assistant />;
  }

  if (hostname === "qumly.me" || hostname === "www.qumly.me") {
    return <Landing />;
  }

  // Local development
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Assistant />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;