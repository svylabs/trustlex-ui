import { MantineProvider } from "@mantine/core";
import Layout from "./components/Layout/Layout";
export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Layout />
    </MantineProvider>
  );
}
