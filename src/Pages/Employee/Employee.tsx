import './Employee.css';
import { useEffect, useState } from 'react';
import { getJson } from '../../Forms/Submission/formikSubmission';
import DataTable, { TableColumn } from 'react-data-table-component';
import TrainingRequest from '../../DbModels/TrainingRequest';

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
		selector: row => row.organizationName === null ? 'individual' : 'organization',
	},
	{
		name: 'Caretaker Name',
		selector: row => row.organizationName === null
      ? row.ownerLastName + ', ' + row.ownerFirstName
      : row.organizationName
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
  let [gridRows, setRows] = useState(null as (TrainingRequest[] | null));
  let [totalRows, setTotalRows] = useState(0);

  const refreshGridData = (page : number) => 
    getJson<TrainingRequest>(`requests?page=${page}&length=${pageLength}`)
    .then(parsedResponse => {
      setRows(parsedResponse.data);
      setTotalRows(parsedResponse.totalRecords);
    });

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
