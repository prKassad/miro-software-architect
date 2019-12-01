import { DataBaseFieldType } from "../../Interfaces";
import { Label } from "./Label";
import { h } from "preact";

export interface ISelectorProps {
  value: number;
  onChange(e);
  options?: Array<{ value: number; text: string }>;
  label?: string;
}

export const Selector = ({
  value,
  onChange,
  options = [],
  label = ""
}: ISelectorProps) => (
  <p>
    <Label>{label}</Label>
    <select
      class="miro-select miro-select--secondary-bordered miro-select--small"
      value={value}
      onChange={onChange}
      style={{ width: "100%" }}
    >
      {options.map(t => (
        <option key={t.value} value={t.value}>
          {t.text}
        </option>
      ))}
    </select>
  </p>
);
