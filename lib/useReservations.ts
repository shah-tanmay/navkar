import { useEffect, useRef, useState } from "react";
import { heartbeat, release } from "../services/inventoryService";

interface UseCheckoutReservationProps {
  orderToken: string | null;
  isCheckoutComplete: boolean;
  heartbeatIntervalMs?: number;
  abandonTimeoutMs?: number;
}

export function useReservations({
  orderToken,
  isCheckoutComplete,
  heartbeatIntervalMs = 30_000,
  abandonTimeoutMs = 5 * 60_000,
}: UseCheckoutReservationProps) {
  const hbRef = useRef<NodeJS.Timeout | null>(null);
  const abandonRef = useRef<NodeJS.Timeout | null>(null);
  const [isActive, setIsActive] = useState(false);

  // heartbeat helper
  const sendHeartbeat = async () => {
    if (!orderToken) return;
    try {
      await heartbeat(orderToken);
    } catch (e) {
      console.error(e);
    }
  };

  // release helper
  const doRelease = async () => {
    if (!orderToken) return;
    clearAbandon();
    try {
      await release(orderToken);
    } catch (e) {
      console.error(e);
    }
  };

  // timers
  const clearHB = () => {
    if (hbRef.current) clearInterval(hbRef.current);
    hbRef.current = null;
    setIsActive(false);
  };
  const startHB = () => {
    clearHB();
    sendHeartbeat();
    hbRef.current = setInterval(sendHeartbeat, heartbeatIntervalMs);
    setIsActive(true);
  };

  const clearAbandon = () => {
    if (abandonRef.current) clearTimeout(abandonRef.current);
    abandonRef.current = null;
  };
  const scheduleAbandon = () => {
    clearAbandon();
    abandonRef.current = setTimeout(doRelease, abandonTimeoutMs);
  };

  // mount/unmount & orderToken/isCheckoutComplete
  useEffect(() => {
    if (orderToken && !isCheckoutComplete) {
      startHB();
    } else {
      clearHB();
      clearAbandon();
    }
    return () => {
      clearHB();
      clearAbandon();
    };
  }, [orderToken, isCheckoutComplete]);

  // visibilitychange + blur/focus
  useEffect(() => {
    const onHidden = () => {
      clearHB();
      scheduleAbandon();
    };
    const onVisible = () => {
      clearAbandon();
      if (orderToken && !isCheckoutComplete) startHB();
    };
    document.addEventListener("visibilitychange", () => {
      document.hidden ? onHidden() : onVisible();
    });
    window.addEventListener("blur", onHidden);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", () => {});
      window.removeEventListener("blur", onHidden);
      window.removeEventListener("focus", onVisible);
    };
  }, [orderToken, isCheckoutComplete]);

  // beforeunload & pagehide
  useEffect(() => {
    const onUnload = () => {
      if (orderToken && !isCheckoutComplete) {
        navigator.sendBeacon(`/api/reservations/${orderToken}/release`);
      }
    };
    window.addEventListener("beforeunload", onUnload);
    window.addEventListener("pagehide", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
      window.removeEventListener("pagehide", onUnload);
    };
  }, [orderToken, isCheckoutComplete]);

  return {
    isActive,
    sendHeartbeat,
    releaseReservations: doRelease,
    startHeartbeats: startHB,
    stopHeartbeats: clearHB,
  };
}
