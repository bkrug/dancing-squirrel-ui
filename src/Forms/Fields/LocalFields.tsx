import { useField } from 'formik';
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';
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
    <div className="field">
      <label className="label-on-left label-for-input" htmlFor={props.name}>{label}</label>
      <div className="right-of-label">
        <input className="fill-container-width typeable-field" {...field} {...props} />
        {meta.touched && meta.error && <div className="error">{meta.error}</div>}
      </div>
    </div>
  );
};

export const LocalTextArea: FC<TextInputProps> = ({ label, ...props }) => {
  props.type = props.type || 'text';
  const [field, meta] = useField(props);
  return (
    <div className="field vertically-arranged-contents">
      <label className="label-on-top" htmlFor={props.name}>{label}</label>
      <textarea {...field} {...props} className="typeable-field"/>
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
    <div className="field">
      <label className="label-on-left" htmlFor={props.name}>{label}</label>
      <div className="radiogroup right-of-label">
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
                <label className="radio-option-label">{option.label}</label>
              </div>
            )
          })
        }
        {meta.touched && meta.error && <div className="error">{meta.error}</div>}
      </div>
    </div>
  );
};

interface SwitchProps {
  label: string,
  name: string,
}

export const LocalSwitch: FC<SwitchProps> = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);
  return (
    <div className="field switch-container">
      <label className="label-on-left" htmlFor={props.name}>{label}</label>
      <div className="right-of-label">
        <Switch
          checked={field.value}
          onChange={(checked: boolean) => helpers.setValue(checked)}
        />
        {meta.touched && meta.error && <div className="error">{meta.error}</div>}
      </div>
    </div>
  );
};