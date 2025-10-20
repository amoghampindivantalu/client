import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <p className="copyright-text">
          © 2025 Venela’s Amoghapindivantalu | All Rights Reserved
        </p>
        <p className="developer-credit">
          Developed by{' '}
          <a href="https://www.instagram.com/dozzi.in/" target="_blank" rel="noopener noreferrer">
            Dozzi.in
          </a>
        </p>
      </div>
      <style>{`
        * {
          box-sizing: border-box;
        }
        .site-footer {
          background-color: #ffffff; /* White background */
          padding: 1.5rem;
          border-top: 1px solid #e5e7eb; /* Light grey top border */
          overflow-x: hidden;
        }
        .container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 0.5rem;
        }
        .copyright-text, .developer-credit {
          font-family: 'Lora', serif;
          font-size: 0.875rem;
          color: #545454; /* Dark grey text */
          margin: 0;
        }
        .developer-credit a {
          color: #185e20; /* Brand green color */
          font-weight: 700;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .developer-credit a:hover {
          color: #D62828; /* Brand red color on hover */
        }

        /* --- Media Queries for Responsiveness --- */
        @media (min-width: 768px) {
          .footer-content {
            flex-direction: row;
            justify-content: space-between;
          }
          .copyright-text {
            order: 1; /* Puts copyright on the left */
          }
          .developer-credit {
            order: 2; /* Puts developer credit on the right */
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;