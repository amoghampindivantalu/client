import React, { useEffect } from 'react'; // Import useEffect directly

const Contact = () => {
  // useEffect to load necessary fonts
  useEffect(() => { // Use useEffect directly
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
  }, []); // Empty dependency array

  const contactMethods = [
    { icon: 'sms', title: 'WhatsApp', info: '8428425969', link: 'https://wa.me/918428425969' },
    { icon: 'call', title: 'Phone', info: '8428425969 / 9949141215', link: 'tel:+918428425969' },
    { icon: 'mail', title: 'Email', info: 'amoghampindivantalu@gmail.com', link: 'mailto:amoghampindivantalu@gmail.com' },
    { icon: 'photo_camera', title: 'Instagram', info: '@amoghampindivantalu', link: 'https://www.instagram.com/amoghampindivantalu/' },
  ];

  // --- ⬇️ PASTE YOUR REAL GOOGLE MAPS URLs HERE ⬇️ ---
  const mapEmbedUrl = "PASTE_THE_EMBED_SRC_URL_HERE"; // Replace this placeholder (URL starts with https://www.google.com/maps/embed?...)
  const mapDirectionsUrl = "PASTE_THE_SHARE_LINK_URL_HERE"; // Replace this placeholder (URL starts with https://maps.app.goo.gl/... or similar)
  // --- ⬆️ PASTE YOUR REAL GOOGLE MAPS URLs HERE ⬆️ ---


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
                      {/* Render iframe only if a valid-looking URL is provided */}
                      {mapEmbedUrl && mapEmbedUrl.startsWith("https://www.google.com/maps/embed") ? (
                          <iframe
                              src={mapEmbedUrl}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="Amogham Pindi Vantalu Location"
                          ></iframe>
                      ) : (
                          <p style={{textAlign: 'center', color: '#6b7280', padding: '2rem'}}>Map loading error. Please provide a valid Google Maps embed URL.</p>
                      )}
                  </div>
                  <div className="address-section">
                      <p className="address-text" style={{ fontFamily: 'Lora, serif' }}>
                        Opposite Vishal Mart, Siddipet, Telangana 502103
                      </p>
                      {/* Render directions link only if a valid-looking URL is provided */}
                      {mapDirectionsUrl && mapDirectionsUrl.startsWith("https://") && (
                          <a
                          href={mapDirectionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cta-button primary directions-button"
                          >
                            <span className="material-symbols-outlined">directions</span>
                            Get Directions
                          </a>
                      )}
                  </div>
              </div>
          </section>
        </div>
      </div>
      {/* --- Styles --- */}
      <style>{`
        * { box-sizing: border-box; }
        .contact-page-container { background-color: #fdf8f0; min-height: 100vh; padding: 2rem 0; position: relative; overflow-x: hidden; }
        .container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 2; }
        .cta-button { padding: 0.8rem 2rem; border-radius: 50px; font-weight: 700; font-size: 1rem; transition: all 0.3s ease; text-decoration: none; font-family: 'Josefin Sans', sans-serif; border: 2px solid transparent; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .cta-button.primary { background-color: #D62828; color: white; }
        .cta-button:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .page-header { text-align: center; margin-bottom: 3rem; }
        .page-header h1 { font-size: 2.75rem; color: #185e20; margin-bottom: 0.5rem; }
        .page-header p { font-size: 1.125rem; color: #545454; max-width: 500px; margin: 0 auto; }
        .background-shapes div { position: absolute; border-radius: 50%; z-index: 1; filter: blur(50px); }
        .shape1 { width: 400px; height: 400px; background: rgba(255, 213, 79, 0.4); top: 5%; left: -200px; animation: drift 15s infinite alternate; }
        .shape2 { width: 300px; height: 300px; background: rgba(214, 40, 40, 0.3); bottom: 5%; right: -150px; animation: drift 20s infinite alternate; }
        @keyframes drift { from { transform: translateX(0) translateY(0); } to { transform: translateX(50px) translateY(50px); } }
        .contact-section { margin-bottom: 4rem; }
        .section-title { font-size: 1.75rem; color: #185e20; text-align: center; margin-bottom: 2.5rem; }
        .contact-methods-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        .contact-card { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); padding: 2.5rem 1.5rem; border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.25); text-decoration: none; color: #185e20; transition: transform 0.3s ease, box-shadow 0.3s ease; text-align: center; }
        .contact-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px -10px rgba(0,0,0,0.1); }
        .contact-icon { font-size: 2.5rem; color: #D62828; margin-bottom: 0.5rem; }
        .contact-card h3 { font-size: 1.2rem; font-weight: 700; margin: 0; }
        .contact-card p { font-size: 0.95rem; color: #545454; margin: 0; word-break: break-word; }
        .location-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.25); box-shadow: 0 10px 30px -15px rgba(0,0,0,0.1); padding: 1.5rem; }
        .map-container { width: 100%; height: 350px; border-radius: 0.75rem; overflow: hidden; margin-bottom: 1.5rem; border: 1px solid #eee; background-color: #eee; display: flex; align-items: center; justify-content: center; /* Center error message */ }
        .address-section { text-align: center; }
        .address-text { font-size: 1.1rem; color: #185e20; margin-bottom: 1.5rem; line-height: 1.6; }
        .directions-button { max-width: 200px; margin: 0 auto; }
        @media (min-width: 768px) { .contact-methods-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; } }
        @media (min-width: 1024px) { .contact-methods-grid { grid-template-columns: repeat(4, 1fr); } }
      `}</style>
    </>
  );
};

export default Contact;