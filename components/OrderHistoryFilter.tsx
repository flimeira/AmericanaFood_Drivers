import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type OrderHistoryFilterProps = {
  onFilterChange: (filters: {
    status: string | null;
    restaurant: string | null;
    month: Date | null;
  }) => void;
  restaurants: string[];
};

export default function OrderHistoryFilter({ onFilterChange, restaurants }: OrderHistoryFilterProps) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);

  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'accepted', label: 'Aceito' },
    { value: 'delivered', label: 'Entregue' },
    { value: 'rejected', label: 'Recusado' },
  ];

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date;
  });

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setShowStatusModal(false);
    onFilterChange({ status, restaurant: selectedRestaurant, month: selectedMonth });
  };

  const handleRestaurantSelect = (restaurant: string) => {
    setSelectedRestaurant(restaurant);
    setShowRestaurantModal(false);
    onFilterChange({ status: selectedStatus, restaurant, month: selectedMonth });
  };

  const handleMonthSelect = (date: Date) => {
    setSelectedMonth(date);
    setShowDateModal(false);
    onFilterChange({ status: selectedStatus, restaurant: selectedRestaurant, month: date });
  };

  const clearFilters = () => {
    setSelectedStatus(null);
    setSelectedRestaurant(null);
    setSelectedMonth(null);
    onFilterChange({ status: null, restaurant: null, month: null });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowStatusModal(true)}
        >
          <MaterialIcons name="filter-list" size={20} color="#666" />
          <Text style={styles.filterButtonText}>
            {selectedStatus ? statusOptions.find(s => s.value === selectedStatus)?.label : 'Status'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowRestaurantModal(true)}
        >
          <MaterialIcons name="restaurant" size={20} color="#666" />
          <Text style={styles.filterButtonText}>
            {selectedRestaurant || 'Restaurante'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowDateModal(true)}
        >
          <MaterialIcons name="calendar-today" size={20} color="#666" />
          <Text style={styles.filterButtonText}>
            {selectedMonth ? formatMonthYear(selectedMonth) : 'Mês/Ano'}
          </Text>
        </TouchableOpacity>
      </View>

      {(selectedStatus || selectedRestaurant || selectedMonth) && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearFilters}
        >
          <MaterialIcons name="clear" size={16} color="#666" />
          <Text style={styles.clearButtonText}>Limpar filtros</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showStatusModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtrar por Status</Text>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  selectedStatus === option.value && styles.modalOptionSelected
                ]}
                onPress={() => handleStatusSelect(option.value)}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedStatus === option.value && styles.modalOptionTextSelected
                ]}>
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
            <Text style={styles.modalTitle}>Filtrar por Restaurante</Text>
            {restaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant}
                style={[
                  styles.modalOption,
                  selectedRestaurant === restaurant && styles.modalOptionSelected
                ]}
                onPress={() => handleRestaurantSelect(restaurant)}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedRestaurant === restaurant && styles.modalOptionTextSelected
                ]}>
                  {restaurant}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecionar Mês/Ano</Text>
            <ScrollView style={styles.monthList}>
              {months.map((date) => (
                <TouchableOpacity
                  key={date.toISOString()}
                  style={[
                    styles.modalOption,
                    selectedMonth?.toISOString() === date.toISOString() && styles.modalOptionSelected
                  ]}
                  onPress={() => handleMonthSelect(date)}
                >
                  <Text style={[
                    styles.modalOptionText,
                    selectedMonth?.toISOString() === date.toISOString() && styles.modalOptionTextSelected
                  ]}>
                    {formatMonthYear(date)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  modalOption: {
    padding: 12,
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
  monthList: {
    maxHeight: 400,
  },
}); 