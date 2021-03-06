import './home.scss';

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { Row, Col, Alert } from 'reactstrap';

import { MoonOutline } from 'react-ionicons';

export type IHomeProp = StateProps;

export const Home = (props: IHomeProp) => {
  const { account } = props;

  return (
    <>
      <section className="main">
        <video src="../../../content/images/video.mp4" autoPlay loop muted></video>
        {/* <img src="../../../content/images/mask.jpg" className="mask" /> */}
        <h2>Las Vegas</h2>
        {/* <p className="copyright">&copy;Derechos reservados - Grupo 1</p> */}
      </section>

      <ul className="navigation">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="login/login.html">Inciar sesión</a>
        </li>
        <li>
          <a href="#">Saber más</a>
        </li>
        <li>
          <a href="#">Visitar</a>
        </li>
        <li>
          <a href="#">Contacto</a>
        </li>
      </ul>

      <main className="container">
        <section id="main">
          <div className="parallax-one">
            <h2>SOUTHERN CALIFORNIA</h2>
          </div>
        </section>

        <section>
          <div className="block">
            <p>
              <span className="first-character sc">L</span>as Vegas es la principal ciudad del estado de Nevada, Estados Unidos. Construida
              en medio de un desierto, presenta temperaturas de más de 40 grados en verano y que apenas superan los cero grados en inverno.
              La ciudad, que se levanta en un marco de montañas coloridas, atrae a millones de visitantes cada año y, durante la temporada
              de verano, se estima que alberga la misma cantidad de turistas que de habitantes. Lo primero que viene a la mente cuando se
              piensa en Las Vegas son seguramente sus incontables casinos, sus atracciones y espectáculos nocturnos, sus marquesinas,
              restaurantes, centros comerciales y las muchas otras formas de diversión que ofrece: no en vano es conocida como la Capital
              del Entretenimiento Mundial.
            </p>
            <p className="line-break margin-top-10"></p>
            <p className="margin-top-10">
              Sin embargo, Las Vegas es todo eso y mucho más, ya que la ciudad tiene también muchos grandes destinos naturales en sus
              alrededores. Por ejemplo, Vegas es el trampolín ideal para conocer el Gran Cañón del Colorado y la impresionante presa Hoover,
              el espejo de agua artificial más grande de Estados Unidos. Una estadía en Las Vegas te permitirá disfrutar del mejor
              entretenimiento nocturno en una zona preparada para recibir al turismo con todo el confort: en Las Vegas Strip, una franja de
              más de 6 km de Las Vegas Boulevard South, se levantan algunos de los hoteles y resorts más lujosos del mundo. Pero además, a
              menos de dos horas de allí podrás también hacer emocionantes actividades al aire libre en el Parque Nacional del Gran Cañón.{' '}
            </p>
          </div>
        </section>

        <section>
          <div className="parallax-two">
            <h2>NEW YORK</h2>
          </div>
        </section>

        <section>
          <div className="block">
            <p>
              <span className="first-character ny">B</span>reaking into the New York fashion world is no easy task. But by the early 2000's,
              UGG Australia began to take it by storm. The evolution of UGG from a brand that made sheepskin boots, slippers, clogs and
              sandals for an active, outdoor lifestyle to a brand that was now being touted as a symbol of a stylish, casual and luxurious
              lifestyle was swift. Much of this was due to a brand repositioning effort that transformed UGG into a high-end luxury footwear
              maker. As a fashion brand, UGG advertisements now graced the pages of Vogue Magazine as well as other fashion books. In the
              mid 2000's, the desire for premium casual fashion was popping up all over the world and UGG was now perfectly aligned with
              this movement.
            </p>
            <p className="line-break margin-top-10"></p>
            <p className="margin-top-10">
              Fueled by celebrities from coast to coast wearing UGG boots and slippers on their downtime, an entirely new era of fashion was
              carved out. As a result, the desire and love for UGG increased as people wanted to go deeper into this relaxed UGG experience.
              UGG began offering numerous color and style variations on their sheepskin boots and slippers. Cold weather boots for women and
              men and leather casuals were added with great success. What started as a niche item, UGG sheepskin boots were now a must-have
              staple in everyone's wardrobe. More UGG collections followed, showcasing everything from knit boots to sneakers to wedges, all
              the while maintaining that luxurious feel UGG is known for all over the world. UGG products were now seen on runways and in
              fashion shoots from coast to coast. Before long, the love spread even further.
            </p>
          </div>
        </section>

        <section>
          <div className="parallax-three">
            <h2>ENCHANTED FOREST</h2>
          </div>
        </section>

        <section>
          <div className="block">
            <p>
              <span className="first-character atw">W</span>hen the New York fashion community notices your brand, the world soon follows.
              The widespread love for UGG extended to Europe in the mid-2000's along with the stylish casual movement and demand for premium
              casual fashion. UGG boots and shoes were now seen walking the streets of London, Paris and Amsterdam with regularity. To meet
              the rising demand from new fans, UGG opened flagship stores in the UK and an additional location in Moscow. As the love spread
              farther East, concept stores were opened in Beijing, Shanghai and Tokyo. UGG Australia is now an international brand that is
              loved by all. This love is a result of a magical combination of the amazing functional benefits of sheepskin and the
              heightened emotional feeling you get when you slip them on your feet. In short, you just feel better all over when you wear
              UGG boots, slippers, and shoes.
            </p>
            <p className="line-break margin-top-10"></p>
            <p className="margin-top-10">
              In 2011, UGG will go back to its roots and focus on bringing the active men that brought the brand to life back with new
              styles allowing them to love the brand again as well. Partnering with Super Bowl champion and NFL MVP Tom Brady, UGG will
              invite even more men to feel the love the rest of the world knows so well. UGG will also step into the world of high fashion
              with UGG Collection. The UGG Collection fuses the timeless craft of Italian shoemaking with the reliable magic of sheepskin,
              bringing the luxurious feel of UGG to high end fashion. As the love for UGG continues to spread across the world, we have
              continued to offer new and unexpected ways to experience the brand. The UGG journey continues on and the love for UGG
              continues to spread.
            </p>
          </div>
        </section>
      </main>
      <div id="map"></div>
      <div id="pano"></div>
    </>
  );
};

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(Home);
