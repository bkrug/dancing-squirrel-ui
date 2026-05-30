import { FormikProps } from 'formik';
import './FeedbackSubmit.css';

interface FeedbackSubmitProps<TValue> {
  label: string;
  displayCompletion: boolean;
  formikState: FormikProps<TValue>;
}

export default function FeedbackSubmit<TValue>({ label, displayCompletion, formikState }: FeedbackSubmitProps<TValue>) {
  return (
    <>
      <button type="submit" disabled={formikState.isSubmitting}>{label}</button>
      <div className='saved-notification'>{displayCompletion && !formikState.isSubmitting ? 'Saved' : (<p></p>)}</div>
    </>
  );
}
