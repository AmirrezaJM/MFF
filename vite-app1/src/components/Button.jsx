import React from "react";

const Button = () => {
    return (
        <button
            style={{
                padding: "12px 24px",
                fontSize: "16px",
                backgroundColor: "#646cff",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#535bf2")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#646cff")}
            onClick={() => alert("Button from Vite App 1! 🎉")}
        >
            Button from Vite App 2
        </button>
    );
};

export default Button;
