import React from 'react';

const Contact = () => {
  // useEffect to load necessary fonts
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

  const contactMethods = [
    { icon: 'sms', title: 'WhatsApp', info: '8428425969', link: 'https://wa.me/918428425969' },
    { icon: 'call', title: 'Phone', info: '8428425969', link: 'tel:+918428425969' },
    { icon: 'mail', title: 'Email', info: 'amoghampindivantalu@gmail.com', link: 'amoghampindivantalu@gmail.com' },
    { icon: 'photo_camera', title: 'Instagram', info: '@amoghampindivantalu', link: 'https://www.instagram.com/amoghampindivantalu/' },
  ];

  return (
    <>
      <div className="contact-page-container">
        <div className="background-shapes">
            <div className="shape1"></div>
            <div className="shape2"></div>
        </div>
        <div className="container">
          {/* --- Section 1: Hero --- */}
          <section className="page-header">
            <h1 style={{ fontFamily: 'Domine, serif' }}>Get In Touch</h1>
            <p style={{ fontFamily: 'Lora, serif' }}>We're here to help and answer any question you might have.</p>
          </section>

          {/* --- Section 2: Direct Contact --- */}
          <section className="contact-section">
              <h2 className="section-title" style={{ fontFamily: 'Domine, serif' }}>Direct Contact</h2>
              <div className="contact-methods-grid">
                {contactMethods.map(method => (
                  <a href={method.link} key={method.title} target="_blank" rel="noopener noreferrer" className="contact-card">
                    <span className="material-symbols-outlined contact-icon">{method.icon}</span>
                    <h3 style={{ fontFamily: 'Josefin Sans, sans-serif' }}>{method.title}</h3>
                    <p>{method.info}</p>
                  </a>
                ))}
              </div>
          </section>

          {/* --- Section 3: Visit Us --- */}
          <section className="contact-section">
              <h2 className="section-title" style={{ fontFamily: 'Domine, serif' }}>Visit Us</h2>
              <div className="location-card">
                  <div className="map-container">
                      <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3790.871991443624!2d78.8519113148875!3d18.10118698761408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bccb8b3e5b53b7b%3A0x9a31a98299173d1c!2sVishal%20Mega%20Mart!5e0!3m2!1sen!2sin!4v1678886456789!5m2!1sen!2sin"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Our Location"
                      ></iframe>
                  </div>
                  <div className="address-section">
                      <p className="address-text" style={{ fontFamily: 'Lora, serif' }}>
                      Opposite to Vishal Mart, Siddipet, Telangana
                      </p>
                      <a 
                      href="https://maps.google.com/?q=Vishal+Mega+Mart,Siddipet" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="cta-button primary directions-button"
                      >
                      <span className="material-symbols-outlined">directions</span>
                      Get Directions
                      </a>
                  </div>
              </div>
          </section>
        </div>
      </div>
      <style>{`
        /* --- Universal Fix & Base Styles --- */
        * {
            box-sizing: border-box;
        }
        .contact-page-container { 
          background-color: #fdf8f0; 
          min-height: 100vh; 
          padding: 2rem 0; 
          position: relative;
          overflow-x: hidden;
        }
        .container { 
          width: 100%; 
          max-width: 1100px; 
          margin: 0 auto; 
          padding: 0 1.5rem; 
          position: relative; 
          z-index: 2; 
        }
        .cta-button { 
          padding: 0.8rem 2rem; border-radius: 50px; font-weight: 700; 
          font-size: 1rem; transition: all 0.3s ease; text-decoration: none; 
          font-family: 'Josefin Sans', sans-serif; border: 2px solid transparent; 
          cursor: pointer; display: flex; align-items: center; justify-content: center; 
          gap: 0.5rem; width: 100%; 
        }
        .cta-button.primary { background-color: #D62828; color: white; }
        .cta-button:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

        .page-header { text-align: center; margin-bottom: 3rem; }
        .page-header h1 { font-size: 2.75rem; color: #185e20; margin-bottom: 0.5rem; }
        .page-header p { font-size: 1.125rem; color: #545454; max-width: 500px; margin: 0 auto; }
        
        /* --- Background Shapes --- */
        .background-shapes div { position: absolute; border-radius: 50%; z-index: 1; filter: blur(50px); }
        .shape1 { width: 400px; height: 400px; background: rgba(255, 213, 79, 0.4); top: 5%; left: -200px; animation: drift 15s infinite alternate; }
        .shape2 { width: 300px; height: 300px; background: rgba(214, 40, 40, 0.3); bottom: 5%; right: -150px; animation: drift 20s infinite alternate; }
        @keyframes drift { from { transform: translateX(0) translateY(0); } to { transform: translateX(50px) translateY(50px); } }

        /* --- Section Styling --- */
        .contact-section { margin-bottom: 3rem; }
        .section-title { font-size: 1.75rem; color: #185e20; text-align: center; margin-bottom: 2rem; }
        
        /* --- Contact Methods --- */
        .contact-methods-grid { 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 1rem; 
        }
        .contact-card {
          display: flex; 
          flex-direction: column;
          align-items: center; 
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 2rem; 
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-decoration: none; 
          color: #185e20;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-align: center;
        }
        .contact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px -10px rgba(0,0,0,0.15);
        }
        .contact-icon { font-size: 2.5rem; color: #D62828; margin-bottom: 0.5rem; }
        .contact-card h3 { font-size: 1.25rem; font-weight: 700; margin: 0; }
        .contact-card p { font-size: 1rem; color: #545454; margin: 0; word-break: break-all; }

        /* --- Map & Location --- */
        .location-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px -15px rgba(0,0,0,0.1);
          padding: 1rem;
        }
        .map-container {
          width: 100%;
          height: 300px;
          border-radius: 0.5rem;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .address-section { text-align: center; }
        .address-text { font-size: 1.125rem; color: #185e20; margin-bottom: 1.5rem; }
        .directions-button { max-width: 250px; margin: 0 auto; }
        
        /* --- Media Queries --- */
        @media (min-width: 768px) {
          .contact-methods-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1024px) {
            .contact-methods-grid { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>
    </>
  );
};

export default Contact;