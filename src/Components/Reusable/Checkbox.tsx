import { h } from "preact";

export interface ICheckboxProps {
  value: string;
  onChange(e): void;
  checked?: boolean;
}

export const Checkbox = ({
  value,
  onChange,
  checked = false
}: ICheckboxProps) => (
  <p>
    <label class="miro-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ width: "100%" }}
      />
      <span>{value}</span>
    </label>
  </p>
);
