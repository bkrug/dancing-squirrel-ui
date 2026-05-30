import { Effect } from 'effect/index';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPagedData, getParsedResponse } from '../../Forms/Submission/formikSubmission';
import { EditUserModel, ViewUserModel } from '../../dtoModels';
import './EditUser.css';
import ContactFieldForm from './subcomponents/ContactFieldForm';
import RoleForm from './subcomponents/RoleForm';

export default function EditUser() {
  let { userId } = useParams();
  let [viewModel, setViewModel] = useState(null as null | ViewUserModel);
  let [editModel, setEditModel] = useState(null as null | EditUserModel);
  let [roleList, setRoleList] = useState({} as { [key: string]: boolean });

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
            setRoleList(Object.fromEntries(
              parsedResponse.data
                .map(role => role.toString())
                .map(role => [role, userRoleNames.includes(role)])
            ));
          },
          onFailure: failureResponse => console.log(failureResponse)
        }))
      );
  }, [viewModel, viewModel?.roles]);

  return (
    <div className='form-parent'>
      {editModel && viewModel && <ContactFieldForm editModel={editModel} viewModel={viewModel} />}
      {Object.keys(roleList).length > 0 && <RoleForm roleList={roleList} userId={userId} />}
    </div>
  );
}
