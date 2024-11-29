import React from "react";
import { IonIcon } from "@ionic/react";
import {
  logoFacebook,
  logoTwitter,
  logoPinterest,
  logoLinkedin,
} from "ionicons/icons";


const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-brand-wrapper">
            <ul className="quicklink-list">
              <a href="/" className="quicklink-link">
                Faq
              </a>

              <a href="/" className="quicklink-link">
                Help center
              </a>

              <a href="/" className="quicklink-link">
                Terms of use
              </a>

              <a href="/" className="quicklink-link">
                Privacy
              </a>
            </ul>
          </div>

          <div className="divider"></div>

          <div className="quicklink-wrapper">
            <ul className="social-list">
              <a href="/" className="social-link">
                <IonIcon icon={logoFacebook} />
              </a>

              <a href="/" className="social-link">
                <IonIcon icon={logoTwitter} />
              </a>

              <a href="/" className="social-link">
                <IonIcon icon={logoPinterest} />
              </a>

              <a href="/" className="social-link">
                <IonIcon icon={logoLinkedin} />
              </a>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">
            &copy; 2024 <a href="/">T&T</a>. All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
