import { Effect } from 'effect/index';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import YesNoModal from '../../Components/YesNoModal';
import { getPagedData, getParsedResponse } from '../../Forms/Submission/formikSubmission';
import { EditProfileProps } from './EditUser';
import './EditUser.css';
import ContactFieldForm from './subcomponents/ContactFieldForm';
import ResetPassword from './subcomponents/ResetPassword';
import RoleForm from './subcomponents/RoleForm';

export default function EditOtherProfile({ viewModel, editModel} : EditProfileProps) {
  let { userId } = useParams();
  let [availableRoles, setAvailableRoles] = useState({} as { [key: string]: boolean });
  let [openDelete, setOpenDelete] = useState(false);
  let navigate = useNavigate();

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
    <div className="form-parent">
      <h2>Edit User {viewModel.username}</h2>
      <div className="form-container">
        <ContactFieldForm editingOwnData={false} editModel={editModel} viewModel={viewModel} />
      </div>
      <div className="form-container">
        {Object.keys(availableRoles).length > 0 && <RoleForm roleList={availableRoles} userId={userId} />}
      </div>
      <div className="form-container">
        <ResetPassword userId={viewModel.userId} />
      </div>
      <div className="form-container">
        <div className="delete-container">
          <button onClick={() => setOpenDelete(true)}>Delete User</button>
        </div>
        <YesNoModal isOpen={openDelete} onConfirm={deleteUser} onDeny={()=> setOpenDelete(false)}>
          Are you sure you want to delete this user?
        </YesNoModal>
      </div>
    </div>
  );
}