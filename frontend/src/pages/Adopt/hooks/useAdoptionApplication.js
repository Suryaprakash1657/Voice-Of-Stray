import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  createAdoptionApplication,
  getExistingApplication,
  getCurrentUser,
  getPetById
} from '../services/adoptionStorage.js';

export function useAdoptionApplication(petOrId) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // Resolve pet object by ID or object
  const pet = useMemo(() => {
    if (!petOrId) return null;
    if (typeof petOrId === 'object') return petOrId;
    return getPetById(petOrId);
  }, [petOrId]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    occupation: '',
    age: '',
    housingType: 'Apartment / Flat',
    ownership: 'Owned',
    petExperience: 'First-time pet parent',
    hoursAlone: '0 - 2 hours (WFH / Family)',
    reasonForAdopting: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);

  // Pre-fill user profile info
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || user.username || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        city: prev.city || user.city || 'Mumbai',
        occupation: prev.occupation || user.occupation || '',
        age: prev.age || user.age || ''
      }));
    }
  }, []);

  // Check if existing application exists for this user and pet
  const existingApp = useMemo(() => {
    if (!pet || !currentUser) return null;
    return getExistingApplication(pet.name || pet.id, currentUser);
  }, [pet, currentUser]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: null
    }));
  }, []);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: null
    }));
  }, []);

  // Submission handler
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      const newErrors = {};
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
      if (!formData.email.trim()) newErrors.email = 'Email Address is required.';
      if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required.';
      if (!formData.city.trim()) newErrors.city = 'City is required.';
      if (!formData.reasonForAdopting.trim()) newErrors.reasonForAdopting = 'Please explain why you would like to adopt.';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      if (!pet) {
        setErrors({ general: 'Selected pet could not be found.' });
        return;
      }

      if (existingApp) {
        setErrors({ general: 'An active application is already on file for this pet.' });
        return;
      }

      setIsSubmitting(true);
      try {
        const applicationPayload = {
          petId: pet.id || '',
          petName: pet.name || 'Stray Companion',
          breed: pet.breed || 'Companion Breed',
          ngoName: pet.ngoName || 'City Rescue NGO',
          ngoInitials: pet.ngoInitials || 'CR',
          applicantName: formData.fullName,
          applicantEmail: formData.email,
          applicantPhone: formData.phone,
          city: formData.city,
          occupation: formData.occupation,
          age: formData.age,
          housingType: formData.housingType,
          ownership: formData.ownership,
          petExperience: formData.petExperience,
          hoursAlone: formData.hoursAlone,
          reasonForAdopting: formData.reasonForAdopting
        };

        const result = createAdoptionApplication(applicationPayload, currentUser);
        setSubmittedApp(result);
        setIsSubmitted(true);
      } catch (err) {
        setErrors({ general: err.message || 'Failed to submit application' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, pet, existingApp, currentUser]
  );

  return {
    pet,
    currentUser,
    isLoggedIn: Boolean(currentUser && (currentUser.isLoggedIn || currentUser.name || currentUser.username)),
    existingApp,
    existingApplication: existingApp,
    formData,
    setFormData,
    errors,
    error: errors.general || null,
    isSubmitting,
    isSubmitted,
    submittedApp,
    submittedApplication: submittedApp,
    isFormValid: Boolean(formData.fullName && formData.email && formData.phone && formData.city && formData.reasonForAdopting && !existingApp),
    handleSubmit,
    handleChange,
    updateField
  };
}
