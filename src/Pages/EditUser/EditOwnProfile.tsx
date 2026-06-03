import { EditProfileProps } from './EditUser';
import './EditUser.css';
import ContactFieldForm from './subcomponents/ContactFieldForm';
import ResetOwnPassword from './subcomponents/ResetOwnPassword';

export default function EditOwnProfile({ viewModel, editModel} : EditProfileProps) {
  return (
    <div className='form-parent'>
      <h2>Edit Your Profile</h2>
      <div className='form-container'>
        <ContactFieldForm editingOwnData={true} editModel={editModel} viewModel={viewModel} />
      </div>
      <div className='form-container'>
        <ResetOwnPassword />
      </div>
    </div>
  );
}
