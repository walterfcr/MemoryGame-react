import React, { useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from './Layout'; // Reuse the Layout for consistent title/back UI
import { gsap } from 'gsap';

export function Login() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.from(containerRef.current, {
      x: "100vw",
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    });
  }, []);

  return (
    <Layout title="Login" onBackClick={() => navigate("/")}>
      <div ref={containerRef} className="loginContent">
        {/* Your login content goes here */}
        <p>Login form goes here.</p>
      </div>
    </Layout>
  );
}

export default Login;
