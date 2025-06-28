"use client";

import { api } from "convex/_generated/api";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect } from "react";

export function ConvexSyncUser() {
  const { isAuthenticated } = useConvexAuth();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (isAuthenticated) {
      void storeUser();
    }
  }, [isAuthenticated, storeUser]);

  return null;
}
