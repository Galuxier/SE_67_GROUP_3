/* eslint-disable react/prop-types */
import { useState } from "react";
import { TrashIcon, PencilSquareIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const OptionEditor = ({ option, index, onUpdateOption, onRemoveOption, onSetMain }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState([...option.values]);
  const [newValue, setNewValue] = useState("");

  // เริ่มการแก้ไข
  const startEditing = () => {
    setEditedValues([...option.values]);
    setIsEditing(true);
  };

  // ยกเลิกการแก้ไข
  const cancelEditing = () => {
    setIsEditing(false);
    setNewValue("");
  };

  // บันทึกการแก้ไข
  const saveEditing = () => {
    onUpdateOption(index, { ...option, values: editedValues });
    setIsEditing(false);
    setNewValue("");
  };

  // เพิ่มค่าใหม่ในขณะแก้ไข
  const handleAddValue = () => {
    if (!newValue.trim()) return;
    if (editedValues.includes(newValue.trim())) return;
    
    setEditedValues([...editedValues, newValue.trim()]);
    setNewValue("");
  };

  // ลบค่าในขณะแก้ไข
  const handleRemoveValue = (valueIndex) => {
    const newValues = [...editedValues];
    newValues.splice(valueIndex, 1);
    setEditedValues(newValues);
  };

  // แก้ไขค่าที่มีอยู่
  const handleEditValue = (valueIndex, newText) => {
    const newValues = [...editedValues];
    newValues[valueIndex] = newText;
    setEditedValues(newValues);
  };

  return (
    <div className="p-3 border bg-card dark:bg-background border-border dark:border-border/50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="font-medium text-text dark:text-text">{option.name}</span>
          {option.isMain && (
            <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
              Main Option
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              {!option.isMain && (
                <button
                  type="button"
                  onClick={() => onSetMain(index)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center dark:text-blue-400 dark:hover:text-blue-600"
                >
                  <CheckIcon className="w-4 h-4 mr-1" />
                  Set as Main
                </button>
              )}
              <button
                type="button"
                onClick={startEditing}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <PencilSquareIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onRemoveOption(index)}
                className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-700"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={saveEditing}
                className="text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-700"
              >
                <CheckIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-700"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* แสดงค่าตัวเลือกในโหมดปกติ */}
      {!isEditing ? (
        <div className="flex flex-wrap gap-2">
          {option.values.map((value, valueIndex) => (
            <span key={valueIndex} className="bg-gray-100 text-text dark:bg-gray-700 dark:text-text rounded-full px-3 py-1 text-sm">
              {value}
            </span>
          ))}
        </div>
      ) : (
        /* แสดงฟอร์มแก้ไขค่าตัวเลือก */
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {editedValues.map((value, valueIndex) => (
              <div key={valueIndex} className="flex items-center bg-gray-100 rounded-full px-3 py-1 dark:bg-gray-700">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleEditValue(valueIndex, e.target.value)}
                  className="bg-transparent text-sm border-none outline-none w-20 text-text dark:text-text"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveValue(valueIndex)}
                  className="ml-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-600"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-2 mt-2">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Add new value"
              className="flex-grow border border-border dark:border-border/50 rounded px-3 py-1 text-sm bg-background dark:bg-card text-text dark:text-text focus:outline-none focus:ring-1 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddValue();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddValue}
              className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90 dark:bg-secondary dark:hover:bg-secondary/90"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionEditor;