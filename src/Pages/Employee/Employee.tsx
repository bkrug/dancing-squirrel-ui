//TODO: Reduce duplicate styling
import './Employee.css';
import { useState } from 'react';
import { CaretakerType } from '../../Enums';
import { getJson } from '../../Forms/Submission/formikSubmission';
import DataTable, { TableColumn } from 'react-data-table-component';

class TrainingRequestGridFields {
  caretakerType: CaretakerType = CaretakerType.Person;
  caretakerFirstName: string = '';
  caretakerLastName: string = '';
  caretakerCompanyName: string = '';
  email: string = '';
  phone: string = '';
  squirrelName: string = '';
}

const columns: TableColumn<TrainingRequestGridFields>[] = [
	{
		name: 'Caretaker Type',
		selector: row => row.caretakerType === CaretakerType.Person ? 'individual' : 'organization',
	},
	{
		name: 'Caretaker Name',
		selector: row => row.caretakerType === CaretakerType.Person
      ? row.caretakerLastName + ', ' + row.caretakerFirstName
      : row.caretakerCompanyName,
	},
  {
    name: 'Squirrel',
    selector: row => row.squirrelName
  },
  {
    name: 'Email',
    selector: row => row.email
  },
  {
    name: 'Phone',
    selector: row => row.phone
  }
];

const pageLength = 10;

export default function Employee() {
  let [gridRows, setRows] = useState(null as (TrainingRequestGridFields[] | null));
  let [totalRows, setTotalRows] = useState(0);

  const refreshGridData = (page : number) => 
    getJson<TrainingRequestGridFields>(`request?page=${page}&length=${pageLength}`)
    .then(parsedResponse => {
      setRows(parsedResponse.data);
      if (parsedResponse.totalRecords != null)
        setTotalRows(parsedResponse.totalRecords);
      else if (parsedResponse.morePages)
        setTotalRows(page * pageLength + 1);
      else
        setTotalRows((page - 1) * pageLength + parsedResponse.data.length);
    });

  if (gridRows === null)
    refreshGridData(1);

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
