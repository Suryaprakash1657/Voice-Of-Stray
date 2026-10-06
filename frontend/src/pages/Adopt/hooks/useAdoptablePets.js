import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getAllAdoptablePets,
  getSavedPetIds,
  toggleSavePet,
  CUSTOM_PETS_KEY,
  SAVED_PETS_KEY
} from '../services/adoptionStorage.js';

const INITIAL_FILTERS = {
  species: 'all',
  age: 'all',
  gender: 'all',
  size: 'all',
  distance: 50,
  specialNeeds: false,
  urgent: false,
  vaccinated: false,
  trained: false,
  savedOnly: false
};

const ITEMS_PER_PAGE = 6;

export function useAdoptablePets() {
  const [rawPets, setRawPets] = useState(() => getAllAdoptablePets());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState('featured');
  const [savedPets, setSavedPets] = useState(() => getSavedPetIds());
  const [currentPage, setCurrentPage] = useState(1);

  const reloadPets = useCallback(() => {
    setRawPets(getAllAdoptablePets());
    setSavedPets(getSavedPetIds());
  }, []);

  useEffect(() => {
    reloadPets();

    const handleStorageChange = (e) => {
      if (e.key === CUSTOM_PETS_KEY || e.key === SAVED_PETS_KEY || !e.key) {
        reloadPets();
      }
    };

    const handleCustomEvent = () => reloadPets();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('voiceOfStrayCustomPetsUpdated', handleCustomEvent);
    window.addEventListener('voiceOfStraySavedPetsUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('voiceOfStrayCustomPetsUpdated', handleCustomEvent);
      window.removeEventListener('voiceOfStraySavedPetsUpdated', handleCustomEvent);
    };
  }, [reloadPets]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  }, []);

  const toggleFavorite = useCallback((petId) => {
    const updated = toggleSavePet(petId);
    setSavedPets([...updated]);
  }, []);

  // Filtered & Searched & Sorted List
  const filteredPets = useMemo(() => {
    let list = rawPets.filter((pet) => {
      // 1. Species Filter
      if (filters.species !== 'all') {
        const pSpecies = (pet.species || '').toLowerCase();
        if (filters.species === 'dog' && !pSpecies.includes('dog') && !pSpecies.includes('canine')) return false;
        if (filters.species === 'cat' && !pSpecies.includes('cat') && !pSpecies.includes('feline')) return false;
        if (filters.species === 'other' && (pSpecies.includes('dog') || pSpecies.includes('cat'))) return false;
      }

      // 2. Age Filter
      if (filters.age !== 'all') {
        const pAge = (pet.age || '').toLowerCase();
        const pCat = (pet.ageCategory || '').toLowerCase();
        if (filters.age === 'puppy' && !pCat.includes('baby') && !pAge.includes('month') && !pAge.includes('puppy') && !pAge.includes('kitten') && !pAge.includes('6 month')) return false;
        if (filters.age === 'young' && !pCat.includes('young') && !pAge.includes('1') && !pAge.includes('2')) return false;
        if (filters.age === 'adult' && !pCat.includes('adult') && !pAge.includes('3') && !pAge.includes('4') && !pAge.includes('5')) return false;
        if (filters.age === 'senior' && !pCat.includes('senior') && !pAge.includes('senior') && !pAge.includes('8') && !pAge.includes('9') && !pet.attributes?.senior) return false;
      }

      // 3. Gender Filter
      if (filters.gender !== 'all') {
        const pGender = (pet.gender || '').toLowerCase();
        if (filters.gender === 'male' && !pGender.startsWith('m')) return false;
        if (filters.gender === 'female' && !pGender.startsWith('f')) return false;
      }

      // 4. Size Filter
      if (filters.size !== 'all') {
        const pSize = (pet.size || '').toLowerCase();
        if (filters.size === 'small' && !pSize.includes('small') && !pSize.includes('s')) return false;
        if (filters.size === 'medium' && !pSize.includes('medium') && !pSize.includes('med') && !pSize.includes('m')) return false;
        if (filters.size === 'large' && !pSize.includes('large') && !pSize.includes('l')) return false;
      }

      // 5. Max Distance Filter
      const pDist = pet.distanceKm || parseFloat(pet.distance) || 5;
      if (pDist > filters.distance) return false;

      // 6. Checkbox Filters
      if (filters.specialNeeds && !pet.specialNeeds && !pet.attributes?.specialNeeds) return false;
      if (filters.urgent && !pet.urgent && !pet.fosterBadge && !pet.attributes?.emergency) return false;
      if (filters.vaccinated && !pet.vaccinated && !pet.attributes?.vaccinated) return false;
      if (filters.trained && !pet.trained && !pet.attributes?.housetrained) return false;
      if (filters.savedOnly && !savedPets.includes(pet.id)) return false;

      // 7. Search Query Match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (pet.name || '').toLowerCase().includes(q);
        const matchBreed = (pet.breed || '').toLowerCase().includes(q);
        const matchLocation = (pet.location || '').toLowerCase().includes(q);
        const matchDesc = (pet.storySnippet || pet.shortDesc || pet.description || '').toLowerCase().includes(q);
        if (!matchName && !matchBreed && !matchLocation && !matchDesc) return false;
      }

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'featured') {
        const urgA = a.urgent || a.fosterBadge || a.attributes?.emergency ? 1 : 0;
        const urgB = b.urgent || b.fosterBadge || b.attributes?.emergency ? 1 : 0;
        return urgB - urgA;
      }
      if (sortBy === 'newest') {
        return (b.id || '').localeCompare(a.id || '');
      }
      if (sortBy === 'age-young') {
        const parseAge = (p) => {
          if (p.ageCategory === 'Baby' || String(p.age).includes('Month')) return 0.5;
          const match = String(p.age).match(/\d+/);
          return match ? parseFloat(match[0]) : 2;
        };
        return parseAge(a) - parseAge(b);
      }
      if (sortBy === 'age-old') {
        const parseAge = (p) => {
          if (p.ageCategory === 'Senior') return 9;
          const match = String(p.age).match(/\d+/);
          return match ? parseFloat(match[0]) : 2;
        };
        return parseAge(b) - parseAge(a);
      }
      if (sortBy === 'nearest') {
        const distA = a.distanceKm || parseFloat(a.distance) || 5;
        const distB = b.distanceKm || parseFloat(b.distance) || 5;
        return distA - distB;
      }
      return 0;
    });

    return list;
  }, [rawPets, filters, searchQuery, sortBy, savedPets]);

  // Pagination
  const totalCount = filteredPets.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);

  const paginatedPets = useMemo(() => {
    const start = (currentPageSafe - 1) * ITEMS_PER_PAGE;
    return filteredPets.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPets, currentPageSafe]);

  const urgentCount = useMemo(() => {
    return rawPets.filter((p) => p.urgent || p.fosterBadge || p.attributes?.emergency).length;
  }, [rawPets]);

  return {
    pets: paginatedPets,
    allFilteredPets: filteredPets,
    rawPets,
    totalCount,
    savedPets,
    filters,
    searchQuery,
    sortBy,
    currentPage: currentPageSafe,
    totalPages,
    itemsPerPage: ITEMS_PER_PAGE,
    urgentCount,
    setSearchQuery,
    setSortBy,
    setCurrentPage,
    updateFilter,
    resetFilters,
    toggleFavorite,
    reloadPets
  };
}
