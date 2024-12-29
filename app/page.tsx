"use client"

import { QueryClient, QueryClientProvider } from "react-query"
import LeftList from "@/app/left-list"
import { Export } from "./export";

const queryClient = new QueryClient()

export default function Home() {

  return (
    <QueryClientProvider client={queryClient}>
      <Export />
    </QueryClientProvider>
  );
}
