import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';

export function BookForm({ visible, onClose, onSave, editBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [pages, setPages] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editBook) {
      setTitle(editBook.title);
      setAuthor(editBook.author);
      setPages(editBook.pages.toString());
    } else {
      setTitle('');
      setAuthor('');
      setPages('');
    }
    setErrors({});
  }, [editBook, visible]);

  const validateForm = () => {
    let currentErrors = {};

    if (!title.trim()) {
      currentErrors.title = "Назва книги є обов'язковою!";
    } else if (title.trim().length < 3) {
      currentErrors.title = "Назва повинна бути не менше 3-х символів!";
    }

    if (!author.trim()) {
      currentErrors.author = "Автор є обов'язковим!";
    }

    if (!pages.trim()) {
      currentErrors.pages = "Вкажіть кількість сторінок!";
    } else if (isNaN(pages) || parseInt(pages) <= 0) {
      currentErrors.pages = "Кількість сторінок повинна бути числом більшим за 0!";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      id: editBook ? editBook.id : Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      pages: parseInt(pages),
      isRead: editBook ? editBook.isRead : false
    });
    
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {editBook ? '📝 Редагувати книгу' : '📚 Додати нову книгу'}
          </Text>

          <Text style={styles.label}>Назва книги *</Text>
          <TextInput 
            style={[styles.input, errors.title && styles.inputError]} 
            value={title} 
            onChangeText={setTitle} 
            placeholder="Наприклад: Кобзар"
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

          <Text style={styles.label}>Автор *</Text>
          <TextInput 
            style={[styles.input, errors.author && styles.inputError]} 
            value={author} 
            onChangeText={setAuthor} 
            placeholder="Наприклад: Тарас Шевченко"
          />
          {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}

          <Text style={styles.label}>Кількість сторінок *</Text>
          <TextInput 
            style={[styles.input, errors.pages && styles.inputError]} 
            value={pages} 
            onChangeText={setPages} 
            keyboardType="numeric" 
            placeholder="Наприклад: 340"
          />
          {errors.pages && <Text style={styles.errorText}>{errors.pages}</Text>}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={onClose}>
              <Text style={styles.btnText}>Скасувати</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleSave}>
              <Text style={styles.btnText}>Зберегти</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalContent: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 12, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#f9f9f9' },
  inputError: { borderColor: '#ff4d4d', backgroundColor: '#fff5f5' },
  errorText: { color: '#ff4d4d', fontSize: 12, marginTop: 3, fontWeight: '500' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 10 },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  btnCancel: { backgroundColor: '#8e8e93' },
  btnSave: { backgroundColor: '#007aff' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});