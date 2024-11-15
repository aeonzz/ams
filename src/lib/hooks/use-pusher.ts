import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { env } from "../env.mjs";

export const usePusher = (channelName: string, eventName: string) => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Pusher with environment variables
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    // Subscribe to the specified channel
    const channel = pusher.subscribe(channelName);

    // Bind to the specified event on the channel
    channel.bind(eventName, (data: { message: string }) => {
      setMessage(data.message);
    });

    // Cleanup function to unsubscribe from the channel when the component unmounts
    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [channelName, eventName]); // Re-run effect if channel or event name changes

  return message;
};
