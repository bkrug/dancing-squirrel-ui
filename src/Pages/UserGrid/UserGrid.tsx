import { Effect } from 'effect';
import { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { GridUser } from '../../dtoModels';
import { getPagedData } from '../../Forms/Submission/formikSubmission';
import './UserGrid.css';

const columns: TableColumn<GridUser>[] = [
  {
    name: 'User ID',
    selector: row => row.userId,
    cell: row => <a href={`user-form/${row.userId}`}>{row.userId}</a>
  },
  {
    name: 'Username',
    selector: row => row.username
  },
  {
    name: 'Email',
    selector: row => row.email
  }
];

const pageLength = 20;

export default function UserGrid() {
  const [gridRows, setRows] = useState(null as (GridUser[] | null));
  const [totalRows, setTotalRows] = useState(0);

  const refreshGridData = (page: number) =>
    getPagedData<GridUser>(`user?page=${page}&length=${pageLength}`)
      .then(result =>
        Effect.runPromise(Effect.match(result, {
          onSuccess: (parsedResponse) => {
            setRows(parsedResponse.data);
            setTotalRows(parsedResponse.totalRecords);
          },
          onFailure: (failureResponse) => console.log(failureResponse)
        }))
      );

  useEffect(() => { refreshGridData(1); }, []);

  return (
    <DataTable
      columns={columns}
      data={gridRows || []}
      pagination
      paginationServer
      paginationTotalRows={totalRows}
      paginationRowsPerPageOptions={[pageLength]}
      onChangePage={refreshGridData} />
  );
}
