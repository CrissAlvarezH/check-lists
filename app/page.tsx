"use client"
import { QueryClient, QueryClientProvider } from "react-query";
import { Export } from "./components/export/export";

export default function Home() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Export />
    </QueryClientProvider>
  );
}
