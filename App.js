import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookForm } from './components/BookForm';
import { BookItem } from './components/BookItem';

const STORAGE_KEY = '@my_books_list';

export default function App() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // 1. Завантаження даних із AsyncStorage при старті
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedBooks !== null) {
        setBooks(JSON.parse(storedBooks));
      }
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося завантажити збережені книги.');
    }
  };

  // 2. Збереження даних в AsyncStorage при будь-якій зміні масиву книг
  const saveBooks = async (newBooksList) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooksList));
      setBooks(newBooksList);
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося зберегти зміни.');
    }
  };

  // Додавання або редагування книги
  const handleSaveBook = (bookData) => {
    if (selectedBook) {
      // Редагування існуючої книги
      const updated = books.map(b => b.id === bookData.id ? bookData : b);
      saveBooks(updated);
    } else {
      // Додавання нової книги
      const updated = [bookData, ...books];
      saveBooks(updated);
    }
    setSelectedBook(null);
  };

  // Видалення однієї книги
  const handleDeleteBook = (id) => {
    Alert.alert('Видалення', 'Ви впевнені, що хочете видалити цю книгу?', [
      { text: 'Скасувати', style: 'cancel' },
      { text: 'Видалити', style: 'destructive', onPress: () => {
          const filtered = books.filter(b => b.id !== id);
          saveBooks(filtered);
        }}
    ]);
  };

  // Позначка "прочитано / не прочитано" (Додаткова фіча)
  const handleToggleRead = (id) => {
    const updated = books.map(b => b.id === id ? { ...b, isRead: !b.isRead } : b);
    saveBooks(updated);
  };

  // Повне очищення списку (Додаткова фіча)
  const handleClearAll = () => {
    if (books.length === 0) return;
    Alert.alert('Очищення', 'Видалити ВСІ книги зі списку?', [
      { text: 'Ні', style: 'cancel' },
      { text: 'Так, очистити', style: 'destructive', onPress: () => saveBooks([]) }
    ]);
  };

  const handleOpenEdit = (book) => {
    setSelectedBook(book);
    setIsModalVisible(true);
  };

  const handleOpenAdd = () => {
    setSelectedBook(null);
    setIsModalVisible(true);
  };

  // Фільтрація списку через пошуковий рядок
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>📚 Персональна Бібліотека</Text>

      {/* Пошуковий рядок (Додаткова фіча) */}
      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Швидкий пошук книги чи автора..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Список книг */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookItem 
            book={item} 
            onDelete={handleDeleteBook} 
            onEdit={handleOpenEdit}
            onToggleRead={handleToggleRead}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? 'Нічого не знайдено 📝' : 'Ваша бібліотека порожня. Додайте першу книгу! ✨'}
          </Text>
        }
      />

      {/* Нижня панель кнопок */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={[styles.footerBtn, styles.btnDanger]} onPress={handleClearAll}>
          <Text style={styles.footerBtnText}>Очистити все</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.footerBtn, styles.btnSuccess]} onPress={handleOpenAdd}>
          <Text style={styles.footerBtnText}>+ Додати книгу</Text>
        </TouchableOpacity>
      </View>

      {/* Компонент форми (модалка) */}
      <BookForm 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        onSave={handleSaveBook}
        editBook={selectedBook}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7', paddingHorizontal: 16, paddingTop: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 15, color: '#1c1c1e' },
  searchBar: { backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e5e5ea', marginBottom: 15, fontSize: 16 },
  emptyText: { textAlign: 'center', color: '#8e8e93', fontSize: 16, marginTop: 40, paddingHorizontal: 20 },
  bottomActions: { flexDirection: 'row', gap: 12, marginVertical: 15 },
  footerBtn: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center', elevation: 2 },
  btnSuccess: { backgroundColor: '#34c759' },
  btnDanger: { backgroundColor: '#ff3b30' },
  footerBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});