<template>
  <aside
    :class="[
      'fixed top-0 left-0 z-99 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'w-[290px] translate-x-0': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div
      :class="[
        'flex h-30 py-8',
        { 'justify-center': !isExpanded && !isHovered && !isMobileOpen },
      ]"
    >
      <router-link to="/">
        <div class="flex items-center gap-2">
          <img src="/images/logo/logo.svg" alt="Logo" />
          <span
            v-if="isExpanded || isMobileOpen || isHovered"
            class="text-4xl font-semibold dark:text-white"
            >Admin</span
          >
        </div>
      </router-link>
    </div>
    <div
      class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear"
    >
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 flex text-xs leading-[20px] text-gray-400 uppercase',
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>
            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'group menu-item w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered
                      ? 'lg:justify-center'
                      : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto h-5 w-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(
                          groupIndex,
                          index,
                        ),
                      },
                    ]"
                  />
                </button>
                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'group menu-item',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>
                  <span
                    v-if="isExpanded || isHovered || isMobileOpen"
                    class="menu-item-text"
                    >{{ item.name }}</span
                  >
                </router-link>
                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) &&
                      (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 ml-9 space-y-1">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(
                                subItem.path,
                              ),
                              'menu-dropdown-item-inactive': !isActive(
                                subItem.path,
                              ),
                            },
                          ]"
                        >
                          {{ subItem.name }}
                          <span class="ml-auto flex items-center gap-1">
                            <span
                              v-if="subItem.new"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path,
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path,
                                  ),
                                },
                              ]"
                            >
                              new
                            </span>
                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(
                                    subItem.path,
                                  ),
                                  'menu-dropdown-badge-inactive': !isActive(
                                    subItem.path,
                                  ),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import {
  GridIcon,
  HorizontalDots,
  SettingsIcon,
  ProductsIcon,
  ChevronDownIcon,
  UserCircleIcon,
  CategoriesIcon,
} from '../icons';

import { useSidebar } from '../composables/useSidebar';
import UserGroupIcon from '../icons/UserGroupIcon.vue';
import OrdersIcon from '../icons/OrdersIcon.vue';

const route = useRoute();

const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

interface MenuItem {
  icon: any;
  name: string;
  path?: string;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  name: string;
  path: string;
  new?: boolean;
  pro?: boolean;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Menu',
    items: [
      {
        icon: GridIcon,
        name: 'Dashboard',
        path: '/',
      },
      {
        icon: ProductsIcon,
        name: 'Products',
        path: '/products',
      },
      {
        icon: CategoriesIcon,
        name: 'Categories',
        path: '/categories',
      },
      {
        icon: UserGroupIcon,
        name: 'Customers',
        path: '/customers',
      },
      {
        icon: OrdersIcon,
        name: 'Orders',
        path: '/orders',
      },
      {
        icon: UserCircleIcon,
        name: 'User Profile',
        path: '/profile',
      },
      {
        icon: SettingsIcon,
        name: 'Settings',
        path: '/store',
      },
    ],
  },
];

const isActive = (path: string): boolean => route.path === path;

const toggleSubmenu = (groupIndex: number, itemIndex: number): void => {
  const key: string = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.some((group) =>
    group.items.some(
      (item) =>
        item.subItems &&
        item.subItems.some((subItem) => isActive(subItem.path)),
    ),
  );
});

const isSubmenuOpen = (groupIndex: number, itemIndex: number) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path),
      ))
  );
};

const startTransition = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = 'auto';
  const height = element.scrollHeight;
  element.style.height = '0px';
  element.offsetHeight;
  element.style.height = height + 'px';
};

const endTransition = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = '';
};
</script>
