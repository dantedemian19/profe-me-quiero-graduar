import './footer.scss';

import React from 'react';

import { Col, Row } from 'reactstrap';

const Footer = props => (
  <div className="footer page-content">
    <footer className="footer">
      <div className="container-footer">
        <div className="row">
          <div className="footer-col">
            <div className="primera">
              <h4>LAS VEGAS</h4>
              <div className="descripcion">
                <a href="#">Conocé la ciudad del pecado, un viaje del que no te vas a arrepentir</a>
              </div>
            </div>
          </div>
          <div className="footer-col">
            <div className="columna1">
              <h4>Programadores</h4>
              <ul>
                <li>
                  <a href="#">Gimenéz Lucas Matias</a>
                </li>
                <li>
                  <a href="#">Alfonso Dante</a>
                </li>
                <li>
                  <a href="#">Lucas González</a>
                </li>
                <li>
                  <a href="#">Denis Luna</a>
                </li>
                <li>
                  <a href="#">Lucas De La Pina</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-col">
            <div className="columna2">
              <h4>Diseñadores</h4>
              <ul>
                <li>
                  <a href="#">Sanchéz Germán</a>
                </li>
                <li>
                  <a href="#">García Matias</a>
                </li>
                <li>
                  <a href="#">Victor Paredes</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-col">
            <div className="columna3">
              <h4>Líderes y Documentadores</h4>
              <ul>
                <li>
                  <a href="#">Santiago Betancort</a>
                </li>
                <li>
                  <a href="#">Thiago Montenegro</a>
                </li>
                <li>
                  <a href="#">Victor Paredes</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-col footer-redes">
            <div className="columna-redes">
              <h4>Contactos</h4>
              <div className="social-links">
                <ul>
                  <li>
                    <a href="https://www.facebook.com/ET-Nº-24-84991834162" className="facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="mailto:et24-defbsas@gmail.com" className="twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="ig">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="linkedin">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default Footer;
