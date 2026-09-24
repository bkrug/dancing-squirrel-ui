import { getIn, useField, useFormikContext } from 'formik';
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';
import { FC } from 'react';
import './LocalFields.css';

interface TextInputProps {
  label: string,
  name: string,
  type?: string,
  disabled?: boolean,
  step?: string | number | undefined
}

export const LocalTextInput: FC<TextInputProps> = ({ label, ...props }) => {
  props.type = props.type || 'text';
  const [field, meta] = useField(props);
  return (
    <div className="field-container">
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
    <div className="field-container vertically-arranged-contents">
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
    <div className="field-container">
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

export interface SelectListOption {
  label: string;
  value: number | string;
}

interface SelectListProps {
  label: string,
  name: string,
  options: SelectListOption[],
  disabled?: boolean
}

export const LocalSelectList: FC<SelectListProps> = ({ label, options, ...props }) => {
  const [field, meta, helpers] = useField(props);
  return (
    <div className="field-container">
      <label className="label-on-left label-for-input" htmlFor={props.name}>{label}</label>
      <div className="right-of-label">
        <select
          className="fill-container-width typeable-field"
          {...props}
          value={field.value ?? ''}
          onBlur={field.onBlur}
          onChange={e => {
            if (e.target.value === '') {
              helpers.setValue(null);
              return;
            }
            const selectedOption = options.find(option => option.value.toString() === e.target.value);
            helpers.setValue(selectedOption ? selectedOption.value : e.target.value);
          }}
        >
          <option value="">-- Select --</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
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
    <div className="field-container switch-container">
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

interface ModelFailureMsgProps {
  name?: string
}

function isAnyTouched(touched: unknown): boolean {
  if (touched === true) return true;
  if (touched && typeof touched === 'object') {
    return Object.values(touched).some(isAnyTouched);
  }
  return false;
}

export const ModelFailureMsg : FC<ModelFailureMsgProps> = ({ name = 'modelFailure' }) => {
  const { touched } = useFormikContext();
  const [, meta] = useField({ name });

  //Attempts to remove the validation message if at least one field in the parent container is changed.
  //Not sure if it actually works.
  const lastDot = name.lastIndexOf('.');
  const scopeTouched = lastDot === -1 ? touched : getIn(touched, name.substring(0, lastDot));
  const isTouched = isAnyTouched(scopeTouched);

  return (
    <div className="field-container">
      <div className="right-of-label">
        {isTouched && meta.error && <div className="error">{meta.error}</div>}
      </div>
    </div>
  );
};
