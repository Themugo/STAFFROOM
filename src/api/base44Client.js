import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { INITIAL_MOCK_DATA } from './mockData';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

const STORAGE_PREFIX = 'staffroom_entity_';

function getStoredEntityData(entityName) {
  if (typeof window === 'undefined') return INITIAL_MOCK_DATA[entityName] || [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${entityName}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read from localStorage:', e);
  }
  const initial = INITIAL_MOCK_DATA[entityName] || [];
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${entityName}`, JSON.stringify(initial));
  } catch {}
  return initial;
}

function saveStoredEntityData(entityName, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${entityName}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

let rawClient = null;
try {
  if (appId) {
    rawClient = createClient({
      appId,
      token,
      functionsVersion,
      serverUrl: '',
      requiresAuth: false,
      appBaseUrl
    });
  }
} catch (err) {
  console.warn('Base44 SDK Client initialization notice:', err);
}

const createMockEntityProxy = (entityName) => ({
  list: async (...args) => {
    const items = getStoredEntityData(entityName);
    return [...items];
  },
  get: async (id) => {
    const items = getStoredEntityData(entityName);
    return items.find((item) => item.id === id) || null;
  },
  filter: async (query) => {
    const items = getStoredEntityData(entityName);
    if (!query) return items;
    return items.filter((item) => {
      return Object.entries(query).every(([k, v]) => item[k] === v);
    });
  },
  create: async (data) => {
    const items = getStoredEntityData(entityName);
    const newRecord = {
      id: `${entityName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_date: new Date().toISOString(),
      ...data
    };
    items.unshift(newRecord);
    saveStoredEntityData(entityName, items);
    return newRecord;
  },
  update: async (id, data) => {
    const items = getStoredEntityData(entityName);
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...data, updated_date: new Date().toISOString() };
      saveStoredEntityData(entityName, items);
      return items[index];
    }
    return { id, ...data };
  },
  delete: async (id) => {
    let items = getStoredEntityData(entityName);
    items = items.filter((item) => item.id !== id);
    saveStoredEntityData(entityName, items);
    return { success: true, id };
  }
});

export const base44 = new Proxy(rawClient || {}, {
  get(target, prop) {
    if (prop === 'entities') {
      const realEntities = target.entities || {};
      return new Proxy(realEntities, {
        get(entityTarget, entityName) {
          const realEntity = entityTarget[entityName];
          const mockProxy = createMockEntityProxy(entityName);

          return new Proxy(realEntity || {}, {
            get(methodTarget, methodName) {
              const realMethod = methodTarget[methodName];
              if (realMethod && appId) {
                return async (...args) => {
                  try {
                    return await realMethod.apply(methodTarget, args);
                  } catch (err) {
                    console.warn(`Base44 API call ${entityName}.${methodName} failed, falling back to local store:`, err);
                    return mockProxy[methodName] ? mockProxy[methodName](...args) : [];
                  }
                };
              }
              return mockProxy[methodName] || (async () => []);
            }
          });
        }
      });
    }

    if (prop === 'auth') {
      const realAuth = target.auth || {};
      return {
        me: async () => {
          if (realAuth.me && appId && token) {
            try {
              return await realAuth.me();
            } catch {}
          }
          return {
            id: 'usr_sarah_jenkins',
            email: 'sarah.jenkins@staffroom.internal',
            full_name: 'Sarah Jenkins',
            role: 'admin',
            department: 'HR',
            job_title: 'HR Director'
          };
        },
        logout: (url) => {
          if (realAuth.logout) {
            try { realAuth.logout(url); } catch {}
          }
        },
        redirectToLogin: (url) => {
          if (realAuth.redirectToLogin) {
            try { realAuth.redirectToLogin(url); } catch {}
          }
        }
      };
    }

    if (target[prop]) {
      return target[prop];
    }

    return undefined;
  }
});
