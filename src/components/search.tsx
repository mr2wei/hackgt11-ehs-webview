import React, { useState, useEffect } from 'react';
import Downshift from 'downshift';
import { SearchResult } from '../types';
import { ListGroup } from 'react-bootstrap';
import '../styles/search.css';

interface SearchBoxProps {
    searchFunction: (inputValue: string) => Promise<SearchResult[]>;
    onSelect: (item: SearchResult) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ searchFunction, onSelect }) => {
    const [items, setItems] = useState<SearchResult[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false); 

    useEffect(() => {
        let isActive = true;

        if (inputValue.trim() === '') {
            setItems([]);
            return;
        }

        (async () => {
            try {
                const results = await searchFunction(inputValue);
                if (isActive) {
                    setItems(results);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        })();

        return () => {
            isActive = false;
        };
    }, [inputValue, searchFunction]);

    return (
        <Downshift
            isOpen={isOpen}
            onChange={(selectedItem) => {
                if (selectedItem) {
                    onSelect(selectedItem);
                }
            }}
            onOuterClick={() => setIsOpen(false)}
            itemToString={(item) => (item ? item.primary : '')}
            inputValue={inputValue}
            onInputValueChange={(value) => {
                setInputValue(value);
                setIsOpen(true);
            }}
        >
            {({
                getInputProps,
                getItemProps,
                getMenuProps,
                isOpen,
                highlightedIndex,
            }) => (
                <div className='search-box'>
                    <div className='search-field'>
                        <input {...getInputProps({ placeholder: 'Search...' })} />
                    </div>
                    <ListGroup {...getMenuProps()} className="search-results">
                        {isOpen &&
                            items.map((item, index) => (
                                <ListGroup.Item
                                    {...getItemProps({
                                        key: item.id,
                                        index,
                                        item,
                                        className: 'search-result-item',
                                    })}
                                action >
                                    <div>{item.primary}</div>
                                    {item.secondary && <small>{item.secondary}</small>}
                                </ListGroup.Item>
                            ))}
                    </ListGroup>
                </div>
            )}
        </Downshift>
    );
};

export default SearchBox;