"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ForumPaginationProps {
  totalPages: number;
  currentPage: number;
}

export function ForumPagination({ totalPages, currentPage }: ForumPaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageItems = [];
  
  const showFirst = currentPage > 2;
  const showLast = currentPage < totalPages - 1;
  
  const showLeftEllipsis = currentPage > 3;
  const showRightEllipsis = currentPage < totalPages - 2;
  
  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);
  
  if (currentPage === 1) {
    endPage = Math.min(3, totalPages);
  } else if (currentPage === totalPages) {
    startPage = Math.max(1, totalPages - 2);
  }
  
  if (showFirst && startPage > 1) {
    pageItems.push(
      <PaginationItem key="first">
        <PaginationLink href={createPageURL(1)}>1</PaginationLink>
      </PaginationItem>
    );
  }
  
  if (showLeftEllipsis) {
    pageItems.push(
      <PaginationItem key="left-ellipsis">
        <PaginationEllipsis />
      </PaginationItem>
    );
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageItems.push(
      <PaginationItem key={i}>
        <PaginationLink 
          href={createPageURL(i)} 
          isActive={i === currentPage}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }
  
  if (showRightEllipsis) {
    pageItems.push(
      <PaginationItem key="right-ellipsis">
        <PaginationEllipsis />
      </PaginationItem>
    );
  }
  
  if (showLast && endPage < totalPages) {
    pageItems.push(
      <PaginationItem key="last">
        <PaginationLink href={createPageURL(totalPages)}>
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious href={createPageURL(currentPage - 1)} />
          </PaginationItem>
        )}
        
        {pageItems}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext href={createPageURL(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}