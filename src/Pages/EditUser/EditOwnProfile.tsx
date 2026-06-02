import { Effect } from 'effect/index';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getParsedResponse } from '../../Forms/Submission/formikSubmission';
import { EditUserModel, ViewUserModel } from '../../dtoModels';
import './Edit.css';
import ContactFieldForm from './subcomponents/ContactFieldForm';

export default function EditOwnProfile() {
  let { userId } = useParams();
  let [viewModel, setViewModel] = useState(null as null | ViewUserModel);
  let [editModel, setEditModel] = useState(null as null | EditUserModel);

  useEffect(() => {
    getParsedResponse('user/self', ViewUserModel)
      .then(parsedResponse => {
        Effect.runPromise(Effect.match(parsedResponse, {
          onSuccess: parsed => {
            setViewModel(parsed);
            setEditModel({ email: parsed.email, phoneNumber: parsed.phoneNumber });
          },
          onFailure: err => console.error(err)
        }));
      });
  }, [userId]);

  return (
    <div className='form-parent'>
      { viewModel && <h2>Edit User {viewModel.username}</h2> }
      <div className='form-container'>
        {editModel && viewModel && <ContactFieldForm editingOwnData={true} editModel={editModel} viewModel={viewModel} />}
      </div>
    </div>
  );
}
