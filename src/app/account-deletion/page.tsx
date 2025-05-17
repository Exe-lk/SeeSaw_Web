import React from "react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Deletion | SeeSaw",
  description: "Learn how to delete your SeeSaw account and understand what data will be removed",
};

const AccountDeletion = () => {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-8 lg:px-24 text-gray-800">
      <section className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Account Deletion
        </h1>

        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-3">Important Notice About Account Deletion</h2>
          <p className="text-gray-700 mb-4">
            When you delete your account, all your data will be permanently erased from our servers. This action is irreversible and includes:
          </p>
          <ul className="list-disc ml-6 text-gray-700 space-y-2">
            <li><span className="font-medium">All Submitted Data:</span> Reports, feedback, and any other submissions</li>
            <li><span className="font-medium">Media Files:</span> All uploaded images and photographs</li>
            <li><span className="font-medium">Audio Content:</span> All voice recordings and audio submissions</li>
            <li><span className="font-medium">Personal Information:</span> Your profile data, settings, and preferences</li>
            <li><span className="font-medium">Activity History:</span> All historical data and interactions</li>
          </ul>
          <p className="mt-4 text-red-600 font-medium">
            ⚠️ This deletion process cannot be undone or reversed once completed.
          </p>
        </div>

        <p className="mb-6 text-center text-gray-700">
          Follow these steps in the mobile app to delete your account:
        </p>

        <ol className="space-y-8">
          <li>
            <h2 className="font-semibold text-lg mb-2">Step 1: Recent Submissions Screen</h2>
            <Image
              src="/images/recent-submissions.jpeg"
              alt="Recent Submissions Screen"
              width={390}
              height={844}
              className="rounded-md border mx-auto"
            />
          </li>

          <li>
            <h2 className="font-semibold text-lg mb-2">Step 2: Navigate to Settings</h2>
            <Image
              src="/images/settings-menu.jpeg"
              alt="Settings Menu"
              width={390}
              height={844}
              className="rounded-md border mx-auto"
            />
          </li>

          <li>
            <h2 className="font-semibold text-lg mb-2">Step 3: Confirm Account Deletion</h2>
            <Image
              src="/images/delete-confirmation.jpeg"
              alt="Delete Account Confirmation Dialog"
              width={390}
              height={844}
              className="rounded-md border mx-auto"
            />
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-gray-700">
                Before proceeding with account deletion, please ensure you have:
              </p>
              <ul className="list-disc ml-6 mt-2 text-gray-700">
                <li>Saved any important data you wish to keep</li>
                <li>Downloaded any necessary images or recordings</li>
                <li>Completed any pending submissions or reports</li>
              </ul>
            </div>
          </li>
        </ol>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            If you have any questions about account deletion or need assistance, please contact our support team before proceeding.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AccountDeletion;
