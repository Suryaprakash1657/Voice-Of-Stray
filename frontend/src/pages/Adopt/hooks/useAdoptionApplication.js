import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  createAdoptionApplication,
  getExistingApplication,
  getCurrentUser
} from '../services/adoptionStorage.js';

export function useAdoptionApplication(pet) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    occupation: '',
    age: '',
    ownRent: 'own',
    hasYard: 'yes',
    hasPets: 'no',
    petsDesc: '',
    hasKids: 'no',
    whyAdopt: '',
    aloneHours: '',
    ownedBefore: '',
    emergencies: '',
    adjustPlan: '',
    chkTerm: false,
    chkCare: false,
    chkReject: false,
    chkAccurate: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [error, setError] = useState(null);

  // Pre-fill user profile info
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || user.username || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        city: prev.city || user.city || 'Mumbai',
        occupation: prev.occupation || user.occupation || '',
        age: prev.age || user.age || ''
      }));
    }
  }, []);

  // Check if existing application exists
  const existingApplication = useMemo(() => {
    if (!pet || !currentUser) return null;
    return getExistingApplication(pet.name || pet.id, currentUser);
  }, [pet, currentUser]);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  }, []);

  // Validation
  const isFormValid = useMemo(() => {
    const hasRequiredChecks =
      formData.chkTerm && formData.chkCare && formData.chkReject && formData.chkAccurate;
    const hasRequiredText =
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.age.trim() !== '' &&
      formData.whyAdopt.trim() !== '' &&
      formData.aloneHours.trim() !== '' &&
      formData.ownedBefore.trim() !== '' &&
      formData.emergencies.trim() !== '' &&
      formData.adjustPlan.trim() !== '';

    return Boolean(hasRequiredChecks && hasRequiredText && !existingApplication);
  }, [formData, existingApplication]);

  // Submission handler
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      if (!isFormValid || !pet) return;

      setIsSubmitting(true);
      setError(null);

      try {
        const applicationPayload = {
          petId: pet.id || '',
          petName: pet.name || 'Stray Companion',
          breed: pet.breed || 'Companion Breed',
          ngoName: pet.ngoName || 'City Rescue NGO',
          ngoInitials: pet.ngoInitials || 'CR',
          applicantName: formData.name,
          applicantEmail: formData.email,
          applicantPhone: formData.phone,
          city: formData.city,
          occupation: formData.occupation,
          age: formData.age,
          ownRent: formData.ownRent,
          hasYard: formData.hasYard,
          hasPets: formData.hasPets,
          petsDesc: formData.petsDesc,
          hasKids: formData.hasKids,
          whyAdopt: formData.whyAdopt,
          aloneHours: formData.aloneHours,
          ownedBefore: formData.ownedBefore,
          emergencies: formData.emergencies,
          adjustPlan: formData.adjustPlan
        };

        const result = createAdoptionApplication(applicationPayload, currentUser);
        setSubmittedApplication(result);
        setIsSubmitted(true);
      } catch (err) {
        setError(err.message || 'Failed to submit application');
      } finally {
        setIsSubmitting(false);
      }
    },
    [isFormValid, pet, formData, currentUser]
  );

  return {
    formData,
    updateField,
    isFormValid,
    isSubmitting,
    isSubmitted,
    submittedApplication,
    existingApplication,
    error,
    currentUser,
    handleSubmit
  };
}
