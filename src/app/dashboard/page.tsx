"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import Link from 'next/link';

interface Problem {
  id: string;
  address: string;
  audioUrl: string;
  createdAt: Date;
  description: string;
  imageUrls: string[];
  isDraft: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  priority: string;
  status: string;
  title: string;
  userId: string;
}

export default function Dashboard() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [indexError, setIndexError] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        setIndexError(false);
        const problemsRef = collection(db, 'problems');
        let q;
        
        if (filter === 'all') {
          q = query(problemsRef, orderBy('createdAt', 'desc'));
        } else {
          // Create a new query with both conditions
          q = query(
            problemsRef,
            where('status', '==', filter.toLowerCase()),
            orderBy('createdAt', 'desc')
          );
        }

        const querySnapshot = await getDocs(q);
        
        const problemsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          location: {
            latitude: doc.data().location.latitude,
            longitude: doc.data().location.longitude
          }
        })) as Problem[];

        setProblems(problemsData);
      } catch (error) {
        console.error('Error fetching problems:', error);
        if (error instanceof Error && error.message.includes('requires an index')) {
          setIndexError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [filter]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 border border-red-300 text-red-800 px-3 py-1 font-medium';
      case 'medium':
        return 'bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-1 font-medium';
      case 'low':
        return 'bg-green-100 border border-green-300 text-green-800 px-3 py-1 font-medium';
      default:
        return 'bg-gray-100 border border-gray-300 text-gray-800 px-3 py-1 font-medium';
    }
  };

  if (indexError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Setting Up Database Index</h2>
          <p className="text-gray-600">Please wait while we set up the necessary database index. This may take a few minutes.</p>
          <p className="text-gray-600">You can refresh the page to check if the setup is complete.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Problem Management</h1>
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-white text-gray-900 font-medium"
          >
            <option value="all">All Problems</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Problems</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{problems.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">
            {problems.filter(p => p.status.toLowerCase() === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">
            {problems.filter(p => p.status.toLowerCase() === 'in progress').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">
            {problems.filter(p => p.status.toLowerCase() === 'resolved').length}
          </p>
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {problems.map((problem) => (
                <tr key={problem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {problem.imageUrls.length > 0 && (
                        <img
                          src={problem.imageUrls[0]}
                          alt={problem.title}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{problem.title}</div>
                        <div className="text-sm text-gray-500">{problem.description.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(problem.status)}`}>
                      {problem.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex text-xs leading-5 rounded-full ${getPriorityColor(problem.priority)}`}>
                      {problem.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {problem.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {problem.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/dashboard/problems/${problem.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 