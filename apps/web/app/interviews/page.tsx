"use client";
import React from "react";
import { MainLayout } from "../../components/layout/MainLayout";

export default function InterviewsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Interviews</h1>
            <p className="text-gray-600">
              Manage and track your job interviews
            </p>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Interview Management Coming Soon
            </h2>
            
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We&apos;re building an amazing interview tracking system that will help you:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 mx-auto mb-2 text-blue-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Schedule Interviews</h3>
                <p className="text-sm text-gray-600">Keep track of all your upcoming interviews</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 mx-auto mb-2 text-green-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Track Progress</h3>
                <p className="text-sm text-gray-600">Monitor interview status and outcomes</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 mx-auto mb-2 text-purple-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Prepare Better</h3>
                <p className="text-sm text-gray-600">Store notes and preparation materials</p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>In the meantime:</strong> You can still add interviews from the Dashboard by clicking &quot;Add Interview&quot; and linking them to your applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}