import { FC } from 'react';
import { useField } from 'formik';
import './LocalFields.css';

interface TextInputProps {
  label: string,
  name: string,
  type?: string
}

export const LocalTextInput: FC<TextInputProps> = ({ label, ...props }) => {
  props.type = props.type || 'text';
  const [field, meta] = useField(props);
  return (
    <div className="field textinputcontainer">
      <label htmlFor={props.name}>{label}</label>
      <input {...field} {...props} className="rightsidefield" />
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
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
      <label htmlFor={props.name}>{label}</label>
      <div className="radiogroup rightsidefield">
        {
          options.map((option) => {
            return (
              <>
                <input
                  id="company"
                  type="radio"
                  value={option.value}
                  defaultChecked={meta.value.toString()===option.value}
                  {...field}
                  {...props}
                />
                <label>{option.label}</label>              
              </>
            )
          })
        }
      </div>
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </div>
  );
};