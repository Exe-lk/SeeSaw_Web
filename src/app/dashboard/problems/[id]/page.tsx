"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Script from 'next/script';

// Dynamically import the Google Maps component to avoid SSR issues
const GoogleMap = dynamic(
  () => import('@/components/GoogleMap'),
  { ssr: false }
);

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

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'yellow', icon: '⏳', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300', textColor: 'text-yellow-800' },
  { value: 'in progress', label: 'In Progress', color: 'blue', icon: '🔄', bgColor: 'bg-blue-50', borderColor: 'border-blue-300', textColor: 'text-blue-800' },
  { value: 'resolved', label: 'Resolved', color: 'green', icon: '✅', bgColor: 'bg-green-50', borderColor: 'border-green-300', textColor: 'text-green-800' },
  { value: 'rejected', label: 'Rejected', color: 'red', icon: '❌', bgColor: 'bg-red-50', borderColor: 'border-red-300', textColor: 'text-red-800' },
];

export default function ProblemDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const problemRef = doc(db, 'problems', id as string);
        const problemSnap = await getDoc(problemRef);
        
        if (problemSnap.exists()) {
          const data = problemSnap.data();
          setProblem({
            id: problemSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            location: {
              latitude: data.location.latitude,
              longitude: data.location.longitude
            }
          } as Problem);
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!problem) return;
    
    setUpdating(true);
    try {
      const problemRef = doc(db, 'problems', problem.id);
      await updateDoc(problemRef, { status: newStatus });
      setProblem(prev => prev ? { ...prev, status: newStatus } : null);
      setShowStatusDropdown(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleGetDirections = () => {
    if (!problem) return;
    const { latitude, longitude } = problem.location;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&key=${apiKey}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Problem not found</p>
      </div>
    );
  }

  const currentStatus = STATUS_OPTIONS.find(opt => opt.value === problem.status);

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-[#2563EB]"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Problems
        </button>
      </div>

      {/* Status Update Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Update Status</h2>
            <p className="text-sm text-gray-500 mt-1">Change the current status of this problem</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`flex items-center px-4 py-2 rounded-md border ${
                currentStatus?.bgColor || 'bg-gray-50'
              } ${currentStatus?.borderColor || 'border-gray-300'} ${
                currentStatus?.textColor || 'text-gray-800'
              }`}
            >
              <span className="mr-2">{currentStatus?.icon}</span>
              <span className="font-medium">{currentStatus?.label}</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {STATUS_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      disabled={updating}
                      className={`flex items-center w-full px-4 py-2 text-sm font-medium ${
                        option.bgColor} ${option.textColor} ${
                        option.value === problem.status ? `${option.bgColor} ${option.borderColor}` : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-2">{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={problem.imageUrls[selectedImage]}
                alt={problem.title}
                className="w-full h-full object-cover"
              />
            </div>
            {problem.imageUrls.length > 1 && (
              <div className="p-4 grid grid-cols-4 gap-2">
                {problem.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-[#2563EB]' : ''
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${problem.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audio Player */}
          {problem.audioUrl && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium mb-4">Audio Recording</h3>
              <audio
                controls
                className="w-full"
                src={problem.audioUrl}
              />
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Problem Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
                <p className="text-sm text-gray-500 mt-1">Created on {problem.createdAt.toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                problem.priority === 'High' ? 'bg-red-100 text-red-800' :
                problem.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {problem.priority} Priority
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1 text-gray-900">{problem.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Address</h4>
                <p className="mt-1 text-gray-900">{problem.address}</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Location</h3>
              <button
                onClick={handleGetDirections}
                className="flex items-center px-4 py-2 bg-[#2563EB] text-white rounded-md hover:bg-[#1d4ed8]"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Get Directions
              </button>
            </div>
            <div className="h-[400px]">
              {problem && (
                <GoogleMap 
                  latitude={problem.location.latitude} 
                  longitude={problem.location.longitude}
                  address={problem.address}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 