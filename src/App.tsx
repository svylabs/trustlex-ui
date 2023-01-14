import { MantineProvider } from "@mantine/core";
import Layout from "./components/Layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Earn from "~/pages/Earn/Earn";

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<h1>Home</h1>} />
            <Route path="/exchange" element={<h1>Exchange</h1>} />
            <Route path="/history" element={<h1>History</h1>} />
            <Route path="/earn" element={<Earn />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </MantineProvider>
  );
}
