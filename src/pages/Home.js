import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  React.useEffect(() => {
    const fontLinks = [
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
      "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Domine:wght@400;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
    ];
    fontLinks.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });
  }, []);

  return (
    <div className="home-container">
      {/* --- Section 1: Refined Hero Layout --- */}
      <section className="hero-section">
        <div className="container hero-flex">
          {/* Left Side: Text Content */}
          <div className="hero-text">
            <h1 className="hero-title" style={{ fontFamily: 'Domine, serif' }}>
              Authentic Delicacies
            </h1>
            <p className="hero-description" style={{ fontFamily: 'Lora, serif' }}>
              Experience the rich tradition and taste through our handcrafted sweets and snacks.
              Explore our variety or become a part of our growing franchise network.
            </p>
            <div className="hero-cta-group">
              <Link to="/franchise" className="cta-button primary">
                Franchise Inquiry
              </Link>
              <Link to="/products" className="cta-button secondary">
                View Our Products
              </Link>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="hero-image-container">
            <img
              src="https://res.cloudinary.com/duhabjmtf/image/upload/v1760451732/Amogam_Final_dvi3sw.jpg"
              alt="Authentic Telangana Delicacies"
            />
          </div>
        </div>
      </section>

      {/* --- Section 2: Our Promise --- */}
      <section className="section-padding promise-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" style={{ fontFamily: 'Domine, serif', color: 'white' }}>
              Our Promise of Quality
            </h2>
          </div>
          <div className="promise-grid">
            {[
              { icon: 'workspace_premium', title: 'Premium Quality', description: 'Using only the finest, locally-sourced ingredients.' },
              { icon: 'temple_hindu', title: 'Traditional Recipes', description: 'Preserving authentic flavors with generational family recipes.' },
              { icon: 'schedule', title: 'Freshly Made Daily', description: 'Handcrafting our products every day for perfect taste.' }
            ].map((feature) => (
              <div key={feature.title} className="promise-item">
                <span className="material-symbols-outlined promise-icon">{feature.icon}</span>
                <h3 className="promise-title" style={{ fontFamily: 'Domine, serif' }}>{feature.title}</h3>
                <p className="promise-description" style={{ fontFamily: 'Lora, serif' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        * { box-sizing: border-box; }
        .home-container {
          background-color: #fdf8f0;
          overflow-x: hidden;
        }
        .container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .section-padding { padding: 5rem 0; }
        .section-header { text-align: center; margin-bottom: 4rem; }
        .section-title { font-size: 2.25rem; font-weight: 700; }

        /* --- Hero Section --- */
        .hero-section {
          padding: 4rem 0;
        }
        .hero-flex {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
        }
        .hero-text {
          text-align: center;
          flex: 1;
        }
        .hero-title {
          font-size: 2.5rem;
          color: #185e20;
          margin-bottom: 1.5rem;
          line-height: 1.3;
        }
        .hero-description {
          font-size: 1.125rem;
          line-height: 1.7;
          margin-bottom: 2rem;
          color: #545454;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-cta-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .cta-button {
          padding: 0.8rem 2rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s ease;
          text-decoration: none;
          font-family: 'Josefin Sans', sans-serif;
          border: 2px solid transparent;
        }
        .cta-button.primary { background-color: #D62828; color: white; }
        .cta-button.secondary { border-color: #185e20; color: #185e20; background-color: transparent; }
        .cta-button:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

        .hero-image-container {
          flex: 1;
          max-width: 450px;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2);
        }
        .hero-image-container img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* --- Promise Section --- */
        .promise-section { background-color: #185e20; }
        .promise-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          color: white;
        }
        .promise-item { text-align: center; }
        .promise-icon {
          font-size: 3rem;
          color: #FFD54F;
          margin-bottom: 1rem;
        }
        .promise-title {
          font-size: 1.5rem;
          color: white;
          margin-bottom: 0.5rem;
        }
        .promise-description {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.8);
          max-width: 300px;
          margin: 0 auto;
        }

        /* --- Responsive Layout --- */
        @media (min-width: 768px) {
          .hero-flex {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            text-align: left;
          }
          .hero-text {
            flex: 1;
            text-align: left;
          }
          .hero-description {
            margin-left: 0;
          }
          .section-title { font-size: 2.75rem; }
          .hero-title { font-size: 3rem; }
          .promise-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default Home;
