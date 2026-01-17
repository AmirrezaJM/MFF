import { useEffect, useRef } from "react";
import { createApp } from "vue";

export default function VueWrapper({ component, ...props }) {
  const ref = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (!ref.current || !component) return;

    // Create Vue app instance
    // If component is a module with default export, use that
    const vueComponent = component.default || component;

    appRef.current = createApp(vueComponent, props);
    appRef.current.mount(ref.current);

    return () => {
      if (appRef.current) {
        appRef.current.unmount();
        appRef.current = null;
      }
    };
  }, [component]);

  return <div ref={ref} />;
}
