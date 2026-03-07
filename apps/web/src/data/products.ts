import { Gamepad2, Sword, Code2, Shield, PlayCircle, Cloud } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Product {
  id: string
  name: string
  meta: string
  cardMeta: string
  price: string
  Icon: LucideIcon
  iconColor: string
  bg: string
  glow: string
  tags: string[]
  description: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'neon-arena',
    name: 'Neon Arena',
    meta: 'Игры · Шутер · Инди',
    cardMeta: 'Игры · Шутер',
    price: '$24.99',
    Icon: Gamepad2,
    iconColor: '#9B5CF6',
    bg: 'linear-gradient(135deg, #1B0A3A 0%, #0A1A4A 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(155,92,246,0.42) 0%, transparent 70%)',
    tags: ['Шутер', 'Мультиплеер', 'Инди'],
    description:
      'Динамичный шутер в неоновом киберпанк-мире. 60fps, онлайн-мультиплеер до 20 игроков, еженедельные обновления. Мгновенная загрузка.',
  },
  {
    id: 'shadow-tactics',
    name: 'Shadow Tactics',
    meta: 'Игры · Стратегия · РПГ',
    cardMeta: 'Игры · Стратегия',
    price: '$19.99',
    Icon: Sword,
    iconColor: '#A8FF3E',
    bg: 'linear-gradient(135deg, #0A2A1A 0%, #1A0A3A 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(168,255,62,0.30) 0%, transparent 70%)',
    tags: ['Стратегия', 'РПГ', 'Инди'],
    description:
      'Пошаговая тактическая RPG с процедурно-генерируемыми подземельями. Сотни часов геймплея, полная русская локализация.',
  },
  {
    id: 'devkit-pro',
    name: 'DevKit Pro',
    meta: 'ПО · Разработка · Лицензия',
    cardMeta: 'ПО · Разработка',
    price: '$49.99',
    Icon: Code2,
    iconColor: '#4F6EF7',
    bg: 'linear-gradient(135deg, #1A0A0A 0%, #2A1060 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(79,110,247,0.35) 0%, transparent 70%)',
    tags: ['IDE', 'Разработка', 'Кроссплатформа'],
    description:
      'Профессиональный набор инструментов для разработчиков: редактор кода, дебаггер и CI/CD интеграции. Лицензия на 1 год, все платформы.',
  },
  {
    id: 'vaultguard',
    name: 'VaultGuard',
    meta: 'ПО · Безопасность',
    cardMeta: 'ПО · Безопасность',
    price: '$14.99',
    Icon: Shield,
    iconColor: '#A8FF3E',
    bg: 'linear-gradient(135deg, #0A1A0A 0%, #1A0A2A 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(168,255,62,0.28) 0%, transparent 70%)',
    tags: ['Безопасность', 'VPN', 'Пароли'],
    description:
      'Комплексная защита: менеджер паролей, встроенный VPN и антивирус в одном приложении. Поддержка до 5 устройств.',
  },
  {
    id: 'streampass',
    name: 'StreamPass',
    meta: 'Подписка · Стриминг · 1 месяц',
    cardMeta: 'Подписка · Стриминг',
    price: '$9.99',
    Icon: PlayCircle,
    iconColor: '#FF6BF8',
    bg: 'linear-gradient(135deg, #0A1A2A 0%, #2A0A30 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(255,107,248,0.30) 0%, transparent 70%)',
    tags: ['Стриминг', '4K', 'Без рекламы'],
    description:
      'Безлимитный доступ к тысячам фильмов и сериалов в 4K. Без рекламы, офлайн-загрузка, до 4 экранов одновременно.',
  },
  {
    id: 'cloudmax',
    name: 'CloudMax',
    meta: 'Подписка · Хранилище · 1 месяц',
    cardMeta: 'Подписка · Хранилище',
    price: '$4.99',
    Icon: Cloud,
    iconColor: '#4F6EF7',
    bg: 'linear-gradient(135deg, #1A0A1A 0%, #0A1A2A 100%)',
    glow: 'radial-gradient(ellipse at center, rgba(79,110,247,0.28) 0%, transparent 70%)',
    tags: ['Облако', '2TB', 'Шифрование'],
    description:
      '2TB облачного хранилища с автоматической синхронизацией между всеми устройствами. Сквозное шифрование AES-256.',
  },
]
