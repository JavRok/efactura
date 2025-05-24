import React from "react";
import { useStore } from "@nanostores/react";
import EditableCell from "./EditableCell";
import FormattedNumber from "./FormattedNumber";
import {
  addInvoiceLine,
  removeInvoiceLine,
  invoiceStore,
  getInvoiceLines,
} from "../stores/invoiceStore";

interface InvoiceTableProps {
  currency: string;
  currencySymbol: string;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  currency,
  currencySymbol,
}) => {
  const $invoice = useStore(invoiceStore);

  const handleAddRow = () => {
    addInvoiceLine();
  };

  const handleDeleteRow = (index: number) => {
    removeInvoiceLine(index);
  };

  return (
    <div className="mb-10">
      <table className="w-full border-2 border-black">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left p-2 w-1/2">Detalle</th>
            <th className="text-center p-2">Cantidad</th>
            <th className="text-center p-2">Precio</th>
            <th className="text-center p-2">Total</th>
            <th className="text-center p-2 w-10 no-print">Acción</th>
          </tr>
        </thead>

        <tbody>
          {$invoice.invoiceLines.map((line, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="p-2">
                <EditableCell
                  index={index}
                  field="detail"
                  initialValue={line.detail}
                />
              </td>
              <td className="text-center p-2">
                <EditableCell
                  index={index}
                  type="number"
                  field="quantity"
                  initialValue={line.quantity}
                  decimals={0}
                  min={1}
                />
              </td>
              <td className="text-center p-2">
                <EditableCell
                  index={index}
                  type="number"
                  decimals={2}
                  min={0}
                  currency={currencySymbol}
                  field="unitPrice"
                  initialValue={line.unitPrice}
                />
              </td>
              <td className="text-center p-2">
                <FormattedNumber
                  lineIndex={index}
                  lineField="totalPrice"
                  decimals={2}
                  currency={currency}
                />
              </td>
              <td className="text-center p-2 no-print">
                <button
                  type="button"
                  className="delete-row text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 rounded cursor-pointer p-1"
                  onClick={() => handleDeleteRow(index)}
                  aria-label="Eliminar fila"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="no-print">
          <tr>
            <td colSpan={5} className="p-2">
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded cursor-pointer p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Añadir línea
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default InvoiceTable;
