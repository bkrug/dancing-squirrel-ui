import { Effect } from 'effect/index';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import YesNoModal from '../../Components/YesNoModal';
import { getPagedData, getParsedResponse } from '../../Forms/Submission/formikSubmission';
import { EditUserModel, ViewUserModel } from '../../dtoModels';
import './EditUser.css';
import ContactFieldForm from './subcomponents/ContactFieldForm';
import RoleForm from './subcomponents/RoleForm';

export default function EditUser() {
  let { userId } = useParams();
  let [viewModel, setViewModel] = useState(null as null | ViewUserModel);
  let [editModel, setEditModel] = useState(null as null | EditUserModel);
  let [availableRoles, setAvailableRoles] = useState({} as { [key: string]: boolean });
  let [openDelete, setOpenDelete] = useState(false);
  let navigate = useNavigate();

  //TODO: Maybe all of this data should just come from a single request
  useEffect(() => {
    getParsedResponse(`user/${userId}`, ViewUserModel)
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

  useEffect(() => {
    if (viewModel === null)
      return

    getPagedData<String>('role')
      .then(result =>
        Effect.runPromise(Effect.match(result, {
          onSuccess: parsedResponse => {
            const userRoleNames = viewModel?.roles.map(r => r.name) ?? [];
            setAvailableRoles(Object.fromEntries(
              parsedResponse.data
                .map(role => role.toString())
                .map(role => [role, userRoleNames.includes(role)])
            ));
          },
          onFailure: failureResponse => console.log(failureResponse)
        }))
      );
  }, [viewModel, viewModel?.roles]);

  function deleteUser() {
    getParsedResponse(`user/${userId}`, Boolean, 'DELETE')
      .then(parsedResponse => {
        Effect.runPromise(Effect.match(parsedResponse, {
          onSuccess: () => {
            setOpenDelete(false);
            navigate('/users');
          },
          onFailure: err => console.error(err)
        }));
      });
  }

  return (
    <div className='form-parent'>
      { viewModel && <h2>Edit User {viewModel.username}</h2> }
      <button onClick={() => setOpenDelete(true)}>Delete</button>
      <YesNoModal isOpen={openDelete} onConfirm={deleteUser} onDeny={()=> setOpenDelete(false)}>
        Are you sure you want to delete this user?
      </YesNoModal>
      <div className='form-container'>
        {editModel && viewModel && <ContactFieldForm editingOwnData={false} editModel={editModel} viewModel={viewModel} />}
      </div>
      <div className='form-container'>
        {Object.keys(availableRoles).length > 0 && <RoleForm roleList={availableRoles} userId={userId} />}
      </div>
    </div>
  );
}
