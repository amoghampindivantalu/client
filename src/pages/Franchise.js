import React from 'react';

const Franchise = () => {
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

  return (
    <div className="franchise-container">
      {/* --- Section 1: High-Impact Hero --- */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-text-panel">
            <h1 className="hero-title" style={{ fontFamily: 'Domine, serif' }}>Partner with Amogham: Share the Taste of Tradition</h1>
            <p className="hero-subtitle" style={{ fontFamily: 'Lora, serif' }}>
              Launch your entrepreneurial journey with a trusted brand. Our franchise model offers an authentic Telangana culinary experience with a low initial investment and comprehensive support.
            </p>
          </div>
          <div className="hero-image-panel">
            <img src="https://res.cloudinary.com/duhabjmtf/image/upload/v1760966898/amogham_shop_nf6wt1.jpg" alt="Authentic Telangana Sweets Kova Gari" className="hero-main-image" />
            <div className="investment-tag">
                <span className="investment-value" style={{ fontFamily: 'Domine, serif' }}>₹5 Lakhs*</span> {/* Added asterisk */}
                <span className="investment-label" style={{ fontFamily: 'Josefin Sans, sans-serif' }}>Starting Investment</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Why Choose an Amogham Franchise? --- */}
      <section className="section-padding advantage-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" style={{ fontFamily: 'Domine, serif' }}>Why Partner with Amogham?</h2>
          </div>
          <div className="advantage-grid">
            {/* UPDATED Advantage Points */}
            <div className="advantage-card">
              <span className="material-symbols-outlined advantage-icon">verified</span>
              <h3 className="advantage-title" style={{ fontFamily: 'Domine, serif' }}>Proven Brand Recognition</h3>
              <p className="advantage-description" style={{ fontFamily: 'Lora, serif' }}>Tap into a loyal customer base with a brand celebrated for authentic Telangana flavors and unwavering commitment to quality.</p>
            </div>
            <div className="advantage-card">
              <span className="material-symbols-outlined advantage-icon">trending_up</span>
              <h3 className="advantage-title" style={{ fontFamily: 'Domine, serif' }}>Efficient & Profitable Model</h3>
              <p className="advantage-description" style={{ fontFamily: 'Lora, serif' }}>Benefit from a streamlined business model designed for rapid setup and strong ROI potential, starting from an accessible investment point.</p>
            </div>
             <div className="advantage-card">
              <span className="material-symbols-outlined advantage-icon">groups</span>
              <h3 className="advantage-title" style={{ fontFamily: 'Domine, serif' }}>End-to-End Partner Support</h3>
              <p className="advantage-description" style={{ fontFamily: 'Lora, serif' }}>Receive comprehensive guidance including location insights, operational training, marketing launch kits, and ongoing expert assistance.</p>
            </div>
             <div className="advantage-card">
              <span className="material-symbols-outlined advantage-icon">local_dining</span>
              <h3 className="advantage-title" style={{ fontFamily: 'Domine, serif' }}>Authentic & Quality Products</h3>
              <p className="advantage-description" style={{ fontFamily: 'Lora, serif' }}>Offer premium, traditionally prepared delicacies using high-quality ingredients and time-honored recipes, ensuring customer satisfaction and repeat business.</p>
            </div>
          </div>
           <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>*Starting investment covers franchise fee, essential equipment, initial branding, and training. Store setup/rental costs may vary based on location.</p>
        </div>
      </section>

      {/* --- NEW Section 3: Comprehensive Franchise Package --- */}
      <section className="section-padding package-section">
          <div className="container">
              <div className="section-header">
                  <h2 className="section-title" style={{ fontFamily: 'Domine, serif' }}>What We Provide</h2>
                  <p className="section-subtitle" style={{fontFamily: 'Lora, serif'}}>Equipping you for success from day one.</p>
              </div>
              <div className="package-grid">
                  <div className="package-item">
                      <span className="material-symbols-outlined package-icon">location_on</span>
                      <h3 className="package-title" style={{ fontFamily: 'Domine, serif' }}>Location Assistance</h3>
                      <p className="package-description" style={{ fontFamily: 'Lora, serif' }}>Guidance on site selection and analysis, recommending optimal store dimensions (approx. 12ft x 20ft preferred).</p>
                  </div>
                   <div className="package-item">
                      <span className="material-symbols-outlined package-icon">design_services</span>
                      <h3 className="package-title" style={{ fontFamily: 'Domine, serif' }}>Store Setup & Branding</h3>
                      <p className="package-description" style={{ fontFamily: 'Lora, serif' }}>Detailed store layout guidelines, themed interior design elements (including cupboards/cabinetry), and high-impact brand billboard specifications.</p>
                  </div>
                  <div className="package-item">
                      <span className="material-symbols-outlined package-icon">build</span>
                      <h3 className="package-title" style={{ fontFamily: 'Domine, serif' }}>Essential Equipment</h3>
                      <p className="package-description" style={{ fontFamily: 'Lora, serif' }}>Provision of critical equipment including a calibrated digital weighing machine and a reliable heat sealing machine.</p>
                  </div>
                   <div className="package-item">
                      <span className="material-symbols-outlined package-icon">inventory</span>
                      <h3 className="package-title" style={{ fontFamily: 'Domine, serif' }}>Initial Supplies</h3>
                      <p className="package-description" style={{ fontFamily: 'Lora, serif' }}>Supply of starter inventory and professionally designed, branded packaging materials (covers, bags, etc.).</p>
                  </div>
                   <div className="package-item">
                      <span className="material-symbols-outlined package-icon">school</span>
                      <h3 className="package-title" style={{ fontFamily: 'Domine, serif' }}>Comprehensive Training</h3>
                      <p className="package-description" style={{ fontFamily: 'Lora, serif' }}>In-depth training on product knowledge, operations, customer service, and quality standards.</p>
                  </div>
                   <div className="package-item">
                      <span className="material-symbols-outlined package-icon">campaign</span>
                      <h3 className="package-title" style={{ fontFamily: 'Domine, serif' }}>Marketing & Launch Support</h3>
                      <p className="package-description" style={{ fontFamily: 'Lora, serif' }}>Guidance and materials for your grand opening and ongoing local marketing efforts.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- Section 4: A Glimpse Into Our World (Gallery) --- */}
      <section className="section-padding gallery-section">
        {/* ... (Gallery content remains the same) ... */}
         <div className="container">
            <div className="section-header">
                <h2 className="section-title" style={{ fontFamily: 'Domine, serif' }}>A Glimpse Into Our World</h2>
            </div>
            <div className="gallery-grid">
                <img src="https://res.cloudinary.com/duhabjmtf/image/upload/v1760451732/Amogam_Final_dvi3sw.jpg" alt="Amogham Pindi Vantalu shop interior" className="gallery-image" />
                <img src="https://res.cloudinary.com/duhabjmtf/image/upload/v1760509724/sarvapindi_iamuni.webp" alt="Making of Sarva Pindi" className="gallery-image" />
                <img src="https://res.cloudinary.com/duhabjmtf/image/upload/v1760475820/saki_mhymtm.webp" alt="Freshly made Sakinalu" className="gallery-image" />
                <img src="https://res.cloudinary.com/duhabjmtf/image/upload/v1760473826/laddu_swubzs.webp" alt="Handcrafted Laddus" className="gallery-image" />
            </div>
        </div>
      </section>

      {/* --- Section 5: Your Path to Ownership --- */}
      <section className="section-padding path-section">
        {/* ... (Path content remains the same) ... */}
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" style={{ fontFamily: 'Domine, serif' }}>Your Path to Ownership</h2>
          </div>
          <div className="path-timeline">
            <div className="path-step">
                <div className="path-icon">1</div>
                <h3 className="path-title" style={{fontFamily: 'Domine, serif'}}>Inquire</h3>
                <p className="path-description" style={{fontFamily: 'Lora, serif'}}>Reach out to express your interest and receive our franchise proposal.</p>
            </div>
            <div className="path-line"></div>
            <div className="path-step">
                <div className="path-icon">2</div>
                <h3 className="path-title" style={{fontFamily: 'Domine, serif'}}>Discuss</h3>
                <p className="path-description" style={{fontFamily: 'Lora, serif'}}>Our team schedules a detailed discussion to review the opportunity and answer questions.</p>
            </div>
             <div className="path-line"></div>
            <div className="path-step">
                <div className="path-icon">3</div>
                <h3 className="path-title" style={{fontFamily: 'Domine, serif'}}>Agreement</h3>
                <p className="path-description" style={{fontFamily: 'Lora, serif'}}>Once aligned, we finalize the location and sign the franchise agreement.</p>
            </div>
             <div className="path-line"></div>
            <div className="path-step">
                <div className="path-icon">4</div>
                <h3 className="path-title" style={{fontFamily: 'Domine, serif'}}>Launch</h3>
                <p className="path-description" style={{fontFamily: 'Lora, serif'}}>We assist with store setup, training, and a grand launch for your new business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 6: Start Your Inquiry --- */}
      <section className="section-padding inquiry-section">
          {/* ... (Inquiry content remains the same) ... */}
          <div className="container inquiry-content">
              <h2 className="section-title" style={{fontFamily: 'Domine, serif', color: 'white'}}>Begin Your Journey Today</h2>
              <p className="inquiry-subtitle" style={{fontFamily: 'Lora, serif'}}>Contact us to receive our detailed proposal and take the first step towards owning your Amogham franchise.</p>
              <div className="inquiry-methods">
                  <a href="https://wa.me/918428425969" target="_blank" rel="noopener noreferrer" className="inquiry-button">
                      <span className="material-symbols-outlined">sms</span>
                      WhatsApp: 8428425969
                  </a>
                  <a href="tel:+918428425969" className="inquiry-button">
                      <span className="material-symbols-outlined">call</span>
                      Call Us: 8428425969 / 9949141215 {/* Added second number */}
                  </a>
                  <a href="mailto:amoghampindivantalu@gmail.com" className="inquiry-button">
                      <span className="material-symbols-outlined">email</span>
                      Email for Proposal
                  </a>
              </div>
          </div>
      </section>

      <style>{`
        /* --- Universal Fix & Base Styles --- */
        * { box-sizing: border-box; }
        .franchise-container { background-color: #fdf8f0; overflow-x: hidden; }
        .container { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
        .section-padding { padding: 5rem 0; }
        .section-header { text-align: center; margin-bottom: 4rem; }
        .section-title { font-size: 2.25rem; color: #185e20; font-weight: 700; margin-bottom: 0.5rem; }
        .section-subtitle { font-size: 1.1rem; color: #545454; max-width: 600px; margin: 0 auto; line-height: 1.6; } /* Added subtitle style */

        /* --- Hero Section --- */
        .hero-section { background-color: #FFD54F; padding: 4rem 0; }
        .hero-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; align-items: center; }
        .hero-text-panel { text-align: center; }
        .hero-title { font-size: 2.75rem; color: #185e20; margin-bottom: 1rem; font-weight: 700; line-height: 1.2; }
        .hero-subtitle { font-size: 1.125rem; color: #545454; max-width: 500px; margin: 0 auto; line-height: 1.7; }
        .hero-image-panel { position: relative; border-radius: 1rem; overflow: hidden; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.2); margin: 2rem auto 0 auto; max-width: 500px; }
        .hero-main-image { width: 100%; height: auto; display: block; }
        .investment-tag { position: absolute; bottom: 1.5rem; left: 1.5rem; background: rgba(24, 94, 32, 0.85); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px); color: white; padding: 1rem; border-radius: 0.5rem; border: 1px solid rgba(255, 255, 255, 0.2); }
        .investment-value { font-size: 2.25rem; font-weight: 700; color: #FFD54F; display: block; line-height: 1; }
        .investment-label { font-size: 0.8rem; color: rgba(255,255,255,0.8); margin-top: 0.25rem; display: block; text-transform: uppercase; letter-spacing: 1px; }

        /* --- Advantage Section --- */
        .advantage-section { background-color: #fdf8f0; }
        /* UPDATED: Use 2 columns on tablet, 4 on desktop */
        .advantage-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        .advantage-card { background-color: white; padding: 2.5rem 2rem; border-radius: 0.75rem; text-align: center; box-shadow: 0 10px 30px -15px rgba(0,0,0,0.08); transition: transform 0.3s ease, box-shadow 0.3s ease; border: 1px solid #eee; }
        .advantage-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px -10px rgba(24, 94, 32, 0.15); }
        .advantage-icon { font-size: 40px; color: #D62828; margin-bottom: 1.5rem; display: inline-block; }
        .advantage-title { font-size: 1.3rem; color: #185e20; margin-bottom: 0.75rem; }
        .advantage-description { font-size: 0.95rem; line-height: 1.7; color: #545454; }

        /* --- NEW: Franchise Package Section --- */
        .package-section { background-color: #fff; } /* White background for contrast */
        .package-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        .package-item { background-color: #fdf8f0; padding: 2rem; border-radius: 0.75rem; text-align: center; border: 1px solid #eee; transition: background-color 0.3s ease; }
        .package-item:hover { background-color: #f7f1e6; }
        .package-icon { font-size: 36px; color: #185e20; margin-bottom: 1.5rem; display: inline-block; }
        .package-title { font-size: 1.2rem; color: #D62828; margin-bottom: 0.75rem; }
        .package-description { font-size: 0.9rem; line-height: 1.6; color: #545454; }

        /* --- Image Gallery Section --- */
        .gallery-section { background-color: #FFD54F; }
        .gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .gallery-image { width: 100%; height: 200px; /* Fixed height for consistency */ object-fit: cover; border-radius: 0.75rem; box-shadow: 0 10px 20px -10px rgba(0,0,0,0.2); transition: transform 0.3s ease; }
        .gallery-image:hover { transform: scale(1.05); }

        /* --- Path to Ownership Section --- */
        .path-section { background-color: #fdf8f0; }
        .path-timeline { display: grid; grid-template-columns: 1fr; gap: 2rem; position: relative; } /* Added relative positioning */
        .path-step { text-align: center; position: relative; z-index: 1; background-color: #fdf8f0; padding: 0 0.5rem; } /* Added background and padding */
        .path-icon { width: 44px; height: 44px; background-color: #D62828; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; font-size: 1.25rem; font-weight: 700; font-family: 'Josefin Sans', sans-serif; border: 3px solid white; box-shadow: 0 0 0 2px #D62828; }
        .path-line { display: block; position: absolute; /* Changed to absolute */ left: 50%; top: 22px; /* Position line vertically centered with icon */ transform: translateX(-50%); height: calc(100% - 44px); width: 2px; background-color: rgba(214, 40, 40, 0.2); z-index: 0; }
        /* Hide line after the last step on mobile */
        .path-step:last-child ~ .path-line { display: none; }
        .path-title { font-size: 1.25rem; color: #185e20; margin-bottom: 0.5rem; }
        .path-description { font-size: 0.9rem; line-height: 1.6; color: #545454; max-width: 250px; margin: 0 auto; }

        /* --- Inquiry Section --- */
        .inquiry-section { background-color: #185e20; text-align: center; }
        .inquiry-subtitle { color: rgba(255,255,255,0.85); max-width: 600px; margin: 0 auto 3rem auto; font-size: 1.125rem; line-height: 1.7; }
        .inquiry-methods { display: grid; grid-template-columns: 1fr; gap: 1rem; max-width: 800px; margin: 0 auto; }
        .inquiry-button { background-color: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; text-decoration: none; padding: 1.25rem 1rem; border-radius: 0.5rem; font-size: 1.125rem; font-family: 'Josefin Sans', sans-serif; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: background-color 0.3s ease, color 0.3s ease; }
        .inquiry-button:hover { background-color: #FFD54F; color: #185e20; }

        /* --- Media Queries for Responsiveness --- */
        @media (min-width: 640px) { /* Small tablets */
           .package-grid { grid-template-columns: repeat(2, 1fr); }
           .advantage-grid { grid-template-columns: repeat(2, 1fr); }
           .inquiry-methods { grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        }

        @media (min-width: 768px) { /* Tablets and larger */
          .section-title { font-size: 2.5rem; }
          .hero-section { padding: 6rem 1.5rem; }
          .hero-grid { grid-template-columns: 1fr 1fr; gap: 4rem; }
          .hero-text-panel { text-align: left; }
          .hero-title { font-size: 3.25rem; }
          .hero-subtitle { margin-left: 0; }
          .hero-image-panel { max-width: 100%; margin: 0; }
          .hero-main-image { max-height: 450px; width: auto; margin: 0 auto; }
          .advantage-grid { grid-template-columns: repeat(4, 1fr); } /* 4 columns for advantage */
          .package-grid { grid-template-columns: repeat(3, 1fr); } /* 3 columns for package */
          .gallery-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
          .gallery-image { height: 250px; }
          .path-timeline {
              display: flex; /* Switch to flexbox */
              justify-content: space-between;
              align-items: flex-start; /* Align steps to top */
              position: relative; /* For the connecting line */
              padding-top: 22px; /* Space for the icon half above line */
          }
          .path-step { flex: 1; padding: 0 1rem; max-width: 250px;} /* Allow flex to distribute space */
          .path-line { /* Repurpose as the horizontal connector */
              position: absolute;
              top: 22px; /* Align vertically with icon centers */
              left: calc(12.5% + 22px); /* Start after first icon's half */
              right: calc(12.5% + 22px); /* End before last icon's half */
              height: 2px;
              background-color: rgba(214, 40, 40, 0.2);
              z-index: 0;
              width: auto; /* Remove fixed width */
              transform: none; /* Remove transform */
              margin: 0;
          }
           /* Hide pseudo-elements used for vertical lines */
           .path-step::before, .path-step::after { display: none; }
        }
         @media (min-width: 1024px) { /* Larger desktops */
            .package-grid { gap: 2.5rem; }
            .advantage-grid { gap: 2.5rem; }
        }
      `}</style>
    </div>
  );
};

export default Franchise;