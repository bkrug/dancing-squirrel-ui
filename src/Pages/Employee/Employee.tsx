import './Employee.css';
import { useEffect, useState } from 'react';
import { getPagedData } from '../../Forms/Submission/formikSubmission';
import DataTable, { TableColumn } from 'react-data-table-component';
import TrainingRequest from '../../DbModels/TrainingRequest';
import { CaretakerType } from '../../Enums';
import { Effect } from 'effect';

const columns: TableColumn<TrainingRequest>[] = [
  {
    name: 'Buttons',
		cell: row => (<a href={`onboard/${row.trainingRequestId}`} rel="noopener noreferrer">Onboard Customer</a>)
  },
  {
    name: 'Squirrel',
    selector: row => row.squirrelName
  },
	{
		name: 'Caretaker Type',
		selector: row => row.caretakerType === CaretakerType.Person ? 'individual' : 'organization',
	},
	{
		name: 'Caretaker Name',
		selector: row => row.caretakerType === CaretakerType.Person
      ? `${row.ownerLastName || ''}, ${row.ownerFirstName || ''}`
      : row.organizationName || ''
	},
  {
    name: 'Email',
    selector: row => row.email
  },
  {
    name: 'Phone',
    selector: row => row.phone || ''
  }
];

const pageLength = 10;

export default function Employee() {
  const [gridRows, setRows] = useState(null as (TrainingRequest[] | null));
  const [totalRows, setTotalRows] = useState(0);

  const refreshGridData = (page : number) => 
    getPagedData<TrainingRequest>(`requests?page=${page}&length=${pageLength}`)
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
