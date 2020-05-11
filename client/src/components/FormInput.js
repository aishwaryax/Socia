import React from 'react';

function FormInput(props) {
    var type = (props.type) ? props.type : 'text'
    if (props.textarea) {
        return (
        <div className='form-group'>
            <label className='text-muted'>{props.labelName}</label>
        <textarea value={props.value} onChange={props.handleChange} type={type} name={props.inputName} className='form-control'>{props.value}</textarea>
        </div>)
        }
        return (
            <div className='form-group'>
                <label className='text-muted'>{props.labelName}</label>
                <input value={props.value} onChange={props.handleChange} type={type} name={props.inputName} className='form-control'></input>
            </div>
        )
    
}

export default FormInput;
