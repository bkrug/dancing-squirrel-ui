import { Effect } from 'effect/index';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getParsedResponse } from '../../Forms/Submission/formikSubmission';
import { EditUserModel, ViewUserModel } from '../../dtoModels';
import EditOtherProfile from './EditOtherProfile';
import EditOwnProfile from './EditOwnProfile';
import './EditUser.css';

interface EditUserProps {
  editingOwnData: boolean;   //Admins can edit any user's data. Non-admins can edit their own data.
}

export interface EditProfileProps {
  viewModel: ViewUserModel;
  editModel: EditUserModel;
}

export default function EditUser({ editingOwnData } : EditUserProps) {
  let { userId } = useParams();
  let [viewModel, setViewModel] = useState(null as null | ViewUserModel);
  let [editModel, setEditModel] = useState(null as null | EditUserModel);

  useEffect(() => {
    getParsedResponse(userId ? `user/${userId}` : 'user/self', ViewUserModel)
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

  if (viewModel && editModel)
    return (<div className='edituser'>
      {
        editingOwnData
        ? (<EditOwnProfile viewModel={viewModel} editModel={editModel} />)
        : (<EditOtherProfile viewModel={viewModel} editModel={editModel} />)
      }
      </div>)
  else
    return (<></>);
}
