'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { usePersonaStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProposalsPage() {
  const { proposals, loadData, acceptProposal, rejectProposal, dismissProposal } = usePersonaStore();
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    loadData();
  }, [loadData]);

  const pendingProposals = proposals.filter(p => p.status === 'pending');
  const acceptedProposals = proposals.filter(p => p.status === 'accepted');
  const rejectedProposals = proposals.filter(p => p.status === 'rejected');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Proposal Review Queue
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            AI agents suggest changes. You review and approve.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              Pending ({pendingProposals.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({acceptedProposals.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedProposals.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending">
            {pendingProposals.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-6 py-12 text-center">
                  <div className="mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center w-16 h-16">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No pending proposals
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    When AI agents suggest improvements to your profile, they'll appear here for your review.
                    You always have the final say.
                  </p>
                  <Button asChild>
                    <Link href="/profile">Go to Profile</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProposals.map((proposal) => (
                  <div key={proposal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {proposal.type.charAt(0).toUpperCase() + proposal.type.slice(1)} proposal
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Suggested by: {proposal.createdByAgent} · Priority: {proposal.priority}/10
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded whitespace-nowrap">
                        Pending
                      </span>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 mb-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {proposal.rationale}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => acceptProposal(proposal.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => rejectProposal(proposal.id)}
                        variant="destructive"
                        className="flex-1"
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => dismissProposal(proposal.id)}
                        variant="outline"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Accepted Tab */}
          <TabsContent value="accepted">
            {acceptedProposals.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No accepted proposals yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {acceptedProposals.map((proposal) => (
                  <div key={proposal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 opacity-75">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {proposal.type.charAt(0).toUpperCase() + proposal.type.slice(1)} proposal
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {proposal.rationale}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded">
                        Accepted
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Rejected Tab */}
          <TabsContent value="rejected">
            {rejectedProposals.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No rejected proposals yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {rejectedProposals.map((proposal) => (
                  <div key={proposal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 opacity-75">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {proposal.type.charAt(0).toUpperCase() + proposal.type.slice(1)} proposal
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {proposal.rationale}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-medium rounded">
                        Rejected
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
