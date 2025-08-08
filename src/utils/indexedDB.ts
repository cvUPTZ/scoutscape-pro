
interface Player {
  id: number;
  name: string;
  age: number;
  position: string;
  club: string;
  location: string;
  marketValue: number;
  rating: number;
  potential: number;
  metrics: any;
  image?: string;
  nationality: string;
  height: string;
  weight: string;
  preferredFoot: string;
  contractUntil: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  appearances: number;
}

interface AdminSettings {
  currency: string;
  showCurrency: boolean;
}

const DB_NAME = 'ScoutProDB';
const DB_VERSION = 1;
const PLAYERS_STORE = 'players';
const SETTINGS_STORE = 'settings';

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(PLAYERS_STORE)) {
          db.createObjectStore(PLAYERS_STORE, { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
          db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
        }
      };
    });
  }

  async savePlayers(players: Player[]): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([PLAYERS_STORE], 'readwrite');
    const store = transaction.objectStore(PLAYERS_STORE);
    
    // Clear existing data
    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve(undefined);
      clearRequest.onerror = () => reject(clearRequest.error);
    });
    
    // Add new data
    for (const player of players) {
      await new Promise((resolve, reject) => {
        const addRequest = store.add(player);
        addRequest.onsuccess = () => resolve(undefined);
        addRequest.onerror = () => reject(addRequest.error);
      });
    }
  }

  async getPlayers(): Promise<Player[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([PLAYERS_STORE], 'readonly');
      const store = transaction.objectStore(PLAYERS_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveSettings(settings: AdminSettings): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction([SETTINGS_STORE], 'readwrite');
    const store = transaction.objectStore(SETTINGS_STORE);
    
    await new Promise((resolve, reject) => {
      const request = store.put({ key: 'admin', ...settings });
      request.onsuccess = () => resolve(undefined);
      request.onerror = () => reject(request.error);
    });
  }

  async getSettings(): Promise<AdminSettings> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([SETTINGS_STORE], 'readonly');
      const store = transaction.objectStore(SETTINGS_STORE);
      const request = store.get('admin');
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? { currency: result.currency, showCurrency: result.showCurrency } : { currency: 'EUR', showCurrency: true });
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbService = new IndexedDBService();
export type { Player, AdminSettings };
