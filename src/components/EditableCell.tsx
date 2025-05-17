import React from 'react';
import EditableText from "./EditableText.js";
import { updateInvoiceLine } from "../stores/invoiceStore.js";

interface EditableCellProps {
  index: number;
  field: string;
  initialValue: string;
}

const EditableCell: React.FC<EditableCellProps> = ({ index, field, initialValue }) => {
  return (
    <EditableText
      name={`invoiceLines[${index}][${field}]`}
      initialText={initialValue}
      onTextChange={(value) => updateInvoiceLine(index, field as any, value)}
    />
  );
};

export default EditableCell;
