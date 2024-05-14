import { Button } from "@tremor/react";
import { useState, useCallback, useEffect } from "react";

export default function LeadsPagination({ page, perPage, totalCount, onPageChange, isLoading, facets }: { page: number, perPage: number, totalCount: number, onPageChange: any, isLoading: boolean, facets: any }) {
    const totalPages = Math.ceil(totalCount / perPage);
    const [inputPage, setInputPage] = useState<number>(page);

    const changePage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    };

    const handleGoClick = useCallback(() => {
        if (!isNaN(inputPage) && inputPage !== page) {
            changePage(inputPage);
        }
    }, [page, inputPage]);

    useEffect(() => {
        setInputPage(page);
    }, [page]);

    return (
        <>
            <div className="flex justify-start items-center gap-2">
                <Button size="xs" onClick={() => changePage(page - 1)} disabled={page === 1 || isLoading} className={page === 1 ? 'opacity-50 cursor-not-allowed' : ''}>
                    Prev
                </Button>
                <span className="text-sm font-medium">Page {page} of {facets ? totalPages : '-'}</span>
                <Button size="xs" onClick={() => changePage(page + 1)} disabled={page === totalPages || isLoading} className={page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}>
                    Next
                </Button>
            </div>
            <div className="flex justify-end lg:justify-center items-center gap-2 grow">
                <input type="number" min={1} max={100} value={inputPage} 
                    onChange={(e) => setInputPage(e.target.valueAsNumber)} 
                    onKeyDown={(e: any) => { if (e.key === 'Enter') handleGoClick(); }}
                    className="border rounded-md text-xs w-20 border-gray-300" 
                    placeholder="Go to page..." 
                />
                <Button size="xs" disabled={isLoading} onClick={handleGoClick}>
                    Go to Page
                </Button>
            </div>
        </>
    );
}
