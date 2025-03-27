import React from "react";
import { IoClose } from "react-icons/io5";

const AddMoreField = ({ close, value, onChange, submit }) => {
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 bg-neutral-800 bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded p-4 max-w-md w-full">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-semibold">Add More Field</h1>
          <button onClick={close}>
            <IoClose size={25} />
          </button>
        </div>
        <input
          onChange={onChange}
          type="text"
          value={value}
          className="bg-blue p-2 border outline-none focus-within:bg-blue-50 rounded w-full my-2"
          placeholder="Enter field Name"
        />
        <button
          onClick={submit}
          className="bg-white px-3 py-1 text-neutral-500 border rounded mx-auto w-fit block hover:bg-primary-200 hover:text-white"
        >
          Add Field
        </button>
      </div>
    </section>
  );
};

export default AddMoreField;
