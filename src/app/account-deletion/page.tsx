import React from "react";
import Image from "next/image";

const AccountDeletion = () => {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-8 lg:px-24 text-gray-800">
      <section className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Account Deletion
        </h1>

        <p className="mb-6 text-center">
          Follow the steps below to delete your account from the mobile app.
        </p>

        <ol className="space-y-8">
          <li>
            <h2 className="font-semibold text-lg mb-2">Step 1: Open the Mobile App</h2>
            <Image
              src="/images/step1.png"
              alt="Mobile App Home Screen"
              width={600}
              height={300}
              className="rounded-md border"
            />
          </li>

          <li>
            <h2 className="font-semibold text-lg mb-2">Step 2: Navigate to Settings</h2>
            <Image
              src="/images/step2.png"
              alt="Settings Menu"
              width={600}
              height={300}
              className="rounded-md border"
            />
          </li>

          <li>
            <h2 className="font-semibold text-lg mb-2">Step 3: Tap on 'Delete Account'</h2>
            <Image
              src="/images/step3.png"
              alt="Delete Account Option"
              width={600}
              height={300}
              className="rounded-md border"
            />
          </li>

          <li>
            <h2 className="font-semibold text-lg mb-2">Step 4: Confirm Deletion</h2>
            <Image
              src="/images/step4.png"
              alt="Confirm Deletion Dialog"
              width={600}
              height={300}
              className="rounded-md border"
            />
          </li>
        </ol>

        <p className="mt-8 text-sm text-gray-500 text-center">
          Once deleted, your account and all associated data will be permanently removed.
        </p>
      </section>
    </main>
  );
};

export default AccountDeletion;
