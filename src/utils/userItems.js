// Save user-uploaded image for existing item
export function saveItemImage(itemId, base64Image) {
  const images = JSON.parse(localStorage.getItem('itemImages') || '{}');
  images[itemId] = base64Image;
  localStorage.setItem('itemImages', JSON.stringify(images));
}

// Get user-uploaded image for item
export function getItemImage(itemId) {
  const images = JSON.parse(localStorage.getItem('itemImages') || '{}');
  return images[itemId] || null;
}

// Delete image for item
export function deleteItemImage(itemId) {
  const images = JSON.parse(localStorage.getItem('itemImages') || '{}');
  delete images[itemId];
  localStorage.setItem('itemImages', JSON.stringify(images));
}

// Get all custom user items
export function getUserItems() {
  return JSON.parse(localStorage.getItem('userItems') || '[]');
}

// Save new custom item
export function saveUserItem(item) {
  const items = getUserItems();
  const newItem = {
    ...item,
    id: 'user_' + Date.now(),
    isUserItem: true,
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  localStorage.setItem('userItems', JSON.stringify(items));
  return newItem;
}

// Delete custom item
export function deleteUserItem(id) {
  const items = getUserItems().filter(i => i.id !== id);
  localStorage.setItem('userItems', JSON.stringify(items));
}

// Update custom item
export function updateUserItem(id, updates) {
  const items = getUserItems().map(i => i.id === id ? { ...i, ...updates } : i);
  localStorage.setItem('userItems', JSON.stringify(items));
}
