import React from "react";
import EditableText from "./EditableText";
import EditableNumber from "./EditableNumber";
import { updateInvoiceLine } from "../stores/invoiceStore.ts";

interface EditableCellProps {
  index: number;
  field: string;
  initialValue: string;
  type?: "text" | "number";
}

const EditableCell: React.FC<EditableCellProps> = ({
  index,
  field,
  initialValue,
  type = "text",
  ...rest
}) => {
  const name = `invoiceLines[${index}][${field}]`;
  return type === "number" ? (
    <EditableNumber
      name={name}
      initialValue={initialValue}
      decimals={0}
      min={1}
      onChange={(value) => updateInvoiceLine(index, field as any, value)}
      {...rest}
    />
  ) : (
    <EditableText
      name={name}
      initialText={initialValue}
      onTextChange={(value) => updateInvoiceLine(index, field as any, value)}
    />
  );
};

export default EditableCell;
