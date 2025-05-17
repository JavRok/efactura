import EditableText from "./EditableText.js";
import { getInvoiceField, updateInvoiceLine } from "../stores/invoiceStore.js";
import type { InvoiceLine } from "../stores/invoiceStore";

const InvoiceLines = () => {
  const lines = getInvoiceField("invoiceLines") as InvoiceLine[];

  return (
    <tbody>
      {lines.map((line, index) => (
        <tr className="border-b border-gray-200" key={line.detail}>
          <td className="p-2">
            <EditableText
              name={`invoiceLines[${index}][detail]`}
              initialText={line.detail}
              onChange={(value) => updateInvoiceLine(index, "detail", value)}
            />
          </td>
          <td className="text-center p-2">{line.quantity}</td>
          <td className="text-center p-2">{line.unitPrice}</td>
          <td className="text-center p-2">{line.totalPrice}</td>
        </tr>
      ))}
    </tbody>
  );
};

export default InvoiceLines;
