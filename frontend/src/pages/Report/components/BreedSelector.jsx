import React, { useEffect } from 'react';
import { Select } from '../../../components/ui';

export const BREED_OPTIONS = {
  "Dog": [
    "Indian Pariah Dog",
    "Labrador Retriever",
    "Golden Retriever",
    "German Shepherd",
    "Beagle",
    "Pug",
    "Rottweiler",
    "Husky",
    "Doberman",
    "Other / Unknown"
  ],
  "Cat": [
    "Indian Street Cat",
    "Persian",
    "Siamese",
    "Maine Coon",
    "Bengal",
    "British Shorthair",
    "Other / Unknown"
  ],
  "Cow": [
    "Jersey",
    "Holstein Friesian",
    "Gir",
    "Sahiwal",
    "Other / Unknown"
  ],
  "Goat": [
    "Jamnapari",
    "Boer",
    "Barbari",
    "Beetle",
    "Other / Unknown"
  ],
  "Horse": [
    "Marwari",
    "Kathiawari",
    "Thoroughbred",
    "Arabian",
    "Quarter Horse",
    "Other / Unknown"
  ],
  "Rabbit": [
    "Angora",
    "Rex",
    "Dutch",
    "Flemish Giant",
    "New Zealand",
    "Other / Unknown"
  ],
  "Bird": [
    "Pigeon",
    "Sparrow",
    "Crow",
    "Parrot",
    "Myna",
    "Eagle",
    "Other / Unknown"
  ],
  "Monkey": [
    "Rhesus Macaque",
    "Bonnet Macaque",
    "Langur",
    "Other / Unknown"
  ],
  "Other": [
    "Other / Unknown"
  ]
};

export default function BreedSelector({ animalType, value, onChange, error }) {
  const breeds = BREED_OPTIONS[animalType] || [];

  useEffect(() => {
    // Automatically set default "Other / Unknown" if current value is invalid
    if (animalType && breeds.length > 0 && !breeds.includes(value)) {
      if (breeds.includes("Other / Unknown")) {
        onChange("Other / Unknown");
      } else {
        onChange(breeds[0]);
      }
    }
  }, [animalType, breeds, value, onChange]);

  return (
    <Select
      label="Breed"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={!animalType || breeds.length === 0}
      error={error}
      required
    >
      <option value="" disabled>Select Breed / Option</option>
      {breeds.map(b => (
        <option key={b} value={b}>{b}</option>
      ))}
    </Select>
  );
}
