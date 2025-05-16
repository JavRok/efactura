import React, { useState, useRef } from "react";
import { updateInvoiceField } from "../stores/invoiceStore";

interface EditableTextProps {
  initialText?: string;
  placeholder?: string;
  className?: string;
  onTextChange?: (text: string) => void;
  name?: string;
  required?: boolean;
  maxLength?: number;
  // id?: string;
}

const EditableText: React.FC<EditableTextProps> = ({
  initialText = "",
  placeholder = "Click to edit this text",
  className = "",
  onTextChange,
  name,
  required = false,
  maxLength,
  // id
}) => {
  // const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   // Update hidden input value when text changes
  //   if (hiddenInputRef.current) {
  //     hiddenInputRef.current.value = text;
  //
  //     // Trigger validation
  //     if (required && !text) {
  //       setError("This field is required");
  //     } else {
  //       setError(null);
  //     }
  //   }
  // }, [text, required]);

  // useEffect(() => {
  //   if (isEditing && textRef.current) {
  //     textRef.current.focus();
  //     // Place cursor at the end
  //     const selection = window.getSelection();
  //     const range = document.createRange();
  //     if (selection && textRef.current.childNodes.length > 0) {
  //       range.selectNodeContents(textRef.current);
  //       range.collapse(false);
  //       selection.removeAllRanges();
  //       selection.addRange(range);
  //     }
  //   }
  // }, [isEditing]);

  // const handleClick = () => {
  //   if (!isEditing) {
  //     setIsEditing(true);
  //   }
  // };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    // set cursor at the end
    const selection = window.getSelection();
    if (selection && textRef.current) {
      // First set the selection at the beginning
      selection.collapse(textRef.current, 0);
      // Then move it to the end
      selection.modify("move", "forward", "documentboundary");
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.textContent || "";
    // setIsEditing(false);

    // Validate on blur
    if (required && !text) {
      setError("This field is required");
    } else {
      setError(null);
    }

    // Update global store
    if (name) {
      updateInvoiceField(name as any, newText);
    }

    if (onTextChange) {
      onTextChange(text);
    }

    setText(newText);
  };

  // const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
  //   const newText = e.currentTarget.textContent || "";

  // console.log("handleInput", newText, text);

  // Handle maxLength if specified
  // if (maxLength && newText.length > maxLength) {
  //   e.currentTarget.textContent = newText.slice(0, maxLength);
  //   return;
  // }
  //
  // setText(newText);
  // };

  // const handleKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     textRef.current?.blur();
  //   }
  // };

  return (
    <div className={`group relative hover:bg-gray-100`}>
      {/* Hidden input for form submission */}
      <input
        type="text"
        name={name}
        id={name}
        value={text}
        required={required}
        maxLength={maxLength}
        readOnly
        hidden
      />

      {/*<div*/}
      {/*  className={`group relative ${error ? 'mb-5' : ''}`}*/}
      {/*  onClick={handleClick}*/}
      {/*>*/}
      <div
        ref={textRef}
        contentEditable="plaintext-only"
        // cotentEditable={isEditing ? 'plaintext-only': false}
        onBlur={handleBlur}
        // onInput={handleInput}
        // onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        className={`
          rounded transition-all duration-200
          ${text ? "text-gray-800" : "text-gray-500 italic"}
          ${className}
        `}
        // ${isEditing
        //   ? 'bg-white border border-blue-400 shadow-sm ring-2 ring-blue-200 ring-opacity-50'
        //   : `border ${error ? 'border-red-400' : 'border-transparent'} hover:bg-blue-50 cursor-pointer`}
        suppressContentEditableWarning={true}
        aria-required={required}
        aria-invalid={!!error}
      >
        {text || placeholder}
      </div>

      {/*{!error && (*/}
      {/*  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-0 group-focus:opacity-0 transition-opacity duration-200">*/}
      {/*    <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">*/}
      {/*      Click para editar*/}
      {/*    </span>*/}
      {/*  </div>*/}
      {/*)}*/}

      {error && (
        <div className="absolute bottom-[-2rem] left-0 text-xs text-red-500">
          {error}
        </div>
      )}
      {/*</div>*/}
    </div>
  );
};

export default EditableText;
