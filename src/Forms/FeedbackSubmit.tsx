import { FormikProps } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import './FeedbackSubmit.css';

interface FeedbackSubmitProps<TValue> {
  label: string;
  displayCompletion: boolean;
  formikState: FormikProps<TValue>;
}

export default function FeedbackSubmit<TValue>({ label, displayCompletion, formikState }: FeedbackSubmitProps<TValue>) {
  const [touchedSinceSubmission, setTouchedSinceSubmission] = useState(false);
  useEffect(() => {
    if (formikState.isSubmitting)
      setTouchedSinceSubmission(false);
    else if (formikState.dirty)
      setTouchedSinceSubmission(true);
  }, [formikState.isSubmitting, formikState.dirty]);
  const showMessage = displayCompletion && !touchedSinceSubmission;

  return (
    <>
      <button type="submit" disabled={formikState.isSubmitting}>{label}</button>
      {showMessage && <div className='saved-notification'>Saved</div>}
    </>
  );
}
