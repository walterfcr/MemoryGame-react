import React from "react";
import './Layout.css'; // for consistent styling
import { useTranslation } from 'react-i18next';

const Layout = ({ children, title, onBackClick }) => {
  const { t } = useTranslation();
  return (
    <div className="layoutContainer">
      <div className="titleHeader">
        {/* Conditionally render the back button if onBackClick is provided */}
        {onBackClick && (
          <button className="backButton" onClick={onBackClick}>
           {t("back")}
          </button>
        )}
        {/* Render the title */}
        <h2>{title}</h2>
      </div>
      <div className="pageContent">
        {children}  {/* Render the children (in this case, the difficulty selection UI) */}
      </div>
    </div>
  );
};

export default Layout;
