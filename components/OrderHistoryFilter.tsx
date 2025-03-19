import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

type OrderHistoryFilterProps = {
  onFilterChange: (filters: {
    status: string | null;
    restaurant: string | null;
    month: Date | null;
  }) => void;
  restaurants: string[];
};

const STATUS_OPTIONS = [
  { label: 'Todos', value: null },
  { label: 'Pendente', value: 'pending' },
  { label: 'Aceito', value: 'accepted' },
  { label: 'Entregue', value: 'delivered' },
  { label: 'Recusado', value: 'rejected' },
];

export default function OrderHistoryFilter({ onFilterChange, restaurants }: OrderHistoryFilterProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleStatusSelect = (status: string | null) => {
    setSelectedStatus(status);
    setShowStatusModal(false);
    onFilterChange({
      status,
      restaurant: selectedRestaurant,
      month: selectedMonth,
    });
  };

  const handleRestaurantSelect = (restaurant: string | null) => {
    setSelectedRestaurant(restaurant);
    setShowRestaurantModal(false);
    onFilterChange({
      status: selectedStatus,
      restaurant,
      month: selectedMonth,
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedMonth(selectedDate);
      onFilterChange({
        status: selectedStatus,
        restaurant: selectedRestaurant,
        month: selectedDate,
      });
    }
  };

  const formatMonth = (date: Date | null) => {
    if (!date) return 'Todos os meses';
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowStatusModal(true)}
      >
        <MaterialIcons name="filter-list" size={20} color="#1976d2" />
        <Text style={styles.filterButtonText}>
          {selectedStatus ? STATUS_OPTIONS.find(s => s.value === selectedStatus)?.label : 'Status'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowRestaurantModal(true)}
      >
        <MaterialIcons name="restaurant" size={20} color="#1976d2" />
        <Text style={styles.filterButtonText}>
          {selectedRestaurant || 'Restaurante'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowDatePicker(true)}
      >
        <MaterialIcons name="calendar-today" size={20} color="#1976d2" />
        <Text style={styles.filterButtonText}>
          {formatMonth(selectedMonth)}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showStatusModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por Status</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {STATUS_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value || 'all'}
                style={[
                  styles.modalOption,
                  selectedStatus === option.value && styles.modalOptionSelected,
                ]}
                onPress={() => handleStatusSelect(option.value)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedStatus === option.value && styles.modalOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showRestaurantModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRestaurantModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar por Restaurante</Text>
              <TouchableOpacity onPress={() => setShowRestaurantModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.modalOption,
                !selectedRestaurant && styles.modalOptionSelected,
              ]}
              onPress={() => handleRestaurantSelect(null)}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  !selectedRestaurant && styles.modalOptionTextSelected,
                ]}
              >
                Todos os restaurantes
              </Text>
            </TouchableOpacity>
            {restaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant}
                style={[
                  styles.modalOption,
                  selectedRestaurant === restaurant && styles.modalOptionSelected,
                ]}
                onPress={() => handleRestaurantSelect(restaurant)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedRestaurant === restaurant && styles.modalOptionTextSelected,
                  ]}
                >
                  {restaurant}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={selectedMonth || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#1976d2',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalOptionSelected: {
    backgroundColor: '#e3f2fd',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalOptionTextSelected: {
    color: '#1976d2',
    fontWeight: '500',
  },
}); 