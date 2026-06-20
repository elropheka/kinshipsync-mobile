import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BrandLoadingSpinner } from '@/components/ui/BrandLoadingSpinner';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAppTheme } from '@/context/AppThemeContext';
import { useAlert } from '@/context/AlertContext';
import { VENDOR_ITEM_AVAILABILITY_OPTIONS } from '@/constants/mock/vendorItems';
import VendorItemImagePicker from '@/components/vendors/VendorItemImagePicker';
import { createVendorItemFormStyles } from '@/styles/components/vendors/VendorItemForm.styles';
import {
  VendorItem,
  CreateVendorItemPayload,
  UpdateVendorItemPayload,
} from '@/types/vendorItemTypes';

const TOTAL_STEPS = 2;

interface VendorItemFormProps {
  visible: boolean;
  vendorId?: string;
  initialItem?: VendorItem | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (
    data: CreateVendorItemPayload | UpdateVendorItemPayload,
    itemId?: string
  ) => Promise<void>;
}

export class VendorItemForm extends React.Component<VendorItemFormProps> {
  public render(): React.ReactNode {
    return <VendorItemFormInner {...this.props} />;
  }
}

const VendorItemFormInner: React.FC<VendorItemFormProps> = ({
  visible,
  vendorId,
  initialItem,
  isSubmitting = false,
  onClose,
  onSubmit,
}) => {
  const { currentColors } = useAppTheme();
  const { showError } = useAlert();
  const styles = useMemo(() => createVendorItemFormStyles(currentColors), [currentColors]);

  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [availability, setAvailability] = useState<string>(VENDOR_ITEM_AVAILABILITY_OPTIONS[0]);
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailabilityPickerVisible, setIsAvailabilityPickerVisible] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setCurrentStep(1);
    setName(initialItem?.name ?? '');
    setCategory(initialItem?.category ?? '');
    setDescription(initialItem?.description ?? '');
    setPriceInput(
      initialItem?.price !== undefined && initialItem?.price !== null
        ? String(initialItem.price)
        : ''
    );
    setAvailability(initialItem?.availability ?? VENDOR_ITEM_AVAILABILITY_OPTIONS[0]);
    setLocation(initialItem?.location ?? '');
    setImageUrl(initialItem?.imageUrl ?? '');
  }, [visible, initialItem]);

  const parsePrice = (value: string): number | string => {
    const trimmed = value.trim();
    if (!trimmed) {
      return trimmed;
    }
    const numeric = Number(trimmed);
    return Number.isNaN(numeric) ? trimmed : numeric;
  };

  const validateStepOne = (): boolean => {
    if (name.trim().length < 3) {
      showError('Validation Error', 'Item name must be at least 3 characters.');
      return false;
    }
    if (category.trim().length < 2) {
      showError('Validation Error', 'Category must be at least 2 characters.');
      return false;
    }
    if (description.trim().length < 10) {
      showError('Validation Error', 'Description must be at least 10 characters.');
      return false;
    }
    return true;
  };

  const validateStepTwo = (): boolean => {
    const parsedPrice = parsePrice(priceInput);
    if (
      (typeof parsedPrice === 'number' && parsedPrice <= 0) ||
      (typeof parsedPrice === 'string' && parsedPrice.length === 0)
    ) {
      showError('Validation Error', 'Enter a positive price or a price description.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStepOne()) {
      return;
    }
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStepTwo()) {
      return;
    }

    const payload: CreateVendorItemPayload = {
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      price: parsePrice(priceInput),
      ...(availability.trim() ? { availability: availability.trim() } : {}),
      ...(location.trim() ? { location: location.trim() } : {}),
      ...(imageUrl.trim()
        ? { imageUrl: imageUrl.trim() }
        : initialItem?.imageUrl
          ? { imageUrl: '' }
          : {}),
    };

    await onSubmit(payload, initialItem?.id);
  };

  const title = initialItem ? 'Edit Item/Service' : 'Add New Item/Service';

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalShell}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.headerTitleContainer}>
                  <Text style={styles.modalTitle}>{title}</Text>
                  <Text style={styles.stepText}>Step {currentStep} of {TOTAL_STEPS}</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  disabled={isSubmitting}
                >
                  <Ionicons name="close" size={24} color={currentColors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.formScroll}
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
              >
              {currentStep === 1 ? (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Item/Service Name*</Text>
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="e.g., Wedding Photography Package"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Category*</Text>
                    <TextInput
                      style={styles.input}
                      value={category}
                      onChangeText={setCategory}
                      placeholder="e.g., Photography, Catering"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Description*</Text>
                    <TextInput
                      style={[styles.input, styles.multilineInput]}
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Describe your offering in detail"
                      multiline
                      numberOfLines={4}
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Price*</Text>
                    <TextInput
                      style={styles.input}
                      value={priceInput}
                      onChangeText={setPriceInput}
                      placeholder="e.g., 1500 or Contact for quote"
                      keyboardType="default"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Availability</Text>
                    <TouchableOpacity
                      style={styles.pickerButton}
                      onPress={() => setIsAvailabilityPickerVisible(true)}
                    >
                      <Text style={styles.pickerButtonText}>{availability}</Text>
                      <Ionicons name="chevron-down" size={18} color={currentColors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Location (Optional)</Text>
                    <TextInput
                      style={styles.input}
                      value={location}
                      onChangeText={setLocation}
                      placeholder="e.g., Accra Only, Online"
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <VendorItemImagePicker
                      imageUrl={imageUrl}
                      onImageUrlChange={setImageUrl}
                      vendorId={vendorId}
                      disabled={isSubmitting}
                    />
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.footer}>
              {currentStep > 1 ? (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handlePrevious}
                  disabled={isSubmitting}
                >
                  <Text style={styles.secondaryButtonText}>Previous</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onClose}
                  disabled={isSubmitting}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}

              {currentStep < TOTAL_STEPS ? (
                <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                  <Text style={styles.primaryButtonText}>Next</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <BrandLoadingSpinner size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {initialItem ? 'Save Changes' : 'Add Item'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={isAvailabilityPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAvailabilityPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.pickerModalOverlay}
          activeOpacity={1}
          onPress={() => setIsAvailabilityPickerVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.pickerModalShell}>
            <View style={styles.pickerModalContent}>
              <View style={styles.pickerHeader}>
                <Text style={styles.modalTitle}>Availability</Text>
                <TouchableOpacity onPress={() => setIsAvailabilityPickerVisible(false)}>
                  <Text style={styles.pickerDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={availability}
                onValueChange={(value) => setAvailability(String(value))}
              >
                {VENDOR_ITEM_AVAILABILITY_OPTIONS.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default VendorItemForm;
