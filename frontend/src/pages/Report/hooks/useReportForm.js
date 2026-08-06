import { useState, useEffect } from 'react';
import * as storage from '../services/reportStorage';

const DRAFT_KEY = "voiceOfStrayReportDraft";

const INITIAL_STATE = {
  photo: "",
  animalType: "",
  breed: "",
  estimatedAge: "",
  issueCategory: "",
  observedCondition: "",
  severity: "",
  location: "Downtown Park, Main St.",
  reporterName: "",
  reporterPhone: "",
  reporterEmail: "",
  anonymous: false,
  communityFollowUp: true,
  possibleOwned: false,
  rewardOffer: false
};

export function useReportForm() {
  const [formValues, setFormValues] = useState(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null); // { id, title }
  const [lastSaved, setLastSaved] = useState(null);

  // Auto-fill logged in user info
  useEffect(() => {
    const user = storage.getCurrentUser();
    setFormValues(prev => ({
      ...prev,
      reporterName: prev.reporterName || user.name,
      reporterEmail: prev.reporterEmail || user.email,
      reporterPhone: prev.reporterPhone || user.phone
    }));
  }, []);

  // Load draft if one exists
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setFormValues(prev => ({ ...prev, ...parsed }));
      } catch (e) {}
    }
  }, []);

  // Autosave draft every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formValues));
      setLastSaved(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, [formValues]);

  const updateField = (field, value) => {
    setFormValues(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'animalType') {
        updated.breed = ''; // Reset breed if type switches
      }
      return updated;
    });
  };

  const handleSaveDraft = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formValues));
    setLastSaved(Date.now());
    alert("Draft saved successfully.");
  };

  const validate = () => {
    const {
      photo,
      animalType,
      breed,
      estimatedAge,
      issueCategory,
      observedCondition,
      severity,
      location,
      reporterName,
      reporterPhone,
      reporterEmail
    } = formValues;

    if (!photo) return "Please upload or capture a photo of the stray animal before submitting.";
    if (!animalType) return "Please select an animal type.";
    if (!breed) return "Please select a breed.";
    if (!estimatedAge) return "Please select estimated age.";
    if (!issueCategory) return "Please select an issue category.";
    if (!observedCondition.trim()) return "Please describe the observed condition.";
    if (!severity) return "Please select a severity level.";
    if (!location.trim()) return "Please enter a location address or landmark.";
    if (!reporterName.trim()) return "Please enter your name.";
    if (!reporterPhone.trim()) return "Please enter your phone number.";
    if (!reporterEmail.trim()) return "Please enter your email address.";

    return null;
  };

  const handleSubmitTrigger = () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    setShowReview(true);
  };

  const confirmSubmission = () => {
    setIsSubmitting(true);
    
    let priority = "Low";
    if (formValues.severity === "emergency") {
      priority = "Emergency";
    } else if (formValues.severity === "urgent") {
      priority = "High Priority";
    }

    const reportId = Math.floor(1000 + Math.random() * 9000).toString();
    const displayTitle = formValues.breed ? `${formValues.animalType} (${formValues.breed})` : formValues.animalType;

    const newReport = {
      id: reportId,
      animalType: formValues.animalType,
      breed: formValues.breed,
      breedDesc: formValues.breed,
      estimatedAge: formValues.estimatedAge,
      issueCategory: formValues.issueCategory,
      title: `${displayTitle} near ${formValues.location}`,
      location: formValues.location,
      reporterName: formValues.reporterName,
      reporterPhone: formValues.reporterPhone,
      reporterEmail: formValues.reporterEmail,
      dateSubmitted: new Date().toISOString().split('T')[0],
      timeSubmitted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: priority,
      observedCondition: formValues.observedCondition.trim(),
      description: formValues.observedCondition.trim(),
      photo: formValues.photo,
      anonymous: formValues.anonymous,
      communityFollowUp: formValues.communityFollowUp,
      possibleOwned: formValues.possibleOwned,
      rewardOffer: formValues.rewardOffer
    };

    storage.createReport(newReport);

    // Clear saved draft
    localStorage.removeItem(DRAFT_KEY);
    
    // Trigger success screen showing ID
    setSuccessInfo({
      id: reportId,
      title: displayTitle
    });

    setIsSubmitting(false);
    setShowReview(false);
    setFormValues(INITIAL_STATE);
  };

  return {
    formValues,
    isSubmitting,
    showReview,
    successInfo,
    lastSaved,
    updateField,
    handleSaveDraft,
    handleSubmitTrigger,
    confirmSubmission,
    setShowReview,
    setSuccessInfo
  };
}
