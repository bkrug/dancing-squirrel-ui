import { useField } from 'formik';
import { FC } from 'react';
import './LocalFields.css';

interface TextInputProps {
  label: string,
  name: string,
  type?: string,
  disabled?: boolean
}

export const LocalTextInput: FC<TextInputProps> = ({ label, ...props }) => {
  props.type = props.type || 'text';
  const [field, meta] = useField(props);
  return (
    <div className="field textinputcontainer">
      <label className='label-left-of-field label-for-input' htmlFor={props.name}>{label}</label>
      <div className="right-side-field">
        <input {...field} {...props} />
        {meta.touched && meta.error && <div className="error">{meta.error}</div>}
      </div>
    </div>
  );
};

export const LocalTextArea: FC<TextInputProps> = ({ label, ...props }) => {
  props.type = props.type || 'text';
  const [field, meta] = useField(props);
  return (
    <div className="field textareacontainer">
      <label htmlFor={props.name}>{label}</label>
      <textarea {...field} {...props} className="bottomsidefield"/>
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </div>
  );
};

interface RadioGroupOption<TValue> {
  label: string;
  value: TValue;
};

interface RadioInputProps<TValue> {
  label: string,
  name: string,
  options: RadioGroupOption<TValue>[]
}

export const LocalRadioInput: FC<RadioInputProps<string>> = ({ label, options, ...props }) => {
  const [{value, ...field}, meta] = useField(props);
  return (
    <div className="field radiogroupcontainer">
      <label className='label-left-of-field' htmlFor={props.name}>{label}</label>
      <div className="radiogroup right-side-field">
        {
          options.map((option) => {
            return (
              <div key={'radio'+option.value.toString()}>
                <input
                  id="company"
                  type="radio"
                  value={option.value}
                  defaultChecked={meta.value.toString()===option.value}
                  {...field}
                  {...props}
                />
                <label>{option.label}</label>
              </div>
            )
          })
        }
        {meta.touched && meta.error && <div className="error">{meta.error}</div>}
      </div>
    </div>
  );
};