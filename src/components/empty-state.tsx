'use client';

import { Search } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Search className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No coins found</h3>
      <p className="text-muted-foreground max-w-md">
        Try adjusting your search or filters to find what you're looking for.
      </p>
    </div>
  );
}
