import { h } from "preact";

export interface ILabelProps {
  children: string;
}

export const Label = ({ children }: ILabelProps) => (
  <div style={{ paddingBottom: "5px", color: "#333" }}>{children}</div>
);
