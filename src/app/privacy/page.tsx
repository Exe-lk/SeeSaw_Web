import Link from "next/link";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 px-4 py-12 sm:px-8 lg:px-24">
      <section className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Privacy Policy
        </h1>

        <p className="mb-4">
          This Privacy Policy outlines how we collect, use, and protect your information when you use our website.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <p className="mb-4">
          We may collect personal information such as your name, email address, and usage data when you interact with our services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
        <p className="mb-4">
          Your information helps us improve our services, provide customer support, and keep you informed with updates.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Protection</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your data from unauthorized access or disclosure.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Third-Party Services</h2>
        <p className="mb-4">
          We may share your data with trusted third parties who assist in operating our website, under confidentiality agreements.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
        <p className="mb-4">
          You have the right to access, update, or delete your personal data. Contact us to exercise these rights.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this policy occasionally. We encourage users to review it regularly.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Account Deletion</h2>
        <p className="mb-4">
          You can delete your account directly from our mobile app. Please see the{" "}
          <Link href="/account-deletion" className="text-blue-600 underline hover:text-blue-800">
            Account Deletion page
          </Link>{" "}
          for detailed instructions.
        </p>

        <p className="text-sm text-gray-500 mt-8">
          Last updated: May 9, 2025
        </p>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
