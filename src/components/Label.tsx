import "./Label.css";
import { ReactNode } from "react";

type Type = "primary" | "secondary" | "progress" | "error" | "success";
type LabelProps = { type: Type, children: ReactNode };

const Label = ({ type, children }: LabelProps) => {
  return <span className={`label ${type}`}>{children}</span>;
};

export default Label;