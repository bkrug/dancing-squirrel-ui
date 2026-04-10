import { FC } from 'react';
import { useField } from 'formik';

interface TextInputProps {
  label: string,
  name: string,
  type?: string
}

export const LocalTextInput: FC<TextInputProps> = ({ label, ...props }) => {
  props.type = props.type || "text";
  const [field, meta] = useField(props);
  return (
    <div className="field">
      <label htmlFor={props.name}>{label}</label>
      <input {...field} {...props} />
      {meta.touched && meta.error && <div className='error'>{meta.error}</div>}
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
    <div className="field">
      <label htmlFor={props.name}>{label}</label>
      <div className="radiogroup">
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
      {meta.touched && meta.error && <div className='error'>{meta.error}</div>}
    </div>
  );
};