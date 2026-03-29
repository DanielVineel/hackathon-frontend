import React from "react";
import "../styles/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <div className="policy-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: March 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to our Hackathon Platform ("we," "us," "our," or "Company"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
          <ul>
            <li><strong>Personal Data:</strong> Name, email address, phone number, profile picture, location</li>
            <li><strong>Account Information:</strong> Username, password, role (student/manager/superadmin)</li>
            <li><strong>Submission Data:</strong> Code submissions, problem attempts, event participation records</li>
            <li><strong>Payment Information:</strong> Transaction details (processed securely by PayU)</li>
            <li><strong>Device Information:</strong> Browser type, IP address, operating system, pages visited</li>
            <li><strong>Activity Data:</strong> Login timestamps, event participation, submissions, certificates earned</li>
          </ul>
        </section>

        <section>
          <h2>3. Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
          <ul>
            <li>Email you regarding your account or subscription</li>
            <li>Execute and fulfill any transactions with you</li>
            <li>Generate a personal profile page for you</li>
            <li>Increase the efficiency and operation of the Site</li>
            <li>Monitor and analyze usage and trends to improve your experience</li>
            <li>Notify you of updates to the Site</li>
            <li>Offer you new products, services, and/or recommendations</li>
          </ul>
        </section>

        <section>
          <h2>4. Disclosure of Your Information</h2>
          <p>We may share information we have collected about you in certain situations:</p>
          <ul>
            <li><strong>By Law or to Protect Rights:</strong> If required by law or legal process</li>
            <li><strong>Third-Party Service Providers:</strong> PayU (payments), Judge0 (code execution), and other vendors</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or bankruptcy</li>
          </ul>
        </section>

        <section>
          <h2>5. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to protect your personal information. However, perfect security does not exist on the Internet.
          </p>
        </section>

        <section>
          <h2>6. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us at gdanielvineeloffice@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
