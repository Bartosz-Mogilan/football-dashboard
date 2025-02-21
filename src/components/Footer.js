import React from "react";
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Football Analytics Dashboard. All rights reserved.</p>
        </footer>
    );
}

export default Footer;