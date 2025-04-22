import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from './Layout';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const clickSound = useRef(new Audio("/sounds/click.mp3"));

  const [name, setName] = useState('');

  useEffect(() => {
    gsap.from(containerRef.current, {
      x: "100vw",
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    });
  }, []);

  const handleBack = () => {
    clickSound.current.currentTime = 0;
    clickSound.current.play();
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("playerName", name.trim());
      clickSound.current.currentTime = 0;
      clickSound.current.play();
      navigate("/"); // go back or to the game
    }
  };

  return (
    <Layout title={t("login")} onBackClick={handleBack}>
      <div ref={containerRef} className="loginContent">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">{t("enterYourName")}:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("yourName")}
            required
          />
          <button type="submit">{t("start")}</button>
        </form>
      </div>
    </Layout>
  );
}

export default Login;

