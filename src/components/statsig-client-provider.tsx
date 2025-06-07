// app/my-statsig.tsx

"use client";

import React from "react";
import { StatsigProvider, useClientAsyncInit } from "@statsig/react-bindings";
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics";
import { StatsigSessionReplayPlugin } from "@statsig/session-replay";

export default function StatsigClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { client } = useClientAsyncInit(
    "client-OCNEiCn3GD8kvNm7UzKWpF7QcPca41ao61HhenGs7xE",
    { userID: "a-user" },
    {
      plugins: [
        new StatsigAutoCapturePlugin(),
        new StatsigSessionReplayPlugin(),
      ],
    },
  );

  return (
    <StatsigProvider client={client} loadingComponent={<div>Loading...</div>}>
      {children}
    </StatsigProvider>
  );
}
