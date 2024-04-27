import React, { useState } from 'react';
import rainworldle_data from './rainworldle-data.json'

function GuessDropdownTextBox({ options, onGuessCallback, hidden }) {
    const [dropdownValue, setDropdownValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    // eslint-disable-next-line no-unused-vars
    let blurTimeout;

    const handleInputChange = (event) => {
        setDropdownValue(event.target.value);
        setIsOpen(true); // Open the dropdown on input change
    };

    const handleInputClick = () => {
        setIsOpen(false); // Don't show options on click.
    };

    const handleInputBlur = () => {
        blurTimeout = setTimeout(() => {
            setIsOpen(false);
        }, 100); // Adjust the delay time as needed
    };

    const filteredOptions = options.filter((option) =>
        dropdownValue.length !== 0 &&
        option.toLowerCase().includes(dropdownValue.toLowerCase())
    );

    const handleKeyDown = ((event) => {
        if(event.key === 'Enter') {
            // Get current input
            const input = dropdownValue;
            const guess = rainworldle_data.filter((item) => item.name.toLowerCase() === input.toLowerCase())
            if(guess.length === 1) {
                onGuessCallback(input)
                setDropdownValue("")
            }
        }
    })

    const handleOptionClick = (option) => {
        setIsOpen(false);
        setDropdownValue("");
        // Make our guess
        onGuessCallback(option);
    };

    return ( hidden &&
        <div className="guess-dropdown-textbox">
            <input
                className="InputGuessTextbox"
                type="text"
                value={dropdownValue}
                placeholder="Enter a creature..."
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onClick={handleInputClick}
                onBlur={handleInputBlur}
            />
            {isOpen && (
                <ul className="options-list">
                    {filteredOptions.map((option, index) => (
                        <li key={index} onClick={() => handleOptionClick(option)}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GuessDropdownTextBox;
