import { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

type Artwork = {
    id: number;
    title: string;
    place_of_origin: string | null;
    artist_display: string | null;
    inscriptions: string | null;
    date_start: number | null;
    date_end: number | null;
};

const rowsPerPage = 12;

export default function App() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [page, setPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
        const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);

    useEffect(() => {
        const loadArtworks = async () => {
            setLoading(true);

            try {
                const response = await axios.get('https://api.artic.edu/api/v1/artworks', {
                    params: { page },
                });

                setArtworks(response.data.data);
                setTotalRecords(response.data.pagination.total);
            } catch (error) {
                console.error('Failed to load artworks', error);
                setArtworks([]);
            } finally {
                setLoading(false);
            }
        };

        loadArtworks();
    }, [page]);

    const handlePage = (event: any) => {
        setPage(event.page + 1);
    };

    return (
        <DataTable
            value={artworks}
                selection={selectedArtworks}
                onSelectionChange={(event: any) => setSelectedArtworks(event.value as Artwork[])}
                selectionMode="checkbox"
            paginator
            lazy
            rows={rowsPerPage}
            totalRecords={totalRecords}
            first={(page - 1) * rowsPerPage}
            onPage={handlePage}
            dataKey="id"
            loading={loading}
            style={{ width: '100%' }}
        >
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            <Column field="title" header="Title" />
            <Column field="place_of_origin" header="Place of Origin" />
            <Column field="artist_display" header="Artist" />
            <Column field="inscriptions" header="Inscriptions" />
            <Column field="date_start" header="Date Start" />
            <Column field="date_end" header="Date End" />
        </DataTable>
    );
}
