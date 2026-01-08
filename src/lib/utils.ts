export const imageToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const validateImage = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, or WebP)',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size must be less than 5MB',
    };
  }

  return { valid: true };
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch {
    return dateString;
  }
};

export const getSpacingValue = (spacing: 'compact' | 'normal' | 'relaxed'): string => {
  const spacingMap = {
    compact: '0.5rem',
    normal: '1rem',
    relaxed: '1.5rem',
  };
  return spacingMap[spacing] || spacingMap.normal;
};

export const getFontFamily = (fontType: 'sans-serif' | 'serif' | 'monospace'): string => {
  const fontMap = {
    'sans-serif': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    'serif': "'Georgia', 'Times New Roman', serif",
    'monospace': "'Courier New', 'Monaco', monospace",
  };
  return fontMap[fontType] || fontMap['sans-serif'];
};
