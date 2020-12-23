import React from 'react';
import '../assets/css/components/Label.css';

type LabelProps = { labelName: string, color: string }; 
const Label = ({labelName, color} : LabelProps) => {
  return (
    <div className={`labelText ${color}`}>
        {labelName}
    </div>
  );
}

export default Label;
