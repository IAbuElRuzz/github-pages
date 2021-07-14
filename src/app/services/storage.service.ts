import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

/**
 * LocalStorage to save page current
 * index of json request data
 */
export class StorageService {
  private currentPageIndex = 0;
  private key = 'pageIndex';

  constructor() {}

  /**
   * Set data(page Index) by key Name from storage
   * @para  pageIdx (optional)  Index of the current page
   * @param keyName (optional) Name of key to use for storage
   */

  setData(pageIdx: number = this.currentPageIndex, keyName: string = this.key) {
    const jsonData = JSON.stringify(pageIdx);
    localStorage.setItem(keyName, jsonData);
  }

  /**
   * Get data by key Name from storage
   * @param  keyName (optional) Name of key
   */
  getData(keyName: string = this.key): number | string {
    const currentIdx = localStorage.getItem(keyName);

    if (!currentIdx) {
      return 0;
    }
    return currentIdx;
  }
  /**
   * Remove data by key Name from storage
   * @param  keyName (optional)Name of key
   */
  removeData(keyName: string = this.key) {
    localStorage.removeItem(keyName);
  }
  /**
   * Clear all internal storage
   */
  clearAllData() {
    localStorage.clear();
  }
}
