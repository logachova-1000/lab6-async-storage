import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function BookItem({ book, onDelete, onEdit, onToggleRead }) {
  return (
    <View style={[styles.card, book.isRead && styles.cardRead]}>
      <View style={styles.info}>
        <Text style={[styles.title, book.isRead && styles.textRead]}>{book.title}</Text>
        <Text style={styles.author}>✍️ {book.author}</Text>
        <Text style={styles.pages}>📄 Сторінок: {book.pages}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.btnAction, book.isRead ? styles.btnUnread : styles.btnRead]} 
          onPress={() => onToggleRead(book.id)}
        >
          <Text style={styles.btnActionText}>{book.isRead ? '🔄' : '✅'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnAction, styles.btnEdit]} onPress={() => onEdit(book)}>
          <Text style={styles.btnActionText}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btnAction, styles.btnDelete]} onPress={() => onDelete(book.id)}>
          <Text style={styles.btnActionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
  cardRead: { backgroundColor: '#eef9ef', borderColor: '#c3e6cb' },
  info: { flex: 1, marginRight: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  textRead: { textDecorationLine: 'line-through', color: '#777' },
  author: { fontSize: 14, color: '#666', marginBottom: 2 },
  pages: { fontSize: 13, color: '#999' },
  actions: { flexDirection: 'row', gap: 6 },
  btnAction: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  btnRead: { backgroundColor: '#34c759' },
  btnUnread: { backgroundColor: '#ffcc00' },
  btnEdit: { backgroundColor: '#007aff' },
  btnDelete: { backgroundColor: '#ff3b30' },
  btnActionText: { fontSize: 16, color: '#fff' }
});