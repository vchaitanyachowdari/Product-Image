// Performance monitoring utilities

export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  const start = performance.now();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now();
      if (import.meta.env.MODE === 'development') {
        // eslint-disable-next-line no-console
        console.log(`${name} took ${end - start} milliseconds`);
      }
    });
  } else {
    const end = performance.now();
    if (import.meta.env.MODE === 'development') {
      // eslint-disable-next-line no-console
      console.log(`${name} took ${end - start} milliseconds`);
    }
    return result;
  }
};

export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Image optimization utilities
export const optimizeImage = (file: File, maxWidth: number = 1024, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const optimizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(optimizedFile);
        } else {
          resolve(file);
        }
      }, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Enhanced performance utilities
export const performanceUtils = {
  // Debounce function for search inputs
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Lazy load images with intersection observer
  lazyLoadImage: (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  },

  // Create intersection observer for lazy loading
  createLazyLoadObserver: (callback: (entries: IntersectionObserverEntry[]) => void) => {
    return new IntersectionObserver(callback, {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
    });
  },

  // Memory usage monitoring
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576),
      };
    }
    return null;
  },

  // Simple in-memory cache with TTL
  cache: {
    store: new Map<string, { data: any; expires: number }>(),

    set: (key: string, data: any, ttlMs = 300000) => { // 5 minutes default
      const expires = Date.now() + ttlMs;
      performanceUtils.cache.store.set(key, { data, expires });
    },

    get: (key: string) => {
      const item = performanceUtils.cache.store.get(key);
      if (!item) return null;
      
      if (Date.now() > item.expires) {
        performanceUtils.cache.store.delete(key);
        return null;
      }
      
      return item.data;
    },

    clear: () => {
      performanceUtils.cache.store.clear();
    },
  },

  // Virtual scrolling helper
  calculateVisibleItems: (
    scrollTop: number,
    containerHeight: number,
    itemHeight: number,
    totalItems: number,
    overscan = 5
  ) => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      totalItems - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex, visibleItems: endIndex - startIndex + 1 };
  },
};