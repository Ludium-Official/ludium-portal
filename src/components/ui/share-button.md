# ShareButton Component

Компонент кнопки шаринга с модальным окном для выбора способа распространения контента.

## Описание

ShareButton представляет собой кнопку с иконкой "Share", при нажатии на которую открывается модальное окно с двумя опциями:
- **Share with link** - шаринг через ссылку (по умолчанию выбрано)
- **Farcaster** - шаринг через Farcaster

## Пропсы

| Проп | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `className` | `string` | - | Дополнительные CSS классы |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'outline'` | Вариант стиля кнопки |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Размер кнопки |
| `children` | `React.ReactNode` | `'Share'` | Текст кнопки |
| `onShare` | `(type: 'link' \| 'farcaster') => void` | - | Callback функция при нажатии на кнопку "Share" |

## Примеры использования

### Базовое использование
```tsx
import { ShareButton } from '@/components/ui/share-button';

function MyComponent() {
  const handleShare = (type: 'link' | 'farcaster') => {
    console.log(`Sharing via ${type}`);
    // Ваша логика шаринга
  };

  return <ShareButton onShare={handleShare} />;
}
```

### С кастомным текстом
```tsx
<ShareButton onShare={handleShare}>
  Share this content
</ShareButton>
```

### Различные варианты стилей
```tsx
// Маленькая кнопка
<ShareButton size="sm" onShare={handleShare} />

// Только иконка
<ShareButton size="icon" onShare={handleShare} />

// Ghost вариант
<ShareButton variant="ghost" onShare={handleShare} />
```

## Структура модального окна

Модальное окно содержит:
1. **Заголовок** - "Share"
2. **Опции выбора** - радио-кнопки для выбора способа шаринга
3. **Кнопка действия** - фиолетовая кнопка "Share" для подтверждения

## События

- `onShare(type)` - вызывается при нажатии на кнопку "Share" в модальном окне
  - `type` может быть `'link'` или `'farcaster'`

## Зависимости

Компонент использует следующие UI компоненты:
- `Button` - для кнопки
- `Dialog` - для модального окна
- `RadioGroup` - для выбора опций
- `Label` - для подписей
- `Share2Icon` - иконка из lucide-react 