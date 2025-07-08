
import { DynamicTabs, type TabItem, useDynamicTabs } from './dynamic-tab';

// Пример компонента с динамичными табами
export function DynamicTabsExample() {
  // Инициализируем табы с фиксированными и динамичными
  const initialTabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Обзор',
      content: (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Обзор программы</h3>
          <p className="text-muted-foreground">
            Здесь отображается общая информация о программе, включая описание,
            цели и основные характеристики.
          </p>
        </div>
      ),
      isFixed: true,
    },
    {
      id: 'applications',
      label: 'Заявки',
      content: (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Заявки участников</h3>
          <p className="text-muted-foreground">
            Список всех заявок на участие в программе с возможностью
            просмотра деталей и управления статусами.
          </p>
        </div>
      ),
      isFixed: true,
    },
    {
      id: 'dynamic-1',
      label: 'Аналитика',
      content: (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Аналитические данные</h3>
          <p className="text-muted-foreground">
            Графики и статистика по программе, включая метрики
            эффективности и ключевые показатели.
          </p>
        </div>
      ),
      isFixed: false,
    },
  ];

  const { tabs, setTabs } = useDynamicTabs(initialTabs);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Управление программой</h2>
        <p className="text-muted-foreground">
          Используйте табы для организации различных разделов программы.
          Фиксированные табы нельзя удалить, а динамичные можно добавлять и удалять.
        </p>
      </div>

      <DynamicTabs
        tabs={tabs}
        onTabsChange={setTabs}
        defaultActiveTab="overview"
        maxDynamicTabs={8}
        className="border rounded-lg p-4"
      />
    </div>
  );
}

// Пример с кастомным контентом для новых табов
export function CustomDynamicTabsExample() {
  const { tabs, setTabs, addTab } = useDynamicTabs([
    {
      id: 'main',
      label: 'Главная',
      content: <div className="p-4">Главная страница</div>,
      isFixed: true,
    },
  ]);

  const handleAddCustomTab = () => {
    addTab({
      label: 'Новый раздел',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Новый раздел</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="tab-name" className="block text-sm font-medium mb-2">Название</label>
              <input
                id="tab-name"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Введите название раздела"
              />
            </div>
            <div>
              <label htmlFor="tab-description" className="block text-sm font-medium mb-2">Описание</label>
              <textarea
                id="tab-description"
                className="w-full px-3 py-2 border rounded-md"
                rows={4}
                placeholder="Введите описание раздела"
              />
            </div>
          </div>
        </div>
      ),
      isFixed: false,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Кастомные табы</h2>
        <p className="text-muted-foreground mb-4">
          Пример с кастомным контентом для новых табов.
        </p>
        <button
          type="button"
          onClick={handleAddCustomTab}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Добавить кастомный таб
        </button>
      </div>

      <DynamicTabs
        tabs={tabs}
        onTabsChange={setTabs}
        defaultActiveTab="main"
        className="border rounded-lg p-4"
      />
    </div>
  );
} 