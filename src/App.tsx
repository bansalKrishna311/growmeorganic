import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";

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
  const [rowsToSelect, setRowsToSelect] = useState<string>('');

  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          "https://api.artic.edu/api/v1/artworks",
          {
            params: { page },
          }
        );

        setArtworks(response.data.data);
        setTotalRecords(response.data.pagination.total);
      } catch (error) {
        console.error("Failed to load artworks", error);
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

  const handleSubmit = async () => {
    const count = parseInt(rowsToSelect);
    if (isNaN(count) || count <= 0) return;

    const selected: Artwork[] = [];
    let remaining = count;
    let currentPage = 1;

    while (remaining > 0) {
      try {
        const response = await axios.get(
          "https://api.artic.edu/api/v1/artworks",
          {
            params: { page: currentPage },
          }
        );

        const pageData: Artwork[] = response.data.data;
        const toSelect = Math.min(remaining, pageData.length);
        selected.push(...pageData.slice(0, toSelect));
        remaining -= toSelect;
        currentPage++;

        if (pageData.length < rowsPerPage) break;
      } catch (error) {
        console.error("Failed to load artworks for selection", error);
        break;
      }
    }

    setSelectedArtworks(selected);
    op.current?.toggle();
  };

  const op = useRef<any>(null);
  return (
    <>
      <DataTable
        value={artworks}
        selection={selectedArtworks}
        onSelectionChange={(event: any) =>
          setSelectedArtworks(event.value as Artwork[])
        }
        selectionMode="checkbox"
        paginator
        lazy
        rows={rowsPerPage}
        totalRecords={totalRecords}
        first={(page - 1) * rowsPerPage}
        onPage={handlePage}
        dataKey="id"
        loading={loading}
        style={{ width: "100%" }}
      >
        <Column selectionMode="multiple" />
        <Column
          header={
            <i
              className="pi pi-angle-down text-sm"
              onClick={(e) => {
                op.current.toggle(e);
              }}
            ></i>
          }
          body={() => null}
          headerStyle={{ width: "3rem" }}
        />

        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Date Start" />
        <Column field="date_end" header="Date End" />
      </DataTable>
      <OverlayPanel ref={op}>
        <div className="flex flex-col gap-4 p-4">
          <input
            type="number"
            placeholder="Select rows..."
            className="border border-gray-300 rounded px-3 py-2 w-64"
            min="0"
            value={rowsToSelect}
            onChange={(e) => setRowsToSelect(e.target.value)}
          />
          <button 
            className="bg-white border border-gray-300 rounded px-6 py-2 self-end hover:bg-gray-50"
            onClick={handleSubmit}
          >
            submit
          </button>
        </div>
      </OverlayPanel>
    </>
  );
}
