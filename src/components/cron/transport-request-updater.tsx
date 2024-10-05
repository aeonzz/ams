"use client";

import React from "react";
import { setupTransportRequestUpdater } from "@/lib/actions/cron-jobs";

export function TransportRequestUpdater() {
  React.useEffect(() => {
    const setup = async () => {
      await setupTransportRequestUpdater();
    };
    setup();
  }, []);

  return null;
}
