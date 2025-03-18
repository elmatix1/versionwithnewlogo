
import React, { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { filterSuggestions, moroccanData } from '@/utils/moroccanData';

interface MoroccanSuggestionInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  dataType: keyof typeof moroccanData;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const MoroccanSuggestionInput: React.FC<MoroccanSuggestionInputProps> = ({
  label,
  id,
  value,
  onChange,
  dataType,
  placeholder,
  required = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Mettre à jour les suggestions lorsque la valeur change
  useEffect(() => {
    if (value.length > 0) {
      setSuggestions(filterSuggestions(dataType, value));
    } else {
      setSuggestions(moroccanData[dataType].slice(0, 5));
    }
  }, [value, dataType]);

  // Gérer les clics en dehors de la liste de suggestions pour la fermer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    setIsFocused(true);
    if (value.length === 0) {
      setSuggestions(moroccanData[dataType].slice(0, 5));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (newValue.length > 0) {
      setSuggestions(filterSuggestions(dataType, newValue));
    } else {
      setSuggestions(moroccanData[dataType].slice(0, 5));
    }
    setIsFocused(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsFocused(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Label htmlFor={id} className="block mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className="w-full"
        required={required}
      />
      
      {isFocused && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex justify-between items-center"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoroccanSuggestionInput;
