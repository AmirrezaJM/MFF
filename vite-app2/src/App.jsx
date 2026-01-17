import React, { Suspense, useEffect, useState } from "react";
import VueWrapper from "./components/VueWrapper";

// Dynamic import from remote vite-app1
const RemoteButton = React.lazy(() => import("vite_app1/Button"));

// Custom lazy loader for Vue component
// We can't use React.lazy directly for the Vue component itself, 
// but we can lazy load the module and pass it to our wrapper
const RemoteAccordion = () => {
    const [Component, setComponent] = useState(null);

    useEffect(() => {
        // Import from the new 'vue_remote' configured in vite.config.js
        import("vue_remote/Accordion").then((module) => {
            setComponent(module.default);
        });
    }, []);

    if (!Component) return <div>Loading remote Accordion...</div>;

    return (
        <VueWrapper
            component={Component}
            items={[
                { title: 'React Host', content: 'This is passed from React to Vue!' },
                { title: 'Vue Remote', content: 'Consuming components from port 5005.' },
                { title: 'CSS Injection', content: 'Styles are now bundled correctly.' }
            ]}
        />
    );
};

function App() {
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>🏠 Vite App 2</h1>
            <p>This app consumes components from React (App 1) and Vue (App 3).</p>

            <div style={{ marginTop: "20px" }}>
                <h3>Remote Button (React):</h3>
                <Suspense fallback={<div>Loading remote Button...</div>}>
                    <RemoteButton />
                </Suspense>

                <h3 style={{ marginTop: '20px' }}>Remote Accordion (Vue):</h3>
                <RemoteAccordion />
            </div>
        </div>
    );
}

export default App;
